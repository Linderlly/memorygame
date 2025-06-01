// Const com as cartas, nome do jogador e tempo
const grid = document.querySelector('.grid');
const spanPlayer = document.querySelector('.player');
const timer = document.querySelector('.timer');

const modalOverlay = document.querySelector('.modal-overlay');
const modalMessage = document.querySelector('.modal-message');
const btnBackLogin = document.querySelector('.btn-back-login');

// Sons
const soundFlip = new Audio('/memorygame/sounds/flip.mp3');
const soundMatch = new Audio('/memorygame/sounds/acerto.mp3');
const soundError = new Audio('/memorygame/sounds/erro.mp3');

// Array com o nome das cartas
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

// Const para criação dos elementos
const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

let firstCard = '';
let secondCard = '';
let lockBoard = false; // trava clique enquanto cartas erradas estão viradas

const checkEndGame = () => {
  const disabledCards = document.querySelectorAll('.disabled-card');

  if (disabledCards.length === 20) {
    clearInterval(loop);

    // Mostrar modal com mensagem
    modalMessage.textContent = `Parabéns, ${spanPlayer.innerHTML}! Seu tempo foi de: ${timer.innerHTML} segundos.`;
    modalOverlay.classList.remove('hidden');
  }
};

const checkCards = () => {
  const firstCharacter = firstCard.getAttribute('data-character');
  const secondCharacter = secondCard.getAttribute('data-character');

  if (firstCharacter === secondCharacter) {
    // Acerto
    firstCard.firstChild.classList.add('disabled-card');
    secondCard.firstChild.classList.add('disabled-card');

    // Adiciona brilho verde
    firstCard.classList.add('correct');
    secondCard.classList.add('correct');

    soundMatch.play();

    setTimeout(() => {
      // Remove o brilho após 1.2s para não acumular estilos
      firstCard.classList.remove('correct');
      secondCard.classList.remove('correct');
      firstCard = '';
      secondCard = '';
      lockBoard = false;

      checkEndGame();
    }, 1200);
    
  } else {
    // Erro
    soundError.play();
    lockBoard = true;

    // Adiciona brilho vermelho
    firstCard.classList.add('wrong');
    secondCard.classList.add('wrong');

    setTimeout(() => {
      firstCard.classList.remove('reveal-card', 'wrong');
      secondCard.classList.remove('reveal-card', 'wrong');

      firstCard = '';
      secondCard = '';
      lockBoard = false;
    }, 1000);
  }
};

const revealCard = ({ target }) => {
  if (lockBoard) return;
  if (target.parentNode.className.includes('reveal-card')) {
    return;
  }

  target.parentNode.classList.add('reveal-card');
  soundFlip.play();

  if (firstCard === '') {
    firstCard = target.parentNode;
  } else if (secondCard === '') {
    secondCard = target.parentNode;

    checkCards();
  }
};

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

const loadGame = () => {
  const duplicateCharacters = [...characters, ...characters];

  const shuffledArray = duplicateCharacters.sort(() => Math.random() - 0.5);

  shuffledArray.forEach((character) => {
    const card = createCard(character);
    grid.appendChild(card);
  });
};

let loop;

const startTimer = () => {
  loop = setInterval(() => {
    const currentTime = +timer.innerHTML;
    timer.innerHTML = currentTime + 1;
  }, 1000);
};

// Voltar para a tela de login ao clicar no botão do modal
btnBackLogin.addEventListener('click', () => {
  window.location.href = '../index.html';
});

// Busca o nome do Jogador inserido na página de login e inicia o jogo
window.onload = () => {
  spanPlayer.innerHTML = localStorage.getItem('player');
  startTimer();
  loadGame();
};
