function Board() {
    this._grid = [];
    this._isSolved = false;
    this._isValid = true;
    this._groups = [];
    this._selectedCell = null;
}

Board.prototype.createGrid = function() {
  for (var id = 0; id < BoardSize*BoardSize; id++) {
     cell = new Cell(id);
     this._grid[id] = cell;
  }
  this._selectedCell=this._grid[0];
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
     rows[cell._row].add(cell);
     cols[cell._col].add(cell);
     boxes[cell._box].add(cell);

     // and to complete the coupling ...
     cell.addGroup(rows[cell._row]);
     cell.addGroup(cols[cell._col]);
     cell.addGroup(boxes[cell._box]);
     cell._up    = this._grid[cell._idUp];
     cell._down  = this._grid[cell._idDown];
     cell._left  = this._grid[cell._idLeft];
     cell._right = this._grid[cell._idRight];
  }
  /*
  // let each cell know who its vertical neighbours are
  for (var col=0; col < BoardSize; col++) {
   var previousCell = cols[col]._group[BoardSize-1];
   var cell = cols[col]._group[0];
   var nextCell = cols[col]._group[1];
   for (var row=0; row < BoardSize; row++) {

     cell._up = previousCell;
     cell._down = nextCell;

     previousCell = cell;
     cell = nextCell;
     nextCell = cols[col]._group[(row + 1) % BoardSize];
   }
  }
  // let each cell know who its horizontal neighbours are
  for (var row=0; row < BoardSize; row++) {
   var previousCell = rows[row]._group[BoardSize-1];
   var cell = rows[row]._group[0];
   var nextCell = rows[row]._group[1];

   for (var col=0; col < BoardSize; col++) {

     cell._left   = previousCell;
     cell._right  = nextCell;

     previousCell = cell;
     cell = nextCell;
     nextCell = rows[row]._group[(col + 1) % BoardSize];
   }
  }
  */
  this._groups = rows.concat(cols.concat(boxes));
}

Board.prototype.selectCell = function (cell) {
  if (this._selectedCell) {
    this._selectedCell.paint(cell);
  }
  this._selectedCell = cell;
  this._selectedCell.paint(cell);
  console.log("selected "+ cell._id);
}

Board.prototype.getSelectedCell = function () {
  return this._selectedCell;
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
  for (var id = 0; id < this._grid.length; id++)
      this._grid[id].clear();
};

Board.prototype.reset = function () {// return Baord to only the givens
  for (var id = 0; id < this._grid.length; id++)
    if (!this._grid[id].isGiven())
      this._grid[id].clear();
  for (var id = 0; id < this._grid.length; id++)
    if (this._grid[id].isGiven())
      this._grid[id].updateGroups();

  return this; // allow chaining
};

Board.prototype.checkIsValid = function (loc, digit) {
  return this._grid[loc.row * BoardSize + loc.col].isCandidate(digit);
};

Board.prototype.nakedSingles = function () {
    for (var id = 0; id < this._grid.length; id++)
      if (!this._grid[id].isAssigned())
        if (this._grid[id].isSingle()) return true;
    return false;
};
Board.prototype.hiddenSingles = function () {
    var response = false;
    for (var id = 0; id < this._grid.length; id++)
      if (!this._grid[id].isAssigned())
        response = response | this._grid[id].hiddenSingles();
    return response;
};

Board.prototype.acceptPossibles = function () {
    var singles = [];
    for (var id = 0; id < this._grid.length; id++)
      if (this._grid[id].hasAnswer() && !this._grid[id].isAssigned())
        singles.push(this._grid[id]);
    for (var i = 0; i < singles.length; i++) {
      console.log(i+" > "+singles[i]._id+" --> "+singles[i].getAnswer());
      singles[i].set(singles[i].getAnswer());
    }
    return this; // allow chaining
};

Board.prototype.getCell = function (id) {
  if (id<0|id>this._grid.length) throw "error Board.getCell( "+id+" )";
  return this._grid[id];
}
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
  // var cols = new Array(BoardSize);
  // var rows = new Array(BoardSize);
  // var squares = new Array(BoardSize);

  // First aggregate assigned values to rows, cols, squares
  // var locs = Location.grid();
  // for (var i = 0; i < locs.length; i++) {
  //   var loc = locs[i];
  //   // Disallow for all cells in this row
  //   var contains = this.getCell(loc).valueMask();
  //   rows[loc.row] |= contains;
  //   cols[loc.col] |= contains;
  //   squares[loc.getSquare()] |= contains;
  // }

  // For each cell, aggregate the values already set in that row, col and square.
  // Since the aggregate is a bitmask, the bitwise inverse of that is therefore the allowed values.
  // this._isValid = true;
  // this._isSolved = true;
  // for (var i = 0; i < locs.length; i++) {
  //   var loc = locs[i];
  //   // Set allowed values
  //   var contains = rows[loc.row] | cols[loc.col] | squares[loc.getSquare()];
  //   var cell = this.getCell(loc);
  //   cell.setAllowed(~contains); // set allowed values to what values are not already set in this row, col or square
  //   cell.setAnswer(0); //clear any previous answers
  //   // As an extra step look for "naked singles", i.e. cells that have only one allowed value, and use
  //   // that to set the answer (note this is different from the "value" as this can only be assigned
  //   // by the user or any auto solve functions like "accept singles"
  //   if (!cell.isAssigned()) {
  //     this._isSolved = false;
  //     var mask = new Candidates(~contains);
  //     var count = mask.count();
  //     if (count == 0)
  //       this._isValid = false;
  //     else if (count == 1)
  //       cell.setAnswer(mask.getSingle());
  //   }
  // }
  // Step 2: Look for "hidden singles".
  // For each row, col, square, count number of times each digit appears.
  // If any appear once then set that as the answer for that cell.
  // Count in rows
  // for (var i = 0; i < locs.length; i++) {
  //   var loc = locs[i];
  //   if (!this.checkForHiddenSingles(loc, SibType.Row))// first check row sibs for a hidden single
  //     if (!this.checkForHiddenSingles(loc, SibType.Col))// then check cols
  //       this.checkForHiddenSingles(loc, SibType.Square); // then check square
  // }
  // TO DO: Add code here to detect naked/hidden doubles/triples/quads
  if (this.nakedSingles()) {
    console.log("naked singles found");
    return true;
  }
  if (this.hiddenSingles()) {
    console.log("hidden singles found");
    return true;
  }
  return false;
};

Board.prototype.trySolve = function (loc, value) {// empty Location allowed
  if (!loc.isEmpty())// assign a value to a location if provided
  {
    var cell = this.getCell(loc);
    if (!cell.isCandidate(value))
      throw "Internal error.";
    cell.set(value);
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
  for (var id = 0; id < this._grid.length; id++) {
    text += this._grid[id].toString();
  }
  return text;
};

Board.prototype.setString = function (value) {
  if (value.length != (BoardSize * BoardSize))
    return false; //Input string is not of length 81
  board.clear();
  for (var id = 0; id < this._grid.length; id++) {
      this._grid[id].setGiven(value[id]);
  }
  this.updateAllowed();
  return true;
};
