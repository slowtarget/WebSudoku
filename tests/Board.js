var GROUP = "Board";
var SquareSize = 3;
var BoardSize = SquareSize * SquareSize;
var board = new Board();

writeTest("1.1","empty board",0,board._grid.length,(0 === board._grid.length));
writeTest("1.2","_isSolved",false,board._isSolved,(false === board._isSolved));
writeTest("1.3","_isValid",true,board._isValid,(true === board._isValid));
writeTest("1.4","_groups.length",0,board._groups.length,(0 === board._groups.length));

var board = new Board();
board.createGrid();
writeTest("2.1","grid created",81,board._grid.length,(81 === board._grid.length));
writeTest("2.2","_isSolved",false,board._isSolved,(false === board._isSolved));
writeTest("2.3","_isValid",true,board._isValid,(true === board._isValid));
writeTest("2.4","_groups.length",0,board._groups.length,(0 === board._groups.length));

var board = new Board();
board.createGrid();
board.buildGroups();
writeTest("3.1","groups built",81,board._grid.length,(81 === board._grid.length));
writeTest("3.2","_isSolved",false,board._isSolved,(false === board._isSolved));
writeTest("3.3","_isValid",true,board._isValid,(true === board._isValid));
writeTest("3.4","_groups.length",27,board._groups.length,(27 === board._groups.length));
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


var grid = [[  0,  1,  2,  3,  4,  5,  6,  7,  8],
            [  9, 10, 11, 12, 13, 14, 15, 16, 17],
            [ 18, 19, 20, 21, 22, 23, 24, 25, 26],
            [ 27, 28, 29, 30, 31, 32, 33, 34, 35],
            [ 36, 37, 38, 39, 40, 41, 42, 43, 44],
            [ 45, 46, 47, 48, 49, 50, 51, 52, 53],
            [ 54, 55, 56, 57, 58, 59, 60, 61, 62],
            [ 63, 64, 65, 66, 67, 68, 69, 70, 71],
            [ 72, 73, 74, 75, 76, 77, 78, 79, 80]]
;

var up   =  [[ 72, 73, 74, 75, 76, 77, 78, 79, 80],
             [  0,  1,  2,  3,  4,  5,  6,  7,  8],
             [  9, 10, 11, 12, 13, 14, 15, 16, 17],
             [ 18, 19, 20, 21, 22, 23, 24, 25, 26],
             [ 27, 28, 29, 30, 31, 32, 33, 34, 35],
             [ 36, 37, 38, 39, 40, 41, 42, 43, 44],
             [ 45, 46, 47, 48, 49, 50, 51, 52, 53],
             [ 54, 55, 56, 57, 58, 59, 60, 61, 62],
             [ 63, 64, 65, 66, 67, 68, 69, 70, 71]]
;
var down =  [[  9, 10, 11, 12, 13, 14, 15, 16, 17],
             [ 18, 19, 20, 21, 22, 23, 24, 25, 26],
             [ 27, 28, 29, 30, 31, 32, 33, 34, 35],
             [ 36, 37, 38, 39, 40, 41, 42, 43, 44],
             [ 45, 46, 47, 48, 49, 50, 51, 52, 53],
             [ 54, 55, 56, 57, 58, 59, 60, 61, 62],
             [ 63, 64, 65, 66, 67, 68, 69, 70, 71],
             [ 72, 73, 74, 75, 76, 77, 78, 79, 80],
             [  0,  1,  2,  3,  4,  5,  6,  7,  8]]
;
var right = [[  1,  2,  3,  4,  5,  6,  7,  8,  0],
             [ 10, 11, 12, 13, 14, 15, 16, 17,  9],
             [ 19, 20, 21, 22, 23, 24, 25, 26, 18],
             [ 28, 29, 30, 31, 32, 33, 34, 35, 27],
             [ 37, 38, 39, 40, 41, 42, 43, 44, 36],
             [ 46, 47, 48, 49, 50, 51, 52, 53, 45],
             [ 55, 56, 57, 58, 59, 60, 61, 62, 54],
             [ 64, 65, 66, 67, 68, 69, 70, 71, 63],
             [ 73, 74, 75, 76, 77, 78, 79, 80, 72]]
;
var left = [[  8,  0,  1,  2,  3,  4,  5,  6,  7],
            [ 17,  9, 10, 11, 12, 13, 14, 15, 16],
            [ 26, 18, 19, 20, 21, 22, 23, 24, 25],
            [ 35, 27, 28, 29, 30, 31, 32, 33, 34],
            [ 44, 36, 37, 38, 39, 40, 41, 42, 43],
            [ 53, 45, 46, 47, 48, 49, 50, 51, 52],
            [ 62, 54, 55, 56, 57, 58, 59, 60, 61],
            [ 71, 63, 64, 65, 66, 67, 68, 69, 70],
            [ 80, 72, 73, 74, 75, 76, 77, 78, 79]]
;

var id = 0;
for (var row in grid){
  for (var col in grid[row]){

    var exp = grid[row][col];
    var cell = board._grid[id];
    var act = cell._id;

    writeTest("4.1."+id,"cell id is correct",exp,act,(exp === act));
    writeTest("4.2."+id,"up",   up[row][col],   cell._up._id,   (up[row][col]    === cell._up._id));
    writeTest("4.3."+id,"down", down[row][col], cell._down._id, (down[row][col]  === cell._down._id));
    writeTest("4.4."+id,"left", left[row][col], cell._left._id, (left[row][col]  === cell._left._id));
    writeTest("4.5."+id,"right",right[row][col],cell._right._id,(right[row][col] === cell._right._id));
    id ++;
  }
}

var board = new Board();
board.createGrid();
board.buildGroups();
var game = "7.8...3.....2.1...5..7..2...4.....263.948...7...1...9..9.6....4....7.5....5......";
board.setString(game); // medium
var id = 0;
for (var id=0;id<board._grid.length;id++){
    var exp = (game[id]===".") ? null : game[id];
    var cell = board._grid[id];
    var act = cell.get();
    writeTest("5.1."+id,"cell value is correct",exp,act,(exp === act));
    writeTest("5.2."+id,"assigned",exp!==null,cell.isAssigned(),((exp!==null) === (cell.isAssigned())));

}
