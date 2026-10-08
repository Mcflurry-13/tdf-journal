// AI Ceramic Pattern Studio
// Show hand landmarks only; face and body remain internal tracking context for Holistic.

const CAM_W = 640;
const CAM_H = 480;
const VIEW_W = 1360;
const VIEW_H = 664;

const CAMERA_PANEL = { x: 36, y: 150, w: 360, h: 270 };
const DRAW_PANEL = { x: 476, y: 150, w: 360, h: 270 };
const VASE_PANEL = { x: 916, y: 150, w: 360, h: 388 };

const CLEAR_BUTTON = { x: 418, y: 398, w: 92, h: 38 };
const GENERATE_BUTTON = { x: 522, y: 398, w: 168, h: 38 };
const ROTATE_BUTTON = { x: 702, y: 398, w: 76, h: 38 };

const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20],
  [5, 9], [9, 13], [13, 17], [17, 0],
];

let holisticLandmarker;
let video;
let hands = [];
let sketchLayer;
let generatedPattern = null;
let projectionCleared = false;
let generationEpoch = 0;

let modelReady = false;
let cameraReady = false;
let modelError = "";
let lastVideoTime = -1;
let lastInferenceAt = 0;

let airTip = null;
let previousAirTip = null;
let airPenActive = false;
let pinchRatio = 1;

let mouseDrawing = false;
let previousMousePoint = null;
let sketchHasInk = false;
let isGenerating = false;
let autoRotate = true;
let statusText = "Make a mark. Let your drawing shape the pattern.";
let statusTone = "neutral";

function setup() {
  createCanvas(VIEW_W, VIEW_H);
  pixelDensity(1);
  textFont("-apple-system, BlinkMacSystemFont, sans-serif");

  sketchLayer = createGraphics(DRAW_PANEL.w, DRAW_PANEL.h);
  sketchLayer.pixelDensity(1);
  resetSketchLayer();

  video = createCapture(VIDEO, { flipped: false }, () => {
    cameraReady = true;
  });
  video.size(CAM_W, CAM_H);
  video.hide();

  initializeHolistic();
  setupTurntableControls();
  setupStudioControls();
}

async function initializeHolistic() {
  try {
    const visionModule = await import(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.mjs"
    );
    const vision = await visionModule.FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    const options = {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/holistic_landmarker/holistic_landmarker/float16/1/holistic_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      minFaceDetectionConfidence: 0.4,
      minFacePresenceConfidence: 0.4,
      minPoseDetectionConfidence: 0.35,
      minPosePresenceConfidence: 0.35,
      minHandLandmarksConfidence: 0.35,
      outputFaceBlendshapes: false,
      outputPoseSegmentationMasks: false,
    };

    try {
      holisticLandmarker = await visionModule.HolisticLandmarker.createFromOptions(vision, options);
    } catch (gpuError) {
      console.warn("GPU unavailable; switching to CPU.", gpuError);
      options.baseOptions.delegate = "CPU";
      holisticLandmarker = await visionModule.HolisticLandmarker.createFromOptions(vision, options);
    }
    modelReady = true;
  } catch (error) {
    modelError = error.message || String(error);
    console.error("Tracking could not load: ", error);
  }
}

function detectHolisticFrame() {
  if (!modelReady || !cameraReady || !video || video.elt.readyState < 2) return;
  if (video.elt.currentTime === lastVideoTime || millis() - lastInferenceAt < 34) return;

  lastVideoTime = video.elt.currentTime;
  lastInferenceAt = millis();

  try {
    const result = holisticLandmarker.detectForVideo(video.elt, performance.now());
    const detectedHands = [];
    for (const landmarks of result.leftHandLandmarks || []) {
      detectedHands.push(normalizedHandToPixels(landmarks, "Left"));
    }
    for (const landmarks of result.rightHandLandmarks || []) {
      detectedHands.push(normalizedHandToPixels(landmarks, "Right"));
    }
    hands = detectedHands;
    updateVisitorPresence(result, performance.now());
  } catch (error) {
    modelError = error.message || String(error);
  }
}

