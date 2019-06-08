// CARD Object declaration
function card(symbol,symbolDescription){
  this.symbol = symbol;
  this.symbolDescription = symbolDescription;
}

// SHUFFLES AN ARRAY (of cards) using Fisher–Yates algorithm
function shuffleArray(series){
  for (let i = 0; i < series.length; i++){
    let randomPos = Math.floor(Math.random()*series.length);
    let temp = series[randomPos];
    series[randomPos] = series[series.length-i-1];
    series[series.length-i-1] = temp;
  }
}//enf funcion shuffleArray

// LOADS CARDS TO THE BOARD
function loadCardsToHtml(series){
  let tabIndex = 1;
  let msgHTML = "";
  for ( let card of series) {
    msgHTML += `<li data-type="${card.symbolDescription}" class="card face__down" alt="card${tabIndex}" tabIndex="${tabIndex++}"> ${card.symbol} </li> \n`;
  }
  board.innerHTML = msgHTML;
}//end loadCardsToHtml

// HIDES AND RESETS CONTENT IN WIN POPUP WINDOW after wining a game
function hideWinPopupWindow(){
  // disable reset game button while popup window is being displayed
  const reset = document.getElementById("reset");
  reset.classList.toggle("disable");
  // hides popup window
  const wmContainer = document.getElementById("win__message__popup");
  wmContainer.classList.toggle("visible");
  // resets popup window content to initial values
  const ratings = document.getElementById("wm__rating");
  ratings.textContent = "Rating: ";
  const wmMoves = document.getElementById("wm__moves");
  wmMoves.textContent = "Moves: ";
  const wmTime = document.getElementById("wm__time");
  wmTime.textContent = "Time: ";
  // once the popup window has been closed the game will be restarted
  resetGame();
}

// UDATES POPUP WINDOW WITH CURRENT SCORES AND DISPLAYS IT
function displayWinMessage(){
  let cButton = document.getElementById("continue__button");
  indexCardInFocus = 1;
  cButton.setAttribute(`tabIndex`,`${indexCardInFocus}`);
  window.setTimeout(function () { document.getElementById('continue__button').focus(); }, 0);
  const reset = document.getElementById("reset");
  reset.classList.toggle("disable");
  const ratings = document.getElementById("rating");
  const wmRating = document.getElementById("wm__rating");
  wmRating.textContent = wmRating.textContent + ratings.textContent;
  const wmMoves = document.getElementById("wm__moves");
  wmMoves.textContent += counterMoves;
  const wmTime = document.getElementById("wm__time");
  const timer = document.getElementById("timer");
  wmTime.textContent = wmTime.textContent + timer.textContent;
  const wmContinueButton = document.getElementById("continue__button");
  wmContinueButton.addEventListener('click', hideWinPopupWindow);
  const wmContainer = document.getElementById("win__message__popup");
  wmContainer.classList.toggle("visible");
}

// VERIFIES IF PLAYER WINS by checking that all cards are open and matched
function checkWinGame(){
  if (matchedCards == cards.length/2){
    win = true;
    displayWinMessage();
  }
}

// FORMATS AND DISPLAYS TIME ON SCREEN EVERY SECOND
function updateTimerOnScreen(){
  seconds++;
  let stringTime = "";
  if(seconds==60){
    minutes++;
    seconds=0;
  }
  // display seconds and minutes in the format 00:00 mm:ss
  (minutes<10)? stringTime += "0"+minutes: stringTime += minutes;
  (seconds<10)? stringTime += ":0"+seconds: stringTime += ":"+seconds;
  const timerDisplay = document.getElementById('timer');
  timerDisplay.textContent = stringTime;
  if (win){
    clearInterval(timer);
  }
}

// STARTS THE TIMER as soon as player has opened two cards (has attempted one match, in other words has made a move)
function startTimer(){
  // setTimeOut could have been used, but it would have to be recursively called, which can me done automatically with setInterval
  timer = setInterval(updateTimerOnScreen,1000);
}

function updateMovesOnScreen(){
  counterMoves++;
  if (counterMoves==1){
    startTimer() ;
  }
  const moves = document.getElementById('moves');
  moves.textContent = counterMoves;
}

function updateRatingsOnScreen(){
  const rating = document.getElementById('rating');
  if (counterMoves <= (cards.length - cards.length/4)){
    rating.textContent = "⭐ ⭐ ⭐";
  }
  if (counterMoves > (cards.length - cards.length/4) && (counterMoves <= cards.length)){
    rating.textContent = "⭐ ⭐";
  }
  if (counterMoves > cards.length){
    rating.textContent = "⭐";
  }
}

