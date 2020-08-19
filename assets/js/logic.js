var currentriddlesIndex = 0;
var time = riddles.length * 15;
var timerId;
var riddlesEl = document.getElementById("riddles");
var timerEl = document.getElementById("time");
var choicesEl = document.getElementById("choices");
var submitBtn = document.getElementById("submit");
var startBtn = document.getElementById("start");
var initialsEl = document.getElementById("initials");
var feedbackEl = document.getElementById("feedback");

function startQuiz() {
  var startScreenEl = document.getElementById("start-screen");
  startScreenEl.setAttribute("class", "hide");
  riddlesEl.removeAttribute("class");
  timerId = setInterval(clockTick, 1000);
  timerEl.textContent = time;
  getriddles();
}

function getriddles() {
  var currentriddles = riddles[currentriddlesIndex];
  var titleEl = document.getElementById("riddles-title");
  titleEl.textContent = currentriddles.title;
  choicesEl.innerHTML = "";

  currentriddles.choices.forEach(function(choice, i) {

    var choiceNode = document.createElement("button");
    choiceNode.setAttribute("class", "choice");
    choiceNode.setAttribute("value", choice);

    choiceNode.textContent = i + 1 + ". " + choice;
    choiceNode.onclick = riddlesClick;
    choicesEl.appendChild(choiceNode);
  });
}

function riddlesClick() {
  if (this.value !== riddles[currentriddlesIndex].answer) {
    // take time off time
    time -= 15;

    if (time < 0) {
      time = 0;
    }
    timerEl.textContent = time;

    feedbackEl.textContent = "Wrong!";
  } else {

    feedbackEl.textContent = "Correct!";
  }
  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function() {
    feedbackEl.setAttribute("class", "feedback hide");
  }, 1000);

  currentriddlesIndex++;
  if (currentriddlesIndex === riddles.length) {
    quizEnd();
  } else {
    getriddles();
  }
}

function quizEnd() {
  // stop timer
  clearInterval(timerId);
  // end screen
  var endScreenEl = document.getElementById("end-screen");
  endScreenEl.removeAttribute("class");
  //final score
  var finalScoreEl = document.getElementById("final-score");
  finalScoreEl.textContent = time;
  //hide riddles section
  riddlesEl.setAttribute("class", "hide");
}

function clockTick() {
  // update time
  time--;
  timerEl.textContent = time;
  // see if user ran out of time
  if (time <= 0) {
    quizEnd();
  }
}

function saveHighscore() {
  var initials = initialsEl.value.trim();
  if (initials !== "") {
    var highscores =
      JSON.parse(window.localStorage.getItem("highscores")) || [];

    var newScore = {
      score: time,
      initials: initials
    };

    highscores.push(newScore);
    window.localStorage.setItem("highscores", JSON.stringify(highscores));

    window.location.href = "highscores.html";
  }
}

function checkForEnter(event) {

  if (event.key === "Enter") {
    saveHighscore();
  }
}

submitBtn.onclick = saveHighscore;
startBtn.onclick = startQuiz;
initialsEl.onkeyup = checkForEnter;
