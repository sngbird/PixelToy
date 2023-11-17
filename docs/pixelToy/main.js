title = "Pixel Toy";

description = `Meditate
`;

characters = [`
r
 `,
`
b 
`,
`
y
 `,
 `
g
 `,
 `
o
 `,
 `
 p
 `]
;


const VIEW_X = 850;
const VIEW_Y = 650;
const EDGE_VELOCITY = 1000;
const EDGE_MARGIN = 50;


options = {
  viewSize: { x: VIEW_X, y: VIEW_Y },
  theme: "dark",
  isPlayingBgm: false,
  isReplayEnabled: true,
  isShowingScore: false,
  seed: 12,
};

/** @type {{pos: Vector, zPos:number, zVel: number, velocity: Vector, color: String, colorCode: number}[]} */
let toyParticles;

let funcString = "Randomized Attraction!";
let funcIter = 0;
let num = 0;
const numFeatures = 7;

const numParticles = 2000; 
const numColors = 6;
const numDimensions = 3;
const dt = .0001; 
const frictionHalfLife = .040;
const rMax = 60;
let attractionMatrix = makeRandomMatrix();
const forceFactor = 50;
let frameDelay;
let predator = false;

const frictionFactor = Math.pow(.5, dt/ frictionHalfLife);

function update() {
  if (!ticks) {
    frameDelay = 0;
    //Initialize the particles
    toyParticles = [];
    for (let i = 0; i < numParticles; i++){
      let particleColor = rndi(1,6);
      toyParticles.push({
        pos: vec(rndi(10, VIEW_X - 10), rndi(10, VIEW_Y - 10),),
        zPos: Math.random() + 1,
        zVel: 0,
        velocity: vec(0,0),
        color: String.fromCharCode(96 + particleColor),
        colorCode: particleColor,
      });
      
    }
    
  }
  //End Init
  text("Current Function: "+funcString,(VIEW_X/2)-128, 20);
  // text("Attraction Matrix:",(VIEW_X*.75), 20);
  // text(attractionMatrix[0].toString(),(VIEW_X*.75)-20, 30);
  // text(attractionMatrix[1].toString(),(VIEW_X*.75)-20, 40);
  // text(attractionMatrix[2].toString(),(VIEW_X*.75)-20, 50);
  // text(attractionMatrix[3].toString(),(VIEW_X*.75)-20, 60);
  // text(attractionMatrix[4].toString(),(VIEW_X*.75)-20, 70);
  // text(attractionMatrix[5].toString(),(VIEW_X*.75)-20, 80);






 
  if(input.isPressed){
    frameDelay++;
  }
 if(input.isJustReleased && frameDelay > 5){
  frameDelay = 0;
  toyFeature(num);
 }else if(input.isJustReleased && frameDelay < 5){
    frameDelay = 0;
    funcIter++;
    num = funcIter % numFeatures;
    toyMessage(num);
 }

  //Particle Logic
  updateParticles();
  remove(toyParticles, (toy) => {
    //Boundary Condition, not working 100% of the time
    toy.pos.wrap(0, VIEW_X , 0, VIEW_Y);
    
    if(toy.pos.x < EDGE_MARGIN){
      toy.velocity.x = EDGE_VELOCITY;
    }
    if(toy.pos.x > (VIEW_X - EDGE_MARGIN)){
      toy.velocity.x = (-1 * EDGE_VELOCITY);
    }
    if(toy.pos.y < EDGE_MARGIN){
      toy.velocity.y = EDGE_VELOCITY;
    }
    if(toy.pos.y > (VIEW_Y - EDGE_MARGIN)){
      toy.velocity.y = (-1 * EDGE_VELOCITY);
    }
    const c = char(toy.color, toy.pos, {scale: { x: 1 / toy.zPos, y: 1 / toy.zPos }}).isColliding.char;
    // let check = c.isColliding;
    // if (toy.color != "g" && check.char.c){
    //   return true;
    // }   
    return false;
  });
  
}
function toyFeature(number){
  if (number === 0){
    //Randomize
    attractionMatrix = makeRandomMatrix();  
  }
  if (number === 1){
    //All Unattracted
    for(let i = 0; i < numColors; i++){
      for(let j = 0; j < numColors; j++){
        attractionMatrix[i][j] = -.9;
      }
    }
  }
  if (number === 2){
    //Left and Top Border of matrix all like
    attractionMatrix[0][0] = 1;
    for(let i = 1; i < numColors; i++){
      attractionMatrix[i][0] = .8;
      attractionMatrix[0][i] = .8;
    }
  }
  if (number === 3){
    //Max Attraction 
    for(let i = 0; i < numColors; i++){
      for(let j = 0; j < numColors; j++){
        attractionMatrix[i][j] = .9;
      }
    }
  }
  if (number === 4){
    //Self Attraction
    for(let i = 0; i < numColors; i++){
      for(let j = 0; j < numColors; j++){
        attractionMatrix[i][j] = -.9;
      }
    }
    for(let i = 0; i < numColors; i++){
      attractionMatrix[i][i] = .9;
    }
  }
  if (number === 5){
    //Self Unattraction
    for(let i = 0; i < numColors; i++){
      for(let j = 0; j < numColors; j++){
        attractionMatrix[i][j] = .5;
      }
    }
    for(let i = 0; i < numColors; i++){
      attractionMatrix[i][i] = -.9;
    }
  }
  if (number === 6){
    for (let i = 0; i < numColors; i++){
      attractionMatrix[i][3] = .9;
      attractionMatrix[3][i] = -.5;
    }
    attractionMatrix[3][3] = .9;
    predator = true;
  }
  play("random")
}
function toyMessage(number){
  if (number === 0){
    funcString = "Randomize Attraction Matrix!"; 
  }
  if (number === 1){
    funcString = "Atomize";
  }
  if (number === 2){
    funcString = "Everybody Loves Red"
  }
  if (number === 3){
    funcString = "Mating Season"
  }
  if (number === 4){
    funcString = "Autophile"
  }
  if (number === 5){
    funcString = "Autophobe"
  }
  if (number === 6){
    funcString = "Green Predator"
  }
}

