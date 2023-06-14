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
const $searchInput = $("input");
const $searchButton = $(".search__button");
const $word = $(".word");
const $wordPhonetic = $(".word__phonetic");
const $meaningSection = $(".meanings__section");
const $listenButton = $(".listen__button");
let audio;
const getWord = (search) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${search}`);
    const wordData = yield res.json();
    return wordData[0];
});
const wordSound = () => audio.play();
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
const useWordData = (wordData) => {
    console.log(wordData);
    const word = wordData.word;
    const phonetics = wordData.phonetics;
    setWordAndPhonetic(word, phonetics.length > 0 ? phonetics : []);
    wordData.meanings && setMeanings(wordData.meanings);
};
$listenButton.addEventListener("click", () => wordSound());
$searchButton.addEventListener("click", () => {
    if ($searchInput.value !== "") {
        getWord($searchInput.value).then(wordData => useWordData(wordData));
        $searchInput.value = "";
    }
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && $searchInput.value !== "") {
        getWord($searchInput.value).then(wordData => useWordData(wordData));
        $searchInput.value = "";
    }
});
window.addEventListener("load", () => {
    getWord("home").then(wordData => useWordData(wordData));
});
