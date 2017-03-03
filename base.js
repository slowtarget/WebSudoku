// Please leave this notice intact.
// Code developed by Ron de Jong 2011.
// You are free to use this code for whatever purpose.

// Converts global co-ords used in mouse events to relative to element
function relMouseCoords(event) {
  var totalOffsetX = 0;
  var totalOffsetY = 0;
  var canvasX = 0;
  var canvasY = 0;
  var currentElement = this;

  do {
    totalOffsetX += currentElement.offsetLeft;
    totalOffsetY += currentElement.offsetTop;
  }
  while (currentElement = currentElement.offsetParent)

  canvasX = event.pageX - totalOffsetX;
  canvasY = event.pageY - totalOffsetY;

  return { x: canvasX, y: canvasY }
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

// Javascript doesn't have 'contains' so added here for later readability
// Array.prototype.contains = function (element) {
//   for (var i = 0; i < this.length; i++) {
//     if (this[i] == element) {
//       return true;
//     }
//   }
//   return false;
// }
var SquareSize = 3;
var BoardSize = SquareSize * SquareSize;
var SibType = { "Row": 1, "Col": 2, "Square": 3 };
