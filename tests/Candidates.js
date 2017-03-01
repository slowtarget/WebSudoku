var GROUP = "Candidates";
var mask = new Candidates(0);
writeTest(1,"Constructor 0",0,mask._mask,(mask._mask === 0));

var mask = new Candidates(15);
writeTest(2,"Constructor 15",15,mask._mask,(mask._mask === 15));

var mask = new Candidates(15);
var act = mask.remove(4);
writeTest(3,"remove x 1",11,mask._mask,(mask._mask === 11));

var mask = new Candidates(15);
var act = mask.remove(4);
var act = mask.remove(4);
writeTest(4,"remove x 2",11,mask._mask,(mask._mask === 11));

var mask = new Candidates(15);
var single = mask.getSingle();
writeTest(5,"getSingle",null,single,(single === null));

var mask = new Candidates(1 << 3);
var single = mask.getSingle();
writeTest(6,"getSingle",4,single,(single === "4"));

var mask = new Candidates(8);
var single = mask.getSingle();
writeTest(7,"getSingle",4,single,(single === "4"));

var mask = new Candidates(0);
mask.setSingle("5");
var single = mask.getSingle();
writeTest(8,"setSingle",5,single,(single === "5"));

var mask = new Candidates(15);
mask.setSingle("7");
var single = mask.getSingle();
writeTest(9,"setSingle",7,single,(single === "7"));

var mask = new Candidates(12);
var count = mask.count();
writeTest(10,"count",2,count,(count === 2));

var mask = new Candidates(0);
var count = mask.count();
writeTest(11,"count",0,count,(count === 0));

var mask = new Candidates(0x1ff);
var count = mask.count();
writeTest(12,"count",9,count,(count === 9));

var mask = new Candidates(0x1ff);
var allowed = mask.isCandidate("5");
writeTest(13,"isCandidate",true,allowed,(allowed));

var mask = new Candidates(20); //  10100
mask.removeValue("5");
writeTest(14,"removeValue",4,mask._mask,(mask._mask === 4));

var mask = new Candidates(20); //  10100
mask.removeValue("5");
mask.removeValue("5");
mask.removeValue("4");
writeTest(15,"removeValue x 3",4,mask._mask,(mask._mask === 4));

var mask = new Candidates(0x1ff);
mask.removeValue("5");
var allowed = mask.isCandidate("5");
writeTest(16,"isCandidate",false,allowed,!(allowed));

BoardSize = 25;
var mask = new Candidates(0);
mask.setFullMask();
mask.removeValue("A");
mask.removeValue("Y");
var allowed = mask.isCandidate("A");
writeTest(17,"setFullMask A",false,allowed,!(allowed));
var allowed = mask.isCandidate("Y");
writeTest(18,"setFullMask Y",false,allowed,!(allowed));
var count = mask.count();
writeTest(19,"setFullMask #",23,count,(count === 23));

BoardSize = 4;

var mask = new Candidates(0);
mask.setFullMask();
mask.removeValue("1");
mask.removeValue("4");
candidatesArray = mask.CandidatesArray();
writeTest(20,"CandidatesArray",["2","3"],candidatesArray,(candidatesArray.length === 2 && candidatesArray[0] === "2" && candidatesArray[1] === "3" && mask.count() === 2));
mask.removeValue("2");
candidatesArray = mask.CandidatesArray();
writeTest(21,"CandidatesArray",["3"],candidatesArray,(candidatesArray.length === 1 && candidatesArray[0] === "3" && mask.count() === 1));
mask.removeValue("3");
candidatesArray = mask.CandidatesArray();
writeTest(22,"CandidatesArray",[],candidatesArray,(candidatesArray.length === 0 && mask.count() === 0));

BoardSize = 4;
var mask = new Candidates(0);
mask._translate = "FGHJ"
mask.setFullMask();
mask.removeValue("F");
clone = mask.clone();
exp = mask.CandidatesArray();
act = clone.CandidatesArray();
writeTest(23,"clone",exp,act,(act.length === 3 && clone.count() === 3 && act[0] === "G" && act[1] === "H" && act[2] === "J" ));