// VERIFIES IF 2 CARDS MATCH (the 2 cards stored in cardsToMatch array. if they match they will be disable otherwise the will be placed facedown and ready to be clicked again)
function checkMatch(){
  cardsToMatch[0].classList.toggle('show__Animation');
  cardsToMatch[1].classList.toggle('show__Animation');
  if(cardsToMatch[0].getAttribute("data-type")==cardsToMatch[1].getAttribute("data-type")){
    // if the cards match then you will not ba able to click on them again
    cardsToMatch[0].classList.toggle('disable');
    cardsToMatch[1].classList.toggle('disable');
    cardsToMatch[0].setAttribute('tabIndex','-1');
    cardsToMatch[1].setAttribute('tabIndex','-1');
    // if a match is found then the keyboard focus will jump to the next available card
    if (matchedCards < Math.floor((cards.length/2)-1)){
      jumpToNext();
      document.querySelector(`li[tabIndex='${indexCardInFocus}']`).focus();
    }
    matchedCards++;
  }else{
    //if the cards didnt match the cards will be flipped face down and be ready to be clicked on again
    cardsToMatch[0].classList.toggle('face__down');
    cardsToMatch[1].classList.toggle('face__down');
    cardsToMatch[0].classList.toggle('clicked');
    cardsToMatch[1].classList.toggle('clicked');
    cardsToMatch[0].setAttribute('tabIndex',`${clickedCard[1]}`);
  }
  //after it has been decided if the cards selected matched or not they will be eliminated from the array of cards to match
  cardsToMatch.pop();
  cardsToMatch.pop();
  checkWinGame();
}

// disable temporary the current selected card (so a user cannot select the same card twice) by setting tabIndex=-1 and jump to the next available card, but i need to storage the actual tabIndex and the card in case theres not a match ill return the card to its original values
function focusOnNextCard(e){
  clickedCard[0] = e.target;
  clickedCard[1] = indexCardInFocus;
  if (cardsToMatch.length == 0){
    e.target.setAttribute('tabIndex','-1');
    jumpToNext();
    document.querySelector(`li[tabIndex='${indexCardInFocus}']`).focus();
  }
}

function respondBoardClick(event){
  //if the element in the board was a card (an <LI> element) and there were 2 or less cards selected then it will check if they match )
  if (event.target.nodeName === 'LI' && (cardsToMatch.length < 2) ){
    //when a card is clicked on, if the card was face up then ill turn it back face down and if it was face down then it will show it face up
    event.target.classList.toggle('face__down');
    event.target.classList.toggle("clicked");
    indexCardInFocus = event.target.getAttribute('tabIndex');
    // if only one card has been opened, since the player cannot click/open the same card twice, it will be disabled and the focus will go to the next available card
    if (cardsToMatch.length == 0){
      focusOnNextCard(event);
    }
    cardsToMatch.push(event.target);
    //if two cards have been selected then we will check if they match
    if (cardsToMatch.length == 2){
      cardsToMatch[0].classList.toggle('show__Animation');
      cardsToMatch[1].classList.toggle('show__Animation');
      setTimeout(checkMatch,800);
      // once two cards have been clicked the number of moves must be updated and depending on the number of moves the ratings will change
      updateMovesOnScreen();
      updateRatingsOnScreen();
    }
  }
}

// MOVES FOCUS TO THE PREVIOUS AVAILABLE CARD
function jumpToPrevious(){
  if(indexCardInFocus==1){
    indexCardInFocus=16;
  }else if(indexCardInFocus!=0){
    indexCardInFocus--;
  }
    if (indexCardInFocus==0){
      indexCardInFocus=1;
    }
    while(!document.querySelector(`li[tabIndex='${indexCardInFocus}']`)){
      if (indexCardInFocus==1){
        indexCardInFocus=17;
      }
      indexCardInFocus--;
    }
}

// MOVES FOCUS TO THE NEXT AVAILABLE CARD
function jumpToNext(){
  if(indexCardInFocus==16){
    indexCardInFocus=1;
  }else{
    indexCardInFocus++;
  }
  if (indexCardInFocus==0){
    indexCardInFocus=1;
  }
  while(!document.querySelector(`li[tabIndex='${indexCardInFocus}']`)){
    if (indexCardInFocus==16){
      indexCardInFocus=0;
    }
    indexCardInFocus++;
  }
}

