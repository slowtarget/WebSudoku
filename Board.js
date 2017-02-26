function Board() {
  function MultiDimArray(rows, cols) {
    var a = new Array(rows);
    for (var i = 0; i < rows; i++) {
      a[i] = new Array(cols);
      for (var j = 0; j < cols; j++)
        a[i][j] = new Cell();
    }
    return a;
  }

  this._digits = MultiDimArray(BoardSize, BoardSize);
  this._isSolved = false;
  this._isValid = false;

}

Board.prototype.clone = function () {
  var clone = new Board();
  clone._isSolved = this._isSolved;
  clone._isValid = this._isValid;
  clone._digits = new Array(BoardSize);
  for (var i = 0; i < BoardSize; i++) {
    clone._digits[i] = new Array(BoardSize);
    for (var j = 0; j < BoardSize; j++)
      clone._digits[i][j] = this._digits[i][j].clone();
  }
  return clone;
};

Board.prototype.copyTo = function (target) {
  target._isSolved = this._isSolved;
  target._isValid = this._isValid;
  for (var i = 0; i < BoardSize; i++)
    for (var j = 0; j < BoardSize; j++)
      target._digits[i][j] = this._digits[i][j].clone();
};

Board.prototype.getCell = function (loc) {
  return this._digits[loc.row][loc.col];
};

Board.prototype.setCell = function (loc, value) {
  this._digits[loc.row][loc.col] = value;
};

Board.prototype.clear = function () {
  for (var i = 0; i < BoardSize; i++)
    for (var j = 0; j < BoardSize; j++)
      this._digits[i][j].clear();
  this.updateAllowed();
};

Board.prototype.reset = function () {// return Baord to only the givens
  for (var i = 0; i < BoardSize; i++)
    for (var j = 0; j < BoardSize; j++) {
      var cell = this._digits[i][j];
      if (!cell.isGiven())
        cell.clear();
    }
  this.updateAllowed();
};

Board.prototype.checkIsValidSibs = function (loc, digit, locs) {
  for (var i = 0; i < locs.length; i++) {
    var loc = locs[i];
    var cell = this._digits[loc.row][loc.col];
    if (cell.getAnswer() == digit)
      return false;
  }
  return true;
};

Board.prototype.checkIsValid = function (loc, digit) {
  // Checks if the digit can go in that location by checking it doesn't
  // exist in either the row, col or square siblings
  if (!this.checkIsValidSibs(loc, digit, loc.colSibs()))
    return false;
  if (!this.checkIsValidSibs(loc, digit, loc.rowSibs()))
    return false;
  if (!this.checkIsValidSibs(loc, digit, loc.squareSibs()))
    return false;

  return true;
};

Board.prototype.acceptPossibles = function () {
  var more = false;
  var locs = Location.grid();
  for (var i = 0; i < locs.length; i++) {
    var loc = locs[i];
    var cell = this._digits[loc.row][loc.col];
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
    if (!this.checkForHiddenSingles(loc, SibType.Row))// first check row sibs for a hiddne single
      if (!this.checkForHiddenSingles(loc, SibType.Col))// then check cols
        this.checkForHiddenSingles(loc, SibType.Square); // then check square
  }

  // TO DO: Add code here to detect naked/hidden doubles/triples/quads
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
  var Candidates = cell._allowed.CandidatesArray();
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
      var val = this._digits[row][col].getValue();
      text += val == 0 ? "." : String(val);
    }
  return text;
};

Board.prototype.setString = function (value) {
  // Assumes all input is digits 1..9 or ./space
  if (value.length != (BoardSize * BoardSize))
    return false; //Input string is not of length 81
  var n = 0;
  for (var row = 0; row < BoardSize; row++)
    for (var col = 0; col < BoardSize; col++) {
      var ch = parseInt(value.charAt(n++)); // converts '0' to 0 etc
      var cell = this._digits[row][col];
      cell.setGiven(!isNaN(ch) ? ch : 0);
    }
  this.updateAllowed();
  return true;
};
