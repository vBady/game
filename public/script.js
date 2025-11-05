const posts = [
  {
    title: "Nowa playlista na lato",
    description:
      "Jedno z naszych ulubionych osób przygotowało playlistę z hitami na wakacje.",
    likedBy: "Ania",
    options: ["Ania", "Michał", "Ola", "Kuba"],
  },
  {
    title: "Zdjęcie z górskiej wyprawy",
    description:
      "Kto zareagował serduszkiem na panoramę z Tatr publikowaną wczoraj?",
    likedBy: "Bartek",
    options: ["Bartek", "Magda", "Dominika", "Piotr"],
  },
  {
    title: "Premiera nowego serialu",
    description:
      "Wszyscy mówią o nowym serialu sci-fi. Kto nie mógł się powstrzymać i dał lajka?",
    likedBy: "Magda",
    options: ["Kamil", "Magda", "Jan", "Lena"],
  },
  {
    title: "Domowe sushi",
    description:
      "Zgadnij, kto docenił wieczorną kolację z własnoręcznie zrobionego sushi.",
    likedBy: "Dominika",
    options: ["Dominika", "Tomek", "Kasia", "Piotr"],
  },
  {
    title: "Maraton charytatywny",
    description:
      "Jedna z osób zawsze wspiera akcje dobroczynne. Kto tym razem kliknął 'lubię to'?",
    likedBy: "Kamil",
    options: ["Paweł", "Kamil", "Natalia", "Ewa"],
  },
  {
    title: "Nowy level w ulubionej grze",
    description:
      "Kto jako pierwszy pogratulował zdobycia nowego poziomu w grze?",
    likedBy: "Ola",
    options: ["Ola", "Patryk", "Weronika", "Marta"],
  },
];

const TIMER_SECONDS = 30;

const elements = {
  score: document.querySelector("#score"),
  bestScore: document.querySelector("#best-score"),
  timer: document.querySelector("#timer"),
  postTitle: document.querySelector("#post-title"),
  postDescription: document.querySelector("#post-description"),
  options: document.querySelector("#options"),
  nextButton: document.querySelector("#next-button"),
  resetButton: document.querySelector("#reset-button"),
  template: document.querySelector("#option-template"),
};

let score = 0;
let bestScore = Number.parseInt(localStorage.getItem("bestScore") ?? "0", 10);
let timerId = null;
let remainingTime = TIMER_SECONDS;
let currentPost = null;

const shuffle = (array) => array.slice().sort(() => Math.random() - 0.5);

function pickPost() {
  const [post] = shuffle(posts);
  currentPost = {
    ...post,
    options: shuffle(post.options),
  };
}

function updateScoreboard() {
  elements.score.textContent = score.toString();
  elements.bestScore.textContent = bestScore.toString();
}

function updateTimer() {
  elements.timer.textContent = remainingTime.toString();
}

function setButtonsDisabled(disabled) {
  const buttons = elements.options.querySelectorAll(".option-button");
  buttons.forEach((btn) => {
    btn.disabled = disabled;
    if (disabled) {
      btn.classList.add("disabled");
    } else {
      btn.classList.remove("disabled");
      btn.classList.remove("correct", "incorrect");
    }
  });
}

function renderPost() {
  if (!currentPost) {
    pickPost();
  }

  if (!currentPost) {
    elements.postTitle.textContent = "Brak scenariuszy";
    elements.postDescription.textContent =
      "Dodaj posty w tablicy 'posts', aby rozpocząć grę.";
    elements.options.innerHTML = "";
    return;
  }

  elements.postTitle.textContent = currentPost.title;
  elements.postDescription.textContent = currentPost.description;
  elements.options.innerHTML = "";

  currentPost.options.forEach((name) => {
    const optionNode = elements.template.content
      .firstElementChild.cloneNode(true);
    const button = optionNode.querySelector(".option-button");
    button.textContent = name;
    button.addEventListener("click", () => handleGuess(name, button));
    elements.options.append(optionNode);
  });
}

function nextRound() {
  pickPost();
  renderPost();
  setButtonsDisabled(false);
  remainingTime = TIMER_SECONDS;
  updateTimer();
  startTimer();
}

function handleGuess(name, button) {
  if (!currentPost) {
    return;
  }

  const isCorrect = name === currentPost.likedBy;
  if (isCorrect) {
    score += 1;
    button.classList.add("correct");
  } else {
    button.classList.add("incorrect");
    revealCorrectAnswer();
  }

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore.toString());
  }

  updateScoreboard();
  stopTimer();
  setButtonsDisabled(true);
}

function revealCorrectAnswer() {
  const buttons = elements.options.querySelectorAll(".option-button");
  buttons.forEach((btn) => {
    if (btn.textContent === currentPost?.likedBy) {
      btn.classList.add("correct");
    }
  });
}

function startTimer() {
  stopTimer();
  timerId = window.setInterval(() => {
    remainingTime -= 1;
    updateTimer();

    if (remainingTime <= 0) {
      revealCorrectAnswer();
      setButtonsDisabled(true);
      stopTimer();
    }
  }, 1000);
}

function stopTimer() {
  if (timerId) {
    window.clearInterval(timerId);
    timerId = null;
  }
}

function resetGame() {
  score = 0;
  remainingTime = TIMER_SECONDS;
  updateScoreboard();
  updateTimer();
  nextRound();
}

elements.nextButton.addEventListener("click", () => {
  nextRound();
});

elements.resetButton.addEventListener("click", () => {
  score = 0;
  remainingTime = TIMER_SECONDS;
  updateScoreboard();
  updateTimer();
  nextRound();
});

updateScoreboard();
updateTimer();
nextRound();
