const voorCounter = document.getElementById("voor-counter");
const naCounter = document.getElementById("na-counter");
const rotatingItems = document.querySelectorAll(".rotating");
const errorElem = document.getElementById("error");
const itemList = document.getElementById("statements");
const itemInput = document.getElementById("item");
const listVoor = document.getElementById("finished-voor");
const listNa = document.getElementById("finished-na");

const opdrachtVersie = 2; //verander dit versienummer wanneer vragen of antwoorden zijn aangepast.
let state = init();

function onClick(e) {
  const weight = parseInt(
    e.target.parentElement.children[1].children[1].children[0].value
  );

  if (!weight && weight !== 0) {
    errorElem.style.opacity = "100";
  } else {
    errorElem.style.opacity = "0";

    const isVoor = e.target.textContent.trim() === "VOOR";

    update(isVoor, weight);
    const item = e.target.parentElement;

    item.style.transform = "scale(.5)";
    item.style.opacity = "0%";

    setTimeout(() => {
      item.remove();
      markItemAsFinished({
        text: e.target.parentElement.children[1].children[0].textContent,
        weight,
        isVoor,
      });
    }, 350);
  }
}

function update(isVoor, weight) {
  const counterToBeUpdated = isVoor ? voorCounter : naCounter;
  counterToBeUpdated.textContent =
    parseInt(counterToBeUpdated.textContent) + weight;

  if (isVoor) state.totaalVoor += weight;
  else state.totaalNa += weight;

  state.difference =
    state.totaalNa - state.totaalVoor > 20
      ? 20
      : state.totaalNa - state.totaalVoor < -20
      ? -20
      : state.totaalNa - state.totaalVoor;

  rotatingItems.forEach((item) => {
    item.style.transform = `rotate(${state.difference}deg)`;
  });
}

function submitNewItem() {
  const item = itemInput.value;

  if (item) {
    addListItem(item);
    state.items.push(item);
    itemInput.value = "";

    updateLocalStorage();
  }
}

function addListItem(item) {
  const li = document.createElement("li");
  li.setAttribute("class", "list-item");
  li.innerHTML = `
      <button onclick="onClick(event)" style="background-color: #78da93">
              VOOR
      </button>
      <p>
          <span>${item}</span>
          <span
            style="
              margin-left: 2em;
              display: inline-flex;
              align-items: center;
            "
          >
            gewicht:
            <input id="weight" type="number" min="0" max="10" />
          </span>
      </p>
      <button onclick="onClick(event)" style="background-color: #da7878">
          NA
      </button>
  `;
  itemList.insertBefore(li, itemList.children[itemList.children.length - 1]);
}

function markItemAsFinished(item) {
  if (item.isVoor) state.voorItems.push(item);
  else state.naItems.push(item);

  state.items = state.items.filter((i) => {
    return item.text !== i;
  });

  addFinishedListItem(item);
  updateLocalStorage();
}

function addFinishedListItem(item) {
  const list = item.isVoor ? listVoor : listNa;
  const li = document.createElement("li");
  li.innerHTML = `
        <p>
          <span>${item.text}</span>
          <span
            style="
              margin-left: 2em;
              display: inline-flex;
              align-items: center;
            "
          >
            gewicht:
            <span style="margin: 0 1em">${item.weight}</span>
          </span>
        </p>
  `;
  list.appendChild(li);
}

function reset() {
  localStorage.removeItem("weegschaalState");
  document.querySelectorAll(".list-item").forEach((node) => {
    node.remove();
  });
  listVoor.innerHTML = "";
  listNa.innerHTML = "";
  state = init();
}

function updateLocalStorage() {
  state.opdrachtVersie = opdrachtVersie;
  localStorage.setItem("weegschaalState", JSON.stringify(state));
}

function init() {
  const state = validate(
    JSON.parse(localStorage.getItem("weegschaalState"))
  ) || {
    totaalVoor: 0,
    totaalNa: 0,
    difference: 0,
    items: shuffle([
      "Minder kans op een SOA",
      "Minder kans op zwanger raken",
      "Merel behoudt haar zelfrespect",
      "Een condoom is makkelijk in gebruik",
      "Merel hoeft geen hormonen (pil) te slikken",
      "Seks met condoom kan minder fijn zijn",
      "Je moet er aan denken om condooms bij je te hebben",
      "Condooms zijn duur",
      "De kans dat de relatie stuk loopt tussen Merel en Jorn is er, omdat Jorn het liever zonder condoom doet en Merel liever met",
    ]),
    voorItems: [],
    naItems: [],
  };

  state.items.forEach((item) => {
    addListItem(item);
  });
  state.voorItems.forEach((item) => {
    addFinishedListItem(item);
  });
  state.naItems.forEach((item) => {
    addFinishedListItem(item);
  });
  rotatingItems.forEach((item) => {
    item.style.transform = `rotate(${state.difference}deg)`;
  });
  voorCounter.textContent = state.totaalVoor;
  naCounter.textContent = state.totaalNa;

  return state;
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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
