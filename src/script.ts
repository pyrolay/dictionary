const getWord = async (search: string): Promise<Array<Object>> => {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${search}`)
    const word = await res.json()
    return word
}

const useWordData = (word: Object) => {
    console.log(word)
}

// window events

window.addEventListener("load", () => {
    getWord("hello").then(word => useWordData(word[0]))
})