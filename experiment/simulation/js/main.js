var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
document.getElementById("playButton").addEventListener("click", play);
document.getElementById("resetButton").addEventListener("click", reset);

const slider_mass1 = document.getElementById("currentmass1");
const slider_mass2 = document.getElementById("currentmass2");
const slider_velocity1 = document.getElementById("currentvelocity1");
const slider_length1 = document.getElementById("currentlength1");
const slider_length2 = document.getElementById("currentlength2");

// GLOBAL VARIABLES - DECLARE AT TOP
var velocity1 = 0.1;
var velocity2 = 0;
var mass1 = 0.2;
var mass2 = 0.2;
var length1 = 5;
var length2 = 5;
var collisionType = "Elastic"; // Track current collision type

var min = 0.85;
var max = 0.95;
var g_elastic = (Math.random() * (max - min + 0.01) + min).toFixed(2);
var g_inelastic = 0.61;
var h = (Math.random() * (0.98 - 0.91 + 0.01) + 0.91).toFixed(2);

var animationId = null;

// ===== LOCK CHECKBOX SETUP =====
const radioInput = document.getElementById("elastic");
const inelasticRadio = document.getElementById("inelastic");
const checkbox = document.querySelector("#lockCheckbox");
let checkboxListenerAttached = false;

// Listen for radio button changes to update collision type
radioInput.addEventListener("change", function () {
  if (this.checked) {
    collisionType = "Elastic";
    updateCollisionTypeDisplay();
  }
});

inelasticRadio.addEventListener("change", function () {
  if (this.checked) {
    collisionType = "Inelastic";
    updateCollisionTypeDisplay();
  }
});

// Function to update collision type in both columns
function updateCollisionTypeDisplay() {
  document.getElementById("collision_type").innerHTML = collisionType;
  document.getElementById("th_collision_type").innerHTML = collisionType;
}

// Attach checkbox listener only once
function attachCheckboxListener() {
  if (checkboxListenerAttached) return;

  checkbox.addEventListener("change", function () {
    if (this.checked) {
      // Lock is checked - disable everything and set theoretical values
      updateTheoreticalValues();
      slider_mass1.disabled = true;
      slider_mass2.disabled = true;
      slider_velocity1.disabled = true;
      slider_length1.disabled = true;
      slider_length2.disabled = true;
      radioInput.disabled = true;
      inelasticRadio.disabled = true;
    } else {
      // Lock is unchecked - enable everything
      slider_mass1.disabled = false;
      slider_mass2.disabled = false;
      slider_velocity1.disabled = false;
      slider_length1.disabled = false;
      slider_length2.disabled = false;
      radioInput.disabled = false;
      inelasticRadio.disabled = false;
    }
  });

  checkboxListenerAttached = true;
}

// Call this on page load
attachCheckboxListener();

// ===== SLIDER FUNCTIONS =====
function showMass1(newmass) {
  newmass = parseFloat(newmass);
  document.getElementById("initialMassValue1").innerHTML = newmass.toFixed(1);
  document.getElementById("mass1").innerHTML = newmass.toFixed(1);
  mass1 = newmass;
  if (checkbox.checked) {
    updateTheoreticalValues();
  }
}

function showMass2(newmass) {
  newmass = parseFloat(newmass);
  document.getElementById("initialMassValue2").innerHTML = newmass.toFixed(1);
  document.getElementById("mass2").innerHTML = newmass.toFixed(1);
  mass2 = newmass;
  if (checkbox.checked) {
    updateTheoreticalValues();
  }
}

function showVelocity1(newvelocity) {
  newvelocity = parseFloat(newvelocity);
  document.getElementById("initialVelocityValue1").innerHTML =
    newvelocity.toFixed(1);
  document.getElementById("velocity1").innerHTML = newvelocity.toFixed(1);
  velocity1 = newvelocity;
  if (checkbox.checked) {
    updateTheoreticalValues();
  }
}

function showlength1(newlength) {
  newlength = parseFloat(newlength);
  document.getElementById("initialLengthValue1").innerHTML = newlength;
  document.getElementById("length1").innerHTML = newlength;
  length1 = newlength;
  if (checkbox.checked) {
    updateTheoreticalValues();
  }
}