function normalizedHandToPixels(landmarks, handedness) {
  return {
    handedness,
    keypoints: landmarks.map((kp) => ({
      x: kp.x * CAM_W,
      y: kp.y * CAM_H,
      z: kp.z,
    })),
  };
}

function draw() {
  background("#f2f1eb");
  detectHolisticFrame();
  updateAirDrawing();
  drawHeader();
  drawCameraPanel();
  drawSketchPanel();
  syncControls();
  drawVasePreview();
  drawFooter();
}

// Three editorial frames: 416px wide, separated by 24px of open space.
function drawHeader() {
  push();
  for (let i = 0; i < 3; i++) {
    const x = 8 + i * 440;
    fill("#faf9f4"); stroke("#292c24"); strokeWeight(1);
    rect(x + .5, 16.5, 416, 556);
    line(x, 128.5, x + 416, 128.5);
    noStroke(); fill("#75776c"); textSize(15);
    textFont("Helvetica Neue"); text("0" + (i + 1), x + 28, 47);
  }
  noStroke(); fill("#6b6e60"); textSize(15);
  text("Your presence starts the interaction.", 36, 470);
  text("Pinch to draw. Release to lift your pen.", 36, 499);
  text("Your drawing stays at the heart of the image.", 476, 470);
  text("Draw freely, then select Create pattern.", 476, 499);
  pop();
}

function drawCameraPanel() {
  const p = CAMERA_PANEL;
  drawPanelTitle("Face & gesture", "Presence and hand tracking", p.x, p.y - 65);
  noStroke();
  fill("#e6e7df");
  rect(p.x, p.y, p.w, p.h, 4);

  if (!video || !cameraReady) {
    fill("#6e6e73");
    textAlign(CENTER, CENTER);
    textSize(14);
    text(modelError ? `Tracking error: ${modelError}` : "Waiting for camera…", p.x + p.w / 2, p.y + p.h / 2);
    textAlign(LEFT, BASELINE);
    return;
  }

  push();
  translate(p.x + p.w, p.y);
  scale(-1, 1);
  image(video, 0, 0, p.w, p.h);
  pop();

  if (!modelReady && !modelError) {
    drawPill(p.x + 12, p.y + 12, 188, "Loading hand tracking…");
  }

  noFill();
  stroke("#b8baaf");
  strokeWeight(1);
  rect(p.x, p.y, p.w, p.h, 4);
  drawHandKeypoints();
  drawVisitorOverlay();
}

function drawHandKeypoints() {
  if (!hands.length) {
    // The visitor overlay provides the idle instruction.
    return;
  }

  const points = hands[0].keypoints || [];
  stroke(83, 226, 215, 178);
  strokeWeight(1.5);
  for (const [a, b] of HAND_CONNECTIONS) {
    if (!points[a] || !points[b]) continue;
    const pa = cameraPoint(points[a]);
    const pb = cameraPoint(points[b]);
    line(pa.x, pa.y, pb.x, pb.y);
  }

  for (let i = 0; i < points.length; i++) {
    const kp = cameraPoint(points[i]);
    noStroke();
    fill(i === 8 ? "#ff5d8f" : i === 4 ? "#ffd166" : "#dff8f4");
    circle(kp.x, kp.y, i === 8 ? 14 : i === 4 ? 10 : 5);
  }

  const label = airPenActive ? "Drawing" : "Pinch to draw";
  const tip = points[8] ? cameraPoint(points[8]) : null;
  if (tip) {
    noFill();
    stroke(airPenActive ? "#ffd166" : "#ff5d8f");
    strokeWeight(2);
    circle(tip.x, tip.y, airPenActive ? 28 : 22);
    noStroke();
    fill("#fff4df");
    textSize(11);
    text(label, tip.x + 16, tip.y - 10);
  }
}

function cameraPoint(kp) {
  const p = CAMERA_PANEL;
  return createVector(
    p.x + (1 - kp.x / CAM_W) * p.w,
    p.y + (kp.y / CAM_H) * p.h
  );
}

