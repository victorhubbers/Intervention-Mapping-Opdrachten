const fases = {
  Preparatie:
    "‘Het slaapgebrek heeft nu al een tijd invloed op mijn schoolprestaties. Dit moet anders en ik ga erover nadenken hoe ik dit het beste kan aanpakken.’",
  Actie:
    "‘Ik neem mijn verantwoordelijkheid door een feestje te missen en ik ga mijn gedrag veranderen zodat ik betere schoolresultaten behaal.’",
  "Pre- contemplatie":
    "‘Ik kan er niks aan doen dat ik te weinig slaap, dat komt door de stadsgeluiden en het hoort bij een studentenleven.’",
  Consolidatie:
    "‘Ik slaap door de week nu aan een stuk door, dus ik zie dat mijn plan werkt. Ik ga dit proberen vol te houden en beloon mezelf door in het weekend uit te gaan’.",
  Contemplatie:
    "‘Soms is het verstandiger om door de weeks eerder naar bed te gaan omdat ik de laatste tijd wel eens in slaap val tijdens de lessen, maar ik wil ook geen huisfeest missen.’",
};

for (const fase in fases) {
  document
    .getElementById("container")
    .appendChild(constructDragBoxContainer(fase, fases[fase]));
}

function nakijken() {
  const dragBoxes = document.querySelectorAll(".drag-box");

  dragBoxes.forEach((box) => {
    const correctAnswer = box.parentElement.getAttribute("fase");
    const givenAnswer = box.firstElementChild.getAttribute("fase");

    const isCorrect = correctAnswer === givenAnswer;

    const bgColor = isCorrect ? "#78DA93" : "#DA7878";
    box.style.backgroundColor = bgColor;
  });
}

function onDragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
}

function onDragOver(e) {
  e.preventDefault();
}

function onDrop(e) {
  if (e.preventDefault) e.preventDefault();
  if (e.stopPropagation) e.stopPropagation();

  const id = e.dataTransfer.getData("text/plain");
  const draggedElem = document.getElementById(id);

  let target;
  let el = e.target;
  while (el) {
    if (el.classList && el.classList.contains("drag-box")) {
      target = el;
      el = "";
    } else {
      el = el.parentElement;
    }
  }

  swap(draggedElem, target.children[0]);

  const answersList = document.getElementById("answers");
  const ele = document.getElementById("nakijk-container");
  if (answersList.childElementCount === 0)
    ele.innerHTML = `<button id="nakijken" onclick="nakijken()">Nakijken</button>`;
}

function swap(node1, node2) {
  if (node1 === node2) return;
  const shouldRemove =
    !node1.parentElement.classList.contains("drag-box") &&
    node2.tagName === "P";

  const node2Parent = node2.parentElement;
  const temp = node1.cloneNode(true);

  node1.parentElement.replaceChild(node2, node1);
  node2Parent.appendChild(temp);

  if (shouldRemove) node2.remove();
}

function constructDragBoxContainer(fase, description) {
  const dragBox = document.createElement("div");
  dragBox.classList.add("drag-box-container");

  dragBox.setAttribute("fase", fase);
  dragBox.innerHTML = `
          <p>
            ${description}
          </p>
          <div
            class="drag-box"
            ondragover="onDragOver(event)"
            ondrop="onDrop(event)"
          >
            <p>Sleep de juiste fase naar dit vak</p>
          </div>
        `;

  return dragBox;
}
