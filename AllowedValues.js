function AllowedValues(n) {
  this._mask = n;
}

AllowedValues.prototype.getSingle = function () {
  // Count number of on bits from 1..9
  var single = 0;
  var count = 0;
  for (var i = 1; i <= BoardSize; i++)
    if ((this._mask & (1 << i)) != 0) {
      count++;
      single = i;
    }
  return count == 1 ? single : 0;
};

// Used when the answer is known at the Cell, level this sets the only allowed value to be that answer
AllowedValues.prototype.setSingle = function (n) {
  this._mask = 1 << n;
};

AllowedValues.prototype.count = function () {
  // Count number of on bits from 1..9
  var count = 0;
  for (var i = 1; i <= BoardSize; i++)
    if ((this._mask & (1 << i)) != 0)
      count++;
  return count;
};

AllowedValues.prototype.isAllowed = function (n) {
  return n >= 1 && n <= BoardSize && ((this._mask & (1 << n)) != 0);
};

AllowedValues.prototype.removeValues = function (bm) {
  this._mask &= ~bm._mask;
};

AllowedValues.prototype.allowedValuesArray = function () {
  var ret = new Array();
  for (var i = 1; i <= BoardSize; i++)
    if (((1 << i) & this._mask) != 0)
      ret.push(i);
  return ret;
};

AllowedValues.prototype.clone = function () {
  return new AllowedValues(this._mask);
};