function updateAirDrawing() {
  if (!hands.length || !hands[0].keypoints || hands[0].keypoints.length < 21) {
    airTip = null;
    previousAirTip = null;
    airPenActive = false;
    pinchStartedAt = null;
    return;
  }

  const points = hands[0].keypoints;
  const indexTip = points[8];
  const thumbTip = points[4];
  const indexMcp = points[5];
  const pinkyMcp = points[17];

  const target = createVector(
    map(CAM_W - indexTip.x, 0, CAM_W, 10, DRAW_PANEL.w - 10, true),
    map(indexTip.y, 15, CAM_H - 15, 10, DRAW_PANEL.h - 10, true)
  );

  if (!airTip) airTip = target.copy();
  airTip.lerp(target, 0.36);

  const palmWidth = max(1, dist(indexMcp.x, indexMcp.y, pinkyMcp.x, pinkyMcp.y));
  pinchRatio = dist(indexTip.x, indexTip.y, thumbTip.x, thumbTip.y) / palmWidth;
  if (!airPenActive) {
    if (pinchRatio < 0.38) {
      if (pinchStartedAt === null) pinchStartedAt = performance.now();
      if (performance.now() - pinchStartedAt >= 300) airPenActive = true;
    } else pinchStartedAt = null;
  }
  if (airPenActive && pinchRatio > 0.60) { airPenActive = false; pinchStartedAt = null; }

  if (!airPenActive) {
    previousAirTip = null;
    return;
  }

  if (!previousAirTip) {
    drawInkDot(airTip);
  } else if (p5.Vector.dist(previousAirTip, airTip) < 78) {
    drawInkLine(previousAirTip, airTip);
  }
  previousAirTip = airTip.copy();
}

function drawSketchPanel() {
  const p = DRAW_PANEL;
  drawPanelTitle("Drawing preview", "Marks made with your mouse or hands", p.x, p.y - 65);
  image(sketchLayer, p.x, p.y);

  noFill();
  stroke("#b8baaf");
  strokeWeight(1);
  rect(p.x, p.y, p.w, p.h, 4);

  if (!sketchHasInk) {
    noStroke();
    fill("#6e6e73");
    textAlign(CENTER, CENTER);
    textSize(15);
    text("Draw a mark, a letter, a word.", p.x + p.w / 2, p.y + p.h / 2);
    textSize(12);
    fill("#86868b");
    text("Turn your gesture into a flowing surface pattern.", p.x + p.w / 2, p.y + p.h / 2 + 26);
    textAlign(LEFT, BASELINE);
  }

  if (airTip) {
    const x = p.x + airTip.x;
    const y = p.y + airTip.y;
    noFill();
    stroke(airPenActive ? "#d19a34" : "#ff5d8f");
    strokeWeight(2);
    circle(x, y, airPenActive ? 18 : 13);
  }
}

function drawControls() {
  drawButton(CLEAR_BUTTON, "Clear drawing", false, false);
  drawButton(GENERATE_BUTTON, isGenerating ? "Creating…" : "Create pattern", true, isGenerating);
  drawButton(ROTATE_BUTTON, autoRotate ? "Pause" : "Play", false, false);

  noStroke();
  fill("#6e6e73");
  textSize(11);
  text("Each creation uses one paid image request.", DRAW_PANEL.x, 458);
}

function drawButton(button, label, primary, disabled) {
  const hover = pointInRect(mouseX, mouseY, button);
  noStroke();
  if (disabled) fill("#d2d2d7");
  else if (primary) fill(hover ? "#0077ed" : "#0071e3");
  else fill(hover ? "#e5e5ea" : "#ebebf0");
  rect(button.x, button.y, button.w, button.h, 7);

  fill(primary && !disabled ? "#ffffff" : "#1d1d1f");
  textAlign(CENTER, CENTER);
  textStyle(primary ? BOLD : NORMAL);
  textSize(13);
  text(label, button.x + button.w / 2, button.y + button.h / 2 + 1);
  textStyle(NORMAL);
  textAlign(LEFT, BASELINE);
}

