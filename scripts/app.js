///////////////
// VARIABLES //
///////////////

let secretWord;
let remainingGuesses = 8;
const guessedLetters = [];


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
		secretWord = wordArr[randNum].toUpperCase()
		console.log(secretWord); // temporary
	})
}

function removeAllChildNodes(parent) {
	while (parent.firstElementChild) {
		parent.removeChild(parent.firstElementChild);
	}
}

function checkWinOrLose() {
	const allGuesses = document.querySelectorAll('.guess');
	let guessedWord = '';
	allGuesses.forEach(guessNode => guessedWord += guessNode.textContent)
	
	if (secretWord === guessedWord) {
		// Handle win
		console.log('you win :)');
		document.querySelector('body').style.backgroundColor = 'rgb(105, 219, 58, 0.1)';
		// Make the secret word letters and bottom border have a white glow
		// Add a link to the words dictionary definition (https://www.dictionary.com/browse/${word})
	} else if (remainingGuesses === 0) {
		// Handle lose
		console.log('you lose :(')
		document.querySelector('body').style.backgroundColor = 'rgb(243, 115, 138, 0.1)';
		// Add a link to the words dictionary definition (https://www.dictionary.com/browse/${word})
	}
}

function reset() {
	// Reset
}



//////////////////////
// DOM MANIPULATION //
//////////////////////

let temp; // temporary
const startGameBtn = document.getElementById('start-game-btn');
const newGameBtn = document.getElementById('new-game-btn');
const section2Ele = document.getElementById('section-2');
const letterContainers = document.querySelectorAll('.letter-container');

window.addEventListener('load', () => {
	generateSecretWord(); // for now; difficulty would need to be selected first
})

startGameBtn.addEventListener('click', () => {
	const ul = document.getElementById('secret-word-container');
	removeAllChildNodes(ul);

	// Initial hangman drawing
	
	for (let idx in secretWord) {
		const li = document.createElement('li');
		li.textContent = '';
		li.classList.add('guess', `guess-${idx}`);
		ul.appendChild(li);
	}

	section2Ele.classList.toggle('hidden');
	startGameBtn.classList.toggle('hidden');
	newGameBtn.classList.toggle('hidden');
	document.querySelector('footer').classList.toggle('hidden');
})

letterContainers.forEach( container => container.addEventListener('click', function(e) {
	if (e.target.localName === 'li') {
		const guessedLetter = e.target.textContent;
		if (secretWord.includes(guessedLetter) && !guessedLetters.includes(guessedLetter)) {
			for (idx in secretWord) {
				if (secretWord[idx] === guessedLetter) document.querySelector(`.guess-${idx}`).textContent = guessedLetter;
			}
			e.target.classList.add('correct');
			guessedLetters.push(guessedLetter);
			checkWinOrLose();
		} else if (!secretWord.includes(guessedLetter) && !guessedLetters.includes(guessedLetter)) {
			remainingGuesses--;
			e.target.classList.add('incorrect');
			guessedLetters.push(guessedLetter);
			checkWinOrLose();
		}
		console.log(remainingGuesses, guessedLetters); // temporary
	}
}))



/////////////////////
// HANGMAN DRAWING //
/////////////////////


// const canvas = document.getElementById('hangman');
// const context = canvas.getContext("2d");

// clearCanvas = () => {
//   context.clearRect(0, 0, canvas.width, canvas.height)
// }

// Draw = (part) => {
//    switch (part) {
//       case 'gallows' :
//         context.strokeStyle = '#444';
//         context.lineWidth = 10; 
//         context.beginPath();
//         context.moveTo(175, 225);
//         context.lineTo(5, 225);
//         context.moveTo(40, 225);
//         context.lineTo(25, 5);
//         context.lineTo(100, 5);
//         context.lineTo(100, 25);
//         context.stroke();
//         break;

//       case 'head':
//         context.lineWidth = 5;
//         context.beginPath();
//         context.arc(100, 50, 25, 0, Math.PI*2, true);
//         context.closePath();
//         context.stroke();
//         break;
      
//       case 'body':
//         context.beginPath();
//         context.moveTo(100, 75);
//         context.lineTo(100, 140);
//         context.stroke();
//         break;

//       case 'rightHarm':
//         context.beginPath();
//         context.moveTo(100, 85);
//         context.lineTo(60, 100);
//         context.stroke();
//         break;

//       case 'leftHarm':
//         context.beginPath();
//         context.moveTo(100, 85);
//         context.lineTo(140, 100);
//         context.stroke();
//         break;

//       case 'rightLeg':
//         context.beginPath();
//         context.moveTo(100, 140);
//         context.lineTo(80, 190);
//         context.stroke();
//         break;

//       case 'rightFoot':
//          context.beginPath();
//          context.moveTo(82, 190);
//          context.lineTo(70, 185);
//          context.stroke();
//       break;

//       case 'leftLeg':
//         context.beginPath();
//         context.moveTo(100, 140);
//         context.lineTo(125, 190);
//         context.stroke();
//       break;

//       case 'leftFoot':
//          context.beginPath();
//          context.moveTo(122, 190);
//          context.lineTo(135, 185);
//          context.stroke();
//       break;
//    } 
// }

// const draws = [
//    'gallows', 
//    'head', 
//    'body', 
//    'rightHarm', 
//    'leftHarm',
//    'rightLeg',
//    'leftLeg',
//    'rightFoot',
//    'leftFoot',
// ]
// var step = 0;


// const next = document.getElementById('next')

// next.addEventListener('click', function() {
//   Draw(draws[step++])
//   if (undefined === draws[step]) this.disabled = true;
// });

// document.getElementById('reset').addEventListener('click', function() {
//   clearCanvas()
//   step = 0
//   next.disabled = false
// })



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