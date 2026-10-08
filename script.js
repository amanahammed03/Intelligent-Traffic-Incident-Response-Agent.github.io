let state = {
    incident: false,
    routeBBlocked: false,
    recommendation: "Normal traffic",
    running: false
};


/* =========================
   ELEMENTS
========================= */

const incidentText = document.getElementById("incident");
const severityText = document.getElementById("severity");
const trafficText = document.getElementById("traffic");
const recommendationText = document.getElementById("recommendation");

const roadA = document.getElementById("roadA");
const roadB = document.getElementById("roadB");
const roadC = document.getElementById("roadC");

const roadAStatus = document.getElementById("roadAStatus");
const roadBStatus = document.getElementById("roadBStatus");
const roadCStatus = document.getElementById("roadCStatus");

const logBox = document.getElementById("log");


/* =========================
   LOG SYSTEM
========================= */

function log(message) {

    const time = new Date().toLocaleTimeString();

    const newLog = document.createElement("p");

    newLog.innerText = `[${time}] ${message}`;

    logBox.appendChild(newLog);

    logBox.scrollTop = logBox.scrollHeight;
}


/* =========================
   AGENT STEPS
========================= */

function activateStep(number) {

    document.querySelectorAll(".step").forEach(step => {
        step.classList.remove("active");
    });

    const selected = document.getElementById(`step${number}`);

    if (selected) {
        selected.classList.add("active");
    }
}


/* =========================
   RESET
========================= */

function resetSimulation() {

    state.incident = false;
    state.routeBBlocked = false;
    state.recommendation = "Normal traffic";

    incidentText.innerText = "No incident detected";
    severityText.innerText = "Normal";
    trafficText.innerText = "Normal";

    recommendationText.innerText =
        "All roads are operating normally.";

    roadA.className = "road road-a";
    roadB.className = "road road-b";
    roadC.className = "road road-c";

    roadAStatus.innerText = "NORMAL";
    roadBStatus.innerText = "NORMAL";
    roadCStatus.innerText = "NORMAL";

    document.querySelectorAll(".step").forEach(step => {
        step.classList.remove("active");
    });

    log("Traffic network reset.");
    log("AI Agent is monitoring all roads.");

}


/* =========================
   CREATE ACCIDENT
========================= */

function createAccident() {

    state.incident = true;

    activateStep(1);

    incidentText.innerText = "Accident detected on Road A";
    severityText.innerText = "HIGH";
    trafficText.innerText = "Heavy";

    roadA.classList.add("accident");
    roadAStatus.innerText = "🚨 ACCIDENT";

    log("New traffic data received.");
    log("Incident detected: ACCIDENT on Road A.");

    setTimeout(() => {

        activateStep(2);

        log("Analyzing incident severity...");
        log("Road A capacity significantly reduced.");

    }, 800);


    setTimeout(() => {

        activateStep(3);

        log("Evaluating alternative routes...");

        chooseRouteB();

    }, 1600);

}


/* =========================
   CHOOSE ROUTE B
========================= */

function chooseRouteB() {

    activateStep(4);

    roadB.classList.add("recommended");
    roadBStatus.innerText = "✓ RECOMMENDED";

    recommendationText.innerText =
        "Avoid Road A. Route B is currently recommended.";

    state.recommendation = "Route B";

    log("Decision: Avoid Road A.");
    log("AI Agent recommendation: Route B.");

}


/* =========================
   CONGEST ROUTE B
========================= */

function congestRouteB() {

    if (!state.incident) {

        log("No incident exists. Create an accident first.");

        return;
    }

    state.routeBBlocked = true;

    activateStep(5);

    roadB.classList.remove("recommended");
    roadB.classList.add("congested");

    roadBStatus.innerText = "⚠ CONGESTED";

    trafficText.innerText = "Heavy";

    log("NEW DATA RECEIVED.");
    log("Route B traffic has increased significantly.");
    log("Previous recommendation may no longer be optimal.");

}


/* =========================
   AGENT REPLAN
========================= */

function agentReplan() {

    if (!state.incident) {

        log("Agent has no incident to analyze.");

        return;
    }

    activateStep(2);

    log("Agent is re-analyzing current traffic conditions...");

    setTimeout(() => {

        if (state.routeBBlocked) {

            activateStep(3);

            log("Route B is too congested.");
            log("Searching for another available route.");

            setTimeout(() => {

                activateStep(4);

                chooseRouteC();

            }, 800);

        } else {

            log("Route B remains the best available option.");

        }

    }, 1000);

}


/* =========================
   CHOOSE ROUTE C
========================= */

function chooseRouteC() {

    activateStep(4);

    roadB.classList.remove("recommended");

    roadC.classList.add("recommended");

    roadCStatus.innerText = "✓ RECOMMENDED";

    recommendationText.innerText =
        "Route B is congested. Route C is now recommended.";

    state.recommendation = "Route C";

    log("ADAPTIVE DECISION ACTIVATED.");
    log("Route C selected as the new best route.");

    setTimeout(() => {

        activateStep(6);

        log("Agent adapted its response to the new traffic situation.");

    }, 800);

}


/* =========================
   FULL AUTOMATIC DEMO
========================= */

async function runFullDemo() {

    if (state.running) {
        return;
    }

    state.running = true;

    resetSimulation();

    await wait(1500);

    log("=== STARTING PRACTICAL AI AGENT DEMO ===");

    await wait(1000);

    createAccident();

    await wait(3500);

    congestRouteB();

    await wait(1500);

    agentReplan();

    await wait(3000);

    activateStep(6);

    log("=== DEMO COMPLETE ===");
    log("Final recommendation: Route C.");

    state.running = false;

}


/* =========================
   WAIT FUNCTION
========================= */

function wait(ms) {

    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });

}


/* =========================
   INITIALIZE
========================= */

resetSimulation();
