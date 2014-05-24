var boardStatus = [0,0,0,0,0,0,0,0,0];

var player =1;

var computer = 2;

var winId;


$("td").click(function() {
  if (boardStatus[$(this).data("id")] === 0) {
    var clickId = $(this).data("id");
    main(clickId);  
  }   
})

function main(clickId) {
  if (handlePlay(clickId, player) === true) {
    resetTable();
  } else {
      computerId();
    if (handlePlay(computerId(), computer) === true) {
      resetTable();
      }
    }
}

function computerId() {
  if (selectWin(computer) !== false) {
    return selectWin(computer);
  } else if (selectWin(player) !== false) {
    return selectWin(player);
  } else {
    return randomId();
  }
}

function handlePlay(id, currentPlayer) {
  boardStatus[id] = currentPlayer;
  insertCharacter(id);
  return checkResult(currentPlayer); 
}

function insertCharacter(id) {
  if (boardStatus[id] === 1) {
    $("td:eq(" + id + ")").addClass("insertStyle").html("O");
  }
  if (boardStatus[id]  === 2) {
    $("td:eq(" + id + ")").addClass("insertStyle").html("X");
  }
}

function checkResult(currentPlayer) {
  if (winGame(currentPlayer) === true) {
    if (currentPlayer === 1) {
      alert("Player Win!")
      return true;
    }
    if (currentPlayer === 2) {
      alert("Computer Win!")
    return true;
    }
  }

  if ($.inArray(0, boardStatus) === -1 &&
    winGame(currentPlayer)!== true){
    alert("Tie!")
    return true;
  }  
  return false;
}

function generateNumber() {
  return Math.floor(Math.random() * 9);
}

function randomId() {
  var randomNumber = generateNumber();
  while (boardStatus[randomNumber] !== 0) {
    randomNumber = generateNumber()
  } 
    return randomNumber;
}

function checkBoard(index1, index2, index3, currentPlayer) {
  return boardStatus[index1] === currentPlayer 
  && boardStatus[index2] === currentPlayer 
  && boardStatus[index3] === currentPlayer
}

function winGame(currentPlayer) {
  if (checkBoard(0, 3, 6, currentPlayer) === true) {
    return true
  }
  if (checkBoard(0, 1, 2, currentPlayer) === true) {
    return true
  }
  if (checkBoard(3, 4, 5, currentPlayer) === true) {
    return true
  }
  if (checkBoard(6, 7, 8, currentPlayer) === true) {
    return true
  }
  if (checkBoard(2, 5, 8, currentPlayer) === true) {
    return true
  }
  if (checkBoard(0, 4, 8, currentPlayer) === true) {
    return true
  }
  if (checkBoard(2, 4, 6, currentPlayer) === true) {
    return true
  }
  if (checkBoard(1, 4, 7, currentPlayer) === true) {
    return true
  }
}

function resetTable() {
  boardStatus = [0,0,0,0,0,0,0,0,0];
  $("td").html("");
}

function convertArr(row, column) {
  return boardStatus[3 * row + column];
}

function rowWin(play) {
  for (var row = 0; row < 3; row++) {
    console.log(row);
    if (convertArr(row, 0) === play && convertArr(row, 1) === play && convertArr(row, 2) === 0){
        return winId = row * 3 + 2;
    } else if (convertArr(row, 0) === play && convertArr(row, 2) === play && convertArr(row, 1) === 0){
        return winId = row * 3 + 1;
    } else if (convertArr(row, 2) === play && convertArr(row, 1) === play && convertArr(row, 0) === 0){
        return winId = row * 3 + 0;
    } 
  } 
  return false;
}

function columnWin(play) {
  for (var column = 0; column < 3; column++) {
    console.log(column);
    if (convertArr(0, column) === play && convertArr(1, column) === play && convertArr(2, column) === 0){
        return winId = 2 * 3 + column;
    } else if (convertArr(0, column) === play && convertArr(2, column) === play && convertArr(1, column) === 0){
        return winId = 1 * 3 + column;
    } else if (convertArr(1, column) === play && convertArr(2, column) === play && convertArr(0, column) === 0){
        return winId = 0 * 3 + column;
    } 
  } return false;
}

function digonalWin(play) {
  if (convertArr(0, 0) === play && convertArr(1, 1) === play && convertArr(2, 2) === 0) {
      return winId = 8;
  } else if (convertArr(1, 1) === play && convertArr(2, 2) === play && convertArr(0, 0) === 0) {
      return winId = 0;
  } else if (convertArr(0, 0) === play && convertArr(2, 2) === play && convertArr(1, 1) === 0) {
      return winId = 4;
  } else if (convertArr(0, 2) === play && convertArr(1, 1) === play && convertArr(2, 0) === 0) {
      return winId = 6;
  } else if (convertArr(0, 2) === play && convertArr(2, 0) === play && convertArr(1, 1) === 0) {
      return winId = 4;
  } else if (convertArr(1, 1) === play && convertArr(2, 0) === play && convertArr(0, 2) === 0) {
      return winId = 2;
  } else {
      return false;
  }
}

function selectWin(play) {
  if (rowWin(play) === false && columnWin(play) === false && digonalWin(play) === false) {
    return false;
  } else {
      return winId;
  }
}
