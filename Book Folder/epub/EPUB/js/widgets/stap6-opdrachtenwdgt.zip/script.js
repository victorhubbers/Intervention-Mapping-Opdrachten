const opdrachtVersie = 1; //verander dit versienummer wanneer vragen of antwoorden zijn aangepast.
const state = init();

window.onresize = function () {
  const answerAreas = document.querySelectorAll("textarea.correctAnswer");

  if (answerAreas) answerAreas.forEach((area) => textAreaAdjust(area));
};

function init() {
  const questionList = document.getElementById("question-list");

  const oldState = validate(JSON.parse(localStorage.getItem("stap6State"))) || {
    question1: {
      text: "Formuleer twee passende procesevaluatievragen.",
      givenAnswer: "",
      correctAnswer: `Voorbeeldantwoorden:  
  
      - Hoe heeft Merel de gesprekken met de GGD verpleegkundige ervaren?  
      - Hoe verliep de communicatie tussen de GGD verpleegkundige en Merel? 
      - Zijn de gesprekken tussen de GGD verpleegkundige en Merel effectief en gestructureerd verlopen?`,
    },
    question2: {
      text: "Formuleer twee passende effectevaluatievragen.",
      givenAnswer: "",
      correctAnswer: `Voorbeeldantwoorden:  
  
      - Heeft Merel het gewenste doel bereikt? 
      - Weet Merel hoe ze nu verder moet met haar dilemma’s omtrent jongens?`,
    },
  };

  for (const question in oldState) {
    const li = document.createElement("li");
    li.innerHTML = `
            <h4>
                ${oldState[question].text}
            </h4>
            <textarea 
              class="givenAnswer" 
              id="${question}" 
              placeholder="Begin met typen..."
              oninput=updateLocalStorage()
            >${oldState[question].givenAnswer}</textarea>
         `;
    questionList.appendChild(li);
  }

  return oldState;
}

function nakijken(e) {
  for (const question in state) {
    const parentElement = document.getElementById(question).parentElement;
    const answerArea = document.createElement("textarea");
    answerArea.classList.add("correctAnswer");
    answerArea.setAttribute("disabled", true);

    answerArea.innerHTML = state[question].correctAnswer;

    parentElement.appendChild(answerArea);
    textAreaAdjust(answerArea);
  }

  e.target.parentElement.removeChild(e.target);
}

function updateLocalStorage() {
  let newState = { ...state };

  const answers = document.querySelectorAll("textarea.givenAnswer");

  answers.forEach((el) => {
    newState[el.id].givenAnswer = el.value;
  });

  newState.opdrachtVersie = opdrachtVersie;
  localStorage.setItem("stap6State", JSON.stringify(newState));
}

/**
 * textAreaAdjust(element) zorgt ervoor dat de vakken van de voorbeeldantwoorden
 * de juiste hoogte hebben.
 *
 * */

function textAreaAdjust(element) {
  element.style.height = "1px";
  element.style.height = 15 + element.scrollHeight + "px";
}

/**
 * validate(obj) kijkt of obj (uit localstorage) nog up-to-date is met
 * mogelijke veranderingen in de opdrachten/antwoorden.
 *
 **/
function validate(obj) {
  if (!obj || !obj.opdrachtVersie) {
    return false;
  } else if (obj.opdrachtVersie !== opdrachtVersie) {
    return false;
  } else {
    delete obj.opdrachtVersie;
    return obj;
  }
}