function showlength2(newlength) {
  newlength = parseFloat(newlength);
  document.getElementById("initialLengthValue2").innerHTML = newlength;
  document.getElementById("length2").innerHTML = newlength;
  length2 = newlength;
  if (checkbox.checked) {
    updateTheoreticalValues();
  }
}

// ===== CALCULATE THEORETICAL VALUES =====
function updateTheoreticalValues() {
  // Get current input values from table (simulation column)
  const m1 = parseFloat(document.getElementById("mass1").innerHTML);
  const m2 = parseFloat(document.getElementById("mass2").innerHTML);
  const v1 = parseFloat(document.getElementById("velocity1").innerHTML);
  const v2 = 0;

  // Set collision type to match what's currently selected
  document.getElementById("th_collision_type").innerHTML = collisionType;
  document.getElementById("th_mass1").innerHTML = m1.toFixed(1);
  document.getElementById("th_mass2").innerHTML = m2.toFixed(1);
  document.getElementById("th_length1").innerHTML =
    document.getElementById("length1").innerHTML;
  document.getElementById("th_length2").innerHTML =
    document.getElementById("length2").innerHTML;
  document.getElementById("th_velocity1").innerHTML = v1.toFixed(1);

  let theo_v1_final, theo_v2_final;

  if (collisionType === "Elastic") {
    // Elastic collision formulas
    theo_v2_final = (2 * m1 * v1) / (m1 + m2);
    theo_v1_final = ((m1 - m2) * v1) / (m1 + m2);
  } else {
    // Inelastic collision formulas
    theo_v1_final = theo_v2_final = (m1 * v1 + m2 * v2) / (m1 + m2);
  }

  // Final velocities
  document.getElementById("Theory_FinalVelocity_V1").innerHTML =
    theo_v1_final.toFixed(3);
  document.getElementById("Theory_FinalVelocity_V2").innerHTML =
    theo_v2_final.toFixed(3);

  // Initial momentum
  const theo_p1_initial = m1 * v1;
  const theo_p2_initial = m2 * v2;
  document.getElementById("Theory_InitialMomentum_V1").innerHTML =
    theo_p1_initial.toFixed(3);

  // Final momentum
  const theo_p1_final = m1 * theo_v1_final;
  const theo_p2_final = m2 * theo_v2_final;
  document.getElementById("Theory_FinalMomentum_V1").innerHTML =
    theo_p1_final.toFixed(3);
  document.getElementById("Theory_FinalMomentum_V2").innerHTML =
    theo_p2_final.toFixed(3);

  // Momentum percentage difference
  const theo_p_initial = theo_p1_initial + theo_p2_initial;
  const theo_p_final = theo_p1_final + theo_p2_final;
  const theo_per_diff_momentum =
    (Math.abs(theo_p_final - theo_p_initial) /
      ((Math.abs(theo_p_final) + Math.abs(theo_p_initial)) / 2)) *
    100;
  document.getElementById("Theory_percentage_diff_momentum").innerHTML = isNaN(
    theo_per_diff_momentum
  )
    ? "0"
    : theo_per_diff_momentum.toFixed(3);

  // Coefficient of restitution
  const theo_e = collisionType === "Elastic" ? 1 : 0;
  document.getElementById("Theory_Coef_Of_Res").innerHTML = theo_e.toFixed(3);

  // Kinetic energy
  const theo_KE1_initial = (m1 * v1 * v1) / 2;
  const theo_KE2_initial = (m2 * v2 * v2) / 2;
  const theo_total_KE_initial = theo_KE1_initial + theo_KE2_initial;

  const theo_KE1_final = (m1 * theo_v1_final * theo_v1_final) / 2;
  const theo_KE2_final = (m2 * theo_v2_final * theo_v2_final) / 2;
  const theo_total_KE_final = theo_KE1_final + theo_KE2_final;

  document.getElementById("Theory_total_Initial_KE").innerHTML =
    theo_total_KE_initial.toFixed(3);
  document.getElementById("Theory_total_Final_KE").innerHTML =
    theo_total_KE_final.toFixed(3);

  // KE percentage difference
  const theo_per_diff_KE =
    (Math.abs(theo_total_KE_final - theo_total_KE_initial) /
      ((Math.abs(theo_total_KE_final) + Math.abs(theo_total_KE_initial)) / 2)) *
    100;
  document.getElementById("Theory_percentage_diff_KE").innerHTML = isNaN(
    theo_per_diff_KE
  )
    ? "0"
    : theo_per_diff_KE.toFixed(3);
}

