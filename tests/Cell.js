var GROUP = "Cell";
var BoardSize = 9;
var cell = new Cell(10);
writeTest("1.1","_candidates",0x1ff,cell._candidates._mask,(cell._candidates._mask === 0x1ff));
writeTest("1.2","_value",null,cell._value,(cell._value === null));
writeTest("1.3","_answer",null,cell._answer,(cell._answer === null));
writeTest("1.4","_given",false,cell._given,(cell._given === false));
writeTest("1.5","_groups",[],cell._groups,(cell._groups.length === 0));
writeTest("1.6","_id",10,cell._id,(cell._id === 10));
writeTest("1.7","_row",1,cell._row,(cell._row === 1));
writeTest("1.8","_col",1,cell._col,(cell._col === 1));
writeTest("1.9","_box",0,cell._box,(cell._box === 0));
writeTest("1.10","_boxpos",4,cell._boxpos,(cell._boxpos === 4));

var cell = new Cell(58);
writeTest("2.1","_candidates",0x1ff,cell._candidates._mask,(cell._candidates._mask === 0x1ff));
writeTest("2.2","_value",null,cell._value,(cell._value === null));
writeTest("2.3","_answer",null,cell._answer,(cell._answer === null));
writeTest("2.4","_given",false,cell._given,(cell._given === false));
writeTest("2.5","_groups",[],cell._groups,(cell._groups.length === 0));
writeTest("2.6","_id",58,cell._id,(cell._id === 58));
writeTest("2.7","_row",6,cell._row,(cell._row === 6));
writeTest("2.8","_col",4,cell._col,(cell._col === 4));
writeTest("2.9","_box",7,cell._box,(cell._box === 7));
writeTest("2.10","_boxpos",1,cell._boxpos,(cell._boxpos === 1));

var cell = new Cell(75);
var clone = cell.clone();
cell._candidates._mask = "over";
cell._value = "over";
cell._answer = "over";
cell._given = "over";
cell._groups = ["over"];
cell._id = 45;
cell._row = 15;
cell._col = 15;
cell._box = 15;
cell._boxpos = 15;

writeTest("3.1","clone",0x1ff,clone._candidates._mask,(clone._candidates._mask === 0x1ff));
writeTest("3.2","_value",null,clone._value,(clone._value === null));
writeTest("3.3","_answer",null,clone._answer,(clone._answer === null));
writeTest("3.4","_given",false,clone._given,(clone._given === false));
writeTest("3.5","_groups",[],clone._groups,(clone._groups.length === 0));
writeTest("3.6","_id",75,clone._id,(clone._id === 75));
writeTest("3.7","_row",8,clone._row,(clone._row === 8));
writeTest("3.8","_col",3,clone._col,(clone._col === 3));
writeTest("3.9","_box",7,clone._box,(clone._box === 7));
writeTest("3.10","_boxpos",6,clone._boxpos,(clone._boxpos === 6));

row4 = ["row1",2,3,4];
col5 = ["col5",5,6,7];
box6 = ["box6",2,3,5];
var cell = new Cell(4);
cell.addGroup(row4);
cell.addGroup(col5);
cell.addGroup(box6);
writeTest("4.1","_groups.length",3,cell._groups.length,(cell._groups.length === 3));
writeTest("4.2","_groups[0][0]","row1",cell._groups[0][0],(cell._groups[0][0] === "row1"));
writeTest("4.3","_groups[1][0]","col5",cell._groups[1][0],(cell._groups[1][0] === "col5"));
writeTest("4.4","_groups[2][0]","box6",cell._groups[2][0],(cell._groups[2][0] === "box6"));

var cell = new Cell(4);
var setResult = cell.set("5");
writeTest("5.1","set","5",cell._value,(cell._value === "5"));
writeTest("5.2","set Result",null,setResult,(setResult === null));

var cell = new Cell(5);
var message = "";
var expected = "";
var error = {};
try {
  var setResult = cell.set("A");
} catch(error) {
  var message = error.message;
}
writeTest("6.1","set invalid",null,cell._value,(cell._value === null));
writeTest("6.2","set Result",null,setResult,(setResult === null));
writeTest("6.3","exception",expected,message,(message === expected));

