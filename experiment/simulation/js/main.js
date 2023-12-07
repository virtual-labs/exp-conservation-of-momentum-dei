var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
document.getElementById("playButton").addEventListener("click", play);
document.getElementById("resetButton").addEventListener("click", reset);

const slider_mass1 = document.getElementById('currentmass1');
const slider_mass2 = document.getElementById('currentmass2');
const slider_velocity1 = document.getElementById('currentvelocity1');
const slider_length1 = document.getElementById('currentlength1');
const slider_length2 = document.getElementById('currentlength2');

// const radioInput = document.getElementById('elastic');

function showMass1(newmass) {
  //get the element
  var display = document.getElementById("initialMassValue1");
  //show the amount
  display.innerHTML = newmass;
  mass1 = document.getElementById("mass1");
  mass1.innerHTML = newmass;
  mass1 = Number(newmass);

  reset();
}
function showMass2(newmass) {
  //get the element
  var display = document.getElementById("initialMassValue2");
  //show the amount
  display.innerHTML = newmass;
  mass2 = document.getElementById("mass2");
  mass2.innerHTML = newmass;
  mass2 = Number(newmass);
  reset();
}

function showVelocity1(newvelocity) {
  //get the element
  var display = document.getElementById("initialVelocityValue1");
  //show the amount
  display.innerHTML = newvelocity;
  velocity1 = document.getElementById("velocity1");
  velocity1.innerHTML = newvelocity;
  velocity1 = Number(newvelocity);
  reset();
}

function showlength1(newlength) {
  //get the element
  var display = document.getElementById("initialLengthValue1");
  //show the amount
  display.innerHTML = newlength;
  length1 = document.getElementById("length1");
  length1.innerHTML = newlength;
  length1 = Number(newlength);
  reset();
}

function showlength2(newlength) {
  //get the element
  var display = document.getElementById("initialLengthValue2");
  //show the amount
  display.innerHTML = newlength;
  length2 = document.getElementById("length2");
  length2.innerHTML = newlength;
  length2 = Number(newlength);
  reset();
} 


var velocity1 = 0.1;
var velocity2 = 0;

var mass1 = 0.2;
var mass2 = 0.2;
var length1 = 5;
var length2 = 5;

var min = 0.85;
var max = 0.95;
var g_elastic = ((Math.random() * (max - min + 0.01)) + min).toFixed(2);
// var g_inelastic =((Math.random() * (0.85 - 0.60 +0.01) )+ 0.60).toFixed(2) ;
var g_inelastic = 0.61;
// var h = 0.96;
var h =((Math.random() * (0.98 -0.91 +0.01) )+ 0.91).toFixed(2) ;
// console.log("g_elastic: " + g_elastic);
// console.log("h: " + h);

var x1 = 60;
var x2 = 400;
var y1 = 215;

var animationId = null;    // Variable to store the animation request ID

var redCubeMoving = true;
var blueCubeMoving = false;
var redGliderMovingBackward = false;
var blueGliderMovingBackward = false;
var redGliderMovingForward = false;


function calculateFinalV2(v1, h, m1, m2, g) {     // final velocity of blue glider
  const sqrtTerm = Math.sqrt(1 - (((m1 / m2) + (1 / m2)) * (1 - (Math.pow(h, 2) / g))));

  const v2 = ((v1 / h) * (1 + sqrtTerm)) / (1 + (1 / m1));
  // console.log("final v2 :  "+v2);
  document.getElementById("FinalVelocity_V1").innerHTML = v2.toFixed(3);           //value shown in table
  return v2;
}

function calculateFinalV1(v1, h, m1, m2, v2) {        // final velocity of red glider
  console.log("h: " +h + "    m1:  " + m1+ "    m2:  " + m2 + "    v1:   " +v1 +"   v2:  "+ v2 + "  ")
  var V1 = (1 / m1) * ((m1 * v1 / h) - (m2 * v2));
  // console.log("final v1 :  "+V1);
  document.getElementById("FinalVelocity_V2").innerHTML = V1.toFixed(3);     //value shown in table

  return V1;
}