function respondBoardKey(event){
  if (win){
    if(event.keyCode === 13){
      hideWinPopupWindow();
      resetGame();
    }
    return;
  }
  if (event.shiftKey && event.keyCode === 9) {
    jumpToPrevious();   // do jumpToPrevious twice because i didnt know how to put it on the switch statement. since a tab key has been pressed (keycode==9) then it will go forward once its read on the switch
    jumpToPrevious();
    document.querySelector(`li[tabIndex='${indexCardInFocus}']`).focus();
  }
  switch (event.keyCode) {
    case 82:            // R key
      resetGame();
      break;
    case 37:            // Left Arrow key
      jumpToPrevious();
      document.querySelector(`li[tabIndex='${indexCardInFocus}']`).focus();
      break;
    case 9:            // Tab key
      event.preventDefault();
      jumpToNext();
      document.querySelector(`li[tabIndex='${indexCardInFocus}']`).focus();
      break;
    case 39:            // Right Arrow key
      jumpToNext();
      document.querySelector(`li[tabIndex='${indexCardInFocus}']`).focus();
      break;
    case 13:            // Enter key
      if (indexCardInFocus==0){
        break;
      }else{
        let cardInFocus = document.querySelector(`li[tabIndex='${indexCardInFocus}']`);
        //When only one card has been selected then the focus will go to the next available card (since the same card cannot be clicked/opened twice)
        if (cardsToMatch.length == 0){
          focusOnNextCard(event);
        }
        //if the element in the board was a card (an <LI> element) and there were 2 or less cards selected then it will check if they match )
        if (cardsToMatch.length < 2){
          //when a card is clicked on, if the card was face up then ill turn it back face down and if it was face down then it will show it face up
          //Im going to allow the user to pick the same card twice (put face up and again face down) but it will be counted as a move
          cardInFocus.classList.toggle('face__down');
          cardInFocus.classList.toggle("clicked");
          cardsToMatch.push(cardInFocus);
          //if two cards have been selected then we will check if they match
          if (cardsToMatch.length == 2){
            cardsToMatch[0].classList.toggle('show__Animation');
            cardsToMatch[1].classList.toggle('show__Animation');
            setTimeout(checkMatch,800);
            // once two cards have been clicked the number of moves must be updated and depending on the number of moves the ratings will change
            updateMovesOnScreen();
            updateRatingsOnScreen();
          }
        }
      }
    }
}

function resetGame(){
  indexCardInFocus = 0;
  counterMoves = 0;
  matchedCards = 0;
  clearInterval(timer);
  seconds = 0;
  minutes = 0;
  win = false;
  cardsToMatch = [];
  const moves = document.getElementById('moves');
  moves.textContent = counterMoves;
  const timerDisplay = document.getElementById('timer');
  timerDisplay.textContent = "00:00";
  document.getElementById("continue__button").setAttribute('tabIndex','-1');
  play();
}

function play(){
  shuffleArray(cards);
  loadCardsToHtml(cards);
  updateRatingsOnScreen();
  board.addEventListener('click', respondBoardClick);
  document.addEventListener('keydown', respondBoardKey);
  const reset = document.getElementById("reset");
  reset.addEventListener('click', resetGame);
}

let seconds = 0;
let minutes = 0;
let win = false;
let timer;
let cardsToMatch = [];
let clickedCard = [];
let indexCardInFocus = 0;
let counterMoves = 0;
let matchedCards = 0;
let cards = [];
cards[0] = new card('🍺', 'beer');
cards[1] = new card('🍺', 'beer');
cards[2] = new card('☘', 'clover');
cards[3] = new card('☘', 'clover');
cards[4] = new card('☔', 'umbrella');
cards[5] = new card('☔', 'umbrella');
cards[6] = new card('🦖', 'trex');
cards[7] = new card('🦖', 'trex');
cards[8] = new card('💜', 'heart');
cards[9] = new card('💜', 'heart');
cards[10] = new card('👽', 'alien');
cards[11] = new card('👽', 'alien');
cards[12] = new card('☠', 'skull');
cards[13] = new card('☠', 'skull');
cards[14] = new card('🦋', 'butterfly');
cards[15] = new card('🦋', 'butterfly');
let board = document.querySelector("ul.board");

document.addEventListener("DOMContentLoaded", play());
