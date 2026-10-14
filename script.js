const canvas = document.getElementById('trafficCanvas');
const ctx = canvas.getContext('2d');
const logBox = document.getElementById('agentLogs');

canvas.width = 900;
canvas.height = 400;

// System States
let incidentState = 'NORMAL'; // 'NORMAL', 'ACCIDENT', 'ROADWORK', 'HEAVY_TRAFFIC'
let bypassCongested = false;
let currentRoute = 'Main Highway (Road A)';

// Emergency Police Vehicle
let policeCar = {
    active: false,
    x: -100,
    y: 135,
    speed: 5,
    sirenFlash: false
};

// Cars Setup
let cars = [];
const numCars = 22;

class Car {
    constructor(id, speed) {
        this.id = id;
        this.speed = speed;
        this.reset();
    }

    reset() {
        this.x = Math.random() * -400;
        this.route = 'A'; // 'A' = Main, 'B' = Bypass 1, 'C' = Bypass 2
        this.lane = Math.floor(Math.random() * 3);
        this.y = 120 + (this.lane * 25);
        this.color = ['#3498db', '#f1c40f', '#ecf0f1', '#9b59b6', '#1abc9c'][Math.floor(Math.random() * 5)];
    }

    move() {
        // Stop behind obstacles on Main Road (Road A)
        if ((incidentState === 'ACCIDENT' || incidentState === 'ROADWORK' || incidentState === 'HEAVY_TRAFFIC') 
            && this.route === 'A' && this.x > 310 && this.x < 400) {
            return; // Stopped in traffic/behind accident
        }

        // Heavy Congestion on Bypass B slows cars down
        if (bypassCongested && this.route === 'B' && this.x > 350 && this.x < 550) {
            this.x += this.speed * 0.2;
        } else {
            this.x += this.speed;
        }

        // Automatic Rerouting Logic at Decision Junction (X = 250)
        if (Math.abs(this.x - 250) < 4) {
            if (currentRoute === 'Route B (Bypass 1)') {
                this.route = 'B';
            } else if (currentRoute === 'Route C (Secondary Sub-road)') {
                this.route = 'C';
            } else {
                this.route = 'A';
            }
        }

        // Dynamic Y Coordinate adjustments for turning into sub-roads
        if (this.route === 'B') {
            if (this.x > 250 && this.x < 350 && this.y > 60) this.y -= 2;
            if (this.x > 550 && this.x < 650 && this.y < 120) this.y += 2;
        } else if (this.route === 'C') {
            if (this.x > 250 && this.x < 350 && this.y < 320) this.y += 3;
            if (this.x > 550 && this.x < 650 && this.y > 170) this.y -= 3;
        }

        if (this.x > canvas.width + 50) {
            this.reset();
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 24, 12);
        // Headlights
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x + 20, this.y + 2, 4, 3);
        ctx.fillRect(this.x + 20, this.y + 7, 4, 3);
    }
}

// Initialize Civilian Cars
for (let i = 0; i < numCars; i++) {
    cars.push(new Car(i, 2 + Math.random() * 1.5));
}

function logMessage(msg) {
    logBox.innerHTML += `<br>${msg}`;
    logBox.scrollTop = logBox.scrollHeight;
}

// --- CONTROLLER FUNCTIONS ---

function triggerAccident() {
    incidentState = 'ACCIDENT';
    policeCar.active = true;
    policeCar.x = -60;
    logMessage(`[PERCEPTION] 🚨 ACCIDENT DETECTED on Main Highway (Road A)!`);
    logMessage(`[ACTION] 🚓 Police car dispatched to crash site.`);
    
    setTimeout(() => {
        currentRoute = 'Route B (Bypass 1)';
        logMessage(`[DECISION & ACT] ⚠️ AI Agent automatically rerouting oncoming traffic to Route B.`);
    }, 1200);
}

function triggerHeavyTraffic() {
    incidentState = 'HEAVY_TRAFFIC';
    logMessage(`[PERCEPTION] 🚗⚡ HEAVY TRAFFIC DETECTED on Main Highway (Road A). Capacity reached.`);
    
    setTimeout(() => {
        currentRoute = 'Route B (Bypass 1)';
        logMessage(`[DECISION & ACT] 🔄 Automated Reroute: Traffic diverted to Route B to relieve congestion.`);
    }, 1000);
}

