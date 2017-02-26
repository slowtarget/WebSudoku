function Location(row, col) {
  this.row = row;
  this.col = col;
}

Location.empty = new Location(-1, -1);

Location.prototype.isEmpty = function () {
  return this.row < 0;
};

Location.prototype.modulo = function (n) {
  if (n < 0)
    return n + BoardSize;
  return n % BoardSize;
};

Location.prototype.left = function () {
  return new Location(this.row, this.modulo(this.col - 1));
};

Location.prototype.right = function () {
  return new Location(this.row, this.modulo(this.col + 1));
};

Location.prototype.up = function () {
  return new Location(this.modulo(this.row - 1), this.col);
};

Location.prototype.down = function () {
  return new Location(this.modulo(this.row + 1), this.col);
};

Location.prototype.toString = function () {
  return "Row=" + String(this.row) + "Col=" + String(this.col);
};

Location.prototype.getSquare = function () {
  return 3 * Math.floor(this.row / 3) + Math.floor(this.col / 3);
};

Location.prototype.equals = function (a) {
  return a.row == this.row && a.col == this.col;
};

Location.prototype.notEquals = function (a) {
  return a.row != this.row || a.col != this.col;
};

// Enumerator for locations of all cells
Location.grid = function () {
  var locs = new Array();
  for (var i = 0; i < BoardSize; i++)
    for (var j = 0; j < BoardSize; j++)
      locs.push(new Location(i, j));
  return locs;
};

// Enumerator for locations of cell siblings in the same row
Location.prototype.rowSibs = function () {
  var locs = new Array();
  for (var i = 0; i < BoardSize; i++)
    if (i != this.col)
      locs.push(new Location(this.row, i));
  return locs;
};

// Enumerator for locations of cell siblings in the same column
Location.prototype.colSibs = function () {
  var locs = new Array();
  for (var i = 0; i < BoardSize; i++)
    if (i != this.row)
      locs.push(new Location(i, this.col));
  return locs;
};

// Enumerator for locations of cell siblings in the same square
Location.prototype.squareSibs = function () {
  var locs = new Array();
  var baseRow = 3 * Math.floor(this.row / 3); // this is how to convert float to an "int" - Javascript doesn't have ints!
  var baseCol = 3 * Math.floor(this.col / 3);
  for (var i = 0; i < SquareSize; i++) {
    var r = baseRow + i;
    for (var j = 0; j < SquareSize; j++) {
      var c = baseCol + j;
      if (r != this.row || c != this.col)
        locs.push(new Location(r, c));
    }
  }
  return locs;
};

Location.prototype.getSibs = function (type) {
  switch (type) {
    case SibType.Row:
      return this.rowSibs();
    case SibType.Col:
      return this.colSibs();
    case SibType.Square:
      return this.squareSibs();
  }
};
