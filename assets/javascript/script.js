/* jshint esversion: 11 */

//Global Scope Variables
let body = document.body;
let currentQuestion = 1;
let score = 0;
let currentLevel = 1;
let currentAnswerIndex = 0;
let currentCorrectAnswerID = 0;
let currentIncorrectAnswer1ID = 0;
let currentIncorrectAnswer2ID = 0;
let progressRingPercent = 1;
let levelOptions = [];
let soundEnabled = true;
let playerName = '';
let highScore = 0;
let outerContainer = document.getElementById('outer-container');
let questionType, levelQuestion, correctAnswerPosition, answerSelected = null;
let button1Text, button2Text, button3Text, questionCountryName, button1Flag, button2Flag, button3Flag = '';

// Loads Main Menu Screen Upon Loading Body
body.addEventListener("load", mainMenuLoad());
// Adds the main menu interface and event listeners out outerContainer
function mainMenuLoad() {
    outerContainer.innerHTML = `
    <section id="home-screen">
       <h1>Flags &<br>Countries</h1>
       <h2>The Geography Game</h2>
       <img src="assets/images/globe.png" alt="Picture of globe">
       <nav id="main-menu-buttons-flex">
        <button type="button" id="main-play">Play</button>
        <button type="button" id="main-scores">Scores</button>
        <button type="button" id="main-how-to-play">How to Play</button>
       </nav>
   </section> `;
   document.getElementById("main-play").addEventListener("click", enterPlayerContainer);
   document.getElementById("main-scores").addEventListener("click", function(){
   window.location.href='scores.html';
   });
   document.getElementById("main-how-to-play").addEventListener("click", function() {
   window.location.href='how_to_play.html';
   });
}
// This function generates a UI where the user can enter or modify a player name. 
function enterPlayerContainer() {
    gradientControl(0);
    checkLocalStorage();
    outerContainer.innerHTML = `
    <section id="enter-player-container">
        <form>
           <label>Enter player name:</label>
           <input type="text" id="player-name-input" placeholder="Enter your name" value="${playerName}" maxlength="15">
           <span id="input-warning"></span>
           <button type="button" id="enter-player-name-button">Start Game</button>
       </form>
    </section>
    `;
    document.getElementById("enter-player-name-button").addEventListener("click", checkPlayerName);
    document.addEventListener("keydown", function() {
        if(event.key == "Enter") {
            checkPlayerName();
        }
    });
}
// This function is used to check if there are values in local storage or not. If there are values in local storage these are used to update variables. 
function checkLocalStorage() {
    if(localStorage.getItem("playerName") == null) {
        localStorage.setItem("playerName", "Player001");
    }
    else {
        playerName = localStorage.getItem("playerName");
        highScore = localStorage.getItem("highScore");
    }
}
// This function checks whether the user has inputted a valid player name
function checkPlayerName() {
    if(document.getElementById("player-name-input").value.length <= 2) {
        document.getElementById("input-warning").innerHTML="Name must be between 3-15 characters.";
    }
    else {
        playerName = document.getElementById("player-name-input").value;
        localStorage.setItem("playerName", document.getElementById("player-name-input").value);
        newGame();
    }
}
// This function starts a new game when called. It sets all variables to their starting position and initialises level and question options.
function newGame() {
    outerContainer.innerHTML = "";
    gradientControl(1);
    score = 0;
    currentLevel = 1;
    currentQuestion = 1;
    progressRingPercent = 1;
    questionType = 1;
    initialiseLevel();
    generateQuestionIDs();
    initialiseQuestion();
    displayControlBar();
    updateProgressRing(1);
}
// This function adds the control bar UI to the HTML Body when called. 
function displayControlBar() {
    const newControlBarUI = document.createElement('nav');
    newControlBarUI.id = 'control-bar';
    body.appendChild(newControlBarUI);
    newControlBarUI.innerHTML = `
    <div id="end-button-cont">
        <button id="end-btn" aria-label="End the current game"></button>
    </div>
    <div id="control-bar-central-cont">
        <div id="level-status-container">
            <div id="level-label">Level</div>
            <div id="level-ring-container">
                <div id="level-top">${currentLevel}</div>
                <svg width="52px" height="52px">
                    <circle id="level-progress-ring" cx="26px" cy="26px" r="24px"/>
                    <circle id="level-ring-background" cx="26px" cy="26px" r="24px">
                </svg>

            </div>
        </div>
        <div id="score-container">
            <span id="score-display">${score}</span>
            <img src="assets/images/score_icon.svg" alt="Score Symbol">
        </div>
    </div>
    <div id="mute-container">
        <button id="mute-btn" aria-label="Toggle sound effects on or off"></button>
    </div> 
    `; 
    document.getElementById("mute-btn").addEventListener("click", soundStatus);
    document.getElementById("end-btn").addEventListener("click", userEndGame);
}
// Initialise level question options - if the user answers a question incorrectly and the game is restarted these will be used to repopulate levelOptions correctly. 
function initialiseLevel() {
    const level1Range = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22];
    const level2Range = [23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44];
    const level3Range = [45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66];
    const level4Range = [67,68,69,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88];
    const level5Range = [89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110];
    const level6Range = [111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,131,132];
    const level7Range = [133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154];
    const level8Range = [155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176];
    const level9Range = [177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198];
    const level10Range = [199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220];
