var ideas = [];

var bodyInput = document.querySelector('#body');
var saveButton = document.querySelector('.save-card');
var savedIdeasSection = document.querySelector(".idea-cards");
var searchBar = document.querySelector('#search');
var showStarredIdeasButton = document.querySelector('.show-starred');
var titleInput = document.querySelector('#title');


bodyInput.addEventListener('keyup', enableSaveButton);
titleInput.addEventListener('keyup', enableSaveButton);
saveButton.addEventListener('click', displayCard);
window.addEventListener('load', retrieveIdeasFromLocalStorage);
savedIdeasSection.addEventListener('click', handleDeleteOrFavoriteEvents);
showStarredIdeasButton.addEventListener('click', filterStarredIdeas);
searchBar.addEventListener('keyup', searchIdeas);


function enableSaveButton() {
  if (titleInput.value !== "" && bodyInput.value !== "") {
    saveButton.classList.add('enable');
    saveButton.disabled = false;
  } else {
    saveButton.classList.remove('enable');
    saveButton.disabled = true;
  }
};


function displayCard(event) {
  event.preventDefault();
  createCard();
  inputCardToHTML();
  persistFavoriteOnPageReload();
  clearInputFields();
};

function createCard() {
  var ideaCard = new Idea(titleInput.value, bodyInput.value);
  ideas.push(ideaCard);
  ideaCard.saveToStorage();
};

function inputCardToHTML() {
  savedIdeasSection.innerHTML = "";
  for (var i = 0; i < ideas.length; i++) {
    savedIdeasSection.innerHTML += `
    <article class="card">
      <div class="fav-or-delete" id="${ideas[i].id}">
        <img class="star" src="assets/star.svg">
        <img class="star-active hidden" src="assets/star-active.svg">
        <div class="delete"></div>
      </div>
      <div class="card-body">
        <h3>${ideas[i].title}</h3>
        <p>${ideas[i].body}</p>
      </div>
      <div class="comment">
        <img class="comment-image" src="assets/comment.svg">
        <h4 class="comment-text">Comment</h4>
      </div>
    </article>`
  }
};

function persistFavoriteOnPageReload() {
  var favorite = document.querySelectorAll(".star");
  var unfavorite = document.querySelectorAll(".star-active");
  favoriteCardsOnLocalStorage(favorite, unfavorite);
};

function favoriteCardsOnLocalStorage(star, starActive) {
  for (var i = 0; i < ideas.length; i++) {
    if (ideas[i].star === true) {
      star[i].classList.add('hidden');
      starActive[i].classList.remove('hidden');
    } else if (ideas[i].star === false) {
      starActive[i].classList.add('hidden');
      star[i].classList.remove('hidden');
    }
  }
};

function clearInputFields() {
  titleInput.value = null;
  bodyInput.value = null;
  saveButton.disabled = true;
  saveButton.classList.remove('enable');
};


function retrieveIdeasFromLocalStorage() {
  var localIdea;
  var parsedLocalIdea;
  var savedIdea;
  pushLocalStorageToIdeas();
  inputCardToHTML();
  persistFavoriteOnPageReload();
};

function pushLocalStorageToIdeas() {
  for (var i = 0; i < localStorage.length; i++) {
    localIdea = localStorage.getItem(localStorage.key(i));
    parsedLocalIdea = JSON.parse(localIdea);
    savedIdea = new Idea(parsedLocalIdea.title, parsedLocalIdea.body);
    savedIdea.id = parsedLocalIdea.id;
    savedIdea.star = parsedLocalIdea.star;
    ideas.push(savedIdea);
  }
};


function handleDeleteOrFavoriteEvents(event) {
  if (event.target.className === "delete") {
    removeCard();
  } else if (event.target.className === "star" || event.target.className === "star-active") {
    favoriteCard();
  }
};

function removeCard() {
  var cardID = event.target.parentElement.id;
  for (var i = 0; i < ideas.length; i++) {
    if (ideas[i].id == cardID) {
      ideas[i].deleteFromStorage();
      ideas.splice(i, 1);
      inputCardToHTML();
      persistFavoriteOnPageReload();
    }
  }
};

function favoriteCard() {
  if (event.target.className === 'star') {
    starOnAndOff();
  } else {
    starOnAndOff();
  }
};

function starOnAndOff() {
  var favorite = document.querySelectorAll(".star");
  var unfavorite = document.querySelectorAll(".star-active");
  var cardID = event.target.parentElement.id;
  toggleFavoriteIcon(cardID, favorite, unfavorite);
};

function toggleFavoriteIcon(cardID, star, starActive) {
  for (var i = 0; i < ideas.length; i++) {
    if (ideas[i].id == cardID && ideas[i].star === false) {
      ideas[i].star = true;
      ideas[i].saveToStorage();
      toggleIconOnAndOff(starActive[i], star[i]);
    } else if (ideas[i].id == cardID && ideas[i].star === true) {
      ideas[i].star = false;
      ideas[i].saveToStorage();
      toggleIconOnAndOff(star[i], starActive[i]);
    }
  }
};

function toggleIconOnAndOff(on, off) {
  on.classList.toggle('hidden');
  off.classList.toggle('hidden');
};


function filterStarredIdeas() {
  if (showStarredIdeasButton.innerText === "Show Starred Ideas") {
    showStarredIdeasButton.innerHTML = `<strong>Show All Ideas</strong>`;
    showOrHideFavoriteCards();
  } else if (showStarredIdeasButton.innerText === "Show All Ideas") {
    showStarredIdeasButton.innerHTML = `<strong>Show Starred Ideas</strong>`;
    showOrHideFavoriteCards();
  }
};

function showOrHideFavoriteCards() {
  var ideaCardArticle = document.querySelectorAll(".card");
  for (var i = 0; i < ideas.length; i++) {
    if (ideas[i].star === false) {
      ideaCardArticle[i].classList.toggle('hidden');
    }
  }
};


function searchIdeas() {
  var cardsToBeHidden = document.querySelectorAll('.card');
  for (var i = 0; i < ideas.length; i++) {
    if (ideas[i].title.includes(searchBar.value) || ideas[i].body.includes(searchBar.value)) {
      cardsToBeHidden[i].classList.remove('hidden');
    } else if (!ideas[i].title.includes(searchBar.value) || !ideas[i].body.includes(searchBar.value)) {
      cardsToBeHidden[i].classList.add('hidden');
    }
  }
};
