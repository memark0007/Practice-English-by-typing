// Get a random word from the word list
function getRandomWord() {
    return new Promise((resolve) => {
        resolve(words[Math.floor(Math.random() * words.length)]);
    });
}

// Display the random word in the UI
async function displayWordToUI() {
    await getRandomWord().then((word) => {
        randomWord = word;
        // wordEl.innerHTML = randomWord;
    });
}

// Translate the text to Thai using the MyMemory API
async function translateText(text) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|th`;

    const response = await fetch(url);
    const data = await response.json();

    return { responseStatus: data.responseStatus, translatedText: data.responseData.translatedText };
}

// Get word details from the Dictionary API
async function getWordFormDict(word) {
    let url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word;

    try {
        const res = await fetch(url);
        const datas = await res.json();
        wordHistory.push(datas[0]);
        console.log("API:", word, datas[0]);
        if (datas[0] === undefined) {
            getWordFormDict()
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Get words from The Oxford 3000.txt
function getMyWord() {
    return new Promise((resolve) => {
        const vocabulary = [];

        fetch("The Oxford 3000.txt")
            .then((response) => response.text())
            .then((data) => {
                const lines = data.split("\r\n");
                lines.forEach((line) => {
                    vocabulary.push(line);
                });

                words = vocabulary;
                resolve(vocabulary);
            })
            .catch((error) => console.error(error));
    });
}
async function addWordToHistoryEl(wordHistory) {
    const lastWord = wordHistory[wordHistory.length - 1];

    // Create list element
    const listEl = document.createElement("div");
    listEl.classList = "list";

    // Create audio element
    const audioEl = document.createElement('audio');

    // Create audio button
    const audioBtn = document.createElement("button");
    audioBtn.classList = "audio";
    audioBtn.innerHTML = "audio";

    lastWord.phonetics.forEach(phonetic => {
        if (phonetic.audio !== '') {
            audioEl.src = phonetic.audio;
            audioBtn.setAttribute('data-audio', phonetic.audio);
        }
    });
    console.log(audioBtn.getAttribute('data-audio'))

    audioBtn.onclick = () => audioEl.play();

    // Create phonetic element
    const phonetic = document.createElement("h3");
    phonetic.classList = "phonetic";
    phonetic.innerHTML = lastWord.phonetic;

    // Create word element
    const word = document.createElement("h3");
    word.classList = "word";
    word.innerHTML = lastWord.word;

    // Create meanings container
    const meaningsEl = document.createElement("div");
    meaningsEl.classList = "meanings";

    lastWord.meanings.forEach((meaning, index) => {
        if (index === 0 || lastWord.meanings[index - 1].partOfSpeech !== meaning.partOfSpeech) {
            // Create part of speech element
            const partOfSpeech = document.createElement("h3");
            partOfSpeech.classList = "partOfSpeech";
            partOfSpeech.innerHTML = meaning.partOfSpeech;

            meaningsEl.append(partOfSpeech);
        }

        meaning.definitions.forEach((definitionObject) => {
            addMeaningToMeaningsEl(meaningsEl, definitionObject,meaning.partOfSpeech);
        });
    });

    // Append elements to the list element
    listEl.appendChild(audioEl);
    listEl.appendChild(audioBtn);
    listEl.appendChild(phonetic);
    listEl.appendChild(word);
    listEl.appendChild(meaningsEl);

    // Append the list element to the history container
    history.appendChild(listEl);

    // Append the list element to the history container
    history.appendChild(listEl);

    // Scroll the last added element into view
    listEl.scrollIntoView({ behavior: 'smooth', block: 'end' });

    // Add this code to update the sidebar
    const wordHistoryItem = document.createElement('div');
    wordHistoryItem.classList = 'word-history-item';
    wordHistoryItem.innerHTML = lastWord.word;
    wordHistoryItem.onclick = () => scrollToWordInHistory(lastWord.word); // Add this line
    document.getElementById('word-history').appendChild(wordHistoryItem);
}
async function addMeaningToMeaningsEl(meaningsEl, definitionObject, partOfSpeech) {
    // Create part of speech element if needed
    return new Promise((resolve, reject) => {


        if (meaningsEl.children.length === 0) {
            const partOfSpeechEl = document.createElement("h2");
            partOfSpeechEl.classList = "partOfSpeech";
            partOfSpeechEl.innerHTML = partOfSpeech;
            meaningsEl.append(partOfSpeechEl);
        }

        // Create definition element
        const definitionEl = document.createElement("h3");
        definitionEl.classList = "definition";
        definitionEl.innerHTML = definitionObject.definition;

        // Append definition to meaningsEl
        meaningsEl.append(definitionEl);

        // Create translated definition element
        const definitionElTH = document.createElement("h3");

        translateText(definitionObject.definition)
            .then(({ responseStatus, translatedText }) => {
                if (responseStatus === 200) {
                    definitionElTH.innerHTML = translatedText;
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });

        // Append translated definition to meaningsEl
        meaningsEl.append(definitionElTH);
    })
}
function scrollToWordInHistory(word) {
    const wordEls = document.querySelectorAll('.word');
    for (const wordEl of wordEls) {
        if (wordEl.textContent === word) {
            wordEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            break;
        }
    }
}


const wordEl = document.getElementById('word')
const textEl = document.getElementById('text')
const ansEl = document.getElementById('ans')
const history = document.getElementById('history')
const wordHistory = []
let words = []
// const words = ['one', 'two', 'tree']
let randomWord;

// Event listener for input text
textEl.addEventListener("input", async (e) => {
    const inputText = e.target.value;

    if (inputText === randomWord) {
        await displayWordToUI();
        await getWordFormDict(randomWord);
        console.log("randomWord", randomWord);
        addWordToHistoryEl(wordHistory);
        e.target.value = "";
    }
});






// Main function to run the application
async function main() {

    await getMyWord();
    console.log("words", words);
    await displayWordToUI();
    await getWordFormDict(randomWord);
    await addWordToHistoryEl(wordHistory);

}

// Initialize the application
main();



