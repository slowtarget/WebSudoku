function Candidates(mask) {
  this._mask = mask;
  if ( BoardSize == 9 ) {
    this._translate = "123456789";
  }
  if ( BoardSize == 16 ) {
    this._translate = "0123456789ABCDEF";
  }
  if ( BoardSize == 4 ) {
    this._translate = "1234";
  }
  if ( BoardSize == 25 ) {
    this._translate = "ABCDEFGHIJKLMNOPQRSTUVWXY";
  }
}

Candidates.prototype.getSingle = function () {
  // Count number of on bits from 1..9
  var single = 0;
  var count = 0;
  for (var i = 0; i < BoardSize; i++)
    if ((this._mask & (1 << i)) != 0) {
      count++;
      single = i;
    }
  return count == 1 ? this._translate[single] : null;
};

Candidates.prototype.setFullMask = function () {
  // set a full mask for the size of the board
  for (var i = 0; i < BoardSize; i++)
    this._mask |= (1 << i)
  return this._mask;
};

Candidates.prototype.getIndex = function (n) {
  return this._translate.indexOf(n)
};

Candidates.prototype.remove = function (mask) {
  this._mask &= ~mask;
  return this._mask;
};

Candidates.prototype.removeValue = function(n) {
  index = this.getIndex(n);
  if (index < 0) return false;
  return this.remove(1 << index);
};

Candidates.prototype.add = function (mask) {
  this._mask |= mask;
  return this._mask;
};

Candidates.prototype.addValue = function(n) {
  index = this.getIndex(n);
  if (index < 0) return false;
  return this.add(1 << index);
};

Candidates.prototype.getMask = function (n) {
  index = this.getIndex(n);
  if (index < 0) return 0;
  return (1 << index);
};

// Used when the answer is known at the Cell, level this sets the only allowed value to be that answer
Candidates.prototype.setSingle = function (n) {
  index = this.getIndex(n);
  if (index < 0) return false;
  this._mask = 1 << index;
  return this._mask;
};

Candidates.prototype.count = function () {
  // Count number of on bits from 1..9
  var count = 0;
  for (var i = 0; i < BoardSize; i++)
    if ((this._mask & (1 << i )) != 0)
      count++;
  return count;
};

Candidates.prototype.isCandidate = function (n) {
  index = this.getIndex(n);
  if (index < 0) return false;
  return (this._mask & (1 << index))!=0;
};

Candidates.prototype.CandidatesArray = function () {
  var ret = new Array();
  for (var i = 0; i < BoardSize; i++)
    if (((1 << i) & this._mask) != 0)
      ret.push(this._translate[i]);
  return ret;
};

Candidates.prototype.clone = function () {
  var clone = new Candidates(this._mask);
  clone._translate = this._translate;
  return clone;
};
