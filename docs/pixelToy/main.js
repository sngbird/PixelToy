title = "Pixel Toy";

description = `calm
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


const VIEW_X = 800;
const VIEW_Y = 600;


options = {
  viewSize: { x: VIEW_X, y: VIEW_Y },
  theme: "dark",
  isPlayingBgm: false,
  isReplayEnabled: true,
  seed: 1,
};

/** @type {{pos: Vector, zPos:number, zVel: number, velocity: Vector, color: String, colorCode: number}[]} */
let toyParticles;

const numParticles = 2000; 
const numColors = 6;
const numDimensions = 3;
const dt = .001; // Time Step - May not need if running this on every tick
const frictionHalfLife = .040;
const rMax = 75;
const attractionMatrix = makeRandomMatrix();
const forceFactor = 10;


const frictionFactor = Math.pow(.5, dt/ frictionHalfLife);

function update() {
  if (!ticks) {
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
  updateParticles();
  remove(toyParticles, (toy) => {
    toy.pos.wrap(5, VIEW_X - 5, 5, VIEW_Y - 5);
    
    // if (toy.pos.x < 0 || toy.pos.x > VIEW_X){
    //   toy.velocity.mul(-1);
    // }
    // if (toy.pos.y < 0 || toy.pos.y > VIEW_Y){
    //   toy.velocity.mul(-1);
    // }
    const c = char(toy.color, toy.pos, {scale: {x:(1/toy.zPos),y:(1/toy.zPos)},}).isColliding.char;
    
    return false;
  });
  
}
function updateParticles(){
  // Update Velocities
  for (let i = 0; i < numParticles; i++){
    let totalForceX = 0;
    let totalForceY = 0;
    let totalForceZ = 0;

    for (let j = 0; j < numParticles; j++){
      if(j === i ) continue;
      if (toyParticles){
        const rx = toyParticles[j].pos.x-toyParticles[i].pos.x;
        const ry = toyParticles[j].pos.y-toyParticles[i].pos.y;
        const rz = toyParticles[j].zPos-toyParticles[i].zPos;
        const r = Math.sqrt(rx*rx + ry*ry + rz*rz);
        if (r > 0 && r < rMax){
          const f = force(r / rMax, attractionMatrix[toyParticles[i].colorCode][toyParticles[j].colorCode]);
          totalForceX += rx / r * f;
          totalForceY += ry / r * f;
          totalForceZ += rz / r * f;
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
  for(let i = 0; i < numParticles; i++){
    if(toyParticles[i]){
      toyParticles[i].pos.add(toyParticles[i].velocity.mul(dt));
      if(toyParticles[i].zPos < 1 && toyParticles[i].zPos > -1){ 
        toyParticles[i].zPos += ((toyParticles[i].zVel * dt));
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
      col.push(Math.random() *2 - 1);
    }
    rows.push(col)
  }
  return rows;
}