function drawVasePreview() {
  const p = VASE_PANEL;
  drawPanelTitle("Generated image", "Your pattern on the ceramic form", p.x, p.y - 65);
  if (projectionCleared) {
    noStroke(); fill(0); rect(p.x, p.y, p.w, p.h);
    return;
  }
  noStroke();
  fill("#ffffff");
  rect(p.x, p.y, p.w, p.h, 4);

  const ctx = drawingContext;
  ctx.save();
  makeVaseClipPath(ctx, p.x, p.y, p.w, p.h);
  ctx.clip();
  noStroke();
  fill("#e9ebe1");
  rect(p.x, p.y, p.w, p.h);

  if (generatedPattern) {
    drawScrollingPattern(generatedPattern, p);
  } else {
    fill("#6e6e73");
    textAlign(CENTER, CENTER);
    textSize(15);
    text("Awaiting your pattern", p.x + p.w / 2, p.y + p.h * 0.77 - 8);
    fill("#86868b");
    textSize(11);
    text("Create a pattern to begin", p.x + p.w / 2, p.y + p.h * 0.77 + 18);
    textAlign(LEFT, BASELINE);
  }
  ctx.restore();

  noFill();
  stroke("#c6c6cc");
  strokeWeight(1.4);
  drawVaseOutline(p.x, p.y, p.w, p.h);
}

function drawScrollingPattern(pattern, panel) {
  const tileHeight = panel.h;
  const tileWidth = tileHeight * (pattern.width / pattern.height);
  const travel = autoRotate ? (millis() * 0.018) % tileWidth : 0;
  const firstX = panel.x - travel - tileWidth;
  for (let x = firstX; x < panel.x + panel.w + tileWidth; x += tileWidth) {
    image(pattern, x, panel.y, tileWidth, tileHeight);
  }
}

function drawFooter() {
  noStroke();
  const statusColor = statusTone === "error" ? "#a34d3e" : statusTone === "success" ? "#536b4c" : "#59634d";
  fill(statusColor);
  circle(30, 616, 8);
  fill("#515154");
  textSize(13);
  text(statusText, 44, 621);

  fill("#6e6e73");
  textAlign(RIGHT, BASELINE);
  text("Pinch to draw · Release to lift the pen", width - 28, 621);
  textAlign(LEFT, BASELINE);
}

function drawPanelTitle(title, subtitle, x, y) {
  noStroke();
  fill("#1d1d1f");
  textStyle(NORMAL);
  textFont("Georgia");
  textSize(28);
  text(title, x, y);
  textFont("Helvetica Neue");
  fill("#6e6e73");
  textStyle(NORMAL);
  textSize(15);
  text(subtitle, x, y + 27);
}

function drawPill(x, y, w, label) {
  noStroke();
  fill(255, 255, 255, 235);
  rect(x, y, w, 32, 6);
  fill("#1d1d1f");
  textSize(11);
  text(label, x + 12, y + 21);
}

function mousePressed() {
  if (false && pointInRect(mouseX, mouseY, CLEAR_BUTTON)) {
    clearSketch();
    return;
  }
  if (false && pointInRect(mouseX, mouseY, GENERATE_BUTTON)) {
    requestAIPattern();
    return;
  }
  if (false && pointInRect(mouseX, mouseY, ROTATE_BUTTON)) {
    autoRotate = !autoRotate;
    return;
  }
  if (pointInRect(mouseX, mouseY, DRAW_PANEL)) {
    mouseDrawing = true;
    previousMousePoint = localDrawingPoint(mouseX, mouseY);
    drawInkDot(previousMousePoint);
  }
}

function mouseDragged() {
  if (!mouseDrawing) return;
  const point = localDrawingPoint(mouseX, mouseY);
  if (previousMousePoint && p5.Vector.dist(previousMousePoint, point) < 80) {
    drawInkLine(previousMousePoint, point);
  }
  previousMousePoint = point;
}

function mouseReleased() {
  mouseDrawing = false;
  previousMousePoint = null;
}

function keyPressed() {
  if (key === "c" || key === "C") clearSketch();
  if (key === "g" || key === "G") requestAIPattern();
  if (key === "r" || key === "R") autoRotate = !autoRotate;
}

function localDrawingPoint(x, y) {
  return createVector(
    constrain(x - DRAW_PANEL.x, 0, DRAW_PANEL.w),
    constrain(y - DRAW_PANEL.y, 0, DRAW_PANEL.h)
  );
}

