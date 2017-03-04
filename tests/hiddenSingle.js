var GROUP = "hiddenSingle";
var BoardSize = 4;
var cells = [];
var group = new Group();
var cell = new Cell(0);  cell.removeCandidate("4"); cell.removeCandidate("2"); group.add(cell); cell.addGroup(group); cells.push(cell); // only one in the group with 1
var cell = new Cell(1);  cell.removeCandidate("1"); cell.removeCandidate("3"); group.add(cell); cell.addGroup(group); cells.push(cell);// only one in the group with 2
var cell = new Cell(2);  cell.removeCandidate("1"); cell.removeCandidate("2"); group.add(cell); cell.addGroup(group); cells.push(cell);
var cell = new Cell(3);  cell.removeCandidate("1"); cell.removeCandidate("2"); group.add(cell); cell.addGroup(group); cells.push(cell);

var exp =[];
exp.push(true);
exp.push(true);
exp.push(false);
exp.push(false);

for (var i=0;i<cells.length;i++){
  var act = cells[i].hiddenSingles();
  writeTest("1.1."+i,"found?",exp[i],act,(act === exp[i]));
}