// This section of the function determines which answer options will be used in each level and assigns them using the levelOptions variable. 
    switch(currentLevel) {
        case 1:
            levelOptions = level1Range;
            levelQuestion = 1;
            break;
        case 2:
            levelOptions = level2Range;
            break;
        case 3:
            levelOptions = level3Range;
            break;
        case 4:
            levelOptions = level4Range;
            break;
        case 5:
            levelOptions = level5Range;
            break;
        case 6:
            levelOptions = level6Range;
            break;
        case 7:
            levelOptions = level7Range;
            break;
        case 8:
            levelOptions = level8Range;
            break;
        case 9:
            levelOptions = level9Range;
            break;
        case 10:
            levelOptions = level10Range;
            break;
        default:
            console.log('An error has occured when initialising the level');
    }
}
// This function picks three question IDs out of the level array, 1 correct answer and 2 incorrect answers. It removes these questions from the levelOptions array ensuring they do not reappear again during a single game.
function generateQuestionIDs() {
    //Correct answer
    currentAnswerIndex = Math.floor(Math.random() * levelOptions.length);
    currentCorrectAnswerID = levelOptions[currentAnswerIndex];
    levelOptions.splice(currentAnswerIndex, 1);
    // 1st incorrect answer
    currentAnswerIndex = Math.floor(Math.random() * levelOptions.length);
    currentIncorrectAnswer1ID = levelOptions[currentAnswerIndex];
    levelOptions.splice(currentAnswerIndex, 1);
    // 2nd incorrect answer
    currentAnswerIndex = Math.floor(Math.random() * levelOptions.length);
    currentIncorrectAnswer2ID = levelOptions[currentAnswerIndex];
    levelOptions.splice(currentAnswerIndex, 1);
}
// The game features two question types. This function determines which question type will be generated. They always alternate.
function initialiseQuestion(){
    if(questionType == 1) {
       questionType = questionType + 1;
       questionType1();
    }
    else {
        questionType = questionType - 1;
        questionType2();
    }
}
// Outputs HTML for question type 1. Question type 1 involves one flag picture and three text buttons.
function questionType1() {
    let correctCountryObject = questions.find(question => question.id == currentCorrectAnswerID);
    let incorrectCountry1Object = questions.find(question => question.id == currentIncorrectAnswer1ID);
    let incorrectCountry2Object = questions.find(question => question.id == currentIncorrectAnswer2ID);
    questionImagePath = correctCountryObject.flagFile;
    correctAnswerPosition = (Math.floor(Math.random() * 3) + 1);
    switch(correctAnswerPosition) {
        case 1:
            button1Text = correctCountryObject.countryName;
            button2Text = incorrectCountry1Object.countryName;
            button3Text = incorrectCountry2Object.countryName;
            break;
        case 2:
            button1Text = incorrectCountry1Object.countryName;
            button2Text = correctCountryObject.countryName;
            button3Text = incorrectCountry2Object.countryName;
            break;
        case 3:
            button1Text = incorrectCountry1Object.countryName;
            button2Text = incorrectCountry2Object.countryName;
            button3Text = correctCountryObject.countryName;
            break;
    }
    outerContainer.innerHTML = `
    <section id="typeA-container" class="question-inner-container">
        <form class="typeA-question-form">
            <img class="typeA-flag" src="assets/images/flags/${questionImagePath}">
            <span class="typeA-question-heading">This is the flag of . . .</span>
            <button type='button' id="buttonAnswer1" value="1">
                ${button1Text}
            </button>
            <button type='button' id="buttonAnswer2" value="2">
                ${button2Text}
            </button>
            <button type='button' id="buttonAnswer3" value="3">
                ${button3Text}
            </button>
        </form>
    </section>
    `;
    // This section of the function determines which button corresponds with which answer. This allows for the correct answer to be assigned to a different button randomly for each question.
    document.getElementById("buttonAnswer1").addEventListener("click", function() {
        answerSelected = 1;
        checkAnswer();
    });
    document.getElementById("buttonAnswer2").addEventListener("click", function() {
        answerSelected = 2;
        checkAnswer();
    });
    document.getElementById("buttonAnswer3").addEventListener("click", function() {
        answerSelected = 3;
        checkAnswer();
    });
}
// Outputs HTML for type 2 questions. Type 2 questions involve aa country name and three picture answer buttons.
function questionType2() {
    let correctCountryObject = questions.find(question => question.id == currentCorrectAnswerID);
    let incorrectCountry1Object = questions.find(question => question.id == currentIncorrectAnswer1ID);
    let incorrectCountry2Object = questions.find(question => question.id == currentIncorrectAnswer2ID);
    questionCountryName = correctCountryObject.countryName;
    correctAnswerPosition = (Math.floor(Math.random() * 3) + 1);
    switch(correctAnswerPosition) {
        case 1:
            button1Flag = correctCountryObject.flagFile;
            button2Flag = incorrectCountry1Object.flagFile;
            button3Flag = incorrectCountry2Object.flagFile;
            break;
        case 2:
            button1Flag = incorrectCountry1Object.flagFile;
            button2Flag = correctCountryObject.flagFile;
            button3Flag = incorrectCountry2Object.flagFile;
            break;
        case 3:
            button1Flag = incorrectCountry1Object.flagFile;
            button2Flag = incorrectCountry2Object.flagFile;
            button3Flag = correctCountryObject.flagFile;
            break;
    }
    outerContainer.innerHTML = `
    <section id="typeB-container" class="question-inner-container">
        <form class="typeB-question-form">
            <span class="typeB-question-heading">What is the flag of <br>${questionCountryName}?</span>
            <button type='button' id="buttonAnswer1" value="A">
                <img alt="Flag A" src="assets/images/flags/${button1Flag}">
            </button>
            <button type='button' id="buttonAnswer2" value="B">
                <img alt="Flag B"src="assets/images/flags/${button2Flag}">
            </button>
            <button type='button' id="buttonAnswer3" value="C">
                <img alt="Flag C" src="assets/images/flags/${button3Flag}">
            </button>
        </form>
    </section>
    `;
    document.getElementById("buttonAnswer1").addEventListener("click", function() {
        answerSelected = 1;
        checkAnswer();
    });
    document.getElementById("buttonAnswer2").addEventListener("click", function() {
        answerSelected = 2;
        checkAnswer();
    });
    document.getElementById("buttonAnswer3").addEventListener("click", function() {
        answerSelected = 3;
        checkAnswer();
    });
}
// Checks if the user has selected the correct answer.
function checkAnswer() {
    // If the user has selected the correct answer updates the score and calls the functions to move on to the next  question.
    if(answerSelected === correctAnswerPosition) {
        correctAnswerSound();
        score = score + 1;
        currentQuestion++;
        updateScoreText();
        progressRingPercent += 14;
        updateProgressRing(progressRingPercent);
        // Flashes the correct answer button green
        document.getElementById('buttonAnswer' + answerSelected).style.animation = 'correctAnswer 1.1s ease-in-out';
        document.getElementById('buttonAnswer' + answerSelected).addEventListener('animationend', function() {
        questionModalRemove();
        });
    }
    // When an incorrect answer has been selected.
    else {
        incorrectAnswerSound();
        // Flashes the selected button red to let the user know they picked the wrong answer.
        document.getElementById('buttonAnswer' + answerSelected).style.animation = 'incorrectAnswer 0.9s ease-in-out 1';
        document.getElementById('buttonAnswer' + answerSelected).addEventListener('animationend', function() {
            // Flashes the correct answer button green
            document.getElementById('buttonAnswer' + correctAnswerPosition).style.animation = 'correctAnswer 1.1s ease-in-out 1';
            document.getElementById('buttonAnswer' + correctAnswerPosition).addEventListener('animationend', function() {
            gameOver();
            });
        });
    }
}
// Removes the question DIV from outerContainer.
function questionModalRemove() {
    outerContainerClear();
    checkLevel();
}
// When a qustion has been answered correctly this function checks whether to initiate the level up animation or if the user has completed the game.
function checkLevel () {
    switch(score) {
        case 7: case 14: case 21: case 28: case 35: case 42: case 49: case 56: case 63:
            levelUp();
            break;
        case 70:
            gameWinner();
            break;
        default:
        generateQuestionIDs();
        initialiseQuestion();
    }
}
// Updates the score in the control bar.
function updateScoreText() {
    let scoreText = document.getElementById("score-display");
    scoreText.innerHTML = score; 
}
// This controls the status of the level progress ring. Arguements from 0-100 representing a percentage.
function updateProgressRing(percent) {
    // *** This function contains code by Jeremias Menichelli - see README.md *** 
    let progressRing = document.getElementById("level-progress-ring");
    const progressRingCircumference = 24 * 2 * Math.PI;
    progressRing.style.strokeDasharray = `${progressRingCircumference} ${progressRingCircumference}`;
    progressRing.style.strokeDashoffset = `${progressRingCircumference}`;
    const offset = progressRingCircumference - percent / 100 * progressRingCircumference ;
    progressRing.style.strokeDashoffset = offset;
}
// Level up - creates div, plays animation, updates variables, deletes div on animaion completition 
function levelUp() {
    outerContainer.innerHTML = `
    <div id="level-up-container">
        <div id="level-up-text">Level Up!</div>
        <div id="level-up-spinner"></div>
    </div>
    `;
    currentLevel = currentLevel + 1;
    let levelTop = document.getElementById('level-top');
    levelTop.innerHTML = currentLevel;
    progressRingPercent = 1;
    updateProgressRing(1);
    let levelupContainer = document.getElementById('level-up-container');
    let levelupSpinner = document.getElementById('level-up-spinner');
    levelUpSound();
    levelupSpinner.style.animation = "levelup-spin 7s linear";
    levelupContainer.style.animation = "levelup 2s linear";
    levelupContainer.addEventListener('animationend', () => {
        outerContainer.innerHTML = "";
        initialiseLevel();
        generateQuestionIDs();
        initialiseQuestion();
        gradientControl(currentLevel);
    });    
}
// Displays content letting the user know they completed the game.
function gameWinner() {
    document.getElementById("end-button-cont").innerHTML = '';
    saveScore();
    localStorage.setItem("highScorePlayer", playerName);
    localStorage.setItem("highScore", score);
    gameWonSound();
    outerContainer.innerHTML = `
    <div id="game-won-container">
        <div id="spinner"></div>
        <div id="game-won-badge"><img src="assets/images/game_complete.png" alt="Game complete!"></div>
    </div>
    `;
    setTimeout( function() {
        document.getElementById("game-won-container").remove();
        document.getElementById("control-bar").remove();
        mainMenuLoad();
        gradientControl(0);
    }, 5500);
}
// Displays the game over information, letting the user know what their score was. 
function gameOver() {   
    // If there is no existing high score in local storage, less information is presented to the user
    if(localStorage.getItem("highScore") == null) {
        saveScore();
        localStorage.setItem("highScorePlayer", playerName);
        localStorage.setItem("highScore", score);
        outerContainer.innerHTML = `
        <div id="game-over-cont">
            <span id="game-over-text">Game Over!</span>
            <span id="game-over-scored">You scored: ${score} points</span>
            <button type="button" id="game-over-play-again">Play Again</button>
            <button type="button" id="game-over-main-menu">Main Menu</button>
        </div>
        `;
    }
    // When there high score is available in local storage this is outputted, letting the player compare their score with the highest achieved score.
    else {
        checkHighScore();
        saveScore();
        outerContainer.innerHTML = `
        <div id="game-over-cont">
            <span id="game-over-text">Game Over!</span>
            <span id="game-over-scored">You scored: ${score} points</span>
            <span id="game-over-scored">Current high score: ${highScore} points</span>
            <button type="button" id="game-over-play-again">Play Again</button>
            <button type="button" id="game-over-main-menu">Main Menu</button>
        </div>
        `;
    }
    document.getElementById("control-bar").remove();
    document.getElementById("game-over-play-again").addEventListener("click", function() {
        enterPlayerContainer(); 
    });
    document.getElementById("game-over-main-menu").addEventListener("click", function() {
        document.getElementById("game-over-cont").remove();
        mainMenuLoad();
        gradientControl(0);
    });
}
// Determines if a new high score has been achieved. If so save it to local storage
function checkHighScore() {
    if(score >= Math.floor(highScore)) {
    localStorage.setItem("highScorePlayer", playerName);
    localStorage.setItem("highScore", score);
    }
}
// Saves score and player name to local storage
function saveScore() {
    if(localStorage.getItem("scores") == null)  {
        let scoreToSet = [
            {player: playerName, gameScore: score}
        ];
        localStorage.setItem("scores", JSON.stringify(scoreToSet));
    }
    else {
        let arrayScores = JSON.parse(localStorage.getItem("scores"));
        arrayScores.push({player: playerName, gameScore: score});
        localStorage.setItem("scores", JSON.stringify(arrayScores));
    }
}
// Called to remove the contents of outContainer div.
function outerContainerClear (){
    outerContainer.innerHTML = "";
}

