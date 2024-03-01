let level = 2;

// Variables for video, poseNet, pose, and skeleton
let video;
let poseNet;
let pose;
let skeleton;


let brain; // Neural network model

let state = 'waiting'; //Indicates the data collection status

let sequenceR; //User pose sequence

//Images
let razzoImg;
let razzoImgEarth;
let startButton;
let immagineTerra;
let immagineLuna;
let immagineMarte;
let immagineGiove;
let immagineSaturno;
let immagineUrano;
let immagineNettuno;
let smokeGif; // New variable for the smoke gif
let smokeGifSize = 100; // New variable for the smoke gif size
let xRazzo;
let yRazzo;
let temp = false;
let currentPlanet = "neptune";
let suonoRazzo;

let rocketUp = false; //Check the direction of the rocket


let interval = 0; //Delay

let startGuess = true; //To save the user poses

// Label for the current pose
let poseLabel = "";
let label = "";

let sequence = []; //Random sequence of 6 poses
let currentIndex = 0;
let userSequence = []; //Usere poses



let font1; //Font fot the text
let font2;

// Examples of pose labels for training
let examples = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];
let trainModel = true; //To train the model 


function preload() {
    //Load Font
    font1 = loadFont('./font/chopsic/Chopsic.otf');
    font2 = loadFont('./font/louis_george_cafe/Louis George Cafe Bold Italic.ttf');

    //Load images
    imgStart = loadImage("./img/start.png");
    razzoImg = loadImage("./img/razzof.gif");
    razzoImgEarth = loadImage("./img/razzoA.png"); // Load the rocket image for earth
    immagineTerra = loadImage("./img/terra14k.jpg");
    immagineLuna = loadImage("./img/Moon.png");
    immagineMarte = loadImage("./img/Mars.png");
    immagineGiove = loadImage("./img/jupiter.png");
    immagineSaturno = loadImage("./img/Saturn.jpg");
    immagineUrano = loadImage("./img/Uranus.png");
    immagineNettuno = loadImage("./img/Neptun.png");
    startButton = loadImage("./img/startButton.jpg");
    smokeGif = loadImage("./img/fumo1.gif"); // Load the smoke gif
    suonoRazzo = loadSound("./audio/rocketSound.mp3");
}

// Setup function, runs once at the beginning
function setup() {
    // Create canvas with innerWidth and innerHeight
    createCanvas(innerWidth - 30, innerHeight - 30);
    // Set frame rate to 60 frames per second
    frameRate(60);
    // Set text alignment to center
    textAlign(CENTER);

    // Retrieve stored yRazzo value from localStorage
    let storedYRazzo = localStorage.getItem('yRazzo');
    if (storedYRazzo) {
        // If yRazzo is found in localStorage, parse and set it
        yRazzo = JSON.parse(storedYRazzo);
        console.log('yRazzo retrieved:', yRazzo);
    } else {
        console.log('yRazzo not found in localStorage, using default value');
    }

    // Retrieve sequenceR from localStorage
    let storedSequence = localStorage.getItem('sequenceR');
    if (storedSequence) {
        // If sequenceR is found in localStorage, parse and set it
        sequenceR = JSON.parse(storedSequence);
        console.log('sequenceR retrieved:', sequenceR);
    } else {
        console.log('sequenceR not found in localStorage');
    }

    // If the level is 2, call the memory function
    if (level == 2) {
        memory();
    }

    // Resize the rocket image
    razzoImg.resize(200, 0);
    // Resize the smoke gif
    smokeGif.resize(smokeGifSize, 0);

    // Set initial coordinates for the rocket
    xRazzo = width / 2 - razzoImg.width / 2;

    // Check if the current planet is "earth"
    if (currentPlanet === "earth") {
        // If the current planet is "earth", position the rocket at the top of the screen
        yRazzo = 20; // Desired height above the top border of the canvas
    } else {
        // Otherwise, position the rocket at the bottom of the screen
        yRazzo = height - height / 8 - razzoImg.height;
    }
}

