function Board() {

    this._grid = [];
    this._isSolved = false;
    this._isValid = false;
    this._groups = [];

}

Board.prototype.createGrid = function() {
  for (var id = 0; id < BoardSize*BoardSize; id++) {
     cell = new Cell(id);
     this._grid[id] = cell;
  }
}

Board.prototype.buildGroups = function () {
  var cols = [];
  var rows = [];
  var boxes = [];

  for (var i = 0; i < BoardSize; i++) {
    cols[i]=new Group("col " + i);
    rows[i]=new Group("row " + i);
    boxes[i]=new Group("box " + i);
  }

  for (var id = 0; id < BoardSize*BoardSize; id++) {
     cell = this._grid[id];
     rows[cell.row].add(cell);
     cols[cell.col].add(cell);
     boxes[cell.box].add(cell);

     // and to complete the coupling ...
     cell.addGroup(rows[cell.row]);
     cell.addGroup(cols[cell.col]);
     cell.addGroup(boxes[cell.box]);
  }

  /* ids to row col box & boxpos
  0   1   2     3   4   5     6   7   8
  9  10  11    12  13  14    15  16  17
  18  19  20    21  22  23    24  25  26

  27  28  29    30  31  32    33  34  35
  36  37  38    39  40  41    42  43  44
  45  46  47    48  49  50    51  52  53

  54  55  56    57  58  59    60  61  62
  63  64  65    66  67  68    69  70  71
  72  73  74    75  76  77    78  79  80

  boxes

  0   1   2
  3   4   5
  6   7   8

  position in the box maps the same

  row = Math.floor(id/BoardSize)
  col = id % BoardSize
  box = SquareSize * Math.floor(this.row / SquareSize) + Math.floor(this.col / SquareSize);
  boxpos = row % 3 * size + col % 3 ( the position of the cell within the box)
  also row = ( id - col )/ BoardSize (as col 0 is always divisible without fractions)

  */
  // let each cell know who its vertical neighbours are
  for (var col=0; col < BoardSize; col++) {
   var previousCell = cols[col][BoardSize-1];
   var cell = cols[col][0];
   var nextCell = cols[col][1];
   for (var row=0; row < BoardSize; row++) {

     cell.up = previousCell;
     cell.down = nextCell;

     previousCell = cell;
     cell = nextCell;
     nextCell = cols[col][(row + 1) % BoardSize];
   }
  }
  // let each cell know who its horizontal neighbours are
  for (var row=0; row < BoardSize; row++) {
   var previousCell = rows[row][BoardSize-1];
   var cell = rows[row][0];
   var nextCell = rows[row][1];

   for (var col=0; col < BoardSize; col++) {

     cell.left = previousCell;
     cell.right = nextCell;

     previousCell = cell;
     cell = nextCell;
     nextCell = rows[row][(col + 1) % BoardSize];
   }
  }
  this._groups = rows.concat(cols.concat(boxes));
}
Board.prototype.clone = function () {
  var clone = new Board();
  clone._isSolved = this._isSolved;
  clone._isValid = this._isValid;
  for (var i = 0; i < BoardSize*BoardSize; i++) {
    clone._grid[i] = this._grid[i].clone();
  }
  clone._groups = clone.buildGroups();
  return clone;
};

Board.prototype.copyTo = function (target) {
  target = this.clone();
};

Board.prototype.getCell = function (loc) {
  return this._grid[loc.row * BoardSize + loc.col];
};

Board.prototype.setCell = function (loc, value) {
  this._grid[loc.row * BoardSize + loc.col].set(value);
};

Board.prototype.clear = function () {
  for (var cell in this._grid)
      cell.clear();
};

Board.prototype.reset = function () {// return Baord to only the givens
  for (var cell in this._grid)
    if (!cell.isGiven())
      cell.clear();
  return this; // allow chaining
};


Board.prototype.checkIsValid = function (loc, digit) {
  return this._grid[loc.row * BoardSize + loc.col].isCandidate(digit);
};

Board.prototype.acceptPossibles = function () {
  Board.prototype.reset = function () {// return Baord to only the givens
    var singles = [];
    for (var cell in this._grid)
      if (cell.isSingle())
        singles.push(cell);
    for (var cell in singles) {
      cell.set(cell.getAnswer());
    }
    return this; // allow chaining
  };

  var more = false;
  var locs = Location.grid();
  for (var i = 0; i < locs.length; i++) {
    var loc = locs[i];
    var cell = this._cells[loc.row][loc.col];
    if (!cell.isAssigned() && cell.hasAnswer() && this.checkIsValid(loc, cell.getAnswer())) {
      cell.setValue(cell.getAnswer()); // if unassigned and has the answer then assign the answer
      more = true;
    }
  }
  return more;
};

