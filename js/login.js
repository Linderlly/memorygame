const input = document.querySelector('.login__input');
const button = document.querySelector('.login__button');
const form = document.querySelector('.login-form');

// Const para evitar que seja um nome de jogador menor que 3 caracteres
const validateInput = ({ target }) => {
  if (target.value.length >= 3) {
    button.removeAttribute('disabled');
    return;
  }

  button.setAttribute('disabled', '');
}

// Direciona para a próxima página (página do jogo) e salva o nome do player
const handleSubmit = (event) => {
  event.preventDefault();

  localStorage.setItem('player', input.value);
  window.location.href = './html/game.html';
}

input.addEventListener('input', validateInput);
form.addEventListener('submit', handleSubmit);