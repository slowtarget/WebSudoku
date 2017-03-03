var GROUP = "Group";
function setup() {
  BoardSize = 9;
  var  group = new Group("row 1");
  for (var i=0;i<BoardSize;i++) {
   cell = new Cell(i);
   cell.addGroup(group);
   group.add(cell);
  }
  return group;
}

// Group.prototype.set = function(value) {
//   var value_mask = 1 << value;
//   this._set |= (value_mask);
//   // remove this from all candidates for the cells in the group
//   for (var cell in this._group){
//     cell.removeCandidate(this._set);
//   }
// }
var group = new Group("row 1");
writeTest("1.1","empty group",0,group._group.length,(0 === group._group.length));
writeTest("1.2","_isSolved",false,group._isSolved,(false === group._isSolved));
writeTest("1.3","_name","row 1",group._name,("row 1" === group._name));
writeTest("1.4","_set._mask",0,group._set._mask,(0 === group._set._mask));

var group = setup();
writeTest("2.1","populated group",9,group._group.length,(9 === group._group.length));
writeTest("2.2","_isSolved",false,group._isSolved,(false === group._isSolved));
writeTest("2.3","_name","row 1",group._name,("row 1" === group._name));
writeTest("2.4","_set._mask",0,group._set._mask,(0 === group._set._mask));

var group = setup();
group._group[2].set("3");
writeTest("3.1","one cell set",9,group._group.length,(9 === group._group.length));
writeTest("3.2","_isSolved",false,group._isSolved,(false === group._isSolved));
writeTest("3.3","_name","row 1",group._name,("row 1" === group._name));
writeTest("3.4","_set._mask",4,group._set._mask,(4 === group._set._mask));
writeTest("3.5","_group[0].isCandidate('3')",false,group._group[0].isCandidate('3'),(false === group._group[0].isCandidate('3')));
writeTest("3.6","_group[1].isCandidate('3')",false,group._group[1].isCandidate('3'),(false === group._group[1].isCandidate('3')));
writeTest("3.7","_group[2].isCandidate('3')",false,group._group[2].isCandidate('3'),(false === group._group[2].isCandidate('3')));
writeTest("3.8","_group[3].isCandidate('3')",false,group._group[3].isCandidate('3'),(false === group._group[3].isCandidate('3')));
writeTest("3.9","_group[4].isCandidate('3')",false,group._group[4].isCandidate('3'),(false === group._group[4].isCandidate('3')));
writeTest("3.10","_group[5].isCandidate('3')",false,group._group[5].isCandidate('3'),(false === group._group[5].isCandidate('3')));
writeTest("3.11","_group[6].isCandidate('3')",false,group._group[6].isCandidate('3'),(false === group._group[6].isCandidate('3')));
writeTest("3.12","_group[7].isCandidate('3')",false,group._group[7].isCandidate('3'),(false === group._group[7].isCandidate('3')));
writeTest("3.13","_group[8].isCandidate('3')",false,group._group[8].isCandidate('3'),(false === group._group[8].isCandidate('3')));
var group = setup();
var i = 1;
for (var cell in group._group) {
 group._group[cell].set(i++);
}
writeTest("4.1","all cells set",9,group._group.length,(9 === group._group.length));
writeTest("4.2","_isSolved",true,group._isSolved,(true === group._isSolved));
writeTest("4.3","_name","row 1",group._name,("row 1" === group._name));
writeTest("4.4","_set._mask",511,group._set._mask,(511 === group._set._mask));

var group = setup();
var i = 1;
for (var cell in group._group) {
 group._group[cell].set(i++);
}
group._group[3].clear();
writeTest("5.1","all cells set, one cleared",9,group._group.length,(9 === group._group.length));
writeTest("5.2","_isSolved",false,group._isSolved,(false === group._isSolved));
writeTest("5.3","_name","row 1",group._name,("row 1" === group._name));
writeTest("5.4","_set._mask",511 - 8,group._set._mask,((511 - 8) === group._set._mask));
