/*** Place your javascript code below ***/

function genertateDictionary() {
  return {
    Epidemiologie:
      "Epidemiologie is de wetenschappelijke studie van het vóórkomen en de verspreiding van ziekten binnen en tussen populaties.",
    Morbiditeit:
      "Morbiditeit is de verhouding van het aantal lijders aan een bepaalde ziekte tot de gehele bevolking. Morbiditeit wordt meestal uitgedrukt per 100.000 inwoners en per jaar.",
    Multimorbiditeit:
      "Multimorbiditeit betekent dat er meerdere chronische aandoeningen tegelijkertijd aanwezig zijn, die elkaar onderling beïnvloeden.",
    "Ethische overwegingen": "Ethische overwegingen zijn keuzes die je maakt op basis van je eigen normen en waarden. Er is geen sprake van goede of foute afwegingen.",
    Oedeem: "Oedeem is de aanwezigheid van vocht op plaatsen in het lichaam waar vocht normaal niet of nauwelijks aanwezig is. Voorbeelden zijn de enkels, de buik of de longen.",
    Risicoperceptie: "Geeft aan of mensen het een groot risico vinden of niet.",
    Ambivalentie: "Twee tegenovergestelde gedachtes of gevoelens ervaren. Ambivalentie is het begin van gedragsverandering. Vooral als je iets nieuws wilt.",
    "Selectieve waarneming": "Selectieve waarneming betekent dat een patiënt niet gemotiveerd is om naar bepaalde informatie te luisteren.",
    "Selectieve blootstelling": " Selectieve blootstelling maakt dat een patiënt een bepaald voorlichtingsbericht dat voor hem is bestemd niet oppikt als gevolg van de situatie waarin hij zich bevindt.",
  };
}

// LET OP, PAS HIERONDER NIETS AAN TENZIJ U KENNIS HEBT VAN HTML, CSS EN JAVASCRIPT.


function generateTemplate() {
  const template = document.createElement("template");
  template.innerHTML = `
      <style>
          #tooltip-container {
              display: inline-block;
              position: relative;
              z-index: 2;
          }
  
          #info-container {
              position: fixed;
              z-index: 2;
              width: 300px;
              background: linear-gradient(101.9deg, #694D75 -25.86%, #9668AA 148.81%);
              color: #FFF2F1;
              box-shadow: 5px 5px 10px rgba(0,0,0,0.1);
              font-size: .8em;
              text-align: left;
              border-radius: .5em;
              padding: 1em;
              transform: scale(0) translateY(-100%);
              transform-origin: top left;
              transition: transform .3s ease-in-out;
          }
      </style>
  
      <div id="tooltip-container">
          <div style="display: flex; justify-content: space-between;">
              <slot name="keyword" style="color: #694D75"></slot>  
              <div id="info-container">
                  <slot name="info" />    
              </div>
          </div>
      </div>
  `;
  return template;
}

if (!customElements.get("custom-tooltip")) {
  window.customElements.define(
    "custom-tooltip",
    class extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(generateTemplate().content.cloneNode(true));
      }

      toggleTooltip(tooltipState) {
        const infoContainer = this.shadowRoot.getElementById("info-container");

        if (tooltipState)
          infoContainer.style.transform = "scale(1) translateY(-100%)";
        else infoContainer.style.transform = "scale(0) translateY(-100%)";
      }

      connectedCallback() {
        this.shadowRoot
          .getElementById("tooltip-container")
          .addEventListener("mouseenter", () => {
            this.toggleTooltip(true);
          });
        this.shadowRoot
          .getElementById("tooltip-container")
          .addEventListener("mouseleave", () => {
            this.toggleTooltip(false);
          });
      }
    }
  );
}

var previousTextNode;
for (const keyword in genertateDictionary()) {
  const dictionary = genertateDictionary();
  const element = document.getElementById("epubInner");

  // Replace the keyword with capital and non capital starting letter.
  replaceInText(
    element,
    new RegExp("\\b" + keyword + "\\b"),
    `<custom-tooltip>
          <strong slot="keyword">${keyword}</strong>
          <span slot="info">${dictionary[keyword]}</span>
      </custom-tooltip>`
  );
  replaceInText(
    element,
    new RegExp("\\b" + keyword.toLowerCase() + "\\b"),
    `<custom-tooltip>
          <strong slot="keyword">${keyword.toLowerCase()}</strong>
          <span slot="info">${dictionary[keyword]}</span>
      </custom-tooltip>`
  );
}

function replaceInText(element, pattern, replacement) {
  for (let node of element.childNodes) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        //avoid recursive tooltips
        if (!(node.tagName === "CUSTOM-TOOLTIP")) {
          replaceInText(node, pattern, replacement);
        }
        break;
      case Node.TEXT_NODE:
        if (node.textContent.match(pattern)) {
          let newNode = document.createElement("span");
          newNode.innerHTML = node.textContent.replace(pattern, replacement);
          node.parentNode.replaceChild(newNode, node);
        } else if (previousTextNode && previousTextNode.textContent.trim()) {
          let combinedWords = previousTextNode.textContent + node.textContent;
          if (combinedWords.match(pattern)) {
            let newNode = document.createElement("span");
            newNode.innerHTML = combinedWords.replace(pattern, replacement);
            node.parentNode.replaceChild(newNode, node);
            previousTextNode.remove();
          }
          previousTextNode = node;
        } else {
          previousTextNode = node;
        }
        break;
      case Node.DOCUMENT_NODE:
        replaceInText(node, pattern, replacement);
    }
  }
}
