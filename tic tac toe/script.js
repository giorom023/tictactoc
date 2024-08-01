document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('.button-option');
  const popup = document.getElementById('popup');
  const message = document.getElementById('message');
  const newGameBtn = document.getElementById('new-game');
  const restartBtn = document.getElementById('restart');
  const toggleModeBtn = document.getElementById('toggle-mode');
  const adjustColorBtn = document.getElementById('adjust-color');
  const selectEmojiBtn = document.getElementById('select-emoji');
  const colorPicker = document.getElementById('color-picker');
  const emojiPicker = document.getElementById('emoji-picker');
  const colorOptions = document.querySelectorAll('.color-option');
  const emojiOptions = document.querySelectorAll('.emoji-option');
  const cancelColorBtn = document.getElementById('cancel-color');
  const confirmEmojisBtn = document.getElementById('confirm-emojis');
  const cancelEmojiBtn = document.getElementById('cancel-emoji');
  const playerXScoreElement = document.getElementById('playerXScore');
  const playerOScoreElement = document.getElementById('playerOScore');

  let currentPlayer = 'X';
  let isGameActive = true;
  let gameState = ['', '', '', '', '', '', '', '', ''];
  let scores = { X: 0, O: 0 };
  let vsBot = false;
  let selectedColor = '';
  let selectedEmojiX = '❌';
  let selectedEmojiO = '⭕';

  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const handleResultValidation = () => {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
      const winCondition = winningConditions[i];
      let a = gameState[winCondition[0]];
      let b = gameState[winCondition[1]];
      let c = gameState[winCondition[2]];
      if (a === '' || b === '' || c === '') {
        continue;
      }
      if (a === b && b === c) {
        roundWon = true;
        break;
      }
    }

    if (roundWon) {
      announce(currentPlayer === 'X' ? 'PLAYERX_WON' : 'PLAYERO_WON');
      isGameActive = false;
      return;
    }

    if (!gameState.includes('')) {
      announce('TIE');
    }
  };

  const announce = (type) => {
    switch (type) {
      case 'PLAYERX_WON':
        message.innerHTML = 'Player X Won!';
        scores.X += 1;
        break;
      case 'PLAYERO_WON':
        message.innerHTML = 'Player O Won!';
        scores.O += 1;
        break;
      case 'TIE':
        message.innerHTML = 'Tie!';
    }
    updateScoreboard();
    popup.classList.remove('hide');
    setTimeout(() => {
      popup.classList.add('hide');
      resetBoard();
    }, 2000);
  };

  const updateScoreboard = () => {
    playerXScoreElement.textContent = scores.X;
    playerOScoreElement.textContent = scores.O;
  };

  const handleCellClick = (e, index) => {
    if (gameState[index] !== '' || !isGameActive) {
      return;
    }

    gameState[index] = currentPlayer;
    e.target.innerHTML = `<span class="emoji">${currentPlayer === 'X' ? selectedEmojiX : selectedEmojiO}</span>`;

    handleResultValidation();

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (vsBot && isGameActive && currentPlayer === 'O') {
      handleBotMove();
    }
  };

  const handleBotMove = () => {
    let emptyCells = [];
    gameState.forEach((cell, index) => {
      if (cell === '') {
        emptyCells.push(index);
      }
    });

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    gameState[randomIndex] = currentPlayer;
    buttons[randomIndex].innerHTML = `<span class="emoji">${selectedEmojiO}</span>`;

    handleResultValidation();
    currentPlayer = 'X';
  };

  const resetBoard = () => {
    gameState = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;
    buttons.forEach(button => {
      button.innerHTML = '';
    });
  };

  const resetScores = () => {
    scores = { X: 0, O: 0 };
    updateScoreboard();
  };

  buttons.forEach((button, index) => {
    button.addEventListener('click', (e) => handleCellClick(e, index));
  });

  newGameBtn.addEventListener('click', resetBoard);
  restartBtn.addEventListener('click', () => {
    resetBoard();
    resetScores();
  });
  toggleModeBtn.addEventListener('click', () => {
    vsBot = !vsBot;
    toggleModeBtn.textContent = vsBot ? 'Play with Friend' : 'Play with Bot';
  });

  adjustColorBtn.addEventListener('click', () => {
    colorPicker.style.display = 'block';
  });

  cancelColorBtn.addEventListener('click', () => {
    colorPicker.style.display = 'none';
  });

  colorOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      selectedColor = e.target.dataset.colors;
      document.body.style.background = selectedColor;
      colorPicker.style.display = 'none';
    });
  });

  selectEmojiBtn.addEventListener('click', () => {
    emojiPicker.style.display = 'block';
  });

  cancelEmojiBtn.addEventListener('click', () => {
    emojiPicker.style.display = 'none';
  });

  emojiOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      if (option.classList.contains('selected')) {
        option.classList.remove('selected');
        option.style.setProperty('--dot-color', 'transparent'); // Reset dot color
      } else {
        const selectedOptions = document.querySelectorAll('.emoji-option.selected');
        if (selectedOptions.length < 2) {
          option.classList.add('selected');
          option.style.setProperty('--dot-color', 'red'); // Set dot color for selected emoji
        } else {
          selectedOptions[0].classList.remove('selected');
          selectedOptions[0].style.setProperty('--dot-color', 'transparent'); // Reset dot color
          option.classList.add('selected');
          option.style.setProperty('--dot-color', 'red'); // Set dot color for newly selected emoji
        }
      }
    });
  });

  confirmEmojisBtn.addEventListener('click', () => {
    const selectedOptions = document.querySelectorAll('.emoji-option.selected');
    if (selectedOptions.length === 2) {
      selectedEmojiX = selectedOptions[0].textContent;
      selectedEmojiO = selectedOptions[1].textContent;
      emojiPicker.style.display = 'none';
    } else {
      alert('Please select two emojis.');
    }
  });
});