function uncheckCheckbox(checkboxId) {
  const checkbox = document.getElementById(checkboxId);
  checkbox.checked = false;
}

var x1 = 60;
var x2 = 400;
var y1 = 215;

var redGliderMoving = true;
var blueGliderMoving = false;
var redGliderMovingBackward = false;
var blueGliderMovingBackward = false;
var redGliderMovingForward = false;

function drawMotion() {
  var finalVel1;
  var finalVel2;

  var elasticRadio = document.getElementById("elastic");
  var inelasticRadio = document.getElementById("inelastic");

  if (elasticRadio.checked) {
    finalVel2 = (2 * mass1 * velocity1) / (mass1 + mass2);
    finalVel1 = ((mass1 - mass2) * velocity1) / (mass1 + mass2);

    if (redGliderMoving) {
      x1 += velocity1 * 10;
      if (x1 >= canvas.width - 460) {
        redGliderMoving = false;
        blueGliderMoving = true;
        redGliderMovingBackward = true;
      }
      if (x2 >= canvas.width - 105) {
        x2 -= finalVel2 * 10;
      }
    }
    if (blueGliderMoving) {
      x2 += finalVel2 * 10;
      if (x2 >= canvas.width - 115) {
        blueGliderMoving = false;
        blueGliderMovingBackward = true;
      }
    }

    if (blueGliderMovingBackward) {
      x2 -= finalVel2 * 10;
      if (x2 <= canvas.width - 225) {
        blueGliderMovingBackward = false;
      }
    }
    if (redGliderMovingBackward) {
      x1 -= finalVel1 * 10;
      if (x1 <= 55) {
        redGliderMovingBackward = false;
        redGliderMovingForward = true;
      }
    }
    if (redGliderMovingForward) {
      x1 += finalVel1 * 10;
      if (x1 >= 165) {
        redGliderMovingForward = false;
      }
    }
  } else if (inelasticRadio.checked) {
    finalVel1 = finalVel2 = (mass1 * velocity1 + mass2 * 0) / (mass1 + mass2);

    if (redGliderMoving) {
      x1 += velocity1 * 10;
      if (x1 >= canvas.width - 460) {
        redGliderMoving = false;
        redGliderMovingForward = true;
        blueGliderMoving = true;
      }
    }
    if (redGliderMovingForward) {
      x1 += finalVel1 * 10;
    }
    if (redGliderMovingBackward) {
      x1 -= finalVel1 * 10;
    }
    if (blueGliderMoving) {
      x2 += finalVel2 * 10;
      if (x2 >= canvas.width - 115) {
        blueGliderMoving = false;
        blueGliderMovingBackward = true;
        redGliderMovingForward = false;
        redGliderMovingBackward = true;
      }
    }
    if (blueGliderMovingBackward) {
      x2 -= finalVel2 * 10;
      if (x2 <= canvas.width - 225) {
        blueGliderMovingBackward = false;
        redGliderMovingBackward = false;
      }
    }
  }

  //initial momentum
  var iniMomentum_Glider1 = mass1 * velocity1;
  var iniMomentum_Glider2 = mass2 * velocity2;

  // final momentum
  var finalMomentum_Glider1 = mass1 * finalVel1;
  var finalMomentum_Glider2 = mass2 * finalVel2;

  document.getElementById("InitialMomentum_V1").innerHTML =
    iniMomentum_Glider1.toFixed(3);
  document.getElementById("FinalMomentum_V1").innerHTML =
    finalMomentum_Glider1.toFixed(3);
  document.getElementById("FinalMomentum_V2").innerHTML =
    finalMomentum_Glider2.toFixed(3);

  // Coefficient of Restitution
  var e = -((finalVel1 - finalVel2) / (velocity1 - velocity2));
  document.getElementById("Coef_Of_Res").innerHTML = e.toFixed(3);

  //percent difference momentum
  var p_i = iniMomentum_Glider1 + iniMomentum_Glider2;
  var p_f = finalMomentum_Glider1 + finalMomentum_Glider2;
  var per_diff =
    (Math.abs(p_f - p_i) / ((Math.abs(p_f) + Math.abs(p_i)) / 2)) * 100;
  document.getElementById("percentage_diff_momentum").innerHTML = isNaN(
    per_diff
  )
    ? "0"
    : per_diff.toFixed(3);

  // Kinetic Energy
  var initial_KE1 = (mass1 * velocity1 * velocity1) / 2;
  var initial_KE2 = (mass2 * velocity2 * velocity2) / 2;

  var final_KE1 = (mass1 * finalVel1 * finalVel1) / 2;
  var final_KE2 = (mass2 * finalVel2 * finalVel2) / 2;

  var total_initial_KE = initial_KE1 + initial_KE2;
  var total_final_KE = final_KE1 + final_KE2;

  document.getElementById("total_Initial_KE").innerHTML =
    total_initial_KE.toFixed(3);
  document.getElementById("total_Final_KE").innerHTML =
    total_final_KE.toFixed(3);

  // Store final velocities
  document.getElementById("FinalVelocity_V1").innerHTML = finalVel1.toFixed(3);
  document.getElementById("FinalVelocity_V2").innerHTML = finalVel2.toFixed(3);

  var per_diff_KE =
    (Math.abs(total_final_KE - total_initial_KE) /
      ((Math.abs(total_final_KE) + Math.abs(total_initial_KE)) / 2)) *
    100;
  document.getElementById("percentage_diff_KE").innerHTML = isNaN(per_diff_KE)
    ? "0"
    : per_diff_KE.toFixed(3);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSetup();

  animationId = requestAnimationFrame(drawMotion);
}

