const opdrachtVersie = 2; //verander dit versienummer wanneer vragen of antwoorden zijn aangepast.
const state = init();

window.onresize = function () {
  const answerAreas = document.querySelectorAll("textarea.correctAnswer");

  if (answerAreas) answerAreas.forEach((area) => textAreaAdjust(area));
};

function init() {
  const questionList = document.getElementById("question-list");

  const oldState = validate(JSON.parse(localStorage.getItem("ASEstate"))) || {
    question1: {
      text:
        "Welke gedragsdeterminanten (ASE- model) kun je ontdekken in deze casus?",
      givenAnswer: "",
      correctAnswer: `Voorbeeldantwoord: 

      Gewenste gedrag:  
  
          - Beter in haar vel laten voelen.
      
      Vaardigheden:
  
          - Voor jezelf opkomen.
          - Niet bang zijn om je eigen identiteit te laten zien.       
          - Grenzen aangeven. 
  
      Barrière:  
  
          - Sociale situatie met huisgenoten. 
          - Niet voor zichzelf op durven te komen.   
          - Geen grenzen aangeven.   
  
      Intentie:  
  
          - Merel denkt erover na om naar de GGD te gaan.
  
      Attitude: 
  
          - Als ik mij anders gedraag dan andere mensen, hoor ik er misschien niet bij en val ik buiten de groep. Maar als ik mijzelf blijf, leef ik gezonder en zit ik beter in mijn vel.  
     
      Subjectieve normen/sociale invloed:  
        
          - Merel laat zich snel leiden door andere personen. Wil graag binnen de groep passen en doet hierdoor dingen wat ze normaal niet zou doen.  
      
      Waargenomen gedragscontrole of eigen effectiviteit:      
         
          - Merel veranderd door het zien van andere gedrag in een nieuwe omgeving. Durft hier dan weinig tot niets van te zeggen en gaat mee in dit (slechte) gedrag.  
  
      Externe variabelen:  
  
          - Individueel: Merel is een onzeker meisje, die zich snel laat leiden door groepsdruk met alle gevolgen van dien.  
          - Sociale externe variabelen: Merel is een vrouw van 18 jaar, ze start met de HBO-V opleiding, is opgegroeid in een rustig en vertrouwde omgeving en zit nu op kamers in een grote studentenstad.       
          - Informatiegerichte externe variabelen: Merel wordt beïnvloed door sociale media en heeft onvoldoende kennis over het gebruik van drugs en het doen van onveilige seks. Merel voelt zich onrustig over de gemaakte studiekeuze door mediaberichten en de verhalen van huisgenoten.
          `,
    },
    question2: {
      text:
        "Welke determinanten zijn het belangrijkste en verdienen prioriteit? Waarom?",
      givenAnswer: "",
      correctAnswer: `Voorbeeld antwoord (mogelijke prioriteiten): 

      Prioriteit 1: Drugs en onveilige seks, omdat dit een groot risico met zich meebrengt.
      Prioriteit 2: Slechte slaap, waardoor Merel nergens energie voor heeft.
      Prioriteit 3: Onrust over studiekeuze, omdat dit ook invloed heeft op het slaapprobleem van Merel.`,
    },
    question3: {
      text: "Zijn de determinanten met voorlichting te beïnvloeden? Hoe?",
      givenAnswer: "",
      correctAnswer: `Voorbeeld antwoord: 

      Er zijn zeker een aantal determinanten met voorlichting te beïnvloeden. Denk hierbij aan de sociale invloed op het leven van Merel. Merel wil er graag bij horen en gaat zich aan deze situatie aanpassen. Door in aanraking te komen met verkeerde huisgenoten/vrienden, laat Merel zich meetrekken in de situatie. Merel zou individuele voorlichting kunnen ontvangen over het voor zichzelf opkomen, maar ook zeker rondom drugs, onveilige seks, gezonde leefstijl etc.  `,
    },
    question4: {
      text:
        "Zijn er ook omgevingsfactoren die beïnvloed kunnen of moeten worden? Hoe?",
      givenAnswer: "",
      correctAnswer: `Voorbeeld antwoord: 

      De vrienden van de studentenvereniging zouden beïnvloed en aangesproken kunnen wordenop hun gedrag. Denk hierbij aan groepsvoorlichtingen waarbij de risico’s rondom drugs en onveilige seks naar voren komen. Dit zorgt voor mogelijk meer begrip en minder van dit gedrag. Mochten de vrienden van Merel niet openstaan voor verandering, dan zou Merel een andere omgeving kunnen zoeken met nieuwe vrienden.`,
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
  localStorage.setItem("ASEstate", JSON.stringify(newState));
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
