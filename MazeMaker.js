let temp;
let points = [];
let startEnd = [];
let open = [];
let closed = [];
let gridSize = 50;
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
let obsticlePercentage = 20;
let childPercentage = 20;
var startButton;
var gridSizeSilder;
var gridSizeInfo;
var gridSizeInfoCurrent;
var obsticlePercentageSlider;
var obsticlePercentageInfo;
var obsticlePercentageInfoCurrent;
var childPercentageSlider;
var childPercentageInfo;
var childPercentageInfoCurrent;
var triesSlider;
var triesSliderInfo;
var info;
var retryButton;
let screenSize;
let keepStartEnd = false;
let pathCount = 0;
let tries = 10;
let maxBetween = 0;
let minTwo = 0;
let pathStart;


function setupGrid() {
  let childs = [];
  for (let i = dV / 2; i < width; i += dV) {
    for (let j = dV / 2; j < width; j += dV) {
      points.push(new Point(i, j, dV * 0.9));
      points[points.length - 1].show(255);
      if (random(100) <= obsticlePercentage) {
        points[points.length - 1].obs = true;
        //console.log("another obsticle");
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
      //console.log("child pushed " + u);
    }
  }
  //console.log(childs);
  //console.log(childs.length);
  getMaxMin();
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
  if (path.length != 0) {
    //optimizePath();
    console.log("PATH LENGTH " + path.length);
    for (let x = 0; x < path.length; x++) {
      let col = (255 / path.length) * x;
      if (path[x].showInPath) {
        path[x].show(color(col, 0, col));
      } else {
        path[x].show(color(255, 255, 0));
      }
    }

    //createP("Found Path with length of: " + path.length + " || Distance between start points: " + dist(start.x,start.y,end.x,end.y)/dV);
    //console.log(path.length);
  }
}

function displayStartEnd() {
  fill(0);
  start.show(color(0, 255, 0));
  end.show(color(0, 255, 0));
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



function calcH(cPoint) {
  return dist(cPoint.x, cPoint.y, end.x, end.y); //euclid
  //  return (cPoint.x - end.x) + (cPoint.y - end.y); // taxi cab

}
//
function isAdj(p1, p2) {
  let in1 = isIn(points, p1, true);
  let in2 = isIn(points, p2, true);
  let adj = false;
  switch (in2) {
    case in1 + 1:
      adj = true;
      break;
    case in1 - 1:
      adj = true;
      break;
    case in1 + gridSize:
      adj = true;
      break;
    case in1 - gridSize:
      adj = true;
      break;
    case in1 + (gridSize + 1):
      adj = true;
      break
    case in1 + (gridSize - 1):
      adj = true;
      break;
    case in1 - (gridSize - 1):
      adj = true;
      break;
    case in1 - (gridSize + 1):
      adj = true;
      break;
  }
  if (adj) {
    //  console.log("it is ");
  }
  return adj;
}

function getOpen(current) { // add function to test if empty is open
  if (open.length > 0) {
    for (let x = 0; x < points.length; x++) {
      let temp = points[x];
      let distance = dist(current.x, current.y, points[x].x, points[x].y);
      if (distance != 0 && distance<= (dV*maxBetween) && !points[x].obs && !isIn(closed, points[x])) { // isAdj(current,points[x])

        if (isIn(open, points[x])) { // this could cause massive problems
          let openref = isIn(open, points[x], true);
          if (current.g + dist(current.x, current.y, open[openref].x, open[openref].y) < open[openref].g) {
            open[openref].parent = current;
            open[openref].h = calcH(open[openref]);
            open[openref].calcG(dist(current.x, current.y, open[openref].x, open[openref].y));
            open[openref].calcF();
          }
        } else if (!isIn(open, points[x])) {
          open.push(points[x]);
          open[open.length - 1].parent = current;
          open[open.length - 1].calcG(dist(current.x, current.y, open[open.length - 1].x, open[open.length - 1].y));
          open[open.length - 1].h = calcH(open[open.length - 1]);
          open[open.length - 1].calcF();
        }

      }
    }
  }
}

function compare(a, b) {
  return a.f - b.f;
}

function returnLowestF() {
  if (open.length == 0 && !samePoint(current, end) && !samePoint(current, start)) {
    return false;
  }
  shuffle(open, true);
  let floorIt;
  if (pathCount > pathCount / 2) {
    floorIt = true;
  } else {
    floorIt = false;
  }
  //console.log(open);
  //console.log("sorting");
  //open = open.sort(compare);
  //console.log(open);
  let lowestIndex = 0;
  let lowest = open[0];

  for (let it = 0; it < open.length; it++) {
    if (open[it].f < lowest.f) {
      lowestIndex = it;
      lowest = open[it];
    } else if (floorIt) {
      if (floor(open[it].f) == floor(lowest.f)) {
        if (open[it].h < lowest.h) {
          lowestIndex = it;
          lowest = open[it];
        }
      }
    }
  }
  if (samePoint(lowest, end)) {
    // return "OVER";
    console.log("found path");
    //pathStart =lowestIndex;
    lowestIndex=true;


  }
  return lowestIndex;
}

function calcPath() {
  //path.push(end);
  cPoint = end;
  while (!samePoint(cPoint, start)) {
    path.push(cPoint);
    cPoint = cPoint.parent;
  }
  path.push(start);
  optimizePath();
}

function calc() {
  let lowestIndex = returnLowestF();
  if (lowestIndex===false) {
    console.log("no path");
    console.log(closed.length + " " + points.length);
    if (pathCount < tries) {
      let pathActual = pathCount + 1;
      info.html("No Path, flipping points, try number : " + pathActual, false);
      keepStartEnd = true;
      pathCount = pathCount + 1;
      resetMaze();
    } else if (pathCount == tries) {
      info.html("Tried " + pathCount + " times, stopping...", false);
      finished = true;
      keepStartEnd = false;
      noLoop();
    }

  } else if (typeof lowestIndex === "boolean" & lowestIndex===true) {

    calcPath();
    if (pathCount > 0) {
      let pathActual = pathCount + 1;
      info.html("Found in " + pathActual + " iterations" + getPathSize(), false)
      pathCount = 0;

    } else if (pathCount == 0) {
      info.html("Found first try" + getPathSize(), false);
    }

    finished = true;
    noLoop();
    // CALCULATE PATH
  } else
  if (typeof lowestIndex !="boolean" && finished === false && !samePoint(current, end)) {
    //let current;
    console.log(lowestIndex);
    closed.push(open[lowestIndex]);
    console.log(open);
    //console.log(open[lowestIndex]);
    current = closed[closed.length - 1];
    getOpen(current);
    open.splice(lowestIndex, 1);
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

function resetMaze() {
  settingUp = true;
  open = [];
  closed = [];
  path = [];
  if (!keepStartEnd) {
    points = [];
    pathCount = 0;
  }
  finished = false;
  loop();

}

function getMaxMin() {
  maxBetween = (dV * dV);
  maxBetween = maxBetween * 2;
  maxBetween = sqrt(maxBetween);
  maxBetween = maxBetween / dV;
}

// find max value for dV multiplier // could be bugs, find min for 2 away
function optimizePath() {
  let opts = 0;
  let newPath = [];
  let dists = [];
  for (let x = 0; x < path.length; x++) {
    for (let y = x; y < path.length; y++) {
      let dT = dist(path[x].x, path[x].y, path[y].x, path[y].y);

      if (isAdj(path[x], path[y])) {
        dists.push(dT);
        for (let t = x + 1; t < y - 1; t++) {
          opts++;
          path[t].showInPath = false;
        }
      }
    }
  }
  for (let x = 0; x < path.length; x++) {
    if (path[x].showInPath) {
      newPath.push(path[x]);
    }
  }
  console.log("Optimized " + opts + " from " + path.length + " to " + newPath.length);
  //  path = newPath;
  //console.log(dists);

}

function reTry() {
  keepStartEnd = true;
  pathCount = 0;
  resetMaze();
}

function getPathSize() {
  return " | length : " + path.length;
}

function setup() {
  //createButton('test');
  rectMode(CENTER);
  startButton = createButton('Go');
  startButton.mouseClicked(resetMaze);
  info = createDiv("Welcome to Maze Maker");
  info.parent('sliderHolder');
  gridSizeSilder = createSlider(5, 200, 50);
  gridSizeSilder.style('background-color', color(200, 0, 0));
  gridSizeSilder.parent('sliderHolder');
  gridSizeInfo = createDiv("Grid Size: " + gridSize);
  gridSizeInfo.parent('sliderHolder');


  obsticlePercentageSlider = createSlider(0, 100, 20, 1);
  obsticlePercentageSlider.style('background-color', color(20));
  obsticlePercentageSlider.style('color', color(0));
  obsticlePercentageSlider.parent('sliderHolder');
  obsticlePercentageInfo = createDiv("% of Obsticles: " + obsticlePercentage);
  obsticlePercentageInfo.parent('sliderHolder');

  childPercentageSlider = createSlider(0, 100, 20, 1);
  childPercentageSlider.style('background-color', color(100));
  childPercentageSlider.parent('sliderHolder');
  childPercentageInfo = createDiv("% of obsticle connections: " + childPercentage);
  childPercentageInfo.parent('sliderHolder');

  triesSlider = createSlider(1, 100, 10);
  triesSlider.style('background-color', color(0, 200, 0));
  triesSlider.parent('sliderHolder');
  triesSliderInfo = createDiv("Tries: " + tries);
  triesSliderInfo.parent('sliderHolder');


  retryButton = createButton('retry');
  retryButton.mouseClicked(reTry);
  retryButton.parent('sliderHolder');
  noStroke();
  let ratio = 100;
  screenSize = min(windowHeight, windowWidth);
  screenSize = screenSize * .9;
  var cnv = createCanvas(screenSize, screenSize);
  cnv.style('display', 'block');
  cnv.parent('canvasHolder');
  startButton.parent('canvasHolder');
  startButton.style('width', '100%');
  dV = screenSize / gridSize;
  updateSliders();

}

function aStar() {
  if (settingUp) {
    if (!keepStartEnd) {
      info.html("searching...", false);
      gridSize = gridSizeSilder.value();
      obsticlePercentage = obsticlePercentageSlider.value();
      childPercentage = childPercentageSlider.value();
      tries = triesSlider.value();
      console.log(gridSize);
      dV = screenSize / gridSize;
      setupGrid();
      // console.log(dist(points[gridSize+1].x,points[gridSize+1].y,points[0].x,points[0].y));
      // console.log("dV " + dV);
      //let startval = random(points.length);
      getStartEnd();

    } else if (keepStartEnd) {
      let temp = start;
      start = end;
      end = temp;
      keepStartEnd = false;
    }
    current = start;
    open.push(current);
    settingUp = false;
    updateSliders();
  }
  if(!finished){
  displayGrid();
  calc();
  displayOpen();

  //  displayPath();
  displayStartEnd();
}
  if (finished) {
    displayGrid();
    displayPath();
    displayStartEnd();
    noLoop();
  }
}

function updateSliders() {
  gridSizeInfo.html("Grid Size: " + gridSize, false);
  childPercentageInfo.html("% of obsticle connections: " + childPercentage, false);
  obsticlePercentageInfo.html("% of Obsticles: " + obsticlePercentage, false);
  triesSliderInfo.html("Tries: " + tries);
}

function draw() {
  aStar();
  //noLoop();
}
