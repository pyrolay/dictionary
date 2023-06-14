// Global

const $ = (selector: string) => document.querySelector(selector) 
const $$ = (selector: string) => document.querySelectorAll(selector)

// Variables

const $searchInput = $("input") as HTMLInputElement
const $searchButton = $(".search__button") as HTMLElement
const $word = $(".word") as HTMLElement
const $wordPhonetic = $(".word__phonetic") as HTMLElement
const $meaningSection = $(".meanings__section") as HTMLElement
const $listenButton = $(".listen__button") as HTMLElement
const $audioIcon = $(".audio__icon") as HTMLElement
const $urlLink = $(".url__link") as HTMLLinkElement

let audio: HTMLAudioElement


// Interfaces

interface IWordAPIMeaningDefinition {
    definition: string,
    example: string
}

interface IWordAPIMeaning {
    partOfSpeech: string,
    definitions: Array<IWordAPIMeaningDefinition>,
    synonyms: Array<string>
}

interface IWordAPIPhonetic {
    audio: string,
    text: string
}

interface IWordAPI {
    meanings: IWordAPIMeaning[],
    phonetics: IWordAPIPhonetic[],
    sourceUrls: string[],
    word: string
}


// GET 

const getWord = async (search: string): Promise<IWordAPI> => {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${search}`)
    const wordData = await res.json()
    return wordData[0]
}


// DOM

const wordSound = () => {
    audio.play()
    $audioIcon.classList.remove("fa-play")
    $audioIcon.classList.add("fa-pause")
    audio.addEventListener('ended', () => {
        $audioIcon.classList.remove("fa-pause")
        $audioIcon.classList.add("fa-play")
    })
}

const setWordAndPhonetic = (word: string, phonetics: IWordAPIPhonetic[]) => {
    $word.innerText = word
    for (const phonetic of phonetics) {
        if (phonetic.text && phonetic.audio) {
            $wordPhonetic.innerText = phonetic.text
            $listenButton.classList.remove("hide")
            audio = new Audio(phonetic.audio)
            break
        }
        else {
            $wordPhonetic.innerText = ""
            $listenButton.classList.add("hide")
        }
    }
}

const setMeanings = (meanings: Array<IWordAPIMeaning>) => {
    $meaningSection.innerHTML = ""
    if (meanings.length > 0) {
        for (const meaning of meanings) {
            $meaningSection.innerHTML += `
            <div>
                <div class="speech__section">
                    <span>${meaning.partOfSpeech}</span>
                    <div class="line"></div>
                </div>
                <div class="speech__meaning">
                    <p>Meaning</p>
                    <ul>
                        ${meaning.definitions ?
                        meaning.definitions.map(def => `
                            <li>
                                <p>${def.definition}</p>
                                ${def.example ?
                                    `<p class="meaning__example">${def.example}</p>`
                                    : ""
                                }
                            </li>`).join('')
                            : ""
                        }
                    </ul>
                </div>
                ${meaning.synonyms.length > 0 ? `
                    <div class="synonyms__section">
                        <p class="synonyms">Synonyms</p>
                        ${meaning.synonyms.map(synonym => `
                            <p class="synonyms__list">${synonym}</p>
                        `).join('')}
                    </div>
                ` : ""
                }
            </div>
            `
        }
    }
}

const setSource = (source: Array<string>) => {
    $urlLink.href = source[0]
    $urlLink.textContent = source[0]
}

const useWordData = (wordData: IWordAPI) => {
    const word = wordData.word
    const phonetics = wordData.phonetics
    const source = wordData.sourceUrls
    setWordAndPhonetic(word, phonetics.length > 0 ? phonetics : [])
    wordData.meanings && setMeanings(wordData.meanings)
    source.length > 0 && setSource(source)
}

// Events

$listenButton.addEventListener("click", () => wordSound())

$searchButton.addEventListener("click", () => {
    if ($searchInput.value !== "") {
        getWord($searchInput.value).then(wordData => useWordData(wordData))
        $searchInput.value = ""
    }
})

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && $searchInput.value !== "") {
        getWord($searchInput.value).then(wordData => useWordData(wordData))
        $searchInput.value = ""
    }
})

// Window events

window.addEventListener("load", () => {
    getWord("home").then(wordData => useWordData(wordData))
})



// Tasks:
// Errores - error al cargar y texto de no se encontraron resultados
// Cambio de font
// Cambio de tema
// Loading