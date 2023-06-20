"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const $mainSection = $(".main__section");
const $fontSelect = $(".font__select");
const $searchInput = $("input");
const $searchButton = $(".search__button");
const $word = $(".word");
const $wordPhonetic = $(".word__phonetic");
const $meaningSection = $(".meanings__section");
const $listenButton = $(".listen__button");
const $audioIcon = $(".audio__icon");
const $urlLink = $(".url__link");
const $loading = $(".spinner__container");
const $errorContainer = $(".error__container");
const $errorMessage = $(".error__message");
let audio;
const getWord = (search) => __awaiter(void 0, void 0, void 0, function* () {
    $loading.classList.remove("hide");
    const res = yield fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${search}`);
    const wordData = yield res.json();
    if (wordData.message) {
        return `${wordData.message}`;
    }
    if (wordData.length > 0) {
        return wordData[0];
    }
    return "Error: Invalid response from the API";
});
const callAPI = (word) => {
    getWord(word).then(wordData => {
        if (typeof wordData === "string") {
            $loading.classList.add("hide");
            catchError(wordData);
        }
        else {
            useWordData(wordData);
            $loading.classList.add("hide");
            $errorContainer.classList.add("hide");
            $mainSection.classList.remove("hide");
        }
    }).catch(() => {
        $loading.classList.add("hide");
        catchError("There was an error, please try again.");
    });
};
const getFont = () => {
    const $body = $("body");
    $body.style.fontFamily = $fontSelect.value;
};
const wordSound = () => {
    audio.play();
    $audioIcon.classList.remove("fa-play");
    $audioIcon.classList.add("fa-pause");
    audio.addEventListener('ended', () => {
        $audioIcon.classList.remove("fa-pause");
        $audioIcon.classList.add("fa-play");
    });
};
const setWordAndPhonetic = (word, phonetics) => {
    $word.innerText = word;
    for (const phonetic of phonetics) {
        if (phonetic.text && phonetic.audio) {
            $wordPhonetic.innerText = phonetic.text;
            $listenButton.classList.remove("hide");
            audio = new Audio(phonetic.audio);
            break;
        }
        else {
            $wordPhonetic.innerText = "";
            $listenButton.classList.add("hide");
        }
    }
};
const setMeanings = (meanings) => {
    $meaningSection.innerHTML = "";
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
                    : ""}
                            </li>`).join('')
                : ""}
                    </ul>
                </div>
                ${meaning.synonyms.length > 0 ? `
                    <div class="synonyms__section">
                        <p class="synonyms">Synonyms</p>
                        ${meaning.synonyms.map(synonym => `
                            <p class="synonyms__list">${synonym}</p>
                        `).join('')}
                    </div>
                ` : ""}
            </div>
            `;
        }
    }
};
const setSource = (source) => {
    $urlLink.href = source[0];
    $urlLink.textContent = source[0];
};
const useWordData = (wordData) => {
    const word = wordData.word;
    const phonetics = wordData.phonetics;
    const source = wordData.sourceUrls;
    setWordAndPhonetic(word, phonetics.length > 0 ? phonetics : []);
    wordData.meanings && setMeanings(wordData.meanings);
    source.length > 0 && setSource(source);
};
const catchError = (error) => {
    $mainSection.classList.add("hide");
    $errorContainer.classList.remove("hide");
    $errorMessage.innerText = error;
};
$listenButton.addEventListener("click", () => wordSound());
$searchButton.addEventListener("click", () => {
    if ($searchInput.value !== "") {
        callAPI($searchInput.value);
        $searchInput.value = "";
    }
});
$fontSelect.addEventListener("change", () => {
    getFont();
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && $searchInput.value !== "") {
        callAPI($searchInput.value);
        $searchInput.value = "";
    }
});
window.addEventListener("load", () => {
    callAPI("home");
});
