window.onload = readyFunction;
function readyFunction() {
  const grid = document.querySelector('.grid');
  let width = 10;
  const arrLength = width * width;
  let mineAmount = 20;
  let defused = 0;
  let chancesLeft = 5;
  let squares = [];
  let isGameOver = false;

  function createBoard() {
    // get shuffled game array with random mines
    const minesArray = Array(mineAmount).fill('mine');
    const emptyArray = Array(arrLength - mineAmount).fill('noMine');
    const gameArray = emptyArray.concat(minesArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);
    // console.log(shuffledArray);
    document.querySelector('.result1').innerHTML = mineAmount + " mines still active";
    document.querySelector('.result2').innerHTML = chancesLeft + " chances remaining";
    for (let i = 0; i < arrLength; i++) {
      const square = document.createElement('div');
      square.setAttribute('id', i);
      square.classList.add(shuffledArray[i]);
      grid.appendChild(square);
      squares.push(square);

      //normal click
      square.addEventListener('click', function (e) {
        click(square);
      });

      // right-click
      // square.oncontextmenu = function (e) {   // I prefer the following
      square.addEventListener('contextmenu', function (e) {
        if (e.button !== 2) return;   // 2 is the mouse right-buttom
        if (isGameOver) return;
        e.preventDefault();
        if (square.classList.contains('checked')) return;
        if (square.classList.contains('mine')) {
          addDefused(square);
        } else {
          click(square);
          chancesLeft--;
          let y = " chances remaining";
          if (chancesLeft === 0) {
            gameOver();
            y = " chances remaining, game over";
          } else if (chancesLeft === 1) {
            y = " chance remaining";
          }
          document.querySelector('.result2').innerHTML = chancesLeft + y;
        }
        square.classList.add('checked');
      });
    }

    // add numbers
    for (let i = 0; i < arrLength; i++) {
      let total = 0;
      const isLeftEdge = (i % width === 0);
      const isRightEdge = (i % width === width - 1);
      if (squares[i].classList.contains('noMine')) {
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('mine')) total++;
        if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('mine')) total++;
        if (i > 9 && squares[i - width].classList.contains('mine')) total++;
        if (i > 10 && !isLeftEdge && squares[i - 1 - width].classList.contains('mine')) total++;
        if (i < 99 && !isRightEdge && squares[i + 1].classList.contains('mine')) total++;
        if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('mine')) total++;
        if (i < 89 && !isRightEdge && squares[i + 1 + width].classList.contains('mine')) total++;
        if (i < 90 && squares[i + width].classList.contains('mine')) total++;
        squares[i].setAttribute('data', total);
      }
    }

  }  // end of createBoard() function

  createBoard();

  function addDefused(square) {
    square.classList.add('defused');
    square.innerHTML = '💣';
    defused++;
    // check for win
    if (defused === mineAmount) {
      document.querySelector('.result1').innerHTML = 'YOU WIN!';
      gameOver();
    } else {
      let minesLeft = mineAmount - defused;
      let x = " mines ";
      if (minesLeft === 1) x = " mine ";
      let y = " chances ";
      if (chancesLeft === 1) y = " life ";
      document.querySelector('.result1').innerHTML = minesLeft + x + "still active";
    }
  }

  function click(square) {
    if (isGameOver || square.classList.contains('checked')) return;
    let currentId = square.id
    if (square.classList.contains('mine')) {
      square.classList.add('explode');
      // square.innerHTML = '💣';   // gets done anyway in gameOver()
      document.querySelector('.result1').innerHTML = "You stepped on a mine";
      document.querySelector('.result2').innerHTML = "Game over";
      gameOver();
    } else {
      let total = square.getAttribute('data');
      if (total > 0) {
        square.innerHTML = total;
      } else {
        checkSquare(square, currentId);
      }
    }
    square.classList.add('checked');
  }

  function checkSquare(square, currentId) {
    currentId = parseInt(currentId);
    const isLeftEdge = (currentId % width === 0);
    const isRightEdge = (currentId % width === width - 1);
    setTimeout(() => {
      // left
      if (currentId > 0 && !isLeftEdge) {
        click(document.getElementById(currentId - 1));
      }
      // top right
      if (currentId > 9 && !isRightEdge) {
        click(document.getElementById(currentId + 1 - width));
      }
      // top
      if (currentId > 9) {
        click(document.getElementById(currentId - width));
      }
      // top left
      if (currentId > 10 && !isLeftEdge) {
        click(document.getElementById(currentId - 1 - width));
      }
      // right
      if (currentId < 99 && !isRightEdge) {
        click(document.getElementById(currentId + 1));
      }
      // bottom left
      if (currentId < 90 && !isLeftEdge) {
        click(document.getElementById(currentId - 1 + width));
      }
      // bottom right
      if (currentId < 89 && !isRightEdge) {
        click(document.getElementById(currentId + 1 + width));
      }
      // bottom
      if (currentId < 90) {
        click(document.getElementById(currentId + width));
      }
    }, 10);
  }

  function gameOver() {
    isGameOver = true;
    squares.forEach(square => {
      if (square.classList.contains('mine')) {
        // if (!square.classList.contains('explode')) {
        square.innerHTML = '💣';
        // }
      } else {
        let total = square.getAttribute('data');
        if (total > 0) {
          square.innerHTML = total;
        }
        square.classList.add('checked');
      }
    });
  }

}