function drawInkDot(point) {
  sketchLayer.noStroke();
  sketchLayer.fill("#27241f");
  sketchLayer.circle(point.x, point.y, 4);
  markSketchChanged();
}

function drawInkLine(from, to) {
  sketchLayer.stroke("#27241f");
  sketchLayer.strokeWeight(3);
  sketchLayer.strokeCap(ROUND);
  sketchLayer.strokeJoin(ROUND);
  sketchLayer.line(from.x, from.y, to.x, to.y);
  markSketchChanged();
}

function markSketchChanged() {
  if (interactionStage !== "drawing") {
    interactionStage = "drawing";
    if (motorPort) sendMotorCommand("S");
  }
  sketchHasInk = true;
  if (!isGenerating) {
    statusText = generatedPattern ? "Drawing updated. Ready for another interpretation." : "When you are ready, choose Create pattern.";
    statusTone = "neutral";
  }
}

function clearSketch() {
  resetSketchLayer();
  sketchHasInk = false;
  previousAirTip = null;
  previousMousePoint = null;
  statusText = "Drawing cleared.";
  statusTone = "neutral";
}

function resetSketchLayer() {
  sketchLayer.background("#ffffff");
}

async function requestAIPattern() {
  if (isGenerating) return;
  if (!sketchHasInk) {
    statusText = "Make a mark on the drawing pad first.";
    statusTone = "error";
    return;
  }

  interactionStage = "generating";
  if (motorPort) sendMotorCommand("S");
  const epoch = ++generationEpoch;
  isGenerating = true;
  statusText = "Creating your all-over ceramic pattern…";
  statusTone = "neutral";

  try {
    const response = await fetch("/api/generate-pattern", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drawing: sketchLayer.canvas.toDataURL("image/png") }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || `Creation failed (${response.status})`);

    const nextPattern = await new Promise((resolve, reject) => {
      loadImage(result.image, resolve, reject);
    });
    if (epoch !== generationEpoch) return;
    generatedPattern = nextPattern;
    publishProjection(result.image);
    projectionCleared = false;
    if (interactionStage === "generating") {
      interactionStage = "showing";
      if (autoVisitorMotion && visitorLatched && performance.now() - visitorLastSeen < 2000 && !document.hidden) runAutomaticTurn();
    }
    statusText = "Your ceramic pattern is ready.";
    statusTone = "success";
  } catch (error) {
    console.error(error);
    if (epoch !== generationEpoch) return;
    interactionStage = "drawing";
    statusText = `Creation failed：${friendlyError(error.message)}`;
    statusTone = "error";
  } finally {
    isGenerating = false;
  }
}

function friendlyError(message) {
  if (/Failed to fetch/i.test(message)) return "Start the local server and open localhost:8787.";
  return message;
}

function pointInRect(x, y, rectValue) {
  return x >= rectValue.x && x <= rectValue.x + rectValue.w && y >= rectValue.y && y <= rectValue.y + rectValue.h;
}

function makeVaseClipPath(ctx,x,y,w,h) { traceVase(ctx,x,y,w,h); }
function drawVaseOutline(x,y,w,h) {
  const ctx=drawingContext;ctx.save();traceVase(ctx,x,y,w,h);ctx.strokeStyle='#c6c6cc';ctx.lineWidth=1.4;ctx.stroke();ctx.restore();
}

// Physical turntable controls are separate from the on-screen scrolling preview.
let motorPort = null;
let motorReader = null;
let motorReadTask = null;
let motorConnecting = false;
let motorClosing = false;
let motorWrites = Promise.resolve();
let motorStatus;
let connectMotorButton;

