let temp;
let points = [];
let startEnd = [];
let open = [];
let closed = [];
let gridSize = 10;
let dV;
let current; // current node
let start;
let end;
let finished = false;
let settingUp = true;
let path = [];
let obsticles = [];
let rIndex = true;
let startRefPoint;
let obsticlePercentage = 5;
let childPercentage =10;
var startButton;
var gridSizeSilder;

function setupGrid() {
  let childs = [];
  for (let i = dV / 20; i < width; i += dV) {
    for (let j = dV / 20; j < width; j += dV) {
      points.push(new Point(i, j, dV * 0.9));
      points[points.length - 1].show(255);
      if (random(100) <= obsticlePercentage) {
        points[points.length - 1].obs = true;
        console.log("another obsticle");
        let childRandom = random(100);
        if (childRandom < childPercentage && !isEdge(points.length - 1)) {
          let pointval = 0;
          let direction = random(100);
          if (direction < 25) { // left
            pointval = gridSize * -1;

          } else if (direction < 50) { // right
            pointval = gridSize;

          } else if (direction < 75) { // up
            pointval = -1;

          } else { // down
            pointval = 1;
          }
          childs.push(points.length - 1 + pointval);
        }
      }
    }
  }
  for (let u = 0; u < points.length; u++) {
    if (childs.includes(u)) {
      points[u].obs = true;
      console.log("child pushed " + u);
    }
  }
  console.log(childs);
  console.log(childs.length);
}

function isEdge(x) {

  if ((x) % gridSize == 0 || (x + 1) % gridSize == 0 ||
    x > (gridSize * gridSize) - gridSize || x < gridSize) {

    //points[x].show(color(0,255,0));
    //console.log(x)
    return true;
  } else {
    return false;
  }

}

function displayGrid() {
  background(255, 0, 0);
  fill(255);
  for (let x = 0; x < points.length; x++) {
    if (points[x].obs) {
      points[x].show(100);
    } else {
      points[x].show(255);
    }
  }
  //displayStartEnd();
}



function displayBlankGrid() {
  fill(255);
  for (let x = 0; x < points.length; x++) {
    points[x].show(255);

  }
}

function displayOpen() {
  for (let x = 0; x < open.length; x++) {
    fill(0, 0, 255);
    open[x].show(color(0, 0, 255));
  }
  //  console.log(open.length);
}

function displayPath() {
  for (let x = 0; x < path.length; x++) {
    fill(255, 0, 255);
    path[x].show(color(255, 0, 255));
  }
  if(path.length!=0){
  //createP("Found Path with length of: " + path.length + " || Distance between start points: " + dist(start.x,start.y,end.x,end.y)/dV);
  //console.log(path.length);
}
}

function displayStartEnd() {
  fill(0);
  start.show(color(0,255,0));
  end.show(color(0,255,0));
}

function isIn(arr, cPoint, getElement) {
  if (arr.length < 1) {
    return false;
  }
  let found = false;
  for (let x = 0; x < arr.length; x++) {
    if (samePoint(arr[x], cPoint)) {
      found = true;
      if (getElement == true) {
        return x;
      } else {
        return found;
      }
    }
  }
  return found;
}

function calcG(cPoint) {
  return cPoint.parentg + dV;
}
function calcH(cPoint){
  return dist(cPoint.x,cPoint.y,end.x,end.y);
}
//
function getOpen(current) { // add function to test if empty is open
  for (let x = 0; x < points.length; x++) {
    let temp = points[x];
    let distance = dist(current.x, current.y, points[x].x, points[x].y);
    if (distance != 0 && distance < dV * 1.5 && !points[x].obs && !isIn(closed, points[x])) {

      if (isIn(open, points[x])  ) {// this could cause massive problems
        let openref =isIn(open, points[x],rIndex);
            if(current.g+dV< open[openref].g){
                open[openref].parent = current;
                open[openref].calcG(dV);
            }
      }else if(!isIn(open, points[x])){
        open.push(points[x]);
        open[open.length-1].parent = current;
        open[open.length-1].calcG(dV);
        open[open.length-1].h = calcH(open[open.length-1]);
        open[open.length-1].calcF();
      }

    }
  }
}

function returnLowestF() {
  if (open.length == 0) {
    return false;
  }
  let lowestIndex = 0;
  let lowest = open[0];

  for (let it = 0; it < open.length; it++) {
    if (open[it].f < lowest.f) {
      lowestIndex = it;
      lowest = open[it];
    }
  }
  if(samePoint(lowest,end)){
    // return "OVER";
    console.log("found path");

  }
  return lowestIndex;
}

function calcPath(cPoint){
  while(!samePoint(cPoint,start)){
    path.push(cPoint);
    cPoint = cPoint.parent;
  }
}
function calc() {
  if (samePoint(open[returnLowestF()],end)&&finished!=true){
      calcPath(open[returnLowestF()]);
      finished =true;
    // CALCULATE PATH
  }else if(returnLowestF != false) {
    let current;
    let lowest = returnLowestF();
    closed.push(open[lowest]);
    open.splice(lowest);
    current = closed[closed.length - 1];
    getOpen(current);
  }


  else if(returnLowestF() == false){
    console.log("no path");
  }
  //console.log(closed);
  //console.log(open);
}

function samePoint(p1, p2) {
  if (p1.x == p2.x && p1.y == p2.y) {
    return true;
  } else {
    return false;
  }
}

function getStartEnd() {
  start = random(points);
  while (start.obs) {
    start = random(points);
  }
  end = random(points);
  while (end.obs || samePoint(start, end)) {
    end = random(points);
  }
}
function resetMaze(){
  settingUp = true;
  open = [];
  closed = [];
  path =[];
  points =[];
  finished = false;
  loop();
}
function setup() {
  //createButton('test');
  startButton = createButton('label');
  startButton.mouseClicked(resetMaze);

  gridSizeSilder = createSlider(5,1000,100);
  noStroke();
  let ratio = 100;
  let size = min(windowHeight, windowWidth);
  size = size * .9;
  createCanvas(size, size);
dV = size / gridSize;

}
function aStar(){
  if(settingUp){
    gridSize = gridSizeSilder.value();
    dV = size / gridSize;
    setupGrid();
    //let startval = random(points.length);
    getStartEnd();
    current = start;
    open.push(current);
    settingUp = false;
  }
  displayGrid();

  //  getOpen(current);


  calc();
  displayOpen();

  //  displayPath();
    displayStartEnd();
    if(finished){
      displayGrid();
      displayPath();
      displayStartEnd();
      noLoop();
    }
}
function draw() {

aStar();
  //noLoop();
}
