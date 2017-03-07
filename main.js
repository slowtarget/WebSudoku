var normalForeColor = "#517900"; //dark green
var selectedColor = "#D21A1A"; // MAIN RED
var givenColor = "#0F7E7E"; //main blue
var normalColor = "#000000"; // BLACK
var singleColor = "#8BC418"; // MAIN GREEN
var bgColor = "#C2EF69"; // LIGHT GREEN
var bgSelectedColor = "#FF7070"; //LIGHT RED

var SquareSize = 3;
var BoardSize = SquareSize * SquareSize;
var SibType = { "Row": 1, "Col": 2, "Square": 3 };

var CellSize = 60;
var SubCellSize = 18;
var margin =2;

var fillSize = CellSize - (2 * margin);
var fillOffset = fillSize / 2;
var subY = [];
var subX = [];

for (var id = 0; id < BoardSize; id++) {
  subY[id] = SubCellSize * (Math.floor(id / SquareSize) - 1);
  subX[id] = SubCellSize * (Math.floor(id % SquareSize) - 1);
}

var cvBoard = document.getElementById("cvBoard");
var context = cvBoard.getContext('2d');
context.textAlign = "center";
context.textBaseline = "middle";

var cvDigitSelector = document.getElementById("cvDigitSelector");
var chbAllowed = document.getElementById("chbAllowed");
var chbShowSingles = document.getElementById("chbShowSingles");
var tbSerial = document.getElementById("tbSerial");
var extraInfo = document.getElementById("extraInfo");

var board = new Board();
board.createGrid();
board.buildGroups();

var showAllowed = true;
var showSingles = true;
var undoStack = Array();

function undo() {
  var tos = undoStack.pop();
  if (tos) {
    board = tos;
    updateUI();
  }
}

function clearUndo() {
  undoStack = Array();
}

function pushBoard() {
  undoStack.push(board.clone());
}

function checkStatus() {
  extraInfo.innerHTML = "";
  if (!board._isValid)
    message.innerHTML = "*Invalid*";
  else if (board._isSolved)
    message.innerHTML = "*Solved*";
  else
    message.innerHTML = "";
}

function drawGrid() {
  // Only ever called once!
  context.strokeStyle = '#808080';
  for (var i = 0; i <= BoardSize; i++) {
    context.beginPath();
    var thick = i % 3 == 0;
    // Draw vertical lines
    context.lineWidth = thick ? 2 : 1;
    context.moveTo(i * CellSize + 0.5, 0.5);
    context.lineTo(i * CellSize + 0.5, BoardSize * CellSize + 0.5);
    context.stroke();

    // Draw horizontal lines
    context.moveTo(0.5, i * CellSize + 0.5);
    context.lineTo(BoardSize * CellSize + 0.5, i * CellSize + 0.5);
    context.stroke();
  }
};

function drawCells(){
  var selectedCell = board.getSelectedCell();
  board._grid.forEach(function(cell, id, arr){cell.paint(selectedCell);});
};

function drawCanvas() {
//  cvBoard.width = cvBoard.width;
  drawGrid();
  drawCells();
};

function updateUI() {
  drawCanvas();
  checkStatus();
  tbSerial.value = board.toString();
};

function readOptions() {
  showAllowed = chbAllowed.checked;
  showSingles = chbShowSingles.checked;
  drawCanvas();
};

chbAllowed.onclick = readOptions;
chbShowSingles.onclick = readOptions;

function selectCell(row, col) {
  selectRow = row;
  selectCol = col;
  drawCanvas();
};

function moveSelection(row, col) {
  selectRow += row;
  selectCol += col;
  if (selectRow < 0)
    selectRow = 8;
  else if (selectRow > 8)
    selectRow = 0;
  if (selectCol < 0)
    selectCol = 8;
  else if (selectCol > 8)
    selectCol = 0;
  drawCanvas();
}

function setDigitInCell(n) {
  var cell = board.getSelectedCell();
  if (cell === null) return;
  message.innerHTML = "";
  if (cell.isGiven()) return;
  if (!cell.isCandidate(n)) {
    message.innerHTML = "Digit not allowed";
    return;
  }
  pushBoard();
  cell.set(n);
  board.updateAllowed();
  updateUI();
}

cvBoard.onmousedown = function canvasMouseDown(ev) {
  var coords = this.relMouseCoords(ev);
  var row = Math.floor(coords.y / CellSize);
  var col = Math.floor(coords.x / CellSize);

  board.selectCell(board.getCell(row * BoardSize + col));

  updateUI();
  message.innerHTML = "["+row+","+col+"]"
}

