const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const questionNumberElement = document.getElementById('question-number');
const questionTextElement = document.getElementById('question-text');
const answerButtons = document.getElementById('answer-buttons');
const scoreElement = document.getElementById('score');

const difficultyButtons = document.querySelectorAll('.difficulty-btn');
let questions = [];
let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

difficultyButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    difficultyButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

fetch('questions.json')
  .then(res => res.json())
  .then(data => questions = data)
  .catch(err => console.error('Error loading questions:', err));

function shuffleArray(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

document.querySelector('.header-title').addEventListener('click', () => {
  quizScreen.style.display = 'none';
  resultScreen.style.display = 'none';
  startScreen.style.display = 'flex';
});

const worldBtn = document.querySelector('.difficulty-btn.world');
const gameBtn = document.querySelector('.difficulty-btn.game');

worldBtn.addEventListener('click', () => startQuiz('world'));
gameBtn.addEventListener('click', () => startQuiz('game'));

function startQuiz(level) {
  if (questions.length === 0) return alert("問題データが読み込まれていません");

  startScreen.style.display = 'none';
  resultScreen.style.display = 'none';
  quizScreen.style.display = 'block';

  score = 0;
  currentQuestionIndex = 0;

  questionNumberElement.classList.remove('world', 'game');
  questionNumberElement.classList.add(level);

  const filtered = questions.filter(q => q.level === level);
  const numQuestions = Math.min(10, filtered.length);
  quizQuestions = shuffleArray(filtered).slice(0, numQuestions);

  showQuestion();
}

function showQuestion() {
  clearAnswers();

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const currentLevel = document.querySelector('.difficulty-btn.selected')?.classList.contains('world') ? 'world' : 'game';

  questionNumberElement.innerHTML = `<span class="question-underline ${currentLevel}">問題 ${currentQuestionIndex + 1}</span>`;

  questionTextElement.textContent = currentQuestion.question;

  const shuffledAnswers = shuffleArray(currentQuestion.answers);
  shuffledAnswers.forEach(answerText => {
    const button = document.createElement('button');
    button.textContent = answerText;
    button.addEventListener('click', () => {
      const isCorrect = (answerText === currentQuestion.answers[currentQuestion.correct]);
      if (isCorrect) score++;
      currentQuestionIndex++;
      if (currentQuestionIndex < quizQuestions.length) {
        showQuestion();
      } else {
        showResult();
      }
    });
    answerButtons.appendChild(button);
  });
}

function clearAnswers() {
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function showResult() {
  quizScreen.style.display = 'none';
  resultScreen.style.display = 'block';
  startScreen.style.display = 'none';

  const selectedCategory = document.querySelector('.difficulty-btn.selected')?.textContent || '';

  const resultTitle = document.getElementById('result-title');
  resultTitle.textContent = `クイズ結果 ～${selectedCategory}～`;

  scoreElement.innerHTML = `
    <span class="correct" style="color:#FF9547; font-size:2em;">${score}</span>
    <span class="unit">問</span>
    <span class="slash"> / </span>
    <span class="total" style="font-size:1.5em;">${quizQuestions.length}</span>
    <span class="unit">問</span>
  `;

  const explanationList = document.getElementById('explanation-list');
  explanationList.innerHTML = '';

  quizQuestions.forEach((q, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <p class="question-number" style="font-weight:bold; font-size:18px;">問題 ${index + 1}</p>
      <p class="question-text">${q.question}</p>
      <p class="correct-answer"><img src="as.png" class="icon-inline"> ${q.answers[q.correct]}</p>
      <p class="explanation"><img src="mm.png" class="icon-inline"> ${q.explanation}</p>
    `;
    explanationList.appendChild(li);
  });
}

const postResultBtn = document.getElementById('post-result');
postResultBtn.addEventListener('click', () => {
  const selectedCategory = document.querySelector('.difficulty-btn.selected')?.textContent || '';
  const postText = `▌ ArcheAgeクイズに挑戦！ ▌\n\n${selectedCategory}で【${score}問】正解！\n\n▼クイズに挑戦\nhttps://www.aafq.jp/\n\n#ArcheAge #ArcheAgeJP #アーキエイジ`;
  const encodedText = encodeURIComponent(postText);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
  window.open(twitterUrl, '_blank', 'width=600,height=400');
});

const backToTopBtn = document.getElementById('back-to-top-btn');
backToTopBtn.addEventListener('click', () => {
  resultScreen.style.display = 'none';
  quizScreen.style.display = 'none';
  startScreen.style.display = 'flex';

  difficultyButtons.forEach(b => b.classList.remove('selected'));

  window.scrollTo({ top: 0, behavior: 'smooth' });
});
