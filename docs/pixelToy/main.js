title = "Pixel Toy";

description = `calm
`;

characters = [];


const VIEW_X = 200;
const VIEW_Y = 200;


options = {
  viewSize: { x: VIEW_X, y: VIEW_Y },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 1,
};

/** @type {{pos: Vector, velocity: Vector, color: number}[]} */
let _toyParticle;

const numParticles = 100; 
const numColors = 6;
const numDimensions = 3;
const dt = .02; // Time Step - May not need if running this on every tick
const frictionHalfLife = .040;
const rMax = .1;
const matrix = makeRandomMatrix();

const colors = new Int32Array(numParticles);
const positionX = new Int32Array(numParticles);
const positionY = new Int32Array(numParticles);
const positionZ = new Int32Array(numParticles);
const velocitiesX = new Int32Array(numParticles);
const velocitiesY = new Int32Array(numParticles);
const velocitiesZ = new Int32Array(numParticles);

const frictionFactor = Math.pow(.5, dt/ frictionHalfLife);

function update() {
  if (!ticks) {
    //Initialize the particles
    for (let i = 0; i < numParticles; i++){
      colors[i] = Math.floor(Math.random() * numColors);
      positionX[i] = Math.random();
      positionY[i] = Math.random();
      positionZ[i] = Math.random();
      velocitiesX[i] = 0;
      velocitiesY[i] = 0;
      velocitiesZ[i] = 0;
    }
  }
}
function updateVelocity(){}

function makeRandomMatrix(){
  const rows = [];
  for (let i = 0; i < numColors; i++){
    const row = [];
    for (let j = 0; j < numColors; j++){
      row.push(Math.random() *2 - 1);
    }
    rows.push(row)
  }
  return rows;
}