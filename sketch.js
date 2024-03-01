let level = 0;

// Examples of pose labels for training
let examples = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];


let font1; //Font fot the text
let font2;

let imgRocket; 
let imgSaturn;

let sequenceR; //User pose sequence

let startGuess = false; //To save the user poses

// Target label for collecting data
let targetLabel;

let isClicked = false; //To check if the key enter is clicked

let video1; //All the video
let video2;
let video3;
let video4;
let video5;
let video6;
let videos = []; //Array of videos

// Variable to track the index of the current video
let currentVideoIndex = 0;

function preload() {
    //Load Font
    font1 = loadFont('./font/chopsic/Chopsic.otf');
    font2 = loadFont('./font/louis_george_cafe/Louis George Cafe Bold Italic.ttf');
    //Load image
    imgRocket = loadImage('./img/razzof.gif');
    imgSaturn = loadImage('./img/imgHome.png');
    // Load your videos here in the array
    videos.push(createVideo('./video/p1.mp4'));
    videos.push(createVideo('./video/p2.mp4'));
    videos.push(createVideo('./video/p3.mp4'));
    videos.push(createVideo('./video/p4.mp4'));
    videos.push(createVideo('./video/p5.mp4'));
    videos.push(createVideo('./video/p6.mp4'));
}

function setup() {
    createCanvas(innerWidth - 30, innerHeight - 30); //Create canvas
    frameRate(60);
    textAlign(CENTER);
}


function draw() {
    if (level == 0) { //If level = 0 -> home page
        home();
    }
    else if (level == 1) { //If level = 1 -> tutorial page
        tutorial();

    }
}


function keyPressed() {
    if (level == 0) {
        if (keyCode === ENTER) { //Press enter to change -> tutorial page
            level = 1;
        }
    }
    else if (level == 1) {
        if (keyCode === ENTER) {  //Press enter to generate the tutorial
            console.log("New sequence:");
            sequenceR = generateRandomSequence(); //Save the random sequence in a Variable
            for (let i = 0; i < 3; i++) {
                console.log(sequenceR[i]);
            }
            startGuess = true; // now we can start to repeat the tutorial
            isClicked = true; //The key enter is clicked 
        }
    }
}


function keyReleased() {
    if (level == 1) {
        if (keyCode === ENTER) { //If key enter is reales set isClicked = false
            isClicked = false;
        }
    }
}

function home() { //Home page
    for (i = 0; i < videos.length; i++) {
        videos[i].hide(); //Hide the videos tutorial
    }
    background(255); // white
    fill(0); // black text
    textSize(100);
    textFont(font1); //set the font of the text
    text("MASTERMIND", width / 2, height / 10); //Title
    textSize(40);
    text("A physical-mnemonic game", width / 2, height / 6); //Subtitle
    image(imgRocket, width/2-850, height/8, 300, 300);
    image(imgSaturn, width/2+550, height/8, 400, 300);
    let instruction = //instruction of the game
        "The game consists of a memory workout,\n" +
        "which involves the display of specific poses.\n" +
        "These poses are to be replicated using your body,\n" +
        "allowing the camera to capture the images and evaluate whether\n" +
        "your execution was correct, incorrect, or incomplete.";

    textSize(60);
    textFont(font2);
    text(instruction, width / 2, (height / 2) + 200); //Instruction on the page

    fill(0, 0, 255);
    stroke(0); // Black outline color
    strokeWeight(5); // Contour thickness
    rectMode(CORNER); //Sets the way to draw the rectangle at the top left vertex
    let rectX = (width - 650) / 2; // coordinates and size of the rectangle
    let rectY = height / 3.5;
    let rectWidth = 650;
    let rectHeight = 150;

    rect(rectX, rectY, rectWidth, rectHeight, 50); //draw the rectangle

    fill(255);
    textAlign(CENTER, CENTER); // Centers text both horizontally and vertically
    textSize(50);
    noStroke();
    text("Press enter \n to Generate", rectX + rectWidth / 2, rectY + rectHeight / 2); //Instruction to start the game

}