function setupTurntableControls() {
  const bar = document.createElement("div");
  bar.className = "hardware-controls";
  document.querySelector("main").appendChild(bar);
  function button(label, action) {
    const b = document.createElement("button");
    b.textContent = label;
    b.className = "control-button";
    b.onclick = action;
    bar.appendChild(b);
    return b;
  }
  button("Clear projection", () => {
    interactionStage = "waiting";
    publishProjection(null);
    generationEpoch++; // Ignore a pending result so it cannot relight a cleared projection.
    projectionCleared = true;
    generatedPattern = null;
    statusText = "Projection cleared. Your drawing is kept.";
    statusTone = "neutral";
    if (motorPort) sendMotorCommand("S");
  });
  connectMotorButton = button("Connect Arduino", toggleMotorConnection);
  button("Run for 8 seconds", () => sendMotorCommand("R"));
  button("Stop turntable", () => { interactionStage = "paused"; sendMotorCommand("S"); });
  const automatic = button("Auto interaction: On", () => {
    autoVisitorMotion = !autoVisitorMotion;
    automatic.textContent = "Auto interaction: " + (autoVisitorMotion ? "On" : "Off");
    automatic.setAttribute("aria-pressed", String(autoVisitorMotion));
    if (!autoVisitorMotion && motorPort) sendMotorCommand("S");
  });
  automatic.setAttribute("aria-pressed", "true");
  visitorStatus = document.createElement("span");
  visitorStatus.textContent = "Enter the camera center to begin · Drawing pauses the turntable.";
  bar.appendChild(visitorStatus);
  motorStatus = document.createElement("span");
  motorStatus.textContent = "Arduino disconnected · Preview playback is independent.";
  bar.appendChild(motorStatus);
  window.addEventListener("pagehide", () => { if (motorPort) sendMotorCommand("S"); });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && motorPort) sendMotorCommand("S");
  });
}

async function toggleMotorConnection() {
  if (motorConnecting || motorClosing) return;
  if (motorPort) return closeMotorConnection();
  if (!navigator.serial) {
    motorStatus.textContent = "Use desktop Chrome or Edge at localhost:8787 to connect Arduino.";
    return;
  }
  motorConnecting = true;
  let selectedPort;
  try {
    selectedPort = await navigator.serial.requestPort();
    await selectedPort.open({ baudRate: 9600 });
    motorPort = selectedPort;
    motorStatus.textContent = "Connected. Waiting for Arduino…";
    connectMotorButton.textContent = "Disconnect Arduino";
    motorReadTask = readMotorMessages(selectedPort);
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (motorPort === selectedPort && !motorClosing) await sendMotorCommand("S");
  } catch (error) {
    motorStatus.textContent = error.name === "NotFoundError" ? "Port selection cancelled." : "Connection failed. Close the IDE serial monitor and other controllers.";
    if (motorPort) await closeMotorConnection();
  } finally {
    motorConnecting = false;
  }
}

function sendMotorCommand(command) {
  if (!motorPort || (motorConnecting && command === "R") || (motorClosing && command === "R")) {
    motorStatus.textContent = "Connect Arduino and wait until it is ready.";
    return Promise.resolve();
  }
  const port = motorPort;
  motorWrites = motorWrites.then(async () => {
    if (!port.writable) throw new Error("Serial port disconnected.");
    const writer = port.writable.getWriter();
    try {
      await writer.write(new TextEncoder().encode(command + "\n"));
      motorStatus.textContent = command === "R" ? "Run sent. Waiting for confirmation…" : "Stop sent. Waiting for confirmation…";
    } finally { writer.releaseLock(); }
  }).catch(error => { motorStatus.textContent = "Serial write failed: " + error.message; });
  return motorWrites;
}

async function readMotorMessages(port) {
  const reader = port.readable.getReader();
  motorReader = reader;
  const decoder = new TextDecoder();
  let pending = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      pending += decoder.decode(value, { stream: true });
      const lines = pending.split("\n");
      pending = lines.pop();
      for (const line of lines) {
        const message = line.trim();
        const labels = { READY: "Arduino ready", ROTATING: "Turntable running · Up to 8 seconds", STOPPED: "Turntable stopped", FAILSAFE_STOP: "Eight seconds elapsed. Turntable stopped." };
        if (labels[message]) motorStatus.textContent = labels[message];
      }
    }
  } catch {
    motorStatus.textContent = "Connection lost. Disconnect and reconnect Arduino.";
  } finally {
    reader.releaseLock();
    if (motorReader === reader) motorReader = null;
  }
}