// Draw function, called continuously
function draw() {
    // Check if the level is 2
    if (level == 2) {
        // Stop the rocket sound if it's playing
        if (suonoRazzo.isPlaying()) {
            suonoRazzo.stop();
        }

        // Reset rocketUp flag
        if (rocketUp) {
            rocketUp = false;
        }

        // Show the video
        background(0);
        push();
        // Translate and scale the video for display
        translate((windowWidth / 2) + 350, (windowHeight - 500 / 2) - 870);
        scale(-1, 1);
        image(video, 0, 0, 1200 + 700, 500 + 590);
        pop();
        noStroke();

        // Check if we are in the guessing phase
        if (startGuess) {
            // Load data for machine learning model if needed
            if (trainModel) {
                brain.loadData('pose.json', dataReady);
                trainModel = false;
            }

            // Increment interval for pose display
            interval++;
            if ((interval % 400) == 0) {
                // Display the user pose every 400 frames
                background(0); // Clear the background
                userPose(); // Call function to display user pose
            }

            // After 1600 frames, end the guessing phase
            if (interval == 1600) {
                // Log the user's sequence
                for (let i = 0; i < 3; i++) {
                    console.log(sequenceR[i]);
                }
                // Log the completion of the user sequence
                console.log("User sequence completed:", userSequence);

                // End the guessing phase
                startGuess = false;
                // Check the user's sequence against the target
                checkSequence();
                // Reset variables for the next round
                currentIndex = 0;
                interval = 0;
                userSequence = [];
            }
        }
    }

    // Check if the level is 3
    if (level == 3) {
        // Clear the canvas
        background(0); // Change background color as needed

        // Display the image of the current planet if not on start screen
        if (currentPlanet !== "start") {
            switch (currentPlanet) {
                case "earth":
                    image(immagineTerra, 0, 0, width, height);
                    break;
                case "moon":
                    image(immagineLuna, 0, 0, width, height);
                    break;
                case "mars":
                    image(immagineMarte, 0, 0, width, height);
                    break;
                case "jupiter":
                    image(immagineGiove, 0, 0, width, height);
                    break;
                case "saturn":
                    image(immagineSaturno, 0, 0, width, height);
                    break;
                case "uranus":
                    image(immagineUrano, 0, 0, width, height);
                    break;
                case "neptune":
                    image(immagineNettuno, 0, 0, width, height);
                    break;
            }

            // Move and display the rocket image
            moveRocket();
            image(razzoImg, xRazzo, yRazzo);

            // Position the rocket differently for earth
            if (currentPlanet === "earth") {
                if (!temp) {
                    yRazzo = 20;
                    temp = true;
                }
            }

            // If the rocket reaches the end of earth screen, show another image
            if (currentPlanet === "earth" && yRazzo >= 550) {
                image(razzoImgEarth, xRazzo + 50, yRazzo);
                // Display "Congratulations" text at the center of the screen
                textSize(35);
                textAlign(CENTER, CENTER);
                fill(255); // White text color
                textFont(font1);
                text("Congratulations you complete your training", width / 2, height / 4);
            }

            // Display smoke gif when rocket is at certain height
            if (yRazzo >= height - height / 8) {
                image(smokeGif, xRazzo, yRazzo + razzoImg.height);
            }

            // Limit rocket's y position
            if (currentPlanet === "earth") {
                yRazzo = constrain(yRazzo, 0, 550);
            } else {
                yRazzo = constrain(yRazzo, 0, height - razzoImg.height);
            }
        }
    }
}