const radioInput = document.getElementById('elastic');
const checkbox = document.querySelector('#lockCheckbox');
function lock(){
  
  if (radioInput.checked && radioInput.value === 'Elastic') {
    document.getElementById("collision_type").innerHTML = "Elastic" ;
  } else {
    document.getElementById("collision_type").innerHTML = "Inelastic" ;
  }

  checkbox.addEventListener('change', function() {
    if (this.checked) {
      slider_mass1.disabled = true;
      slider_mass2.disabled =true ;
      slider_velocity1.disabled = true;
      slider_length1.disabled = true;
      slider_length2.disabled = true;
      elastic.disabled = true;
      inelastic.disabled = true;
      
      
    } else {
      slider_mass1.disabled = false;
      slider_mass2.disabled =false ;
      slider_velocity1.disabled = false;
      slider_length1.disabled = false;
      slider_length2.disabled = false;
      elastic.disabled = false;
      inelastic.disabled = false;
      
      reset();
    }   
  });
}

function uncheckCheckbox(checkboxId) {
  const checkbox = document.getElementById(checkboxId);
  checkbox.checked = false;

}

function drawMotion() {
  

  var finalVel2 = calculateFinalV2(velocity1, h, mass1, mass1, g_elastic);     //final velocity of glider 2
  var finalVel1 = calculateFinalV1(velocity1, h, mass1, mass2, finalVel2);    //final velocity of glider 1
  // console.log("final Velocity of red glide: " + finalVel1);
  // console.log("final Velocity of blue glide: " + finalVel2);
  // console.log("velocity1: " + velocity1);
  // console.log("mass1: " + mass1 + "   mass2: " + mass2);

  //initial momentum
  var iniMomentum_Glider1 = mass1*velocity1;
  var iniMomentum_Glider2 = mass2*velocity2;
  
  // final momentum
   
  var finalMomentum_Glider1 = mass1*finalVel1;
  var finalMomentum_Glider2 = mass2*finalVel2;

  document.getElementById("InitialMomentum_V1").innerHTML = iniMomentum_Glider1.toFixed(3);     //values shown in table
  document.getElementById("FinalalMomentum_V1").innerHTML = finalMomentum_Glider1.toFixed(3); 
  document.getElementById("FinalalMomentum_V2").innerHTML = finalMomentum_Glider2.toFixed(3);  

  // Coefficient of Restitution
  var e = -((finalVel1 - finalVel2)/ (velocity1 - velocity2));           
  document.getElementById("Coef_Of_Res").innerHTML = e.toFixed(3);     //values shown in table

//percent diffrence momentum 
  var p_f = iniMomentum_Glider1 + iniMomentum_Glider2;               //total final momentum 
  var p_i = finalMomentum_Glider1 + finalMomentum_Glider2;             //total initial momentum 
  var per_diff = ((Math.abs(p_f - p_i))/((p_f + p_i)/2))*100;                 //percent diffrence momentum 
  document.getElementById("percentage_diff_momentum").innerHTML = per_diff.toFixed(3); 
  
 // Kinetic Energy
 var initial_KE1 =( mass1*velocity1*velocity1)/2;      // initial kinetic energy for glider 1
 var initial_KE2 = (mass2*velocity2*velocity2)/2;       // initial kinetic energy for glider 2

 var final_KE1 =( mass1*velocity1*finalVel1)/2;      // final kinetic energy for glider 1
 var final_KE2 = (mass2*velocity2*finalVel2)/2;       // final kinetic energy for glider 2



  var total_initial_KE = initial_KE1 + initial_KE2;   //Total Initial Kinetic Energy KE (J)
  var total_final_KE = final_KE1 + final_KE2;     //Total Final Kinetic Energy KE (J)

  document.getElementById("total_Initial_KE").innerHTML = total_initial_KE.toFixed(3); 
  document.getElementById("total_Final_KE").innerHTML = total_final_KE.toFixed(3);  

  var per_diff_KE = ((Math.abs(total_final_KE - total_initial_KE)) / ((total_final_KE + total_initial_KE)/2))*100;   //Percentage Difference in Kinetic Energy
  document.getElementById("percentage_diff_KE").innerHTML = per_diff_KE.toFixed(3);  
                                             
  
  if (redCubeMoving) {
    x1 += velocity1*10; 
    console.log("x1      "+x1 +"  " )
    if (x1 >= canvas.width - 460) {
        redCubeMoving = false; 
        blueCubeMoving = true;
      redGliderMovingBackward = true;
    }
    if (x2 >= canvas.width - 105) {
      x2 -=finalVel2*10;

    }
  }
  if (blueCubeMoving) {
    x2 += finalVel2*10; 
    if (x2 >= canvas.width - 115) {
        blueCubeMoving = false; 
        blueGliderMovingBackward = true;
    }
  }
  
  if (blueGliderMovingBackward) {
    x2 -=finalVel2*10;
    if (x2 <= canvas.width - 225) {
      blueGliderMovingBackward = false;

    }
  }
  if (redGliderMovingBackward) {
    x1 -= finalVel1*10; 
    if (x1 <= 55) {
      redGliderMovingBackward = false;
      redGliderMovingForward =true; 
    }
  }
  if (redGliderMovingForward) {
    x1 +=finalVel1*10; 
      if (x1 >= 165) {
        redGliderMovingForward = false; 
    }
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSetup();

  // Request the next frame for animation
  animationId = requestAnimationFrame(drawMotion);
}

function play() {
  let checkbox = document.getElementById("lockCheckbox");
  if (!checkbox.checked) {
    alert("Lock the input parameters");
  }
  else{
    if (animationId === null) {
      drawMotion();
    }
  }
 
}

function reset() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
    x1 = 60;
    x2 = 400;
    redCubeMoving = true;
    blueCubeMoving = false;
    finalVel2 = 0;
    finalVel1 = 0;
    const allSpans = document.getElementsByTagName('span');

    slider_mass1.disabled = false;
    slider_mass2.disabled =false ;
    slider_velocity1.disabled = false;
    slider_length1.disabled = false;
    slider_length2.disabled = false;
    elastic.disabled = false;
    inelastic.disabled = false;

  uncheckCheckbox('lockCheckbox');


// Loop through each <span> element and set its text content to "0"
for (let i = 6; i < allSpans.length; i++) {
    allSpans[i].textContent = '0';
}
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSetup();
  }
}

