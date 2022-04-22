const correctP = document.getElementById("correct-text");
const speechP = document.getElementById("speech-text");
const btnGroup = document.getElementById("btn-group");
const info = document.getElementById("info");
const endScreen = document.getElementById("end-screen");

const counterP = document.getElementById("counter-text");

counterP.style.display = "none";
correctP.style.display = "none";
speechP.style.display = "none";
btnGroup.style.display = "none";
info.style.display = "none";

// ----------------- speech recognition -----------------
let speechStatus = 0;

const speech = new webkitSpeechRecognition();
speech.continuous = true;
speech.lang = "en-US";

const onResult = (event) => {
  // speech.interimResults = true;
  console.log("dispatched");
  if (event.results[0][0].transcript.length) {
    speechP.innerHTML = textToUpperCase(event.results[0][0].transcript);
    console.log(event.results[0][0].transcript);
    checkTextFunc();
  }
  speechStatus = 0;
  speech.stop();
};

speech.addEventListener("result", onResult);

const textToUpperCase = (text) => {
  if (text.length) return text[0].toUpperCase() + text.slice(1);
};

const addSpanFunc = (text, place) => {
  var arr = [];
  arr = text.split(/(\s+)/).map(function (value) {
    var span = document.createElement("span");

    span.textContent = value;
    place.appendChild(span);

    return span;
  });
  return arr;
};

// ----------------- start screen -----------------
const maindiv = document.getElementById("maindiv");
const startbtn = document.getElementById("start");
maindiv.classList.add("center-div");

// when start button is clicked
const start = () => {
  startbtn.style.display = "none";
  maindiv.appendChild(info);
  maindiv.appendChild(correctP);
  maindiv.appendChild(counterP);

  maindiv.appendChild(speechP);
  maindiv.appendChild(btnGroup);
  counterP.style.display = "block";
  counterP.style.color = "hotpink";

  const startCntDwn = new Promise((resolve, reject) => {
    setInterval(() => {
      if (counterP.innerHTML > 1) {
        counterP.innerHTML -= 1;
      } else {
        resolve("resolved");
      }
    }, 1000);
  });

  startCntDwn.then((resolve) => {
    if (resolve === "resolved") {
      speechP.style.display = "block";
      info.style.display = "flex";
      createText();
      maindiv.classList.remove("center-div");
      maindiv.classList.add("grid-div");

      maindiv.removeChild(counterP);
      correctP.style.display = "block";

      correctP.style.color = "#999";
      speechP.style.color = "#999";

      speechStatus = 1;
      speech.start();
    }
  });

  // const startCntDwn = setInterval(() => {
  //   if (counterP.innerHTML > 1) {
  //     counterP.innerHTML -= 1;
  //   } else {
  //     clearInterval(startCntDwn);
  //     speechP.style.display = "block";
  //     info.style.display = "flex";
  //     createText();
  //     maindiv.classList.remove("center-div");
  //     maindiv.classList.add("grid-div");

  //     maindiv.removeChild(counterP);
  //     correctP.style.display = "block";

  //     correctP.style.color = "#999";
  //     speechP.style.color = "#999";

  //     speechStatus = 1;
  //     speech.start();
  //   }
  // }, 1000);
};

// ----------------- tongue twister -----------------
const nextBtn = document.getElementById("next-btn");
const retryBtn = document.getElementById("retry-btn");
const giveupBtn = document.getElementById("giveup-btn");

const rank = document.getElementById("rank");
const playAgainBtn = document.getElementById("play-again");

let textLists = [
  // 1-2 --- C
  // 3-5 --- B
  // 6-7 --- A
  // 8-9 --- A+
  // 10 --- S

  "I scream you scream we all scream for ice cream",
  "I saw a kitten eating chicken in the kitchen",

  "Freshly fried fresh fish",
  "He threw three free throws",
  "Four furious friends fought for the phone.",

  "Betty bought some butter but the butter is bitter",
  "She sells seashells by the seashore",

  "Nine nice night nurses nursing nicely",
  "Red lorry yellow lorry",

  "I slit the sheet that I slit and on the slitted sheet I sit",

  // ------ other tongue twister ------
  // "Fred fed Ted bread and Ted fed Fred bread",
  // "Smelly shoes and socks shock sisters."
  // "Peter Piper picked a peck of pickled peppers",
  // "How can a clam cram in a clean cream can",
  // "I slit the sheet, the sheet I slit, and on the slitted sheet I sit"
];
let doneTexts = [];