async function closeMotorConnection() {
  motorClosing = true;
  try {
    await sendMotorCommand("S");
    if (motorReader) await motorReader.cancel();
    if (motorReadTask) await motorReadTask;
    if (motorPort) await motorPort.close();
    motorStatus.textContent = "Arduino disconnected.";
  } catch {
    motorStatus.textContent = "Serial port disconnected.";
  } finally {
    motorPort = null;
    motorReadTask = null;
    motorClosing = false;
    connectMotorButton.textContent = "Connect Arduino";
  }
}

let generateControl, playControl;
const projectionChannel = new BroadcastChannel("ceramic-projection");
let lastProjection = null;
projectionChannel.onmessage = event => {
  if (event.data.type === "ready" && lastProjection) projectionChannel.postMessage({type:"image", image:lastProjection});
};
function publishProjection(image) {
  lastProjection = image;
  projectionChannel.postMessage({type:"image",image});
}
function setupStudioControls() {
  const bar = document.createElement("div"); bar.className = "studio-controls";
  function button(text, action, primary=false) {
    const b=document.createElement("button"); b.textContent=text;
    b.className=primary ? "primary" : "control-button"; b.onclick=action;
    bar.appendChild(b); return b;
  }
  button("Clear drawing",clearSketch);
  generateControl=button("Create pattern",requestAIPattern,true);
  playControl=button("Pause preview",()=>{autoRotate=!autoRotate;});
  button("Open projector",()=>window.open("/projector.html","ceramic-projector","popup,width=1100,height=750"));
  document.querySelector("main").appendChild(bar);
}
function syncControls() {
  if (!generateControl) return;
  generateControl.disabled=isGenerating;
  generateControl.textContent=isGenerating ? "Creating…" : "Create pattern";
  playControl.textContent=autoRotate ? "Pause preview" : "Play preview";
}


// A visitor dwells for 650 ms, tolerating detection gaps up to 700 ms.
// Rearm after 3 s without a person; hand landmarks alone never trigger entry.
let autoVisitorMotion = true;
let interactionStage = "waiting";
let pinchStartedAt = null;
const VISITOR_DWELL_MS = 650;
const VISITOR_GAP_MS = 700;
const VISITOR_LEAVE_MS = 3000;
let visitorSince = null;
let visitorLastSeen = 0;
let visitorLatched = false;
let visitorWelcomeSent = false;
let visitorStatus;
let automaticStopTimer;
let visitorBounds = null;
let visitorFrameAt = 0;
let visitorPresent = false;
let visitorTriggerAt = -Infinity;
function runAutomaticTurn() {
  if (!motorPort || motorConnecting || motorClosing) return;
  sendMotorCommand("R");
  visitorTriggerAt = performance.now();
  clearTimeout(automaticStopTimer);
  automaticStopTimer = setTimeout(() => { if (motorPort) sendMotorCommand("S"); }, 8000);
}
function updateVisitorPresence(result, now) {
  const pose = result.poseLandmarks?.[0];
  const face = result.faceLandmarks?.[0];
  const visible = p => p && (p.visibility ?? 1) > 0.5 && p.x > 0.06 && p.x < 0.94 && p.y > 0 && p.y < 1;
  const present = Boolean((pose && visible(pose[11]) && visible(pose[12])) || (face && visible(face[1])));
  visitorFrameAt = now;
  visitorPresent = present || (visitorSince !== null && now - visitorLastSeen <= VISITOR_GAP_MS);
  const outlinePoints = [...(face || []), ...(pose || []).filter(p => (p.visibility ?? 0) > 0.6)]
    .filter(p => Number.isFinite(p.x) && Number.isFinite(p.y) && p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1);
  visitorBounds = outlinePoints.length ? {
    left: Math.max(0, Math.min(...outlinePoints.map(p => p.x)) - .04),
    right: Math.min(1, Math.max(...outlinePoints.map(p => p.x)) + .04),
    top: Math.max(0, Math.min(...outlinePoints.map(p => p.y)) - .04),
    bottom: Math.min(1, Math.max(...outlinePoints.map(p => p.y)) + .04)
  } : null;
  if (present) {
    visitorLastSeen = now;
    if (visitorSince === null) visitorSince = now;
    if (!visitorLatched && now - visitorSince >= VISITOR_DWELL_MS && !document.hidden) {
      visitorLatched = true;
    }
    // Detection and motor readiness are separate: a detected visitor can wait
    // for Arduino without losing the pending welcome event.
    if (visitorLatched && !visitorWelcomeSent && autoVisitorMotion &&
        interactionStage === "waiting" && !isGenerating && !document.hidden &&
        motorPort?.writable && !motorConnecting && !motorClosing) {
      visitorWelcomeSent = true;
      interactionStage = "welcome";
      runAutomaticTurn();
    }
  } else {
    if (now - visitorLastSeen > VISITOR_GAP_MS) visitorSince = null;
    if (now - visitorLastSeen > VISITOR_LEAVE_MS && (visitorLatched || interactionStage === "drawing" || interactionStage === "welcome" || interactionStage === "paused")) {
      visitorLatched = false;
      visitorWelcomeSent = false;
      if (motorPort) sendMotorCommand("S");
      interactionStage = "waiting";
    }
  }
  if (visitorStatus) visitorStatus.textContent = `${present ? "Visitor detected" : "Waiting for a visitor"} · ${interactionStage} · Auto interaction ${autoVisitorMotion ? "on" : "off"}`;
}