function drawSetup() {

  //photogates
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.fillRect(225, 130, 7, 250);  // stand
  ctx.fillRect(565, 130, 7, 250);
  ctx.fillStyle = "grey";
  ctx.fillRect(540, 380, 60, 10);     //bricks
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
  ctx.fillRect(695, 400, 60, 15);     //bricks
  ctx.fillRect(50, 400, 60, 15);

  ctx.fillStyle = "black";
  ctx.fillRect(75, 305, 10, 95);
  ctx.fillRect(720, 305, 10, 95);
  for (var i = 0; i <= 16; i++) {
    ctx.fillStyle = "black";
    ctx.fillRect(65 + i * 40, 280, 4, 4);
    ctx.fillRect(85 + i * 40, 265, 4, 4);
  }
  ctx.fillStyle = "#DB5F16";       // pump
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
  
  var gradient1 = ctx.createLinearGradient(x1, y1-30, x1, y1);
  gradient1.addColorStop(0, 'red'); 
  gradient1.addColorStop(0.5, 'red');  
  gradient1.addColorStop(1, '#360d17');    

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1+7,y1-7);
  ctx.lineTo(x1+7,y1-30);
  ctx.lineTo(x1+2,y1-30);
  ctx.lineTo(x1+2,y1-37);
  ctx.lineTo(x1+48,y1-37);
  ctx.lineTo(x1+48,y1-30);
  ctx.lineTo(x1+43,y1-30);
  ctx.lineTo(x1+43,y1-7);
  ctx.lineTo(x1+50,y1);
  ctx.closePath();
  ctx.fillStyle = gradient1; // Set the fill color
  ctx.fill();

  var gradient2 = ctx.createLinearGradient(x2, y1-30, x2, y1);
  gradient2.addColorStop(0, '#3aa1e8'); 
  gradient2.addColorStop(0.5, '#3d91d6');  
  gradient2.addColorStop(1, '#074d94');    
  ctx.beginPath();
  ctx.moveTo(x2, y1);
  ctx.lineTo(x2+7,y1-7);
  ctx.lineTo(x2+7,y1-30);
  ctx.lineTo(x2+2,y1-30);
  ctx.lineTo(x2+2,y1-37);
  ctx.lineTo(x2+48,y1-37);
  ctx.lineTo(x2+48,y1-30);
  ctx.lineTo(x2+43,y1-30);
  ctx.lineTo(x2+43,y1-7);
  ctx.lineTo(x2+50,y1);
  ctx.closePath();
  ctx.fillStyle = gradient2;             // blue glider
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

    // Draw scale mm lines
    ctx.fillRect(intervalX, intervalY, 1, 20);

    // Draw labels
    ctx.fillText(intervalValue, intervalX, intervalY + 35);
  }
}

drawSetup();
drawScale();