function triggerRoadwork() {
    incidentState = 'ROADWORK';
    logMessage(`[PERCEPTION] 🚧 ROADWORK / CONSTRUCTION DETECTED on Main Highway (Road A). Lanes blocked.`);
    
    setTimeout(() => {
        currentRoute = 'Route B (Bypass 1)';
        logMessage(`[DECISION & ACT] ⚠️ Automated Reroute: Rerouting traffic via Route B around roadworks.`);
    }, 1000);
}

function congestDiversion() {
    if (incidentState === 'NORMAL') {
        alert("Trigger an incident first (Accident, Roadwork, or Heavy Traffic)!");
        return;
    }
    bypassCongested = true;
    logMessage(`[MONITORING] 📈 Bypass Route B is now experiencing heavy secondary congestion!`);
    
    setTimeout(() => {
        currentRoute = 'Route C (Secondary Sub-road)';
        logMessage(`[ADAPTATION] 🔄 AI Agent adapts response! Rerouting traffic to Route C (Sub-road 2).`);
    }, 1000);
}

function resetSimulation() {
    incidentState = 'NORMAL';
    bypassCongested = false;
    policeCar.active = false;
    policeCar.x = -100;
    currentRoute = 'Main Highway (Road A)';
    cars.forEach(car => car.reset());
    logMessage(`[RESET] All road conditions cleared. Agent monitoring normal operations.`);
}

// --- ANIMATION LOOP ---

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. DRAW ROAD LAYOUT
    ctx.fillStyle = '#34495e';
    ctx.fillRect(0, 110, canvas.width, 80); // Main 3-Lane Highway
    ctx.fillRect(250, 40, 400, 40);   // Sub-road B
    ctx.fillRect(250, 310, 400, 40);  // Sub-road C

    // Connecting Lanes
    ctx.beginPath();
    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 40;
    ctx.moveTo(250, 150); ctx.lineTo(350, 60);
    ctx.moveTo(550, 60); ctx.lineTo(650, 150);
    ctx.moveTo(250, 150); ctx.lineTo(350, 330);
    ctx.moveTo(550, 330); ctx.lineTo(650, 150);
    ctx.stroke();

    // Dash Markings
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 2;
    ctx.setLineDash([15, 15]);
    ctx.beginPath();
    ctx.moveTo(0, 136); ctx.lineTo(canvas.width, 136);
    ctx.moveTo(0, 163); ctx.lineTo(canvas.width, 163);
    ctx.stroke();
    ctx.setLineDash([]);

    // Road Labels
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.fillText('Main Highway (Road A)', 20, 100);
    ctx.fillText('Route B (Bypass 1)', 380, 30);
    ctx.fillText('Route C (Bypass 2)', 380, 370);

    // 2. DRAW INCIDENTS & OBSTACLES
    if (incidentState === 'ACCIDENT') {
        // Crashed Cars
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(400, 130, 24, 12);
        ctx.fillStyle = '#c0392b';
        ctx.fillRect(415, 134, 24, 12);
        
        ctx.fillStyle = '#f39c12';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('💥 CRASH SITE', 380, 115);
    } else if (incidentState === 'ROADWORK') {
        // Construction Cones & Barriers
        ctx.fillStyle = '#e67e22';
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(390 + (i * 20), 125 + (i % 2 * 20), 12, 16);
        }
        ctx.fillStyle = '#f1c40f';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('🚧 ROAD WORK', 380, 115);
    } else if (incidentState === 'HEAVY_TRAFFIC') {
        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('🚗⚡ HEAVY CONGESTION', 360, 115);
    }

    // 3. MOVE & DRAW POLICE CAR
    if (policeCar.active) {
        if (policeCar.x < 360) {
            policeCar.x += policeCar.speed;
        }
        
        // Draw Police Car Body
        ctx.fillStyle = '#000000';
        ctx.fillRect(policeCar.x, policeCar.y, 26, 12);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(policeCar.x + 8, policeCar.y, 10, 12); // White door panel
        
        // Flashing Siren Lights
        policeCar.sirenFlash = !policeCar.sirenFlash;
        ctx.fillStyle = policeCar.sirenFlash ? '#ff0000' : '#0000ff';
        ctx.fillRect(policeCar.x + 10, policeCar.y - 4, 6, 4);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 11px Arial';
        ctx.fillText('POLICE 🚓', policeCar.x - 5, policeCar.y - 8);
    }

    // 4. MOVE & DRAW CIVILIAN CARS
    cars.forEach(car => {
        car.move();
        car.draw();
    });

    requestAnimationFrame(animate);
}

animate();