Board.prototype.checkForHiddenSingles = function (loc, st) {
  // Check each cell - if not assigned and has no answer then check its siblings
  // get all its allowed then remove all the allowed
  var cell = this.getCell(loc);
  if (!cell.isAssigned() && !cell.hasAnswer()) {
    var allowed = cell.getAllowedClone(); // copy of bit mask of allowed values for this cell
    var locs = loc.getSibs(st);
    for (var i = 0; i < locs.length; i++) {
      var sib = locs[i];
      var sibCell = this.getCell(sib);
      if (!sibCell.isAssigned())
        allowed.removeValues(sibCell.getAllowedClone()); // remove allowed values from siblings
    }
    var answer = allowed.getSingle(); // if there is only one allowed value left (i.e. this cell is the only one amonsgt its sibs with this allowed value)
    // then apply it as the answer. Note getSingle will return 0 (i.e. no anser) if the number of allowed values is not exactly one
    if (answer != 0) {
      cell.setAnswer(answer);
      return true; // no need to check others sibling collections
    }
  }
  return false;
};

Board.prototype.findCellWithFewestChoices = function () {
  var minLocation = Location.empty;
  var minCount = 9;
  var locs = Location.grid();
  for (var i = 0; i < locs.length; i++) {
    var loc = locs[i];
    var cell = this.getCell(loc);
    if (!cell.isAssigned()) {
      var count = cell.getAllowedClone().count();
      if (count < minCount) {
        minLocation = loc;
        minCount = count;
      }
    }
  }
  return minLocation;
};

Board.prototype.updateAllowed = function () {
  // Called whenever the user sets a value or via auto solve
  // Updates the allowed values for each cell based on existing digits
  // entered in a cell's row, col or square
  var cols = new Array(BoardSize);
  var rows = new Array(BoardSize);
  var squares = new Array(BoardSize);

  // First aggregate assigned values to rows, cols, squares
  var locs = Location.grid();
  for (var i = 0; i < locs.length; i++) {
    var loc = locs[i];
    // Disallow for all cells in this row
    var contains = this.getCell(loc).valueMask();
    rows[loc.row] |= contains;
    cols[loc.col] |= contains;
    squares[loc.getSquare()] |= contains;
  }

  // For each cell, aggregate the values already set in that row, col and square.
  // Since the aggregate is a bitmask, the bitwise inverse of that is therefore the allowed values.
  this._isValid = true;
  this._isSolved = true;
  for (var i = 0; i < locs.length; i++) {
    var loc = locs[i];
    // Set allowed values
    var contains = rows[loc.row] | cols[loc.col] | squares[loc.getSquare()];
    var cell = this.getCell(loc);
    cell.setAllowed(~contains); // set allowed values to what values are not already set in this row, col or square
    cell.setAnswer(0); //clear any previous answers
    // As an extra step look for "naked singles", i.e. cells that have only one allowed value, and use
    // that to set the answer (note this is different from the "value" as this can only be assigned
    // by the user or any auto solve functions like "accept singles"
    if (!cell.isAssigned()) {
      this._isSolved = false;
      var mask = new Candidates(~contains);
      var count = mask.count();
      if (count == 0)
        this._isValid = false;
      else if (count == 1)
        cell.setAnswer(mask.getSingle());
    }
  }
  // Step 2: Look for "hidden singles".
  // For each row, col, square, count number of times each digit appears.
  // If any appear once then set that as the answer for that cell.
  // Count in rows
  for (var i = 0; i < locs.length; i++) {
    var loc = locs[i];
    if (!this.checkForHiddenSingles(loc, SibType.Row))// first check row sibs for a hidden single
      if (!this.checkForHiddenSingles(loc, SibType.Col))// then check cols
        this.checkForHiddenSingles(loc, SibType.Square); // then check square
  }
  // TO DO: Add code here to detect naked/hidden doubles/triples/quads
  return true;
};

Board.prototype.trySolve = function (loc, value) {// empty Location allowed
  if (!loc.isEmpty())// assign a value to a location if provided
  {
    var cell = this.getCell(loc);
    if (!cell.isAllowed(value))
      throw "Internal error.";
    cell.setValue(value);
  }

  do {
    this.updateAllowed();
    if (!this._isValid)
      return false;
  } while (this.acceptPossibles()); // keep doing deterministic answers

  if (this._isSolved)
    return true;

  if (!this._isValid)
    return false;

  // No deterministic solutions, find cell with the fewest choices and try each one in turn
  // until success.
  var locChoice = this.findCellWithFewestChoices();
  if (locChoice.isEmpty())
    return false;

  var cell = this.getCell(locChoice);
  var Candidates = cell._candidates.CandidatesArray();
  for (var i = 0; i < Candidates.length; i++) {
    var val = Candidates[i];
    var board = this.clone();
    if (board.trySolve(locChoice, val)) {
      board.copyTo(this);
      return true;
    }
  }

  return false;
};

Board.prototype.toString = function () {
  var text = "";
  for (var row = 0; row < BoardSize; row++)
    for (var col = 0; col < BoardSize; col++) {
      var val = this._cells[row][col].getValue();
      text += val == 0 ? "." : String(val);
    }
  return text;
};

Board.prototype.setString = function (value) {
  // Assumes all input is digits 1..9 or ./space
  if (value.length != (BoardSize * BoardSize))
    return false; //Input string is not of length 81
  for (var id = 0; id < BoardSize*BoardSize; id++) {
      var ch = parseInt(value.charAt(id)); // converts '0' to 0 etc
      var cell = this._grid[id];
      cell.setGiven(!isNaN(ch) ? ch : 0);
    }
  this.updateAllowed();
  return true;
};