function play() {
  let checkbox = document.getElementById("lockCheckbox");
  if (!checkbox.checked) {
    alert("Lock the input parameters");
  } else {
    if (animationId === null) {
      drawMotion();
    }
  }
}

function reset() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  x1 = 60;
  x2 = 400;
  redGliderMoving = true;
  blueGliderMoving = false;
  redGliderMovingBackward = false;
  blueGliderMovingBackward = false;
  redGliderMovingForward = false;

  // Enable all sliders and radio buttons
  slider_mass1.disabled = false;
  slider_mass2.disabled = false;
  slider_velocity1.disabled = false;
  slider_length1.disabled = false;
  slider_length2.disabled = false;
  radioInput.disabled = false;
  inelasticRadio.disabled = false;

  // Uncheck the lock checkbox
  uncheckCheckbox("lockCheckbox");

  // Clear only the result/output fields, NOT the input parameters
  const resultIds = [
    "FinalVelocity_V1",
    "FinalVelocity_V2",
    "InitialMomentum_V1",
    "FinalMomentum_V1",
    "FinalMomentum_V2",
    "percentage_diff_momentum",
    "Coef_Of_Res",
    "total_Initial_KE",
    "total_Final_KE",
    "percentage_diff_KE",
    "Theory_FinalVelocity_V1",
    "Theory_FinalVelocity_V2",
    "Theory_InitialMomentum_V1",
    "Theory_FinalMomentum_V1",
    "Theory_FinalMomentum_V2",
    "Theory_percentage_diff_momentum",
    "Theory_Coef_Of_Res",
    "Theory_total_Initial_KE",
    "Theory_total_Final_KE",
    "Theory_percentage_diff_KE",
  ];

  resultIds.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = "0";
    }
  });

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSetup();
}

