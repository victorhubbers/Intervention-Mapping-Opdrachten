const ANTWOORDEN = Object.freeze({
  STAP1: "Stap 1: Contact leggen met de patiëntengroep",
  STAP2: "Stap 2: Gedragsdeterminant",
  STAP3: "Stap 3: Gedragsverandering",
  STAP4: "Stap 4: Gedragsbehoud",
  STAP5: "Stap 5: Bevorderen zelfmanagement",
});

let state = {
  question1: {
    text: `Merel is begonnen met het maken van een plan waarin zij beschrijft hoe zij haar grenzen beter kan gaan aangeven. Ze gaat samen met de verpleegkundige uitdagende doelen opstellen. Hierdoor hoopt zij vooruitgang te maken in haar persoonlijke doelen.`,
    givenAnswer: "",
    correctAnswer: "STAP3",
  },
  question2: {
    text: `Het gaat nu goed met Merel en zij is in staat haar om grenzen goed aan te geven. Merel gaat nu af en toe naar de tijd naar de verpleegkundige om haar situatie en obstakels te bespreken. Hierop kan de verpleegkundige anticiperen en haar handvaten meegeven.`,
    givenAnswer: "",
    correctAnswer: "STAP5",
  },
  question3: {
    text: `Merel vindt het veranderen van haar gedrag best moeilijk. Hiervoor gaat zij kijken naar hoe andere studenten hun grenzen aangeven. Ook heeft Merel samen met de verpleegkundige een voor- en nadelen balans gemaakt om beter inzicht te krijgen in haar situatie.`,
    givenAnswer: "",
    correctAnswer: "STAP2",
  },
  question4: {
    text: `Merel is al goed op weg alleen is zij soms nog geneigd om samen met haar vrienden veel activiteiten te gaan ondernemen, waardoor de kans groot is dat ze terugvalt naar haar oude gedrag. Hiervoor heeft zij een plan opgesteld.`,
    givenAnswer: "",
    correctAnswer: "STAP4",
  },
  question5: {
    text: `De leraren van de school hebben al vaker gezien dat Merel niet lekker in haar vel zit en haar schoolresultaten achteruitgaan. Haar SLB’er is samen met Merel het gesprek aangegaan. Hier kwam naar voren dat Merel toch wel somber is. De SLB’er heeft aan Merel gevraagd of zij openstaat voor een gesprek met een GGD verpleegkundige. Merel heeft dit geaccepteerd en heeft de volgende dag een gesprek met de GGD verpleegkundige.`,
    givenAnswer: "",
    correctAnswer: "STAP1",
  },
};

render();

function render() {
  const container = document.getElementById("container");

  let i = 0;
  for (const question in state) {
    const questionContainer = document.createElement("div");
    questionContainer.classList.add("question-container");
    questionContainer.setAttribute("id", question);

    questionContainer.innerHTML = `
    <h3>Fragment ${++i}:</h3>
    <p>
      ${state[question].text}
    </p>
    <br />
    <h4>In welke stap zit Merel?</h4>
    <div class="multiple-choice-answers"></div>
             `;

    container.appendChild(questionContainer);

    for (const answer in ANTWOORDEN) {
      const MCA = document
        .getElementById(question)
        .querySelector(".multiple-choice-answers");
      MCA.appendChild(constructAnswerOption(question, answer));
    }
  }
  const nakijkBtn = document.createElement("button");
  nakijkBtn.id = "nakijken";
  nakijkBtn.style.display = "none";
  nakijkBtn.onclick = nakijken;
  nakijkBtn.innerText = "Nakijken";
  container.appendChild(nakijkBtn);
}

function constructAnswerOption(question, answer) {
  const answerOption = document.createElement("div");
  answerOption.classList.add("answer-option");
  const id = question + "-" + answer;

  answerOption.innerHTML = `
    <input
        type="radio"
        id="${id}"
        name="${question + "-ANTWOORDEN"}"
        value="${answer}"
        oninput="updateState(event)"
    />
    <label for="${id}">${ANTWOORDEN[answer]}</label>
  `;
  return answerOption;
}

function updateState(e) {
  const [question, answer] = e.target.id.split("-");

  let newState = { ...state };

  newState[question].givenAnswer = answer;

  state = newState;

  if (isEveryQuestionAnswered())
    document.getElementById("nakijken").style.display = "block";
}

function isEveryQuestionAnswered() {
  for (const question in state) {
    if (!state[question].givenAnswer) return false;
  }
  return true;
}

function nakijken() {
  const labels = document.querySelectorAll("label");

  labels.forEach((label) => {
    label.classList.remove("correct");
    label.classList.remove("incorrect");
  });

  let score = 0;
  for (const question in state) {
    const isCorrect =
      state[question].givenAnswer === state[question].correctAnswer;

    const correctAnswerLabel = document.getElementById(
      question + "-" + state[question].correctAnswer
    ).nextElementSibling;

    correctAnswerLabel.classList.add("correct");

    if (!isCorrect) {
      const wrongAnswerLabel = document.getElementById(
        question + "-" + state[question].givenAnswer
      ).nextElementSibling;

      wrongAnswerLabel.classList.add("incorrect");
    }
  }
}
