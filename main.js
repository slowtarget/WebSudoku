var CellSize = 60;
var SubCellSize = 18;

var cvBoard = document.getElementById("cvBoard");
var cvDigitSelector = document.getElementById("cvDigitSelector");
var chbAllowed = document.getElementById("chbAllowed");
var chbShowSingles = document.getElementById("chbShowSingles");
var tbSerial = document.getElementById("tbSerial");
var extraInfo = document.getElementById("extraInfo");

var board1 = new Board();
var selectRow = 0;
var selectCol = 0;
var showAllowed = true;
var showSingles = true;
var undoStack = Array();

function undo() {
  var tos = undoStack.pop();
  if (tos) {
    board1 = tos;
    updateUI();
  }
}

function clearUndo() {
  undoStack= Array();
}

function pushBoard() {
  undoStack.push(board1.clone());
}

function checkStatus() {
  extraInfo.innerHTML = "";
  if (!board1._isValid)
    message.innerHTML = "*Invalid*";
  else if (board1._isSolved)
    message.innerHTML = "*Solved*";
  else
    message.innerHTML = "";
}

function drawGrid() {
  // Only ever called once!
  var context = cvBoard.getContext('2d');
  context.strokeStyle = '#808080';
  for (var i = 0; i <= BoardSize; i++) {
    context.beginPath();
    var thick = i % 3 == 0;
    // Draw vertical lines
    context.lineWidth = thick ? 2 : 1;
    context.moveTo(i * CellSize + 0.5, 0.5);
    context.lineTo(i * CellSize + 0.5, BoardSize * CellSize + 0.5);

    // Draw horizontal lines
    context.moveTo(0.5, i * CellSize + 0.5);
    context.lineTo(BoardSize * CellSize + 0.5, i * CellSize + 0.5);
    context.stroke();
  }
}

function drawCells() {
  var context = cvBoard.getContext('2d');

  context.font = "12pt Calibri"; // small text
  context.textAlign = "center";
  context.textBaseline = "middle";
  var normalColor = "#aaaaaa";
  var singleColor = "#ff143c";

  // Draw background for selected cell
  for (var row = 0; row < BoardSize; row++)
    for (var col = 0; col < BoardSize; col++) {

      // Draw background of selected cell
      if (row == selectRow && col == selectCol) {
        var margin = 2;
        context.beginPath();
        context.rect(col * CellSize + margin + 0.5, row * CellSize + margin + 0.5, CellSize - 2 * margin, CellSize - 2 * margin);
        context.fillStyle = "#ffe4e1";
        context.fill()
      }
    }
  context.fillStyle = "#999999"; // text color - light

  // Draw allowed values
  if (showAllowed)
    for (var row = 0; row < BoardSize; row++)
      for (var col = 0; col < BoardSize; col++) {
        var cell = board1.getCell(new Location(row, col));
        if (!cell.isAssigned()) {
          var Candidates = cell._allowed.CandidatesArray();
          for (var i = 0; i < Candidates.length; i++) {
            var val = Candidates[i];
            var x = (col + 0.5) * CellSize; // center of cell for textAlign center, textBaseline middle
            var y = (row + 0.5) * CellSize;
            var subRow = Math.floor((val - 1) / 3) - 1;
            var subCol = Math.floor((val - 1) % 3) - 1;
            x += subCol * SubCellSize;
            y += subRow * SubCellSize;
            var hiddenSingle = Candidates.length != 1 && val == cell.getAnswer(); // naked single would have only one allowed value
            context.fillStyle = normalColor; // show hidden single in purple
            if (showSingles && val == cell.getAnswer())
              context.fillStyle = singleColor; // show hidden single in purple
            context.fillText(val, x, y);
          }
        }
      }

  // New if a digit is selected then make all cells with the same digit foreground red
  var selectCell = board1.getCell(new Location(selectRow, selectCol));
  var selectValue = selectCell.getValue();

  // Draw values last
  context.font = "32pt Calibri";
  context.textAlign = "center";
  context.textBaseline = "middle";
  var normalForeColor = "#191929";
  var sameDigitForeColor = "#F91919";
  context.fillStyle = normalForeColor; // text color - dark
  for (var row = 0; row < BoardSize; row++)
    for (var col = 0; col < BoardSize; col++) {
      var cell = board1.getCell(new Location(row, col));
      var x = (col + 0.5) * CellSize; // center of cell for textAlign center, textBaseline middle
      var y = (row + 0.5) * CellSize;
      var sameDigit = cell.getValue() == selectValue && selectValue != 0;
      // Draw value
      var value = cell.getValue();
      if (value != 0) {
        context.fillStyle = cell.isGiven() ? "#2200aa" : "#696969"; // show "givens" in a darker color
        if (sameDigit)// then override
          context.fillStyle = sameDigitForeColor; // text color - dark
        context.fillText(value, x, y);
      }
    }
}

