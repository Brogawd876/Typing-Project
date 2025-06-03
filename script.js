const textDisplay = document.getElementById('text-display');
const textInput = document.getElementById('text-input');
const results = document.getElementById('results');
const restartBtn = document.getElementById('restart-btn');
const themeToggle = document.getElementById('theme-toggle');

const texts = [
    'The quick brown fox jumps over the lazy dog.',
    'Typing tests help you improve your speed.',
    'Practice makes perfect when learning to type.',
    'JavaScript powers many interactive websites.'
];

let currentText = '';

let startTime;
let completed = false;

function startTimer() {
    if (!startTime) {
        startTime = Date.now();
    }
}

function finishTest() {
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000; // seconds
    const words = currentText.split(' ').length;
    const wpm = Math.round((words / timeTaken) * 60);
    results.textContent = `Your speed: ${wpm} WPM`;
    completed = true;
}

function resetTest() {
    currentText = texts[Math.floor(Math.random() * texts.length)];
    textInput.value = '';
    results.textContent = '';
    startTime = null;
    completed = false;
    updateDisplay();
    textInput.focus();
}

function updateDisplay() {
    const typed = textInput.value;
    let markup = '';
    for (let i = 0; i < currentText.length; i++) {
        const char = currentText[i];
        if (i < typed.length) {
            markup += `<span class="${typed[i] === char ? 'correct' : 'incorrect'}">${char}</span>`;
        } else {
            markup += `<span>${char}</span>`;
        }
    }
    textDisplay.innerHTML = markup;
}

textInput.addEventListener('input', () => {
    startTimer();
    updateDisplay();
    if (textInput.value === currentText) {
        if (!completed) {
            finishTest();
        }
    }
});

restartBtn.addEventListener('click', resetTest);

// Initialize
resetTest();

// Theme toggling
function setTheme(dark) {
    if (dark) {
        document.body.classList.add('dark');
        themeToggle.checked = true;
    } else {
        document.body.classList.remove('dark');
        themeToggle.checked = false;
    }
}

// Load stored preference
const storedTheme = localStorage.getItem('darkTheme');
if (storedTheme) {
    setTheme(storedTheme === 'true');
}

themeToggle.addEventListener('change', (e) => {
    const isDark = e.target.checked;
    setTheme(isDark);
    localStorage.setItem('darkTheme', isDark);
});
