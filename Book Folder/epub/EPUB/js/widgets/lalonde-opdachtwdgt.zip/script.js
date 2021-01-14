const items = [
  "Biologische factoren",
  "Omgeving",
  "Voorzieningen gezondheidszorg",
  "Leefstijl",
];

init();

function init() {
  const grid = document.getElementById("grid-container");

  items.forEach((item) => {
    grid.appendChild(constructItem(item));
  });

  const oldState = JSON.parse(localStorage.getItem("lalondeState"));
  if (oldState) {
    items.forEach((item) => {
      const tag = item.substring(0, 3);
      const textarea = document.getElementById(tag);
      textarea.value = oldState[tag];
    });
  }

  function constructItem(item) {
    const elem = document.createElement("div");
    const tag = item.substring(0, 3);
    elem.classList.add(tag);
    elem.classList.add("input-box-container");

    elem.innerHTML = `
    <div class="input-box-header">
        <p>${item}</p>
    </div>
    <div class="input-box">
        <textarea 
            id="${tag}" 
            oninput=updateLocalStorage()
            placeholder="Begin met typen..."
        ></textarea>
    </div>
  `;
    return elem;
  }
}

function updateLocalStorage() {
  let newState = {};

  items.forEach((item) => {
    const tag = item.substring(0, 3);
    const textarea = document.getElementById(tag);
    newState[tag] = textarea.value;
  });

  localStorage.setItem("lalondeState", JSON.stringify(newState));
}