var cell = new Cell(7);
writeTest("7.1","isCandidate",true,cell.isCandidate("5"),(cell.isCandidate("5") === true));
writeTest("7.2","removeCandidate",495,cell.removeCandidate("5"),(cell.removeCandidate("5") === 495));
writeTest("7.3","removeCandidate",487,cell.removeCandidate("4"),(cell.removeCandidate("4") === 487));
writeTest("7.4","isCandidate",false,cell.isCandidate("4"),(cell.isCandidate("4") === false));
writeTest("7.5","isCandidate",false,cell.isCandidate("5"),(cell.isCandidate("5") === false));
writeTest("7.6","isCandidate",false,cell.isCandidate("A"),(cell.isCandidate("A") === false));

var cell = new Cell(8);
writeTest("8.1","hasAnswer",false,cell.hasAnswer(),(cell.hasAnswer() === false));
cell._answer = "6";
writeTest("8.2","hasAnswer",true,cell.hasAnswer(),(cell.hasAnswer() === true));

var cell = new Cell(9);
writeTest("9.1","getAnswer",null,cell.getAnswer(),(cell.getAnswer() === null));
cell._answer = "6";
writeTest("9.2","getAnswer","6",cell.getAnswer(),(cell.getAnswer() === "6"));

var cell = new Cell(10);
writeTest("10.1","get",null,cell.get(),(cell.get() === null));
cell.set("6");
writeTest("10.2","get","6",cell.get(),(cell.get() === "6"));

var cell = new Cell(11);
var message = "";
var expected = "";
var error = {};
var exceptionRaised = false
try {
  var response = cell.setAnswer("A");
} catch(error) {
  exceptionRaised = true;
  var message = error.message;
}
writeTest("11.1","setAnswer invalid",null,cell._answer,(cell._answer === null));
writeTest("11.2","setAnswer response",null,response,(response === null));
writeTest("11.3","exception",expected,message,(message === expected));
writeTest("11.4","exception",false,exceptionRaised,(!exceptionRaised));

var cell = new Cell(12);

var message = "";
var expected = "";
var error = {};
var exceptionRaised = false
try {
  var response = cell.setAnswer("4");
} catch(error) {
  exceptionRaised = true;
  var message = error.message;
}
writeTest("12.1","setAnswer","4",cell._answer,(cell._answer === "4")); //._answer
writeTest("12.2","setAnswer response","4",response,(response === "4"));
writeTest("12.3","exception",expected,message,(message === expected));
writeTest("12.4","exception",false,exceptionRaised,(!exceptionRaised));

var cell = new Cell(13);
var response = cell.setGiven("4");
writeTest("13.1","setGiven 4",true,cell._given,(cell._given));
writeTest("13.2","setGiven answer","4",cell._answer,(cell._answer === "4"));
writeTest("13.3","setGiven value","4",cell.get(),(cell.get() === "4"));
writeTest("13.4","setGiven response",true,response,(response));

var cell = new Cell(14);
var response = cell.setGiven("A");
writeTest("14.1","setGiven invalid",false,cell._given,(!cell._given));
writeTest("14.2","setGiven answer",null,cell._answer,(cell._answer === null));
writeTest("14.3","setGiven response",null,response,(response===null));

var cell = new Cell(15);
var response = cell.isGiven();
writeTest("15.1","isGiven -ve",false,response,(!response));
var response = cell.setGiven("4");
var response = cell.isGiven();
writeTest("15.2","isGiven +ve",true,response,(response));

var cell = new Cell(16);
var response = cell.isAssigned();
writeTest("16.1","isAssigned -ve",false,response,(!response));
cell.set("4");
var response = cell.isAssigned();
writeTest("16.2","isAssigned +ve",true,response,(response));

BoardSize = 9;
var cell = new Cell(16);
cell.setGiven("9");
writeTest("17.1","set... get","9",cell.get(),("9" === cell.get()));
cell.clear();
writeTest("17.2","clear value",null,cell.get(),(null === cell.get()));
writeTest("17.3","clear _candidates",511,cell._candidates._mask,(511 === cell._candidates._mask));
writeTest("17.4","clear getAnswer",null,cell.getAnswer(),(null === cell.getAnswer()));
writeTest("17.5","clear isGiven",false,cell.isGiven(),(false === cell.isGiven()));
