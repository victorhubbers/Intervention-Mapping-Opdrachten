const opdrachtVersie = 1;

let state = validate(
  JSON.parse(localStorage.getItem("communicatieMatrixState"))
) || {
  "Gedrags-verandering": {
    Bron: "",
    Voorlichtingsbericht: "",
    "Educatieve strategie": "",
    Ontvanger: "",
  },
  "Gedrags-behoud": {
    Bron: "",
    Voorlichtingsbericht: "",
    "Educatieve strategie": "",
    Ontvanger: "",
  },
};

render();

function render() {
  const table = document.querySelector("#container table");

  for (const row in state) {
    table.appendChild(constructTableRow(row));
  }
}

function constructTableRow(row) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <th>${row}</th>
    <td>
      <input 
      id="${row + "--Bron"}" 
      type="text" 
      placeholder="Begin met typen..." 
      value="${state[row].Bron}"
      oninput="updateState(event)" />
    </td>
    <td>
      <textarea 
        id="${row + "--Voorlichtingsbericht"}" 
        placeholder="Begin met typen..."
        oninput="updateState(event)"
        >${state[row].Voorlichtingsbericht}</textarea>
    </td>
    <td>
      <input 
        id="${row + "--Educatieve-strategie"}" 
        type="text" 
        placeholder="Begin met typen..." 
        value="${state[row]["Educatieve strategie"]}"
        oninput="updateState(event)" />
    </td>
    <td>
      <input 
        id="${row + "--Ontvanger"}" 
        type="text" 
        placeholder="Begin met typen..." 
        value="${state[row].Ontvanger}"
        oninput="updateState(event)" />
    </td>
  `;
  return tr;
}

function updateState(e) {
  let [row, column] = e.target.id.split("--");
  column = column.split("-").join(" ");

  let newState = { ...state };
  newState[row][column] = e.target.value;

  state = newState;

  newState.opdrachtVersie = opdrachtVersie;

  localStorage.setItem("communicatieMatrixState", JSON.stringify(newState));
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
