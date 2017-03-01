function Group(name) {

    this._group = [];
    this._isSolved = false;
    this._name = name;
    this._set = new Candidates(0); // none initially

}

Group.prototype.add = function(cell) {
  this._group.push(cell);
}

Group.prototype.set = function(value) {
  var value_mask = 1 << value;
  this.__set |= (value_mask);
  // remove this from all candidates for the cells in the group
  for (var cell in this._group){
    cell.removeCandidate(value_mask);
  }
}
