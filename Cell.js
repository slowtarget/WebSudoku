function Cell(value) {
  this._value = value; // 0 means unassigned
  this._allowed = new Candidates(0x3e); // all possible
  this._answer = 0; // no answer
  this._given = false;
}

Cell.prototype.clone = function (value) {
  var clone = new Cell();
  clone._value = this._value;
  clone._allowed = this._allowed.clone();
  clone._answer = this._answer;
  clone._given = this._given;
  return clone;
};

Cell.prototype.single = function (value) {
  this._value = value; // value user (or auto solve functions) has assigned as a possible answer
  this._allowed = new Candidates(0x3e); // the allowed values as a bit mask
  this._answer = 0; // calculated as the only possible correct value
};

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
  if (n != 0 && !this._allowed.isAllowed(n))
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
  this._allowed = new Candidates(0x3E); // all possible
  this._answer = 0;
  this._given = 0;
};

Cell.prototype.isAllowed = function (value) {
  return this._allowed.isAllowed(value);
};

Cell.prototype.setAllowed = function (value) {
  this._allowed = new Candidates(value);
};

Cell.prototype.getAllowedClone = function (value) {
  return this._allowed.clone();
};
