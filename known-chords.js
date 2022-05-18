const DEFAULT_TUNING = "E-A-D-G-B-E"

const fifthStringBarreChords = {
    "XX": [-1, 1, 3, 3, 3, 1],
    "XXmaj7": [-1, 1, 3, 2, 3, 1],
    "XX7": [-1, 1, 3, 1, 3, 1],
    "XXm": [-1, 1, 3, 3, 2, 1],
    "XXm7": [-1, 1, 3, 1, 2, 1],
}

const sixthStringBarreChords = {
    "XX": [1, 3, 3, 2, 1, 1],
    "XXmaj7": [1, 3, 3, 2, 1, 0],
    "XX7": [1, 3, 1, 2, 1, 1],
    "XXm": [1, 3, 3, 1, 1, 1],
    "XXm7": [1, 3, 1, 1, 1, 1],

}

const buildStrings = (frets) => {
    return frets.map(string => string === -1 ? "x" : string.toString()).join("-")
}

const addStrings = (chord, tuning = DEFAULT_TUNING) => {
    return `${chord}\n|-|-|-|-|-|\n${tuning}`
}


const incrementBarreChords = (chordKey, barreChordBase, semitonesToIncrement) => {
    let newChords = {}
    for (const [chord, frets] of Object.entries(barreChordBase)) {
        const incrementedFrets = frets.map(fret => {
            return fret === -1 ? -1 : fret + semitonesToIncrement;
        })
        newChords[chord.replace("XX", chordKey)] = incrementedFrets
    }
    return newChords
}

function getKnownChords() {

    const knownChords = new Map();

    const addToKnownChords = (chords) => {
        for (const [key, frets] of Object.entries(chords)) {
            knownChords.set(key, addStrings(buildStrings(frets)))
        }
    }


    // A
    knownChords.set("A", addStrings("x-0-2-2-2-0"));
    knownChords.set("Amaj7", addStrings("x-0-2-1-2-0"));
    knownChords.set("A7", addStrings("x-0-2-0-2-0"));
    knownChords.set("Am", addStrings("x-0-2-2-1-0"));
    knownChords.set("Am7", addStrings("x-0-2-0-1-0"));
    knownChords.set("Am7/G", addStrings("3-0-2-0-1-0")); // Starman

    // Bb
    const bFlatChords = incrementBarreChords("Bb", fifthStringBarreChords, 0)
    addToKnownChords(bFlatChords)
    knownChords.set("Bb/A", addStrings("x-0-0-3-3-1")); // Starman

    // B
    knownChords.set("B", addStrings("x-2-4-4-4-2"));
    knownChords.set("Bmaj7", addStrings("x-2-1-3-0-x"));
    knownChords.set("B7", addStrings("x-2-1-2-0-2"));
    knownChords.set("Bm", addStrings("x-2-4-4-3-2"));
    knownChords.set("Bm7", addStrings("x-2-0-2-0-2"));

    // C
    knownChords.set("C", addStrings(buildStrings([-1, 3, 2, 0, 1, 0])))
    knownChords.set("Cmaj7", addStrings(buildStrings([-1, 3, 2, 0, 0, 0])))
    knownChords.set("C7", addStrings(buildStrings([-1, 3, 2, 3, 1, 0])))
    knownChords.set("Cm", addStrings(buildStrings([-1, 3, 1, 0, -1, -1])))
    knownChords.set("Cm7", addStrings(buildStrings([-1, 3, 1, 3, -1, -1])))

    // C/G
    knownChords.set("C/G", addStrings(buildStrings([3, 3, 2, 0, 1, 0])))


    // C#
    const cSharpChords = incrementBarreChords("C#", fifthStringBarreChords, 3)
    addToKnownChords(cSharpChords)


    // D
    knownChords.set("D", addStrings("x-x-0-2-3-2"))
    knownChords.set("Dmaj7", addStrings("x-x-0-2-2-2"))
    knownChords.set("D7", addStrings("x-x-0-2-1-2"))
    knownChords.set("Dm", addStrings("x-x-0-2-3-1"))
    knownChords.set("Dm7", addStrings("x-x-0-2-1-1"))

    // Eb
    const eBChords = incrementBarreChords("Eb", fifthStringBarreChords, 5)
    addToKnownChords(eBChords)

    // E
    knownChords.set("E", addStrings("0-2-2-1-0-0"))
    knownChords.set("Emaj7", addStrings("0-2-1-1-0-0"))
    knownChords.set("E7", addStrings("0-2-0-1-0-0"))
    knownChords.set("Em", addStrings("0-2-2-0-0-0"))
    knownChords.set("Em7", addStrings("0-2-2-0-3-0"))


    // F
    const fChords = incrementBarreChords("F", sixthStringBarreChords, 0)
    addToKnownChords(fChords)

    // F#
    const fSharpChords = incrementBarreChords("F#", sixthStringBarreChords, 1)
    addToKnownChords(fSharpChords)

    // G
    knownChords.set("G", addStrings(buildStrings([3, 2, 0, 0, 0, 3])))
    knownChords.set("Gmaj7", addStrings(buildStrings([3, -1, 0, 0, 0, 2])))
    knownChords.set("G7", addStrings(buildStrings([3, 2, 0, 0, 0, 1])))
    knownChords.set("Gm", addStrings(buildStrings([3, 1, 0, 0, 0, 3])))
    knownChords.set("Gm7", addStrings(buildStrings([-1, 1, 3, 0, 3, 0])))

    // G# & Ab
    const gSharpChords = incrementBarreChords("G#", sixthStringBarreChords, 3)
    addToKnownChords(gSharpChords)
    const aFlatChords = incrementBarreChords("Ab", sixthStringBarreChords, 3)
    addToKnownChords(aFlatChords)

    return knownChords
}

module.exports = getKnownChords