function drawCanvas() {
  cvBoard.width = cvBoard.width;
  drawGrid();
  drawCells();
}

function updateUI() {
  drawCanvas();
  checkStatus();
  tbSerial.value = board1.toString();
}

function readOptions() {
  showAllowed = chbAllowed.checked;
  showSingles = chbShowSingles.checked;
  drawCanvas();
}

chbAllowed.onclick = readOptions;
chbShowSingles.onclick = readOptions;

function selectCell(row, col) {
  selectRow = row;
  selectCol = col;
  drawCanvas();
}

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

function setDigitInCell(digit) {
  var cell = board1.getCell(new Location(selectRow, selectCol));
  message.innerHTML = "";
  if (cell.isGiven())
    return;
  if (digit != 0 && !cell.isAllowed(digit)) {
    message.innerHTML = "Digit not allowed";
    return;
  }
  pushBoard();
  cell.setValue(digit);
  board1.updateAllowed();
  updateUI();
}

cvBoard.onmousedown = function canvasMouseDown(ev) {
  var x = ev.pageX - this.offsetLeft;
  var y = ev.pageY - this.offsetTop;
  var coords = this.relMouseCoords(ev);
  selectCell(Math.floor(coords.y / CellSize), Math.floor(coords.x / CellSize));
}

document.onkeydown = function (ev) {
  switch (ev.keyCode) {
    case 37: // left arrow
      moveSelection(0, -1);
      break;
    case 38: // up arrow
      moveSelection(-1, 0);
      break;
    case 39: // right arrow
      moveSelection(0, 1);
      break;
    case 40: // down arrow
      moveSelection(1, 0);
      break;
    default:
      var key = Number(ev.keyCode);
      var digit = key >= 96 ? key - 96 : key - 48;// handle keypad digits as well
      if (digit >= 0 && digit <= 9)
        setDigitInCell(digit);
      break;
  }
}

function loadText() {
  var ret = board1.setString(tbSerial.value);
  updateUI();
  if (!ret)
    message.innerHTML = "String is not of length 81";
}

function clearGame() {
  clearUndo();
  board1.clear();
  updateUI();
}

function acceptPossibles() {
  pushBoard();
  board1.acceptPossibles();
  board1.updateAllowed();
  updateUI();
}

function hint() {
  // First check if we had calculated a solution, if not do so now
  solution = board1.clone();
  if (solution.trySolve(Location.empty, 0)) {
    // There is a solution to the board from its current state
    var cell = solution.getCell(new Location(selectRow, selectCol));
    if (!cell.isGiven())
      setDigitInCell(cell.getValue());
  }
}

function reset() {
  clearUndo();
  board1.reset();
  updateUI();
}

function solve() {
  pushBoard();
  var n = new Date();           // Grab new copy of date
  var s = n.getTime();          // Grab current millisecond #
  board1.trySolve(Location.empty, 0);
  var diff = new Date().getTime() - s;
  updateUI();
  extraInfo.innerHTML = "Solve took " + String(diff) + " milliseconds";
}

//http://magictour.free.fr/sudoku.htm for list of hard Sudoku puzzles
// http://www.sudokuwiki.org/sudoku.htm good on-line solver accepting serial format
//board1.setString("7.8...3.....2.1...5.........4.....263...8.......1...9..9.6....4....7.5..........."); //very hard
board1.setString("7.8...3.....2.1...5..7..2...4.....263.948...7...1...9..9.6....4....7.5....5......"); // medium
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
}
