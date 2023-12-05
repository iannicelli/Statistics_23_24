
"use strict";

class random_function {

    static normaleStandardSaved = undefined;
  
    static gaussian(Mean, StdDev) {     //Marsaglia polar method
  
      if (this.normaleStandardSaved) {
        const normale = Mean + StdDev * this.normaleStandardSaved;
        this.normaleStandardSaved = undefined;
        return normale;
  
      } else {
  
        let u, v, s = 0;
  
        while (s >= 1 || s === 0) {
          u = 2 * Math.random() - 1;
          v = 2 * Math.random() - 1;
          s = u * u + v * v;
        }
  
        s = Math.sqrt(-2 * Math.log(s) / s);
        this.normaleStandardSaved = v * s;
        return Mean + StdDev * u * s;
  
      }
  
    }
  }

  class rectangular {

    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
    
    left() {
        return this.x
      }
    
      top() {
        return this.y
      }
    
      right() {
        return this.x + this.width
      }
    
      bottom() {
        return this.y + this.height
      }
    
      aspectRatio() {
        return this.width / this.height || 1
        //converto Nan a 1
      }
    draw_rectangular(ctx, Colore, Spessore, lineDash) {
  
      ctx.save();
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.strokeStyle = Colore;
      ctx.lineWidth = Spessore;
      ctx.setLineDash(lineDash);
      ctx.stroke();
      ctx.restore()
  
    }
  
  
  }
  

//enum per scegliere il tipo di grandezza da rappresentare
const ChosenVariate = Object.freeze({
    BROWNIAN_MOTION_STANDARD: Symbol("brownianMotion_Standard"),
    BROWNIAN_MOTION_GENERAL: Symbol("brownianMotion"),
    BROWNIAN_MOTION_GEO: Symbol("brownianMotion_Geometric"),
    ORNSTEIN_UHLENBECK: Symbol("ornsteinUhlenbeck")
});

const buttonRecompute_1 = document.getElementById("buttonRecompute_1");
const buttonRecompute_2 = document.getElementById("buttonRecompute_2");
const buttonRecompute_3 = document.getElementById("buttonRecompute_3");
const buttonRecompute_4 = document.getElementById("buttonRecompute_4");
const inputMu = document.getElementById("inputMu");
const inputSigma = document.getElementById("inputSigma");
const inputLambda = document.getElementById("inputLambda");
const inputTimes = document.getElementById("inputTimes");
const inputPaths = document.getElementById("inputPaths");
const inputTheta = document.getElementById("inputTheta");




const check_BROWNIAN_MOTION_STANDARD = document.getElementById("check_BROWNIAN_MOTION_STANDARD");
const check_BROWNIAN_MOTION_GEN = document.getElementById("check_BROWNIAN_MOTION_GEN");
const check_BROWNIAN_MOTION_GEO = document.getElementById("check_BROWNIAN_MOTION_GEO");
const check_ORNSTEIN_UHLENBECK = document.getElementById("check_ORNSTEIN_UHLENBECK");

const Graphic = document.getElementById("Graphic");
const ctx = Graphic.getContext("2d");

let mu, sigma, lambda, n, theta;
let numberOfSamplePaths;
let allPaths;
let myRandomJump;
let myVariate;
let myProcessValueType;
let myProcessValueDescription;
let myVariate_MinView;
let myVariate_MaxView;
let myProcessValue_Range;
let intervalSize;
let NumberOfClasses;
let x_Origin;
let y_Origin;
let timeForHistogram_t;
let timeForHistogram_n;
let avgAtLastTime;              
let ssAtLastTime;               
let intervals_t;                
let intervals_n;                
let currentPathNumber;
let mul = false;

const rectChart = new rectangular(20, 30, Graphic.width - 200, Graphic.height - 30 - 40);

buttonRecompute_1.onclick = mainTask_1;
buttonRecompute_2.onclick = mainTask_2;
buttonRecompute_3.onclick = mainTask_3;
buttonRecompute_4.onclick = mainTask_4;