function tutorial() { //Tutorial page
    background(0); //Balck 

    for (i = 0; i < videos.length; i++) {
        videos[i].hide(); //Hide the videos tutorial
    }
    fill(255); // White
    textSize(100);
    textFont(font1);  //set the font of the text
    text("TUTORIAL / VIDEO", width / 2, height / 15); //Title

    // Disegna il rettangolo
    if (isClicked) {
        fill(0, 255, 0);
    } else {
        fill(179, 40, 179); // Colore rettangolo
    }
    stroke(255); // White outline color
    strokeWeight(2); // Contour thickness
    rectMode(CORNER); //Sets the way to draw the rectangle at the top left vertex
    let rectX = (width - 650) / 2; // coordinates and size of the rectangle
    let rectY = height / 6;
    let rectWidth = 650;
    let rectHeight = 150;

    stroke(255);
    strokeWeight(3);
    rect(rectX, rectY, rectWidth, rectHeight, 50); //draw the rectangle

    fill(255);
    textAlign(CENTER, CENTER); // Centers text both horizontally and vertically
    textSize(50);
    noStroke();
    text("Press enter \n to Generate", rectX + rectWidth / 2, rectY + rectHeight / 2); //Instruction to start the game
   
   
    // Mostra il tutorial solo se è stato cliccato Generate e startGuess è vero
    if (startGuess) { //if the sequence has been generated I can show the tutorials
        videos[currentVideoIndex].onended(playNextVideo);//Check if the video is ended
        videos[currentVideoIndex].play();//Play the video
        image(videos[currentVideoIndex], (width / 2) - 600, height / 3, 1220, 650);//Show the video on the screen
        textSize(30);
        text("Tutorial exercise: "+ (currentVideoIndex + 1), width/2, height/2+500);
    }
    textSize(30);
    textFont(font2);
    fill(255);
    text("Pressing enter will display 3 video tutorials\n of some physical exercises \nthat you will need to memorize.\n Afterwards, the virtual brain will be\n trained to recognize your movements.\n Your goal is to repeat the sequence of\n exercises as accurately as possible \nand in the correct order!", width/6, height/2+50);
    text("After the tutorials and camera preview,\n the screen will turn black for 1 second,\n three times.That is your cue to perform the poses! \nBased on your results, \na video game will be developed!", width-360, height/2+50);
   
}






// Function to generate a random sequence of 3 pose labels
function generateRandomSequence() {
    let shuffled = examples.slice(); // Create a copy of the examples array
    shuffled = shuffleArray(shuffled); // Shuffle the array randomly
    sequenceR = shuffled.slice(0, 3); //Assign the shuffled array to sequenceR
    localStorage.setItem('sequenceR', JSON.stringify(sequenceR)); // Save sequenceR to localStorage
    sequenceR = ["p1", "p2", "p3"]; //For the presentation
    return sequenceR;
}
// Function to shuffle an array randomly (using Fisher-Yates algorithm)
function shuffleArray(array) {
    // Loop through the array starting from the last element
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index between 0 and i (inclusive)
        const j = Math.floor(Math.random() * (i + 1));
        // Swap elements at positions i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
    // Return the shuffled array
    return array;
}


// Function to play the next video in the sequence
function playNextVideo() {
    // Check if there are more videos to play in the sequence
    if (currentVideoIndex < sequenceR.length) {
        // Stop the current video
        videos[currentVideoIndex].stop();

        // If the currentVideoIndex is greater than or equal to 2 (3rd video)
        if (currentVideoIndex >= 2) {
            // Open a new window with the specified URL
            window.open("./p2/index.html", "_blank");
            // Close the current window
            window.close();
        }

        // Move to the next video in the sequence
        currentVideoIndex++;

        // Loop through all videos
        for (let i = 0; i < sequenceR.length; i++) {
            // Hide all videos except the current one
            if (i !== currentVideoIndex) {
                videos[i].hide();
            } else {
                // Show and play the current video
                videos[i].show();
                videos[i].play();
            }
        }
    }
}
