///////////////
// VARIABLES //
///////////////

let secretWord;



///////////////
// FUNCTIONS //
///////////////

function generateSecretWord() {
	let wordFile = 'words-alpha.txt'

	return fetch(wordFile)
	.then((response) => response.text())
	.then((text) => {
		const wordArr = text.split('\n');
		const randNum = Math.trunc(Math.random() * wordArr.length)
		secretWord = wordArr[randNum]
	})
}



//////////////////////
// DOM MANIPULATION //
//////////////////////

const startGameBtn = document.getElementById('start-game-btn');

window.addEventListener('load', () => {
	generateSecretWord();
})

startGameBtn.addEventListener('click', () => {
	generateSecretWord();
	
	for (let char of secretWord) {
		const ul = document.getElementById('secret-word');
		const li = document.createElement('li');
		li.textContent = char.toUpperCase();
		ul.appendChild(li);
	}

})