function BROWNIAN_MOTION_STANDARD() {

    mu = Number(inputMu.value);
    sigma = Number(inputSigma.value);
    lambda = Number(inputLambda.value);
    theta = Number(inputTheta.value);
    n = Math.round(Number(inputTimes.value));  
    numberOfSamplePaths = Number(inputPaths.value);
    NumberOfClasses = Math.max(100, numberOfSamplePaths / 60);

    timeForHistogram_t = Math.round(n / 2);
    timeForHistogram_n = n;

    const sigmaMultipleForRange = 4;

    const dt = 1 / n;
    const sigma_sqrt_dt = sigma * Math.sqrt(dt);          //varianza proporzionale al tempo
    const sqrt_dt = Math.sqrt(dt);              //caso di sigma=1


        myProcessValueDescription = 'Standard BM ≈ Σ N(0, dt), where dt=1/n, mean=0, var=1 at last time n, taken as 1';
        myProcessValueType = ChosenVariate.BROWNIAN_MOTION_STANDARD;
        myVariate_MinView = -sigmaMultipleForRange;
        myVariate_MaxView = sigmaMultipleForRange;
        myRandomJump = () => random_function.gaussian(0, sqrt_dt);
        myVariate = (sumOfJumps) => sumOfJumps;
        mul = false;

    myProcessValue_Range = myVariate_MaxView - myVariate_MinView;
    intervalSize = myProcessValue_Range / NumberOfClasses;

    [x_Origin, y_Origin] = for2d.transformXYToViewport([0, 0], 0, n, myVariate_MinView, myProcessValue_Range, rectChart);

}

function BROWNIAN_MOTION_GEN() {

  mu = Number(inputMu.value);
  sigma = Number(inputSigma.value);
  lambda = Number(inputLambda.value);
  theta = Number(inputTheta.value);
  n = Math.round(Number(inputTimes.value));  
  numberOfSamplePaths = Number(inputPaths.value);
  NumberOfClasses = Math.max(100, numberOfSamplePaths / 60);

  timeForHistogram_t = Math.round(n / 2);
  timeForHistogram_n = n;

  const sigmaMultipleForRange = 4;

  const dt = 1 / n;
  const sigma_sqrt_dt = sigma * Math.sqrt(dt);          //varianza proporzionale al tempo
  const sqrt_dt = Math.sqrt(dt);              //caso di sigma=1


      myProcessValueDescription = "general (arithmetic) Brownian motion ≈ Σ N(μ dt, σ² dt), where dt=1/n, mean=μ, var=σ² at last time n, taken as 1";
      myProcessValueType = ChosenVariate.BROWNIAN_MOTION_GENERAL;
      myVariate_MinView = Math.min(0, mu - sigmaMultipleForRange * sigma);
      myVariate_MaxView = Math.max(0, mu + sigmaMultipleForRange * sigma);
      myRandomJump = () => random_function.gaussian(mu * dt, sigma_sqrt_dt);
      myVariate = (sumOfJumps) => sumOfJumps;
      mul = false;

  myProcessValue_Range = myVariate_MaxView - myVariate_MinView;
  intervalSize = myProcessValue_Range / NumberOfClasses;

  [x_Origin, y_Origin] = for2d.transformXYToViewport([0, 0], 0, n, myVariate_MinView, myProcessValue_Range, rectChart);

}

function BROWNIAN_MOTION_GEO() {

  mu = Number(inputMu.value);
  sigma = Number(inputSigma.value);
  lambda = Number(inputLambda.value);
  theta = Number(inputTheta.value);
  n = Math.round(Number(inputTimes.value));  
  numberOfSamplePaths = Number(inputPaths.value);
  NumberOfClasses = Math.max(100, numberOfSamplePaths / 60);

  timeForHistogram_t = Math.round(n / 2);
  timeForHistogram_n = n;

  const sigmaMultipleForRange = 4;

  const dt = 1 / n;
  const sigma_sqrt_dt = sigma * Math.sqrt(dt);          //varianza proporzionale al tempo
  const sqrt_dt = Math.sqrt(dt);              //caso di sigma=1


      myProcessValueDescription = "Geometric Brownian motion ≈ S_t = S_0 exp((μ - σ²/2)dt + σ W_t), where W_t is a standard BM))";
      myProcessValueType = ChosenVariate.BROWNIAN_MOTION_GEO;
      myVariate_MinView = 0;
      myVariate_MaxView = Math.exp((mu + 3 * sigma) * n * dt);
      myRandomJump = () => Math.exp(random_function.gaussian((mu - sigma * sigma /2) * dt, sigma_sqrt_dt));
      myVariate = (productOfJumps) => productOfJumps;
      mul = true;

  myProcessValue_Range = myVariate_MaxView - myVariate_MinView;
  intervalSize = myProcessValue_Range / NumberOfClasses;

  [x_Origin, y_Origin] = for2d.transformXYToViewport([0, 0], 0, n, myVariate_MinView, myProcessValue_Range, rectChart);

}