function drawSetup() {
  //photogates
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.fillRect(225, 130, 7, 250);
  ctx.fillRect(565, 130, 7, 250);
  ctx.fillStyle = "grey";
  ctx.fillRect(540, 380, 60, 10);
  ctx.fillRect(200, 380, 60, 10);
  ctx.fillStyle = "yellow";
  ctx.fillRect(222, 135, 14, 50);
  ctx.fillRect(562, 135, 14, 50);
  ctx.strokeStyle = "black";
  ctx.strokeRect(222, 135, 14, 50);
  ctx.strokeRect(562, 135, 14, 50);

  //air track
  ctx.beginPath();
  ctx.moveTo(50, 200);
  ctx.lineTo(750, 200);
  ctx.lineTo(750, 300);
  ctx.lineTo(50, 300);
  ctx.fillStyle = "#373737";
  ctx.fill();
  ctx.fillStyle = "grey";

  ctx.fillRect(50, 200, 700, 5);
  ctx.fillRect(50, 250, 700, 5);
  ctx.fillRect(50, 300, 700, 5);
  ctx.fillStyle = "black";
  ctx.fillRect(50, 170, 5, 30);
  ctx.fillRect(745, 170, 5, 30);
  ctx.fillStyle = "grey";
  ctx.fillRect(695, 400, 60, 15);
  ctx.fillRect(50, 400, 60, 15);

  ctx.fillStyle = "black";
  ctx.fillRect(75, 305, 10, 95);
  ctx.fillRect(720, 305, 10, 95);
  for (var i = 0; i <= 16; i++) {
    ctx.fillStyle = "black";
    ctx.fillRect(65 + i * 40, 280, 4, 4);
    ctx.fillRect(85 + i * 40, 265, 4, 4);
  }
  ctx.fillStyle = "#DB5F16";
  ctx.fillRect(15, 280, 35, 10);
  ctx.fillRect(15, 280, 10, 45);
  ctx.fillStyle = "#404040";
  ctx.fillRect(0, 325, 40, 60);

  ctx.fillStyle = "red";
  ctx.fillRect(10, 385, 2, 45);
  ctx.fillRect(1, 428, 10, 2);
  ctx.fillStyle = "black";
  ctx.fillRect(20, 385, 2, 56);
  ctx.fillRect(1, 439, 20, 2);

  drawScale();
  drawGliders();

  ctx.fillStyle = "white";
  ctx.font = "13px Arial";
  ctx.fillText("PUMP", 20, 358);
}

function drawGliders() {
  var gradient1 = ctx.createLinearGradient(x1, y1 - 30, x1, y1);
  gradient1.addColorStop(0, "red");
  gradient1.addColorStop(0.5, "red");
  gradient1.addColorStop(1, "#360d17");

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 + 7, y1 - 7);
  ctx.lineTo(x1 + 7, y1 - 30);
  ctx.lineTo(x1 + 2, y1 - 30);
  ctx.lineTo(x1 + 2, y1 - 37);
  ctx.lineTo(x1 + 48, y1 - 37);
  ctx.lineTo(x1 + 48, y1 - 30);
  ctx.lineTo(x1 + 43, y1 - 30);
  ctx.lineTo(x1 + 43, y1 - 7);
  ctx.lineTo(x1 + 50, y1);
  ctx.closePath();
  ctx.fillStyle = gradient1;
  ctx.fill();

  var gradient2 = ctx.createLinearGradient(x2, y1 - 30, x2, y1);
  gradient2.addColorStop(0, "#3aa1e8");
  gradient2.addColorStop(0.5, "#3d91d6");
  gradient2.addColorStop(1, "#074d94");
  ctx.beginPath();
  ctx.moveTo(x2, y1);
  ctx.lineTo(x2 + 7, y1 - 7);
  ctx.lineTo(x2 + 7, y1 - 30);
  ctx.lineTo(x2 + 2, y1 - 30);
  ctx.lineTo(x2 + 2, y1 - 37);
  ctx.lineTo(x2 + 48, y1 - 37);
  ctx.lineTo(x2 + 48, y1 - 30);
  ctx.lineTo(x2 + 43, y1 - 30);
  ctx.lineTo(x2 + 43, y1 - 7);
  ctx.lineTo(x2 + 50, y1);
  ctx.closePath();
  ctx.fillStyle = gradient2;
  ctx.fill();
}

function drawScale() {
  const minValue = 0;
  const maxValue = 100;
  const scaleWidth = 680;
  const scaleX = 60;
  const scaleY = 200;
  const numIntervals = 10;

  const intervalWidth = scaleWidth / numIntervals;

  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.font = "12px Arial";

  for (let i = 0; i <= numIntervals; i++) {
    const intervalValue = minValue + ((maxValue - minValue) / numIntervals) * i;
    const intervalX = scaleX + intervalWidth * i;
    const intervalY = scaleY;

    ctx.fillRect(intervalX, intervalY, 1, 20);
    ctx.fillText(intervalValue, intervalX, intervalY + 35);
  }
}

// Initialize the canvas on page load
drawSetup();
drawScale();
