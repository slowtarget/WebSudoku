function Cell(id) {
  this._value = null; // null means unassigned
  this._candidates = new Candidates(0x3e); // all possible
  this._answer = null; // no answer yet found
  this._given = false;

  this._id = id;
  this._row = Math.floor(id / BoardSize);
  this._col = id % BoardSize;
  this._box = SquareSize * Math.floor(this._row / SquareSize) + Math.floor(this._col / SquareSize);
  this._boxpos = this._row % SquareSize * size + this._col % SquareSize //  ( the position of the cell within the box)
}

Cell.prototype.clone = function (id) {
  var clone = new Cell(id);
  clone._value = this._value;
  clone._candidates = this._candidates.clone();
  clone._answer = this._answer;
  clone._given = this._given;
  return clone;
};

Cell.prototype.single = function (value) {
  this._value = value; // value user (or auto solve functions) has assigned as a possible answer
  this._candidates = new Candidates(1 << value); // the allowed values as a bit mask
  this._answer = value; // calculated as the only possible correct value
};
/* hex 4 * 4 sudoku puzzles loom... - so probably don't want to use 0 for unset... space would be better.
  0   1   2   3
  4   5   6   7
  8   9   A   B
  C   D   E   F
  */
Cell.prototype.valueMask = function () {
  return this._value == 0 ? 0 : 1 << this._value;
};

Cell.prototype.hasAnswer = function () {
  return this._answer != 0;
};

Cell.prototype.getAnswer = function () {
  return this._answer;
};

Cell.prototype.setAnswer = function (n) {
  if (n < 0 || n > 9)
    throw "Illegal value not in the range 1..9.";
  this._answer = n;
};

Cell.prototype.getValue = function () {
  return this._value;
};

Cell.prototype.setValue = function (n) {
  if (n < 0 || n > 9)
    throw "Illegal value not in the range 1..9.";
  if (n != 0 && !this._candidates.isAllowed(n))
    throw "Not allowed.";
  this._value = n;
  this._given = false;
};

Cell.prototype.setGiven = function (n) {
  if (n < 0 || n > 9)
    throw "Illegal value not in the range 1..9.";
  this._value = n;
  this._given = n != 0;
  this._answer = 0;
};

Cell.prototype.isGiven = function () {
  return this._given;
};

Cell.prototype.isAssigned = function () {
  return this._value != 0;
};

Cell.prototype.clear = function () {
  this._value = 0; // means unassigned
  this._candidates = new Candidates(0x3E); // all possible
  this._answer = 0;
  this._given = 0;
};

Cell.prototype.isAllowed = function (value) {
  return this._candidates.isAllowed(value);
};

Cell.prototype.setAllowed = function (value) {
  this._candidates = new Candidates(value);
};

Cell.prototype.getAllowedClone = function (value) {
  return this._candidates.clone();
};