function createText() {
  correctP.textContent = textLists[0];

  const chosen = textLists.splice(0, 1);
  doneTexts.push(chosen);
}

let countWrong = 0;

const checkTextFunc = () =>
  setTimeout(() => {
    // speech.interimResults = false;

    const copyText = correctP.textContent;
    const copyText2 = textToUpperCase(speechP.textContent);
    correctP.textContent = "";
    speechP.textContent = "";
    const checkText1 = addSpanFunc(copyText, correctP);
    const checkText2 = addSpanFunc(copyText2, speechP);

    let longer = 0;
    let shorter = 0;
    if (checkText1.length >= checkText2.length) {
      longer = checkText1.length;
      shorter = checkText2.length;
    } else {
      longer = checkText2.length;
      shorter = checkText1.length;
    }

    for (let word = 0; word < shorter; word++) {
      let insideText = checkText1[word].textContent;
      let insideText2 = checkText2[word].textContent;

      if (insideText === insideText2) {
        checkText2[word].className = "add-blue";
      } else {
        checkText2[word].className = "add-red";
        countWrong++;
      }
    }

    if (longer !== shorter) {
      countWrong++;
    }

    afterCheck();
  }, 2500);

const afterCheck = () => {
  giveupBtn.addEventListener("click", giveup);

  if (countWrong === 0) {
    if (textLists.length) {
      btnGroup.style.display = "block";
      nextBtn.classList.remove("gray-btn");
      retryBtn.className = "gray-btn";

      retryBtn.removeEventListener("click", retry);
      nextBtn.addEventListener("click", next);
    } else {
      giveup();
    }
  } else {
    countWrong = 0;

    btnGroup.style.display = "block";
    retryBtn.classList.remove("gray-btn");
    nextBtn.className = "gray-btn";

    nextBtn.removeEventListener("click", next);
    retryBtn.addEventListener("click", retry);

    giveupBtn.addEventListener("click", giveup);
  }
};

// ----------------- btn function -----------------
const retry = () => {
  btnGroup.style.display = "none";
  speechP.innerHTML = "";
  if (speechStatus === 1) {
    speechStatus = 0;
    speech.stop();
  }
  speechStatus = 1;
  speech.start();
};

const next = () => {
  const count = document.getElementById("count");
  let countInt = parseInt(count.innerHTML);
  countInt += 1;
  count.innerHTML = countInt.toString();

  btnGroup.style.display = "none";
  speechP.innerHTML = "";
  createText();

  if (speechStatus === 1) {
    speechStatus = 0;
    speech.stop();
  }
  speechStatus = 1;
  speech.start();
};

const giveup = () => {
  correctP.style.display = "none";
  speechP.style.display = "none";
  btnGroup.style.display = "none";
  info.style.display = "none";

  maindiv.appendChild(endScreen);
  maindiv.classList.remove("grid-div");
  maindiv.classList.add("center-div");
  endScreen.style.display = "grid";

  switch (doneTexts.length) {
    //2, 3, 2, 2, 1
    case 0:
    case 1:
    case 2:
      rank.textContent = "C";
      rank.className = "rank-c";
      break;
    case 3:
    case 4:
    case 5:
      rank.textContent = "B";
      rank.className = "rank-b";
      break;
    case 6:
    case 7:
      rank.textContent = "A";
      rank.className = "rank-a";
      break;
    case 8:
    case 9:
      rank.innerHTML = "A<sup>+</sup>";
      rank.className = "rank-a-plus";
      break;
    case 10:
      rank.innerHTML = "S";
      rank.className = "rank-s";
      break;
  }
};

playAgainBtn.addEventListener("click", () => {
  location.reload();
});

// ----------------- icon onclick -----------------
const icon = document.getElementById("icon");

icon.addEventListener("click", () => {
  if (speechStatus === 1) {
    speechStatus = 0;
    speech.stop();
  }
  speechStatus = 1;
  speech.start();
});
