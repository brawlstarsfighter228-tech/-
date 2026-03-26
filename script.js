document.addEventListener('DOMContentLoaded', () => {
    // Секции
    const setupSection = document.getElementById('setup-section');
    const inputSection = document.getElementById('input-section');
    const quizSection = document.getElementById('quiz-section');
    const resultSection = document.getElementById('result-section');

    // Кнопки
    const startBtn = document.getElementById('start-btn');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const checkAnswerBtn = document.getElementById('check-answer-btn');
    const restartBtn = document.getElementById('restart-btn');

    // Поля ввода и отображения
    const wordCountInput = document.getElementById('word-count');
    const wordInputsContainer = document.getElementById('word-inputs');
    const russianWordDisplay = document.getElementById('russian-word-display');
    const englishInput = document.getElementById('english-input');
    const feedback = document.getElementById('feedback');
    const scoreDisplay = document.getElementById('score-display');

    let words = [];
    let quizWords = [];
    let currentWordIndex = 0;
    let score = 0;
    let attempts = 0;

    // Шаг 1: Пользователь выбирает количество слов
    startBtn.addEventListener('click', () => {
        const count = parseInt(wordCountInput.value, 10);
        if (count > 0) {
            setupSection.classList.add('hidden');
            inputSection.classList.remove('hidden');
            createWordInputs(count);
        } else {
            alert('Пожалуйста, введите корректное количество слов.');
        }
    });

    // Создание полей для ввода слов
    function createWordInputs(count) {
        wordInputsContainer.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const pairDiv = document.createElement('div');
            pairDiv.className = 'word-pair';
            pairDiv.innerHTML = `
                <input type="text" class="english-word" placeholder="Слово на английском ${i + 1}">
                <input type="text" class="russian-word" placeholder="Перевод на русском ${i + 1}">
            `;
            wordInputsContainer.appendChild(pairDiv);
        }
    }

    // Шаг 2: Пользователь вводит слова и начинает тест
    startQuizBtn.addEventListener('click', () => {
        words = [];
        const englishWordInputs = document.querySelectorAll('.english-word');
        const russianWordInputs = document.querySelectorAll('.russian-word');
        let allFilled = true;

        for (let i = 0; i < englishWordInputs.length; i++) {
            const english = englishWordInputs[i].value.trim();
            const russian = russianWordInputs[i].value.trim();
            if (english && russian) {
                words.push({ english, russian });
            } else {
                allFilled = false;
                break;
            }
        }

        if (allFilled) {
            inputSection.classList.add('hidden');
            quizSection.classList.remove('hidden');
            startQuiz();
        } else {
            alert('Пожалуйста, заполните все поля.');
        }
    });
    
    // Начало квиза
    function startQuiz() {
        // Перемешиваем слова для случайного порядка
        quizWords = [...words].sort(() => Math.random() - 0.5);
        currentWordIndex = 0;
        score = 0;
        showNextWord();
    }

    // Показать следующее слово
    function showNextWord() {
        if (currentWordIndex < quizWords.length) {
            const word = quizWords[currentWordIndex];
            russianWordDisplay.textContent = word.russian;
            englishInput.value = '';
            feedback.textContent = '';
            englishInput.focus();
            attempts = 0;
        } else {
            showResults();
        }
    }

    // Шаг 3: Проверка ответа
    checkAnswerBtn.addEventListener('click', () => {
        const userAnswer = englishInput.value.trim().toLowerCase();
        const correctAnswer = quizWords[currentWordIndex].english.toLowerCase();

        if (userAnswer === correctAnswer) {
            feedback.textContent = 'Правильно!';
            feedback.style.color = 'green';
            if (attempts === 0) {
                score++;
            }
            setTimeout(() => {
                currentWordIndex++;
                showNextWord();
            }, 1000);
        } else {
            attempts++;
            if (attempts < 2) {
                feedback.textContent = 'Неправильно. Попробуйте еще раз.';
                feedback.style.color = 'orange';
                englishInput.value = '';
                englishInput.focus();
            } else {
                feedback.textContent = `Неправильно. Правильный ответ: ${quizWords[currentWordIndex].english}`;
                feedback.style.color = 'red';
                setTimeout(() => {
                    currentWordIndex++;
                    showNextWord();
                }, 2000);
            }
        }
    });
    
    // Позволяет нажимать Enter для проверки
    englishInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            checkAnswerBtn.click();
        }
    });

    // Показать результаты
    function showResults() {
        quizSection.classList.add('hidden');
        resultSection.classList.remove('hidden');
        scoreDisplay.textContent = `Вы набрали ${score} из ${words.length} баллов.`;
    }

    // Начать заново
    restartBtn.addEventListener('click', () => {
        resultSection.classList.add('hidden');
        setupSection.classList.remove('hidden');
        wordCountInput.value = '5';
    });
});