document.onkeydown = function (ev) {
  switch (ev.keyCode) {
    case 37: // left arrow
      if (board._selectedCell == null) return;
      board.selectCell(board._selectedCell._left);
      break;
    case 38: // up arrow
      if (board._selectedCell == null) return;
      board.selectCell(board._selectedCell._up);
      break;
    case 39: // right arrow
      if (board._selectedCell == null) return;
      board.selectCell(board._selectedCell._right);
      break;
    case 40: // down arrow
      if (board._selectedCell == null) return;
      board.selectCell(board._selectedCell._down);
      break;
    default:
      if (board._selectedCell == null) return;
      var key = Number(ev.keyCode);
      var digit = key >= 96 ? key - 96 : key - 48;// handle keypad digits as well
      if (digit >= 0 && digit <= 9)
        setDigitInCell(digit);
      break;
  }
}

function loadText() {
  var ret = board.setString(tbSerial.value);
  updateUI();
  if (!ret)
    message.innerHTML = "String is not of length 81";
}

function clearGame() {
  clearUndo();
  board.clear();
  updateUI();
}

function acceptPossibles() {
  pushBoard();
  board.acceptPossibles();
  board.updateAllowed();
  updateUI();
}

function hint() {
  // First check if we had calculated a solution, if not do so now
  solution = board.clone();
  if (solution.trySolve(Location.empty, 0)) {
    // There is a solution to the board from its current state
    var cell = solution.getCell(new Location(selectRow, selectCol));
    if (!cell.isGiven())
      setDigitInCell(cell.getValue());
  }
}

function reset() {
  clearUndo();
  board.reset();
  updateUI();
}

function solve() {
  pushBoard();
  var n = new Date();           // Grab new copy of date
  var s = n.getTime();          // Grab current millisecond #
  board.trySolve(Location.empty, 0);
  var diff = new Date().getTime() - s;
  updateUI();
  extraInfo.innerHTML = "Solve took " + String(diff) + " milliseconds";
}

//http://magictour.free.fr/sudoku.htm for list of hard Sudoku puzzles
// http://www.sudokuwiki.org/sudoku.htm good on-line solver accepting serial format
//board.setString("7.8...3.....2.1...5.........4.....263...8.......1...9..9.6....4....7.5..........."); //very hard
//board.setString("7.8...3.....2.1...5..7..2...4.....263.948...7...1...9..9.6....4....7.5....5......"); // medium
//board.setString("...7..5.2.6.5.289....1.........3.1...93.7....51...6..91.8.............6...4...2.3"); // medium
//board.setString(".....89...7...9.1.4....3..71..5..3.2..4.9.....296.......52..43.8...........3..26.");
board.setString("..3 4  29    1    24   78  62    79 4       8 95    62  26   74    2    31  9 2  ");

updateUI();
var digCellSize = 54;

// New stuff - draw a digit selector in canvas above board
function initDigitSource() {
  // Only ever called once!
  var context = cvDigitSelector.getContext('2d');
  context.strokeStyle = '#808080';
  var SourceSize = BoardSize + 1;
  for (var i = 0; i <= SourceSize; i++) {
    context.beginPath();
    // Draw vertical lines
    context.lineWidth = 1;
    context.moveTo(i * digCellSize + 0.5, 0.5);
    context.lineTo(i * digCellSize + 0.5, digCellSize + 0.5);
    context.stroke();
  }
  for (var i = 0; i <= 1; i++) {
    context.beginPath();
    // Draw horizontal lines
    context.lineWidth = 1;
    context.moveTo(0.5, i * digCellSize + 0.5);
    context.lineTo(SourceSize * digCellSize + 0.5, i * digCellSize + 0.5);
    context.stroke();
  }
  context.font = "24pt Calibri";
  context.textAlign = "center";
  context.textBaseline = "middle";
  var normalForeColor = "#708090";
  context.fillStyle = normalForeColor; // text color - dark
  for (var col = 0; col < SourceSize; col++) {
    var x = (col + 0.5) * digCellSize; // center of cell for textAlign center, textBaseline middle
    var y = 0.5 * digCellSize;
    var value = col < 9 ? col + 1 : "Del";
    context.fillStyle = normalForeColor; // show "givens" in a darker color
    context.fillText(value, x, y);
  }
}
initDigitSource();

cvDigitSelector.onmousedown = function canvasMouseDown(ev) {
  var x = ev.pageX - this.offsetLeft;
  var y = ev.pageY - this.offsetTop;
  var coords = this.relMouseCoords(ev);
  var dig = Math.floor(coords.x / digCellSize) + 1;
  if (dig == 10)
    dig = 0;
  setDigitInCell(dig);
};
