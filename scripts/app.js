///////////////
// VARIABLES //
///////////////

let secretWord;
let remainingGuesses = 8;
let guessedLetters = [];



///////////////
// FUNCTIONS //
///////////////

function generateSecretWord() {
	let wordFile = 'words-alpha.txt';

	return fetch(wordFile)
	.then((response) => response.text())
	.then((text) => {
		const wordArr = text.split('\r\n');
		const randNum = Math.trunc(Math.random() * wordArr.length);
		secretWord = wordArr[randNum].toUpperCase();
		console.log(secretWord); // temporary
	})
}

function removeAllChildNodes(parent) {
	while (parent.firstElementChild) {
		parent.removeChild(parent.firstElementChild)
	}
}

function removeWordDefinitionLink(link) {
	canvasContainer.insertAdjacentElement('afterend', secretWordContainer)
	link.remove()
}

function setAttributes(ele, attrs) {
  for (let key in attrs) {
    ele.setAttribute(key, attrs[key])
  }
}

function checkWinOrLose() {
	const allGuesses = document.querySelectorAll('.guess');
	let guessedWord = '';
	allGuesses.forEach(guessNode => guessedWord += guessNode.textContent)
	
	if (secretWord === guessedWord) {
		bodyEle.style.backgroundColor = 'rgb(105, 219, 58, 0.05)';
		section2Ele.style.pointerEvents = 'none';

		allGuesses.forEach(guessNode => guessNode.classList.add('win'))

		const wordLink = document.createElement('a');
		wordLink.appendChild(secretWordContainer)
		setAttributes(wordLink, {
			'href': `https://www.merriam-webster.com/dictionary/${secretWord}`,
			'target': '_blank',
			'id': 'word-definition-link',
		})
		canvasContainer.insertAdjacentElement('afterend', wordLink)
	} else if (remainingGuesses <= 0) {
		bodyEle.style.backgroundColor = 'rgb(243, 115, 138, 0.05)';
		section2Ele.style.pointerEvents = 'none';

		for (idx in secretWord) {
			if (!guessedLetters.includes(secretWord[idx])) {
				document.querySelector(`.guess-${idx}`).textContent = secretWord[idx];
				document.querySelector(`.guess-${idx}`).style.color = 'red';
			}
		}

		allGuesses.forEach(guessNode => guessNode.classList.add('lose'))
		
		const wordLink = document.createElement('a');
		wordLink.appendChild(secretWordContainer)
		setAttributes(wordLink, {
			'href': `https://www.merriam-webster.com/dictionary/${secretWord}`,
			'target': '_blank',
			'id': 'word-definition-link',
		})
		canvasContainer.insertAdjacentElement('afterend', wordLink)
	}
}

function init() {
	removeAllChildNodes(secretWordContainer)
	
	for (let idx in secretWord) {
		const li = document.createElement('li');
		li.textContent = '';
		li.classList.add('guess', `guess-${idx}`)
		li.setAttribute('style', `--i:${Number(idx)+1}`)
		secretWordContainer.appendChild(li)
	}

	// Initial hangman drawing
	
	section2Ele.classList.toggle('hidden')
	startGameBtn.classList.toggle('hidden')
	footerEle.classList.toggle('hidden')
	resetGameBtn.classList.toggle('hidden')
	closeModal()
}

function reset() {
	const wordDefinitionLink = document.getElementById('word-definition-link');

	generateSecretWord()
	removeAllChildNodes(secretWordContainer)
	if (wordDefinitionLink) removeWordDefinitionLink(wordDefinitionLink)
	
	for (let char of 'HANGMAN') {
		const li = document.createElement('li');
		li.textContent = char;
		li.classList.add('guess')
		secretWordContainer.appendChild(li)
	}

	// Reset hangman drawing

	document.querySelectorAll('.correct').forEach(li => li.classList.remove('correct'))
	document.querySelectorAll('.incorrect').forEach(li => li.classList.remove('incorrect'))

	bodyEle.style.backgroundColor = 'rgb(241, 236, 206, 0.2)';
	section2Ele.style.pointerEvents = 'inherit';
	section2Ele.classList.toggle('hidden')
	startGameBtn.classList.toggle('hidden')
	resetGameBtn.classList.toggle('hidden')
	footerEle.classList.toggle('hidden')

	remainingGuesses = 8;
	guessedLetters = [];
}

function openModal(e) {
  modal.classList.remove("hidden")
  overlay.classList.remove("hidden")
	if (e.target.textContent === 'New Game') reset()
}

function closeModal() {
  modal.classList.add("hidden")
  overlay.classList.add("hidden")
}



//////////////////////
// DOM MANIPULATION //
//////////////////////

let temp; // temporary
const startGameBtn = document.getElementById('start-game-btn');
const resetGameBtn = document.getElementById('reset-btn');
const modalCloseBtn = document.querySelector(".close-modal");
const confirmBtn = document.getElementById('confirm-btn');
const bodyEle = document.querySelector('body');
const section2Ele = document.getElementById('section-2');
const footerEle = document.querySelector('footer');
const canvasContainer = document.getElementById('canvas-container');
const secretWordContainer = document.getElementById('secret-word-container');
const letterContainers = document.querySelectorAll('.letter-container');
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

window.addEventListener('load', () => {
	generateSecretWord() // for now; difficulty would need to be selected first
})

document.addEventListener("keydown", event => {if (event.key === "Escape") closeModal()})

modalCloseBtn.addEventListener("click", closeModal)

overlay.addEventListener("click", closeModal)

startGameBtn.addEventListener('click', openModal)

resetGameBtn.addEventListener('click', openModal)

confirmBtn.addEventListener('click', init)

letterContainers.forEach( container => container.addEventListener('click', function(e) {
	if (e.target.localName === 'li') {
		const guessedLetter = e.target.textContent;
		if (secretWord.includes(guessedLetter) && !guessedLetters.includes(guessedLetter)) {
			for (idx in secretWord) {
				if (secretWord[idx] === guessedLetter) document.querySelector(`.guess-${idx}`).textContent = guessedLetter;
			}
			e.target.classList.add('correct')
			guessedLetters.push(guessedLetter)
			checkWinOrLose()
		} else if (!secretWord.includes(guessedLetter) && !guessedLetters.includes(guessedLetter)) {
			remainingGuesses--
			e.target.classList.add('incorrect')
			guessedLetters.push(guessedLetter)
			checkWinOrLose()
		}
		console.log(remainingGuesses, guessedLetters); // temporary
	}
}));



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