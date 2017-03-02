function Cell(id) {
  this._value = null; // null means unassigned
  this._candidates = new Candidates(); // all possible
  this._candidates.setFullMask();
  this._answer = null; // no answer yet found
  this._given = false;
  this._groups = [];

  this._id = id;
  this._row = Math.floor(id / BoardSize);
  this._col = id % BoardSize;
  this._box = SquareSize * Math.floor(this._row / SquareSize) + Math.floor(this._col / SquareSize);
  this._boxpos = this._row % SquareSize * SquareSize + this._col % SquareSize //  ( the position of the cell within the box)
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
*/
Cell.prototype.clone = function (id) {
  var clone = new Cell(id);
  clone._value = this._value;
  clone._candidates = this._candidates.clone();
  clone._answer = this._answer;
  clone._given = this._given;
  clone._id = this._id;
  clone._row = this._row;
  clone._col = this._col;
  clone._box = this._box;
  clone._boxpos = this._boxpos;

  return clone;
};

Cell.prototype.addGroup = function (group) {
  this._groups.push(group);
};

Cell.prototype.get = function () {
  return this._value;
};

Cell.prototype.set = function (value) {
  if (this._candidates.getIndex(value) < 0)
    throw "Illegal value not in : " + this._candidates._translate;

  if (!this.isCandidate(value))
    throw "Not allowed.";

  for (var group in this._groups) {
    //  group.set(value);
  }
  this._candidates.setSingle(value);
  this._value = value; // value user (or auto solve functions) has assigned as a possible answer

  if (this._answer === null)  // calculated as the only possible correct value
    return null; // should probably solve the puzzle until this has an answer - so that we know whether this is correct or not...

  if (this._answer != value) return false;
  return true;
};

/*
Cell.prototype.set = function (value) {
  this._value = value; // value user (or auto solve functions) has assigned as a possible answer
  if (this.isCandidate(value))
  this._candidates = new Candidates(this.valueMask()); // the allowed values as a bit mask
  this._answer = value; // calculated as the only possible correct value
};
*/
Cell.prototype.isCandidate = function (value) {
  return (this._candidates.isCandidate(value));
};

Cell.prototype.removeCandidate = function (value) {
  return (this._candidates.removeValue(value));
};

/* hex 4 * 4 sudoku puzzles loom... - so probably don't want to use 0 for unset... space would be better.
  0   1   2   3
  4   5   6   7
  8   9   A   B
  C   D   E   F
  */

Cell.prototype.hasAnswer = function () {
  return this._answer != null;
};

Cell.prototype.getAnswer = function () {
  return this._answer;
};

Cell.prototype.setAnswer = function (n) {
  if (this._candidates.getIndex(n) < 0)
    return null;
  this._answer = n;
  return this._answer;
};

Cell.prototype.setGiven = function (n) {
  if (this._candidates.getIndex(n) < 0)
    return null;
  this._given = true;
  cell._answer = n;
  return this.set(n);
};

Cell.prototype.isGiven = function () {
  return this._given;
};

Cell.prototype.isAssigned = function () {
  return this._value != 0;
};

Cell.prototype.clear = function () {
  this._value = null; // means unassigned
  this._candidates = new Candidates(0x3E); // all possible
  this._answer = 0;
  this._given = 0;
};



Cell.prototype.setAllowed = function (value) {
  this._candidates = new Candidates(value);
};

Cell.prototype.getAllowedClone = function (value) {
  return this._candidates.clone();
};