function ORNSTEIN_UHLENBECK() {

  mu = Number(inputMu.value);
  sigma = Number(inputSigma.value);
  lambda = Number(inputLambda.value);
  theta = Number(inputTheta.value);
  n = Math.round(Number(inputTimes.value));  
  numberOfSamplePaths = Number(inputPaths.value);
  NumberOfClasses = Math.max(100, numberOfSamplePaths / 60);

  timeForHistogram_t = Math.round(n / 2);
  timeForHistogram_n = n;

  const sigmaMultipleForRange = 4;

  const dt = 1 / n;
  const sigma_sqrt_dt = sigma * Math.sqrt(dt);          //varianza proporzionale al tempo
  const sqrt_dt = Math.sqrt(dt);              //caso di sigma=1


      myProcessValueDescription = "Ornstein-Uhlenbeck process ≈ X_t = θ(μ - X_t)dt + σ dW_t, where W_t is a standard BM))";
      myProcessValueType = ChosenVariate.ORNSTEIN_UHLENBECK;
      myVariate_MinView = mu - sigmaMultipleForRange * sigma;
      myVariate_MaxView = mu + sigmaMultipleForRange * sigma;
      myRandomJump = (currentX) => random_function.gaussian(theta * (mu - currentX) * dt, sigma_sqrt_dt);
      myVariate = (sumOfJumps) => sumOfJumps;
      mul = false;

  myProcessValue_Range = myVariate_MaxView - myVariate_MinView;
  intervalSize = myProcessValue_Range / NumberOfClasses;

  [x_Origin, y_Origin] = for2d.transformXYToViewport([0, 0], 0, n, myVariate_MinView, myProcessValue_Range, rectChart);

}

function mainTask_1() {

  console.log("mainTask_1");
    BROWNIAN_MOTION_STANDARD();     
    intervals_t = [];               //intervalli per distribuzione tempo intermedio
    intervals_n = [];               //intervalli per distribuzione tempo finale
    currentPathNumber = 0;
    avgAtLastTime = 0;              //media della variata al tempo n
    ssAtLastTime = 0;               //somma quadrati della variata al tempo n
    ctx.clearRect(0, 0, Graphic.width, Graphic.height);
    allPaths = [];



        //generazione sample paths
        for (let s = 1; s <= numberOfSamplePaths; s++) {
            const newPath = createSinglePath(s);
            allPaths.push(newPath);
            ctx.lineWidth = 1;
            ctx.strokeStyle = forChart.randomColorCSS();      //forChart.randomColor();
            ctx.stroke(newPath);
        }

        sovrapponiIstogrammi();
        creaTaccheELegenda();
    

}

function mainTask_2() {

  console.log("mainTask_2");
  BROWNIAN_MOTION_GEN();     
  intervals_t = [];               //intervalli per distribuzione tempo intermedio
  intervals_n = [];               //intervalli per distribuzione tempo finale
  currentPathNumber = 0;
  avgAtLastTime = 0;              //media della variata al tempo n
  ssAtLastTime = 0;               //somma quadrati della variata al tempo n
  ctx.clearRect(0, 0, Graphic.width, Graphic.height);
  allPaths = [];



      //generazione sample paths
      for (let s = 1; s <= numberOfSamplePaths; s++) {
          const newPath = createSinglePath(s);
          allPaths.push(newPath);
          ctx.lineWidth = 1;
          ctx.strokeStyle = forChart.randomColorCSS();      //forChart.randomColor();
          ctx.stroke(newPath);
      }

      sovrapponiIstogrammi();
      creaTaccheELegenda();
  

}

function mainTask_3() {


  console.log("mainTask_3");
  BROWNIAN_MOTION_GEO();     //acquisizione nuove scelte
  intervals_t = [];               //intervalli per distribuzione tempo intermedio
  intervals_n = [];               //intervalli per distribuzione tempo finale
  currentPathNumber = 0;
  avgAtLastTime = 0;              //media della variata al tempo n
  ssAtLastTime = 0;               //somma quadrati della variata al tempo n
  ctx.clearRect(0, 0, Graphic.width, Graphic.height);
  allPaths = [];



      //generazione sample paths
      for (let s = 1; s <= numberOfSamplePaths; s++) {
          const newPath = createSinglePath(s);
          allPaths.push(newPath);
          ctx.lineWidth = 1;
          ctx.strokeStyle = forChart.randomColorCSS();      //forChart.randomColor();
          ctx.stroke(newPath);
      }

      sovrapponiIstogrammi();
      creaTaccheELegenda();
  

}

