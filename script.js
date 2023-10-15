// Get a reference to the canvas element and its context
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

// Function to draw a line
function drawLine() {
    context.beginPath();
    context.moveTo(50, 50);
    context.lineTo(200, 50);
    context.strokeStyle = "black";
    context.stroke();
}

// Function to draw a point
function drawPoint() {
    context.beginPath();
    context.arc(100, 100, 3, 0, 2 * Math.PI, false);
    context.fillStyle = "red";
    context.fill();
}

// Function to draw a circle
function drawCircle() {
    context.beginPath();
    context.arc(150, 150, 50, 0, 2 * Math.PI, false);
    context.strokeStyle = "blue";
    context.stroke();
}

// Function to draw a rectangle
function drawRectangle() {
    context.beginPath();
    context.rect(50, 200, 150, 100);
    context.strokeStyle = "green";
    context.stroke();
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// Add event listeners to the buttons
document.getElementById("lineButton").addEventListener("click", drawLine);
document.getElementById("pointButton").addEventListener("click", drawPoint);
document.getElementById("circleButton").addEventListener("click", drawCircle);
document.getElementById("rectangleButton").addEventListener("click", drawRectangle);
document.getElementById("resetButton").addEventListener("click", clearCanvas);

// Aggiungi un gestore di eventi per il pulsante "Mostra Codice"
document.getElementById("showCodeButton").addEventListener("click", function() {

    var codeURL = 'URL_DEL_TUO_CODICE';
    
    // Apri l'URL in una nuova scheda o finestra del browser
    window.open(codeURL, '_blank');
});