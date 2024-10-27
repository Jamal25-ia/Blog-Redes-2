const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

// get mouse position
let mouse = {
  x: null,
  y: null,
  radius: 50
};

window.addEventListener('mousemove', function(event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

// create particle
class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }
  // method to draw individual particles
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color; // Usa el color de la partícula
    ctx.fill();
  }
  // check particle position, check mouse position, move the particle, draw the particle
  update() {
    // check if particle is still within canvas
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }
    
    // check collision detection - mouse/particles position
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < mouse.radius + this.size) {
      if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
        this.x += 1.3;
      } 
      if (mouse.x > this.x && this.x > this.size * 10) {
        this.x -= 1.3;
      }
      if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
        this.y += 1.3;
      } 
      if (mouse.y > this.y && this.y > this.size * 10) {
        this.y -= 1.3;
      }
    }
    // move particle
    this.x += this.directionX;
    this.y += this.directionY;
    // draw particle
    this.draw();
  }
}

// create particle array
function init() {
  particlesArray = [];
  let maxParticles = 200; // Número máximo de partículas
  let numberOfParticles = Math.min((canvas.height * canvas.width) / 4000, maxParticles);

  for (let i = 0; i < numberOfParticles; i++) {
    let size = (Math.random() * 5) + 1;
    let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
    let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
    let directionX = Math.random() - 1;
    let directionY = Math.random() - 1;
    let color = '#00FFFF'; // Color celeste
    
    particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
  }
}

// check if particles are close enough to draw line between them
function connect() {
  let opacityValue = 1;
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
      if (distance < (canvas.width / 7) * (canvas.height / 7)) {
        opacityValue = 1 - (distance / 20000);
        ctx.strokeStyle = 'rgba(0, 255, 255, ' + opacityValue + ')'; // Azul celeste con opacidad
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

// animation loop
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  ctx.fillStyle = 'black'; // Establece el color de fondo
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Rellena el fondo con negro
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  connect();
}

// resize event
window.addEventListener('resize', function() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  mouse.radius = ((canvas.height / 80) * (canvas.height / 80));
  init();
});

window.addEventListener('mouseout', function() {
  mouse.x = undefined;
  mouse.y = undefined;
});

init();
animate();
