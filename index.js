const getKnownChords = require("./known-chords.js")


/**
 * Returns true when every non-space characterset in {line} is in {keys}
 * @param {string} line
 * @param {string[]} keys
 * @returns {bool}
 */
const isChordLine = (line, keys) => {
    if (!keys) {
        keys = Array.from(getKnownChords().keys())
    }
    const tokens = line.split(/\s/).filter(a => a) // strip out the ''s
    return tokens.every(token => keys.includes(token))
}


/**
 * Returns true if a line consists only of '[' <something> ']'
 * Used to aid styling of block descriptors such as '[Intro]' and '[Chorus]' 
 * @param {string} line
 * @returns {bool}
 */
const isBlockLine = (line) => {
    return /^\[(.*)\]$/.test(line.trim())
}


/**
 * Returns an array of objects containing information about a chord's position on a line
 * @param {any} line
 * @returns {Object[]}
 */
function convertToChords(line) {
    const nonSpaceRegex = /[^\s]+/g
    const matches = [...line.matchAll(nonSpaceRegex)]
    let firstSpace = 0
    const chordData = matches.map((match, i) => {
        return {
            start: match.index,
            end: match.index + match[0].length,
            chord: match[0]
        }
    })

    for (const chordDatum of chordData) {
        chordDatum.precedingSpaces = chordDatum.start - firstSpace
        firstSpace = chordDatum.end
    }
    return chordData
}




/**
 * Replace all chord strings within a string {line} with an opinionated <span> element in the correct position
 * <span> element comes with the 'chord' classname and the string value representing the chord as the value
 * of the "data-finger-positioning" attribute.
 * @param {string} line
 * @param {Map<string, string>} knownChords
 * @returns {any}
 */
function chordLine(line, knownChords) {
    const chords = convertToChords(line)

    return chords.map(({ chord, precedingSpaces }) => {
        const spaces = ' '.repeat(precedingSpaces)
        return `${spaces}<span class="chord" data-finger-positioning="${knownChords.get(chord)}">${chord}</span>`
    }).join("")
}

/**
 * Stylises lines in a string, replacing "Block" line e.g. '[Chorus]', and "Chord" lines e.g. ' Am   Amaj7'
 * with opinionated <span> elements.
 * @param {any} songData
 * @returns {any}
 */
function chordify(songData, cb = applyTransformBasedOnLineType) {
    // The eleventy filter is expected to take the whole song as data, passed as a single argument
    // ... hence chords need to be loaded here
    const knownChords = getKnownChords()
    const keys = Array.from(knownChords.keys())
    const songLines = songData.split("\n")
    const highlightedLines = songLines.map(line => cb(line, keys, knownChords))
    return highlightedLines.join("\n")
}




function applyTransformBasedOnLineType(line, keys, knownChords) {
    let replacePreCode = false
    // Markdown processing tacks on a <pre><code> tag to the head of the first line
    const openTags = "<pre><code>"
    const closeTags = "</code></pre>"

    if (/<pre><code>/.test(line)) {
        line = line.replace(openTags, "").replace(closeTags, "")
        replacePreCode = true
    }

    const startString = replacePreCode ? openTags : ""

    if (isBlockLine(line)) {
        return `${startString}<span class="block" >${line}</span > `
    }
    if (!isChordLine(line, keys)) {
        return `${startString}${line}`
    }

    return `${startString}${chordLine(line, knownChords)}`
}

module.exports = { chordify, chordifyLine: convertToChords, isChordLine, isBlockLine, getKnownChords } 