// Global

const $ = (selector: string) => document.querySelector(selector) 
const $$ = (selector: string) => document.querySelectorAll(selector)


// Variables

const $body = $("body") as HTMLElement
const $mainSection = $(".main__section") as HTMLElement
const $fontSelect = $(".font__select") as HTMLSelectElement
const $themeSwitcher = $(".theme__button") as HTMLElement
const $searchInput = $("input") as HTMLInputElement
const $searchButton = $(".search__button") as HTMLElement
const $word = $(".word") as HTMLElement
const $wordPhonetic = $(".word__phonetic") as HTMLElement
const $meaningSection = $(".meanings__section") as HTMLElement
const $listenButton = $(".listen__button") as HTMLElement
const $audioIcon = $(".audio__icon") as HTMLElement
const $urlLink = $(".url__link") as HTMLLinkElement
const $loading = $(".spinner__container") as HTMLElement
const $errorContainer = $(".error__container") as HTMLElement
const $errorMessage = $(".error__message") as HTMLParagraphElement

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

const getWord = async (search: string): Promise<IWordAPI | string> => {
    $loading.classList.remove("hide")
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${search}`)
    const wordData = await res.json()
    if (wordData.message) {
        return `${wordData.message}`
    }
    if (wordData.length > 0) {
        return wordData[0]
    }
    return "Error: Invalid response from the API"
}


// Functions

const callAPI = (word: string) => {
    getWord(word).then(wordData => {
        if (typeof wordData === "string") {
            $loading.classList.add("hide")
            catchError(wordData)
        }
        else {
            useWordData(wordData)
            $loading.classList.add("hide")
            $errorContainer.classList.add("hide")
            $mainSection.classList.remove("hide")
        }
    }).catch(() => {
        $loading.classList.add("hide")
        catchError("There was an error, please try again.")
    })
}


// DOM

const getFont = () => {
    $body.style.fontFamily = $fontSelect.value
}

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

const catchError = (error: string) => {
    $mainSection.classList.add("hide")
    $errorContainer.classList.remove("hide")
    $errorMessage.innerText = error
}


// Events

$listenButton.addEventListener("click", () => wordSound())

$searchButton.addEventListener("click", () => {
    if ($searchInput.value !== "") {
        callAPI($searchInput.value)
        $searchInput.value = ""
    }
})

$fontSelect.addEventListener("change", () => getFont())

$themeSwitcher.addEventListener("click", () => {
    $body.classList.toggle("active")
})

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && $searchInput.value !== "") {
        callAPI($searchInput.value)
        $searchInput.value = ""
    }
})

window.addEventListener("load", () => {
    callAPI("home")
})



// Tasks:
// Cambio de font