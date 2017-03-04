function Group(name) {
    this._group = [];
    this._isSolved = false;
    this._name = name;
    this._set = new Candidates(0); // none initially

    var solvedSet = new Candidates(0);
    solvedSet.setFullMask();
    this._fullMask = solvedSet._mask;
}

Group.prototype.add = function(cell) {
  this._group.push(cell);
}

Group.prototype.set = function(value) {
  // add this value to the group mask _set
  // remove this value as a candidate from all cells in the group
  this._set.addValue(value);
  // remove this from all candidates for the cells in the group
  for (var i in this._group){
    var cell = this._group[i];
    if (!cell.isGiven()) {
      cell.remove(this._set._mask);
    }
  }
  if (this._set._mask === this._fullMask) this._isSolved = true;
}

Group.prototype.unset = function(value) {
  // remove this value to the group mask _set
  // add this value as a candidate to all cells in the group#
  var mask = this._set.getMask(value);
  this._set.remove(mask);
  // add this to all candidates for the cells in the group
  for (var i in this._group){
    var cell = this._group[i];
    if (!cell.isGiven()) cell.add(mask);
  }
  this._isSolved =  (this._set._mask === this._fullMask);
}
