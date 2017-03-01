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

Candidates.prototype.remove = function (mask) {
  this._mask &= ~mask;
  return this._mask;
};

Candidates.prototype.removeValue = function(n) {
  index = this._translate.indexOf(n)
  if (index < 0) return false;
  this._mask &= ~(1 << index);
};

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


// Used when the answer is known at the Cell, level this sets the only allowed value to be that answer
Candidates.prototype.setSingle = function (n) {
  index = this._translate.indexOf(n)
  if (index < 0) return false;
  this._mask = 1 << index;
};

Candidates.prototype.count = function () {
  // Count number of on bits from 1..9
  var count = 0;
  for (var i = 0; i < BoardSize; i++)
    if ((this._mask & (1 << i )) != 0)
      count++;
  return count;
};

Candidates.prototype.isAllowed = function (n) {
  return n >= 1 && n <= BoardSize && ((this._mask & (1 << n)) != 0);
};


Candidates.prototype.CandidatesArray = function () {
  var ret = new Array();
  for (var i = 1; i <= BoardSize; i++)
    if (((1 << i) & this._mask) != 0)
      ret.push(i);
  return ret;
};

Candidates.prototype.clone = function () {
  return new Candidates(this._mask);
};
