

class Word {
  constructor(text) {
    this.text = text;
    this.element = document.createElement('div');
    this.element.classList.add('word');
    const letterSpans = text.split('').map(letter => {
      const span = document.createElement('span');
      span.classList.add('letter');
      span.textContent = letter;
      return span;
    });
    this.element.append(...letterSpans);
  }

  markLetter(key, expected) {
    const currentLetter = this.element.querySelector('.letter.current');
    if (currentLetter) {
      currentLetter.classList.add(key === expected ? 'correct' : 'incorrect');
      currentLetter.classList.remove('current');
      if (currentLetter.nextElementSibling) {
        currentLetter.nextElementSibling.classList.add('current');
      }
    } else {
      const incorrectLetter = document.createElement('span');
      incorrectLetter.textContent = key;
      incorrectLetter.classList.add('letter', 'incorrect', 'extra');
      this.element.appendChild(incorrectLetter);
    }
  }

  isComplete() {
    const letters = [...this.element.querySelectorAll('.letter')];
    return letters.every(letter => letter.classList.contains('correct'));
  }
}

class Game {
  constructor(element) {
    this.element = element;
    this.words = [];
    this.infoElement = document.getElementById('info');
    this.cursor = document.getElementById('cursor');
    this.gameTime = 30 * 1000;
    this.timer = null;
    this.gameOver = false;
    this.startTime = null;
  }

  startGame() {
    this.gameOver = false;
    this.words.length = 0;
    this.element.innerHTML = '';
    for (let i = 0; i < 200; i++) {
      this.words.push(new Word(randomWord()));
      this.element.appendChild(this.words[i].element);
    }
    this.words[0].element.querySelector('.letter').classList.add('current');
    this.infoElement.textContent = this.gameTime / 1000;
    this.startTime = Date.now();
    this.timer = setInterval(() => this.gameLoop(), 1000);
  }

  gameLoop() {
    if (this.gameOver) return;
    const currentTime = Date.now();
    const elapsedTime = currentTime - this.startTime;
    const remainingTime = Math.round((this.gameTime - elapsedTime) / 1000);
    if (remainingTime <= 0) {
      this.gameOver = true;
      this.endGame();
      return;
    }
    this.infoElement.textContent = remainingTime;
    this.updateCursor();
  }

  endGame() {
    clearInterval(this.timer);
    this.element.classList.add('over');
    this.infoElement.textContent = `WPM: ${this.getWpm()}`;
  }

  getWpm() {
    const correctWords = this.words.filter(word => word.isComplete());
    return correctWords.length / (this.gameTime / 60000);
  }

  updateCursor() {
    const currentWord = this.element.querySelector('.word.current');
    // Check if currentWord exists before attempting to use it
    if (currentWord) {
      const nextLetter = currentWord.querySelector('.letter.current');
      if (nextLetter) {
        this.cursor.style.top = nextLetter.getBoundingClientRect().top + 2 + 'px';
        this.cursor.style.left = nextLetter.getBoundingClientRect().left + 2 + 'px';
      } else {
        this.cursor.style.top = currentWord.getBoundingClientRect().top + 2 + 'px';
        this.cursor.style.left = currentWord.getBoundingClientRect().right + 2 + 'px';
      }
    } else {
      // Optionally hide the cursor or handle the case when no current word is found
      // For example, you could hide the cursor or move it to a default position
      this.cursor.style.display = 'none';
    }
  }
  

  handleKeyup(event) {
    if (this.gameOver) return;
    const key = event.key;
    const currentWord = this.element.querySelector('.word.current');

    // Handle key logic
    const isLetter = key.length === 1 && key !== ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';
    const expected = currentWord?.querySelector('.letter.current')?.textContent || ' ';

    if (isLetter) {
      currentWord.markLetter(key, expected);
    } else if (isSpace) {
      const correctLetters = [...currentWord.querySelectorAll('.letter.correct')];
      if (expected !== ' ') {
        currentWord.querySelectorAll('.letter:not(.correct)').forEach(letter => letter.classList.add('incorrect'));
      }
      currentWord.classList.remove('current');
      const nextWord = currentWord.nextElementSibling;
      if (nextWord) {
        nextWord.classList.add('current');
        nextWord.querySelector('.letter').classList.add('current');
      }
      this.checkMoveLines();
    } else if (isBackspace) {
      if (currentWord.classList.contains('current')) {
        this.handleBackspace(currentWord);
      } else {
        const previousWord = currentWord.previousElementSibling;
        if (previousWord) {
          previousWord.classList.add('current');
          previousWord.lastElementChild.classList.add('current');
          this.removeInlineClasses(previousWord.lastElementChild, ['incorrect', 'correct']);
        }
      }
    }
    this.updateCursor();
  }

  handleBackspace(word) {
    const currentLetter = word.querySelector('.letter.current');
    if (currentLetter && currentLetter.classList.contains('first-letter')) {
      const previousWord = word.previousElementSibling;
      if (previousWord) {
        previousWord.classList.add('current');
        this.removeInlineClasses(previousWord.lastElementChild, ['incorrect', 'correct']);
        previousWord.lastElementChild.classList.add('current');
      }
    } else if (currentLetter) {
      currentLetter.classList.remove('current');
      currentLetter.previousElementSibling.classList.add('current');
      this.removeInlineClasses(currentLetter.previousElementSibling, ['incorrect', 'correct']);
    } else {
      const lastLetter = word.lastElementChild;
      this.removeInlineClasses(lastLetter, ['incorrect', 'correct']);
      lastLetter.classList.add('current');
    }
  }

  removeInlineClasses(element, classes) {
    classes.forEach(className => element.classList.remove(className));
  }

  checkMoveLines() {
    const currentWord = this.element.querySelector('.word.current');
    if (currentWord.getBoundingClientRect().top > 200) {
      const wordsContainer = document.getElementById('words');
      const currentMargin = parseInt(wordsContainer.style.marginTop || '0px');
      wordsContainer.style.marginTop = `${currentMargin - 35}px`;
    }
  }
}

function randomWord() {
  const words = [
    "example", "array", "of", "words", "for", "typing", "game",
    "javascript", "programming", "code", "function", "variable",
    "object", "array", "string", "number", "boolean", "if",
    "else", "for", "while", "loop", "condition", "class",
    "method", "document", "element", "event", "listener",
    "style", "css", "html", "web", "development", "browser"
  ];
  // Generate a random index based on the length of the words array
  const randomIndex = Math.floor(Math.random() * words.length);
  // Return the word at the randomly chosen index
  return words[randomIndex];
}

function isLetter(key) {
  return key.length === 1 && key.match(/^[a-z]+$/i);
}

const game = new Game(document.getElementById('game'));
document.getElementById('newGameBtn').addEventListener('click', () => game.startGame());