function mainTask_4() {

  console.log("mainTask_4");
  ORNSTEIN_UHLENBECK();     //acquisizione nuove scelte
  intervals_t = [];               //intervalli per distribuzione tempo intermedio
  intervals_n = [];               //intervalli per distribuzione tempo finale
  currentPathNumber = 0;
  avgAtLastTime = 0;              //media della variata al tempo n
  ssAtLastTime = 0;               //somma quadrati della variata al tempo n
  ctx.clearRect(0, 0, Graphic.width, Graphic.height);
  allPaths = [];



      //generazione sample paths
      for (let s = 1; s <= numberOfSamplePaths; s++) {
          const newPath = createSinglePath(s);
          allPaths.push(newPath);
          ctx.lineWidth = 1;
          ctx.strokeStyle = forChart.randomColorCSS();      //forChart.randomColor();
          ctx.stroke(newPath);
      }

      sovrapponiIstogrammi();
      creaTaccheELegenda();
  

}

function sovrapponiIstogrammi() {

    //rettangolo contenitore istogramma
    const rettangoloIstogramma_t = new rectangular(for2d.transformX(timeForHistogram_t, 0, n, rectChart.x, rectChart.width), rectChart.y, 150, rectChart.height);
    const rettangoloIstogramma_n = new rectangular(for2d.transformX(timeForHistogram_n, 0, n, rectChart.x, rectChart.width), rectChart.y, 150, rectChart.height);


    //istogrammi
    forChart.verticalHistoFromIntervals(ctx, intervals_t, myVariate_MinView, myVariate_MaxView - myVariate_MinView, rettangoloIstogramma_t, "Green", 1, "Green");
    forChart.verticalHistoFromIntervals(ctx, intervals_n, myVariate_MinView, myVariate_MaxView - myVariate_MinView, rettangoloIstogramma_n, "Green", 1, "Green");

}

function createSinglePath(s) {

    currentPathNumber = s;
    const myPath = new Path2D();

    let sumOfJumps = mul ? 1 : 0;
    let previousY_Variate = y_Origin;

    myPath.moveTo(x_Origin, y_Origin);   //visualmente facciamo partire la path dall'origine

    for (let t = 1; t <= n; t++) {

        sumOfJumps = mul ? sumOfJumps * myRandomJump(sumOfJumps) : sumOfJumps + myRandomJump(sumOfJumps);

        let myProcessValue = myVariate(sumOfJumps, t);

        //raccolta valori per istogramma
        if (t === timeForHistogram_t) {
            forDistribution.allocateValueInIntervals(myProcessValue, intervals_t, intervalSize);
        } else if (t === timeForHistogram_n) {
            forDistribution.allocateValueInIntervals(myProcessValue, intervals_n, intervalSize);
            [avgAtLastTime, ssAtLastTime] = forDistribution.UpdateMeanAndSS(myProcessValue, s, [avgAtLastTime, ssAtLastTime]);
        }

        const ascissa_t = for2d.transformX(t / n, 0, 1, rectChart.x, rectChart.width);

        //const ascissa_t = for2d.transformX(t, 0, n, rectChart.x, rectChart.width);
        const ordinata = for2d.transformY(myProcessValue, myVariate_MinView, myProcessValue_Range, rectChart.y, rectChart.height);

        //scalino mantenendo quota precedente
        myPath.lineTo(ascissa_t, previousY_Variate);
        //salva quota per prossimo scalino
        previousY_Variate = ordinata;

        myPath.lineTo(ascissa_t, ordinata);
    }

    return myPath;

}

function creaTaccheELegenda() {

    //rettangolo simulazione
    rectChart.draw_rectangular(ctx, "maroon", 2, []);

    //label riferimenti numerici range, media, sigma della variata

    //tacche tempi/trials e tempi







    // Draw horizontal grid lines
    ctx.beginPath();
    ctx.strokeStyle = "lightgray";

    for (let v = myVariate_MinView; v <= myVariate_MaxView; v += myProcessValue_Range / 60) {
        let ordinata = for2d.transformY(v, myVariate_MinView, myProcessValue_Range, rectChart.y, rectChart.height);
        ctx.moveTo(rectChart.left(), ordinata);
        ctx.lineTo(rectChart.right(), ordinata);
    }
    ctx.stroke();

    // Draw vertical grid lines
    ctx.beginPath();
    ctx.strokeStyle = "lightgray";
    ctx.setLineDash([5, 3]);
    

    ctx.stroke();

    // Reset line dash and color
    ctx.setLineDash([]);
    ctx.strokeStyle = "black";
 















        ctx.fillStyle = "black";

        for (let t = 0; t <= 1; t += 0.1) {
            let ascissa_t = for2d.transformX(t, 0, 1, rectChart.x, rectChart.width);
            ctx.fillText(t.toFixed(1).toString(), ascissa_t - 5, rectChart.bottom() + 15);
        }


    ctx.stroke();

}