// Function to move the rocket
function moveRocket() {
    // Check if the current planet is "earth"
    if (currentPlanet === "earth") {
        // Move the rocket downwards only if it's below the bottom edge of the canvas
        if (yRazzo < height - height / 8) {
            // Increment the rocket's y position based on the score
            yRazzo += score * 3;
            // Save the updated yRazzo position to localStorage
            localStorage.setItem('yRazzo', JSON.stringify(yRazzo));
        }
    } else {
        // For other planets, move the rocket upwards
        if (!rocketUp) {
            // Use setTimeout for a delayed movement
            setTimeout(() => {
                // Increment the rocket's y position based on the score
                yRazzo -= score * 3;
                // Save the updated yRazzo position to localStorage
                localStorage.setItem('yRazzo', JSON.stringify(yRazzo));
            }, 1000);

            // Set rocketUp to true after the rocket moves up
            rocketUp = true;

            // Open a new window after 5 seconds (5000 milliseconds)
            setTimeout(() => {
                window.open("../index.html", "_blank"); // Open "index.html" in a new window
                window.close(); // Close the current window
            }, 5000);
        }

        // Play the rocket sound
        suonoRazzo.play();

        // If the rocket moves above the top of the screen, change the planet
        if (yRazzo < 0) {
            switch (currentPlanet) {
                case "neptune":
                    currentPlanet = "uranus";
                    break;
                case "uranus":
                    currentPlanet = "saturn";
                    break;
                case "saturn":
                    currentPlanet = "jupiter";
                    break;
                case "jupiter":
                    currentPlanet = "mars";
                    break;
                case "mars":
                    currentPlanet = "moon";
                    break;
                case "moon":
                    currentPlanet = "earth";
                    break;
            }
        }
    }
}


function memory() { //Webcam 
    // Capture video from webcam
    video = createCapture(VIDEO);
    video.hide();

    // Initialize poseNet model
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);

    // Neural network options
    let options = {
        inputs: 34,   // Number of input values (17 keypoints * 2 for x and y)
        outputs: 4,   // Number of output classes (p1, p2, p3, p4)
        task: 'classification',  // Classification task
        debug: true   // Enable debug mode
    }

    // Initialize neural network
    brain = ml5.neuralNetwork(options);
}


// Function to handle when poseNet model is loaded
function modelLoaded() {
    console.log('poseNet ready');
}

// Function to handle when poses are detected
// Callback function triggered when poses are detected
function gotPoses(poses) {
    // Check if at least one pose is detected
    if (poses.length > 0) {
        // Get the first detected pose
        pose = poses[0].pose;
        skeleton = poses[0].skeleton;
        
        // If the state is 'collecting', add pose data to training set
        if (state == 'collecting') {
            // Create an array to store pose keypoints' x and y positions
            let inputs = [];
            // Iterate through all keypoints of the pose
            for (let i = 0; i < pose.keypoints.length; i++) {
                // Get x and y positions of each keypoint
                let x = pose.keypoints[i].position.x;
                let y = pose.keypoints[i].position.y;
                // Add x and y positions to the inputs array
                inputs.push(x);
                inputs.push(y);
            }
            // The target label for this set of inputs
            let target = [targetLabel];
            // Add this set of inputs and target label to the training data
            brain.addData(inputs, target);
        }
    }
}

// //Function to handle key presses
// Function called when a key is pressed
// function keyPressed() {
//     // Check if the level is 2
//     if (level == 2) {
//         // If 'p' or 'P' is pressed, generate a new random sequence of 3 poses
//         if (key == 'p' || key === 'P') {
//             console.log("New sequence:");
//             sequenceR = generateRandomSequence();
//             for (let i = 0; i < 3; i++) {
//                 console.log(sequenceR[i]);
//             }
//             // Set startGuess to true to begin the guessing phase
//             startGuess = true;
//         } else { // To save the pose data
//             // Switch statement to assign labels based on key presses
//             switch (key) {
//                 case '1':
//                     label = "p1";
//                     break;
//                 case '2':
//                     label = "p2";
//                     break;
//                 case '3':
//                     label = "p3";
//                     break;
//                 case '4':
//                     label = "p4";
//                     break;
//                 case '5':
//                     label = "p5";
//                     break;
//                 case '6':
//                     label = "p6";
//                     break;
//                 default:
//                     return; // If an invalid key is pressed, exit the function
//             }