function updateParticles() {
  // Update Velocities
  const gridSize = 200; // Adjust as needed
  const grid = {};

  // Partition particles into the grid
  for (let i = 0; i < numParticles; i++) {
    const particle = toyParticles[i];
    const gridX = Math.floor(particle.pos.x / gridSize);
    const gridY = Math.floor(particle.pos.y / gridSize);
    const gridZ = Math.floor(particle.zPos / gridSize); 

    const gridKey = `${gridX}_${gridY}_${gridZ}`;

    if (!grid[gridKey]) {
      grid[gridKey] = [];
    }

    grid[gridKey].push(particle);
  }

  for (let i = 0; i < numParticles; i++) {
    let totalForceX = 0;
    let totalForceY = 0;
    let totalForceZ = 0;

    const particle = toyParticles[i];
    const gridX = Math.floor(particle.pos.x / gridSize);
    const gridY = Math.floor(particle.pos.y / gridSize);
    const gridZ = Math.floor(particle.zPos / gridSize);

    // Loop over adjacent grid cells
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          const neighborX = gridX + dx;
          const neighborY = gridY + dy;
          const neighborZ = gridZ + dz;
          const neighborKey = `${neighborX}_${neighborY}_${neighborZ}`;

          const particlesInCell = grid[neighborKey];

          if (particlesInCell) {
            for (const otherParticle of particlesInCell) {
              if (otherParticle !== particle) {
                const rx = otherParticle.pos.x - particle.pos.x;
                const ry = otherParticle.pos.y - particle.pos.y;
                const rz = otherParticle.zPos - particle.zPos;
                const r = Math.sqrt(rx * rx + ry * ry + rz * rz);

                if (r > 0 && r < rMax) {
                  const f = force(r / rMax, attractionMatrix[particle.colorCode][otherParticle.colorCode]);
                  totalForceX += rx / r * f;
                  totalForceY += ry / r * f;
                  totalForceZ += rz / r * f;
                }
              }
            }
          }
        }
      }
    }

    totalForceX *= rMax * forceFactor;
    totalForceY *= rMax * forceFactor;
    totalForceZ *= rMax * forceFactor;

    toyParticles[i].velocity.x *= frictionFactor;
    toyParticles[i].velocity.y *= frictionFactor;
    toyParticles[i].zVel *= frictionFactor;

    toyParticles[i].velocity.x += totalForceX;
    toyParticles[i].velocity.y += totalForceY;
    toyParticles[i].zVel += totalForceZ;
  }

  // Update Positions
  for (let i = 0; i < numParticles; i++) {
    if (toyParticles[i]) {
      toyParticles[i].pos.add(toyParticles[i].velocity.mul(dt));
      if (toyParticles[i].zPos < 1 && toyParticles[i].zPos > -1) {
        toyParticles[i].zPos += toyParticles[i].zVel * dt;
      }
    }
  }
}


function force(r, attractionMatrix){
  const beta = .3;
  if (r < beta){
    return r / beta - 1; 
  }
  else if (beta < r && r < 1){
    return attractionMatrix * (1- Math.abs(2 * r - 1 - beta) / (1 - beta));
  }
  else {
    return 0;
  }
}

function makeRandomMatrix(){
  const rows = [];
  for (let i = 0; i < numColors; i++){
    const col = [];
    for (let j = 0; j < numColors; j++){
      col.push(Math.round((Math.random() *2 - 1) * 1000)/1000);
    }
    rows.push(col)
  }
  return rows;
}