// This function is called when the quit game button is pressed.
// It presents the UI asking the user to confirm their decision. If the user confirms the game is ended, otherwise the end game UI is removed. 
function userEndGame() {
    let endGameUI = document.createElement('div');
    endGameUI.id = 'end-game-modal';
    endGameUI.innerHTML = `
     <div id="end-game-inner">
        <span id="end-game-heading">Are you sure you wish to end the current game?</span>
        <p>If you do all game progress will be lost and your score will not be saved.</p>
        <button type="button" class="end-game-buttons" id="end-game-yes" aria-roledescription="Confirms decision to end game">Yes</button>
        <button type="button" class="end-game-buttons" id="end-game-no" aria-roledescription="Cancels decision to end game, resumes game">No</button>
    </div>       
    `;
    body.appendChild(endGameUI);
    document.getElementById("end-game-yes").addEventListener("click", yesEndGame);
    // If the user selects no the coe simply removes the modal
    document.getElementById("end-game-no").addEventListener("click", function() {
       document.getElementById("end-game-modal").remove();
    });
}
// This function is called when the user confirms 'Yes' in th emodal that they wish to quit the game. Removes the modal, on screen question, control bar, resets the gradient and then loads the main menu assets.
function yesEndGame() {
    document.getElementById("end-game-modal").remove();
    outerContainer.innerHTML = "";
    document.getElementById("control-bar").remove();
    gradientControl(0);
    mainMenuLoad();
}
// Sound Functions
 // This function determines whether the player has enabled or disabled sounds
