window.onload = (event) => {
  if (document.getElementById("suggestion-languages").childElementCount === 0) {
    document.getElementById("suggestion").style.display = "none";
  }
};

document.addEventListener('keydown', (event) => {
  switch(event.keyCode) {
    case 13:
      event.preventDefault();
      keydownLanguage('OK');
      break;
    case 38: // 위
      event.preventDefault();
      keydownLanguage('U');
      break;
    case 40:
      event.preventDefault();
      keydownLanguage('D');
      break;
    default:
      break;
  }
}, false);

let timer;
let cachedLanguages = {};

document.getElementById("search-input").oninput = function ({ target: { value } }) {
  if (value) {
    let languages = [];

    clearTimeout(timer);
    timer = setTimeout(async () => {
      if (value in cachedLanguages) {
        languages = cachedLanguages[value];
      } else {
        const response = await fetch(`https://wr4a6p937i.execute-api.ap-northeast-2.amazonaws.com/dev/languages?keyword=${value}`);
        const data = await response.json();
        if (data.length === 0) {
          document.getElementById("suggestion").style.display = "none";
        }
        cachedLanguages[value] = data;
        languages = data;
      }

      clearLanguages();
      appendLangages(languages, value);
    }, 400);
  }
};

const clearLanguages = () => {
  const elSuggestionLanguages = document.getElementById("suggestion-languages");
  elSuggestionLanguages.innerHTML = '';
}

const selectLanguage = (language) => {
  alert(language);
  const elSelectedLanguages = document.getElementById("selected-languages");

  const elExistLanguage = Array.from(elSelectedLanguages.childNodes).find((elSelectedLanguage) => {
    return elSelectedLanguage.innerText === language
  });

  if (elExistLanguage) {
    elSelectedLanguages.removeChild(elExistLanguage);
  }

  if (elSelectedLanguages.childNodes.length > 5) {
    elSelectedLanguages.firstElementChild.remove();
  }

  const elSelectedLanguage = document.createElement("li");
  elSelectedLanguage.appendChild(document.createTextNode(language));

  elSelectedLanguages.appendChild(elSelectedLanguage);
  elSelectedLanguages.appendChild(document.createTextNode(" "));
}

const appendLangages = (languages, keyword) => {
  const elSuggestionLanguages = document.getElementById("suggestion-languages");

  if (languages.length) {
    document.getElementById("suggestion").style.display = "block";

    languages.map(language => {
      const elLanguage = document.createElement("li");
      elLanguage.classList.add("Suggestion__item");
      elLanguage.innerHTML = language.replaceAll(new RegExp(`(${keyword})`, 'gi'), '<span class="Suggestion__item--matched">$1</span>');

      elLanguage.onclick = function({ target }) {
        selectLanguage(target.innerText);
      }
      elSuggestionLanguages.appendChild(elLanguage);
    });
  }
}

const keydownLanguage = (move) => {
  const elLanguages = document.getElementById("suggestion-languages").childNodes;

  const selectedLanguageNode = Array.from(elLanguages).find(elLanguage =>
    elLanguage.classList.contains("Suggestion__item--selected")
  );

  if (selectedLanguageNode) {
    selectedLanguageNode.classList.remove("Suggestion__item--selected")
    if (move === 'D') {
      if (selectedLanguageNode.nextSibling) {
        selectedLanguageNode.nextSibling.classList.add("Suggestion__item--selected");
      } else {
        elLanguages.item(0).classList.add("Suggestion__item--selected");
      }
    }
    if (move === 'U') {
      if (selectedLanguageNode.previousSibling) {
        selectedLanguageNode.previousSibling.classList.add("Suggestion__item--selected");
      } else {
        elLanguages.item(4).classList.add("Suggestion__item--selected");
      }
    }
    if (move === 'OK') {
      selectLanguage(selectedLanguageNode.innerText);
    }
  } else {
    elLanguages.item(0).classList.add("Suggestion__item--selected");
  }
}
