// Seletores principais
const grid = document.querySelector('.grid');
const spanPlayer = document.querySelector('.player');
const timer = document.querySelector('.timer');
const modalOverlay = document.querySelector('.modal-overlay');
const modalMessage = document.querySelector('.modal-message');
const btnBackLogin = document.querySelector('.btn-back-login');

// Efeitos sonoros
const soundFlip = new Audio('/memorygame/sounds/flip.mp3');
const soundMatch = new Audio('/memorygame/sounds/acerto.mp3');
const soundError = new Audio('/memorygame/sounds/erro.mp3');

// Cartas do jogo
const characters = [
  'beth',
  'jerry',
  'jessica',
  'morty',
  'pessoa-passaro',
  'pickle-rick',
  'rick',
  'summer',
  'meeseeks',
  'scroopy',
];

// Função auxiliar para criar elementos
const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

let firstCard = '';
let secondCard = '';
let lockBoard = false;

// Verifica fim de jogo
const checkEndGame = () => {
  const disabledCards = document.querySelectorAll('.disabled-card');

  if (disabledCards.length === 20) {
    clearInterval(loop);

    modalMessage.textContent = `Parabéns, ${spanPlayer.innerHTML}! Seu tempo foi de: ${timer.innerHTML} segundos.`;
    modalOverlay.classList.remove('hidden');
  }
};

// Comparar cartas
const checkCards = () => {
  const firstCharacter = firstCard.getAttribute('data-character');
  const secondCharacter = secondCard.getAttribute('data-character');

  if (firstCharacter === secondCharacter) {
    // Acerto
    firstCard.firstChild.classList.add('disabled-card');
    secondCard.firstChild.classList.add('disabled-card');

    firstCard.classList.add('correct');
    secondCard.classList.add('correct');

    soundMatch.play();

    setTimeout(() => {
      firstCard.classList.remove('correct');
      secondCard.classList.remove('correct');

      firstCard = '';
      secondCard = '';
      lockBoard = false;

      checkEndGame();
    }, 1200);
  } else {
    // Erro
    lockBoard = true;

    firstCard.classList.add('wrong');
    secondCard.classList.add('wrong');

    soundError.play();

    setTimeout(() => {
      firstCard.classList.remove('reveal-card', 'wrong');
      secondCard.classList.remove('reveal-card', 'wrong');

      firstCard = '';
      secondCard = '';
      lockBoard = false;
    }, 1000);
  }
};

// Revela carta ao clicar
const revealCard = ({ target }) => {
  const card = target.parentNode;

  if (lockBoard || card.classList.contains('reveal-card') || card.classList.contains('disabled-card')) {
    return;
  }

  card.classList.add('reveal-card');
  soundFlip.play();

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;

  setTimeout(checkCards, 500); // pequena pausa para deixar transição suave
};

// Cria carta com frente e verso
const createCard = (character) => {
  const card = createElement('div', 'card');
  const front = createElement('div', 'face front');
  const back = createElement('div', 'face back');

  front.style.backgroundImage = `url('../img/${character}.png')`;

  card.appendChild(front);
  card.appendChild(back);

  card.setAttribute('data-character', character);
  card.addEventListener('click', revealCard);

  return card;
};

// Carrega o jogo embaralhando as cartas
const loadGame = () => {
  const duplicateCharacters = [...characters, ...characters];
  const shuffledArray = duplicateCharacters.sort(() => Math.random() - 0.5);

  shuffledArray.forEach((character) => {
    const card = createCard(character);
    grid.appendChild(card);
  });
};

let loop;

// Inicia o cronômetro
const startTimer = () => {
  loop = setInterval(() => {
    const currentTime = +timer.innerHTML;
    timer.innerHTML = currentTime + 1;
  }, 1000);
};

// Botão para voltar ao login
btnBackLogin.addEventListener('click', () => {
  window.location.href = '../index.html';
});

// Inicia o jogo ao carregar
window.onload = () => {
  spanPlayer.innerHTML = localStorage.getItem('player');
  startTimer();
  loadGame();
};