function soundStatus() {
    if (soundEnabled == true) {
        document.getElementById("mute-btn").style.backgroundImage='url("assets/images/sound_disabled.png")';
        soundEnabled = !soundEnabled;
    }   else { 
        document.getElementById("mute-btn").style.backgroundImage='url("assets/images/sound_enabled.png")';
        soundEnabled = !soundEnabled;
    }
}
//These functions play a sound when called - correct answer, incorrect answer, level up and game won
function correctAnswerSound() {
    if (soundEnabled == true) {
        let sound = new Audio('assets/sounds/correct.mp3');
        sound.play();
    }
}
function incorrectAnswerSound() {
    if (soundEnabled == true) {
        let sound = new Audio('assets/sounds/incorrect_gameover.mp3');
        sound.play();
    }
}
function levelUpSound() {
    if (soundEnabled == true) {
        let sound = new Audio('assets/sounds/level_up.mp3');
        sound.play();
    }
}
function gameWonSound() {
    if (soundEnabled == true) {
        let sound = new Audio('assets/sounds/game_won.mp3');
        sound.play();
    }
}
// This function controls and changes the background graidents based on the level of the game
function gradientControl(gradient) {
    let gradient0 = document.getElementById ('gradient-0');
    let gradient1 = document.getElementById ('gradient-1');
    let gradient2 = document.getElementById ('gradient-2');
    let gradient3 = document.getElementById ('gradient-3');
    let gradient4 = document.getElementById ('gradient-4');
    let gradient5 = document.getElementById ('gradient-5');
    let gradient6 = document.getElementById ('gradient-6');
    let gradient7 = document.getElementById ('gradient-7');
    let gradient8 = document.getElementById ('gradient-8');
    let gradient9 = document.getElementById ('gradient-9');
    let gradient_apply = '';
    switch(gradient) {
        case 0:
            // Loops throughadient divs 0-9 resetting the gradient backgrounds after a game is complete, lost, quit
            for(let gradient_count = 0; gradient_count < 10; gradient_count++) {
                gradient_apply = "gradient-" + String(gradient_count);
                document.getElementById(gradient_apply).style.opacity = "1.0";
            }
            break;
        case 1:
            gradient0.style.opacity="0";
            break;
        case 2:
            gradient1.style.opacity="0";
            break;
        case 3:
            gradient2.style.opacity="0";
            break;
        case 4:
            gradient3.style.opacity="0";
            break;
        case 5:
            gradient4.style.opacity="0";
            break;
        case 6:
            gradient5.style.opacity="0";
            break;
        case 7:
            gradient6.style.opacity="0";
            break;
        case 8:
            gradient7.style.opacity="0";
            break;
        case 9:
            gradient8.style.opacity="0";
            break;
        case 10:
            gradient9.style.opacity="0";
            break;
        default:
            console.log("error setting gradient");
    }
}