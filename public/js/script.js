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
const getWord = (search) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${search}`);
    const word = yield res.json();
    return word;
});
const useWordData = (word) => {
    console.log(word);
};
// window events
window.addEventListener("load", () => {
    getWord("hello").then(word => useWordData(word[0]));
});