function drawVisitorOverlay() {
  const p = CAMERA_PANEL, now = performance.now();
  const fresh = modelReady && now - visitorFrameAt < 1000;
  const detected = fresh && visitorPresent;
  const progress = detected ? (visitorLatched ? 1 : Math.min(1, (now - visitorSince) / VISITOR_DWELL_MS)) : 0;
  const color = detected ? (visitorLatched ? "#39e5a3" : "#ffd166") : "#ffffff";
  push();
  noFill(); stroke(color); strokeWeight(2);
  drawingContext.setLineDash([7, 6]);
  rect(p.x + p.w * .06, p.y + 8, p.w * .88, p.h - 16, 10);
  drawingContext.setLineDash([]);
  if (fresh && visitorBounds) {
    const b = visitorBounds;
    // Camera image is mirrored; use the same transform for the detection bounds.
    const x = p.x + (1 - b.right) * p.w, y = p.y + b.top * p.h;
    const w = (b.right - b.left) * p.w, h = (b.bottom - b.top) * p.h;
    const n = Math.min(16, w / 3, h / 3);
    strokeWeight(3);
    for (const [cx, cy, dx, dy] of [[x,y,1,1],[x+w,y,-1,1],[x,y+h,1,-1],[x+w,y+h,-1,-1]]) {
      line(cx,cy,cx+dx*n,cy); line(cx,cy,cx,cy+dy*n);
    }
  }
  let label = !modelReady ? "Loading detection…" : !fresh ? "Waiting for camera detection…" : !detected ? "Step into the marked zone" : !visitorLatched ? "Person detected · Hold briefly" : "Visitor detected · Pinch to draw";
  if (detected && visitorLatched) {
    if (interactionStage === "drawing") label = "Drawing · Turntable paused";
    else if (interactionStage === "generating") label = "Creating pattern · Turntable paused";
    else if (interactionStage === "paused") label = "Turntable paused manually";
    else if (!autoVisitorMotion) label = "Visitor detected · Auto interaction off";
    else if (!motorPort) label = "Visitor detected · Connect Arduino";
    else if (motorConnecting) label = "Visitor detected · Arduino connecting…";
    else if (now - visitorTriggerAt < 8000) label = "Turn requested · 8-second cycle";
  }
  if (!detected && fresh && visitorLatched) label = `Rearming in ${Math.max(0, Math.ceil((VISITOR_LEAVE_MS - (now - visitorLastSeen))/1000))}s · Step out`;
  noStroke(); fill(20, 25, 32, 220); rect(p.x + 8,p.y + p.h - 51,p.w - 16,43,9);
  fill(color); textAlign(LEFT, CENTER); textSize(12); text(label,p.x + 18,p.y + p.h - 33);
  fill(255,255,255,55); rect(p.x + 18,p.y + p.h - 18,p.w - 36,4,2);
  fill(color); rect(p.x + 18,p.y + p.h - 18,(p.w - 36)*progress,4,2);
  pop();
}