//             // If a label is selected, set targetLabel and start collecting data
//             if (label) {
//                 targetLabel = label; // Set the target label for data collection
//                 console.log(targetLabel);
//                 // After a delay, set the state to 'collecting'
//                 setTimeout(function () {
//                     console.log('collecting');
//                     state = 'collecting';
//                     // After another delay, set the state back to 'waiting'
//                     setTimeout(function () {
//                         console.log('not collecting');
//                         state = 'waiting';
//                     }, 7000); // 7000 milliseconds (7 seconds) delay
//                 }, 1000); // 1000 milliseconds (1 second) delay
//             }
//         }
//     }
// }


// Function to handle when training data is loaded
function dataReady() {
    // Normalize the data for training
    brain.normalizeData();
    
    // Train the neural network model
    brain.train({
        epochs: 50 // Train for 50 epochs
    }, finished); // Call 'finished' function when training is complete
}


// Function to handle when training is finished
function finished() {
    console.log('model trained'); // Log a message when training is finished
    brain.save(); // Save the trained model
    classifyPose(); // Call function to start classifying poses
}


// Function to classify the current pose
function classifyPose() {
    // Check if a pose is detected
    if (pose) {
        let inputs = [];
        // Loop through each keypoint in the pose
        for (let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            // Add x and y coordinates to inputs array
            inputs.push(x);
            inputs.push(y);
        }
        // Use the trained neural network to classify the inputs
        brain.classify(inputs, gotResult);
    } else {
        // If no pose is detected, wait and try again after 100 milliseconds
        setTimeout(classifyPose, 100);
    }
}

// Function to handle classification results
function gotResult(error, results) {
    // Check if there are results and if confidence is high enough
    if (results && results[0].confidence > 0.75) {
        // Assign the label of the highest confidence result to poseLabel
        poseLabel = results[0].label;
    }
    // Continue to classify the next pose
    classifyPose();
}


// Function to simulate user posing
function userPose() {
    // Check if currentIndex is less than 3 (0, 1, or 2)
    if (currentIndex < 3) {
        // Use setTimeout for a delayed execution
        setTimeout(function () {
            // Log the pose to console
            console.log("Pose: " + currentIndex);
            
            // Another setTimeout to simulate user response after 1 second
            setTimeout(function () {
                // Assign the current pose label to userSequence array
                userSequence[currentIndex] = poseLabel; // Use poseLabel instead of targetLabel
                // Uncomment if you want to log the pose label
                // console.log(poseLabel);

                // Increment currentIndex after assigning the value
                currentIndex++;
            }, 4000); // Wait 4 second before executing this inner function
        }, 1000); // Wait 1 second before executing the outer function
    }
}


// Function to check user's sequence against the target sequence
function checkSequence() {
    let correctPoses = 0; // Counter for correct poses in the correct position
    let correctOrder = true; // Flag to track if poses are in the correct order
    let incorrectPoses = new Set(); // Set to store incorrect poses

    // Check if user's sequence length matches the target sequence length
    if (userSequence.length == sequenceR.length) {
        // Loop through each pose in the sequences
        for (let i = 0; i < sequenceR.length; i++) {
            // Check if the pose at index i matches in both sequences
            if (sequenceR[i] == userSequence[i]) {
                correctPoses++; // Increment correct pose counter
            } else {
                correctOrder = false; // Set correctOrder flag to false if poses are not in order
                incorrectPoses.add(userSequence[i]); // Add incorrect pose to the set
            }
        }

        // Calculate score based on correct poses and incorrect poses
        if (correctOrder && correctPoses == sequenceR.length) {
            // All poses are correct and in correct order
            score = 650;
        } else {
            // Calculate score based on correct and incorrect poses
            score = correctPoses * 110; // Each correct pose adds 110 to the score
            score += 90 * incorrectPoses.size; // Each incorrect pose deducts 90 from the score
        }

        console.log("Score: " + score); // Log the calculated score
        level = 3; // Move to level 3
    }
}
