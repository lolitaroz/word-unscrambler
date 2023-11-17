let correctWord = "";
let scrambledWord = "";
let score = 0;

async function getRandomWord() {
    try {
        const response = await fetch('https://random-word-api.herokuapp.com/word');
        const words = await response.json();
        return words[0]; // Assuming the API returns an array with one word
    } catch (error) {
        console.error('Error fetching word:', error);
        return null;
    }
}

function scrambleWord(word) {
    let scrambled = word.split('');
    for (let i = scrambled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
    }
    return scrambled.join('');
}

async function setupGame() {
    correctWord = await getRandomWord();
    scrambledWord = scrambleWord(correctWord);
    document.getElementById('result').innerText = '';
    document.getElementById('scrambled-word').innerText = scrambledWord;
    document.getElementById('score').innerText = `Score: ${score}`;
}

function checkWord() {
    const userGuess = document.getElementById('user-input').value;
    document.getElementById('user-input').value = '';
    if (userGuess === correctWord) {
        document.getElementById('result').innerText = "Correct!";
        score += 1;
        setupGame();
    } else {
        document.getElementById('result').innerText = "Try again!";
        score = 0;
    }
    document.getElementById('score').innerText = `Score: ${score}`;
}

async function hint() {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${correctWord}`);
        const data = await response.json();
        const definition = data[0].meanings[0].definitions[0].definition;
        document.getElementById('result').innerText = `Hint: ${definition}`;
    } catch (error) {
        console.error('Error fetching definition:', error);
        document.getElementById('result').innerText = 'Sorry, no hint available.';
    }
}

function reveal() {
    score = 0
    document.getElementById('result').innerText = `The word was: ${correctWord}`;
    document.getElementById('score').innerText = `Score: ${score}`;
    setupGame()
}

document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        checkWord();
    }
});

setupGame();
