window.onload = (event) => {
  if (document.getElementById("suggestion-languages").childElementCount === 0) {
    document.getElementById("suggestion").style.display = "none";
  }

  document.getElementById("search-input").focus()
};

document.addEventListener('keydown', function (event) {
  switch(event.keyCode) {
    case 13:
      keydownLanguage('OK');
    case 38:
      keydownLanguage('U');
    case 40:
      keydownLanguage('D');
    default:
      break;
  }
}, false);

document.getElementById("search-input").oninput = ({ target: { value } }) => {
  fetch(`https://wr4a6p937i.execute-api.ap-northeast-2.amazonaws.com/dev/languages?keyword=${value}`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      if (data.length === 0) {
        document.getElementById("suggestion").style.display = "none";
      }

      clearLanguages();
      appendLangages(data, value);
    });
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
}

const appendLangages = (languages, keyword) => {
  const elSuggestionLanguages = document.getElementById("suggestion-languages");

  if (languages.length) {
    document.getElementById("suggestion").style.display = "block";

    languages.map(language => {
      const elLanguage = document.createElement("li");
      elLanguage.classList.add("Suggestion__item");
      elLanguage.appendChild(document.createTextNode(language));

      const spanMatchedLanguage = document.createElement("span");
      spanMatchedLanguage.classList.add("Suggestion__item--matched");
      spanMatchedLanguage.innerHTML = elLanguage.outerHTML;

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
