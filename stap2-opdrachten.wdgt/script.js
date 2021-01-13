const opdrachtVersie = 2; //verander dit versienummer wanneer vragen of antwoorden zijn aangepast.
const state = init();

window.onresize = function () {
  const answerAreas = document.querySelectorAll("textarea.correctAnswer");

  if (answerAreas) answerAreas.forEach((area) => textAreaAdjust(area));
};

function init() {
  const questionList = document.getElementById("question-list");

  const oldState = validate(JSON.parse(localStorage.getItem("stap2State"))) || {
    question1: {
      text: "Formuleer twee passende gedragsdoelen voor Merel.",
      givenAnswer: "",
      correctAnswer: `Voorbeeldantwoorden:
        
      - Merel maakt een plan om haar eigen grenzen beter aan te geven.  
      - Merel heeft kennis opgezocht over veilig vrijen.  
      - Merel maakt een plan hoe zij betere prioriteiten kan stellen met de studie en de sociale activiteiten.  
      - Merel geeft haar belemmering van het slapen aan tegen haar huisgenoten.  `,
    },
    question2: {
      text: "Formuleer twee passende veranderdoelen voor Merel.",
      givenAnswer: "",
      correctAnswer: `Voorbeeldantwoorden:  
  
      - Merel is in staat om duidelijk haar eigen grenzen aan te geven om haar eigen effectiviteit te vergroten.  
      - Merel weet wat veilig vrijen inhoud en is in staat dit te kunnen toepassen.  
      - Merel kan het “studentenleven” en het studeren goed combineren  
      - Merel maakt samen met haar huisgenoten afspraken met betrekking tot geluidsoverlast, zodat zij beter kan gaan slapen   `,
    },
    question3: {
      text:
        "Formuleer drie passende evaluatievragen voor Merel die je kunt stellen tijdens en na het doorlopen van stap 2.",
      givenAnswer: "",
      correctAnswer: `Voorbeeldantwoorden:  
  
      - Was er voldoende tijd om het de gedrags- en veranderdoelen te behalen?  
      - Zijn de prioriteiten van de cliënt gewijzigd?  
      - Is de cliënt het eens met de opgestelde doelen?  
      - Zijn de verpleegkundige instructies voldoende toegelicht?  
      - Heeft de verpleegkundige de cliënt bij iedere stap van de ontwikkeling en uitvoering van het plan betrokken?  
      - Zijn de doelen bereikt?  `,
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

function textAreaAdjust(element) {
  element.style.height = "1px";
  element.style.height = 15 + element.scrollHeight + "px";
}

function updateLocalStorage() {
  let newState = { ...state };

  const answers = document.querySelectorAll("textarea.givenAnswer");

  answers.forEach((el) => {
    newState[el.id].givenAnswer = el.value;
  });

  newState.opdrachtVersie = opdrachtVersie;
  localStorage.setItem("stap2State", JSON.stringify(newState));
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
