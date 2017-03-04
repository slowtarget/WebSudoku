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
  this._x = (this._col + 0.5) * CellSize; // center of cell for textAlign center, textBaseline middle
  this._y = (this._row + 0.5) * CellSize;

  this._up     = null;
  this._down   = null;
  this._left   = null;
  this._right  = null;

  var rowColtoId = function(row,col) {
    return (row % BoardSize) * BoardSize + (col % BoardSize);
  };

  this._idUp     = rowColtoId(this._row  + BoardSize - 1 ,this._col);
  this._idDown   = rowColtoId(this._row + 1,              this._col);
  this._idLeft   = rowColtoId(this._row,                  this._col + BoardSize - 1);
  this._idRight  = rowColtoId(this._row,                  this._col + 1);
};

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

  if (this._value !== null) {
    for (var group in this._groups) {
       this._groups[group].unset(value);
    }
  }

  this._candidates.setSingle(value);
  this._value = value; // value user (or auto solve functions) has assigned as a possible answer

  this.updateGroups(value);

  if (this._answer === null)  // calculated as the only possible correct value
    return null; // should probably solve the puzzle until this has an answer - so that we know whether this is correct or not...

  if (this._answer !== value) return false;
  return true;
};
Cell.prototype.updateGroups = function (value) {
  for (var group in this._groups) {
     this._groups[group].set(value);
  }
}

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

Cell.prototype.remove = function (mask) {
  this._candidates.remove(mask);
  this.setAnswer(this._answer  || this._candidates.getSingle());
  return this._candidates._mask;
};

Cell.prototype.isSingle = function () {
  return this._candidates.isSingle();
};

Cell.prototype.getSingle = function () {
  var single = this._candidates.getSingle();
  if (single) console.log("setting single answer "+this._id);
  this.setAnswer(this.getAnswer() | single);
  return single;
};

Cell.prototype.add = function (mask) {
  return (this._candidates.add(mask));
};
/* hex 4 * 4 sudoku puzzles loom... - so probably don't want to use 0 for unset... space would be better.
  0   1   2   3
  4   5   6   7
  8   9   A   B
  C   D   E   F
  */

Cell.prototype.hasAnswer = function () {
  return this._answer !== null;
};

Cell.prototype.getAnswer = function () {
  return this._answer;
};

Cell.prototype.setAnswer = function (n) {
  if (this.hasAnswer()) return;
  if (this._candidates.getIndex(n) < 0)
    return null;
  this._answer = n;
  console.log(this._id+" setting answer : "+n);
  return this._answer;
};

Cell.prototype.setGiven = function (n) {
  if (this._candidates.getIndex(n) < 0)
    return null;
  this._given = true;
  this.setAnswer(n);
  return this.set(n);
};

Cell.prototype.isGiven = function () {
  return this._given;
};

Cell.prototype.isAssigned = function () {
  return this._value != null;
};

Cell.prototype.clear = function () {
  if (this._value) {
    for (var id in this._groups) {
     this._groups[id].unset(this._value);
    }
    this._value = null; // means unassigned
  }
  this._candidates.setFullMask(); // all possible

  this._answer = null;
  this._given = false;
};

Cell.prototype.hiddenSingles = function () {
  if (this.isAssigned()) return false;
  console.log ("hiddenSingles "+this._id)
  for (var groupId in this._groups ) {// for each group this cell belongs to
    var group =   this._groups[groupId];
    var mask = this.getCandidateMask();
    for (var cellId = 0; (cellId < group._group.length) && (mask !== 0); cellId++) { // for each cell in the group
      var other =  group._group[cellId];
      if (other !== this) {            // if its not this cell
        console.log ("comparing "+this._id+" with "+other._id)
        mask = mask & ~ other.getCandidateMask(); // remove any bits that are not unique
      }
    }
    if (mask) { // found a hidden single
      console.log("found! at"+this._id);
      var candidate = new Candidates(mask);
      this.setAnswer(candidate.getSingle());
      return true;
    }
  }
  return false;
}

Cell.prototype.paint = function(selectedCell) {
  if (!context) return;
  var selectedValue = selectedCell === null ? null : selectedCell.get();
  context.fillStyle = (this===selectedCell)? bgSelectedColor : bgColor;
  context.fillRect(this._x - fillOffset , this._y - fillOffset, fillSize, fillSize);

  if (this.isAssigned()) {
    context.font = "32pt Calibri";
      // Draw value
    context.fillStyle =  (this._value == selectedValue) ? selectedColor : (this._isGiven ? givenColor : normalForeColor); // show "givens" in a darker color
    context.fillText(this._value, this._x, this._y);
  } else {
    value = null;
    if (showAllowed) {
      context.font = "12pt Calibri"; // small text

      var mask = this.getCandidateMask();
      var i = 0 ;
      for (var id = 0; id < BoardSize; id ++) {
        if (mask & ( 1 << id )) {
          var val = this._candidates.translate(id);
          context.fillStyle = (val == selectedValue) ? selectedColor : (showSingles && val == this._answer) ? singleColor : normalColor;
          context.fillText(val, this._x + subX[id],  this._y + subY[id]);
        }
      }
    }
  }
};
Cell.prototype.getCandidateMask = function() {
  return this._candidates.get();
}
Cell.prototype.toString = function () {
  return this._value === null ? "." : this._value;
};
// Cell.prototype.setAllowed = function (mask) {
//   this._candidates = new Candidates(mask);
// };
//
// Cell.prototype.getAllowedClone = function (value) {
//   return this._candidates.clone();
// };
