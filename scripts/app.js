///////////////
// VARIABLES //
///////////////

let secretWord;
let remainingGuesses = 8;


///////////////
// FUNCTIONS //
///////////////

function generateSecretWord() {
	let wordFile = 'words-alpha.txt'

	return fetch(wordFile)
	.then((response) => response.text())
	.then((text) => {
		const wordArr = text.split('\r\n');
		const randNum = Math.trunc(Math.random() * wordArr.length)
		secretWord = wordArr[randNum]
		console.log(secretWord); // temporary
	})
}

function removeAllChildNodes(parent) {
	while (parent.firstElementChild) {
		parent.removeChild(parent.firstElementChild);
	}
}



//////////////////////
// DOM MANIPULATION //
//////////////////////

const startGameBtn = document.getElementById('start-game-btn');
const section2Ele = document.getElementById('section-2');

window.addEventListener('load', () => {
	generateSecretWord(); // for now; difficulty would need to be selected first
})

startGameBtn.addEventListener('click', () => {
	const ul = document.getElementById('secret-word-container');
	removeAllChildNodes(ul);
	
	for (let char of secretWord) {
		const li = document.createElement('li');
		li.textContent = char.toUpperCase();
		li.classList.add('guess');
		ul.appendChild(li);
	}

	section2Ele.classList.toggle('hidden');
	startGameBtn.classList.toggle('hidden');
	document.querySelector('footer').classList.toggle('hidden');s
})



/* To Do:
- Begin implementing the HTML canvas drawing of the Hangman

- Start building out the logic for the event listeners that will be attached to each 
of the letter containers. Make sure event delegation is working as intended

- The startGameBtn listener will need to be updated so that it creates the secret word,
but the textContent of each new li element doesnt show the char. The char should
only be revealed after a correct guess

- For the difficulty modes, that should be handled by a Modal window. Refer to previous
projects and notes for building out the Modal
*/

/* Feature Ideas:
- Difficulty Modes:
	The harder the difficulty, the longer the words become
	Note: 'electroencephalographically' is longest word I found (27 chars long)

- Link to secret words Dictionary.com definition:
	On win or lose, display a hyperlink to the words definition
	Note: https://www.dictionary.com/browse/${word}
*/