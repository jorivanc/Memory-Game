// var cards = ['🍺','🍺','☘','☘','☆','☆','☠','☠','☔','☔','☻','☻','💜','💜','👽','👽'];

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

  function loadCardsToHtml(series){
    let msgHTML = "";
    for ( let card of series) {
      msgHTML += `<li data-type="${card.symbolDescription}" class="card face__down"> ${card.symbol} </li> \n`;
    }
    board.innerHTML = msgHTML;
  }//end loadCardsToHtml

// HIDES AND RESETS CONTENT WIN POPUP WINDOW after wining a game
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
    resetGame();
  }

  function displayWinMessage(){
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

  function checkWinGame(){
    if (matchedCards == cards.length/2){
      win = true;
      displayWinMessage();
    }
  }
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

  function startTimer(){
     // setTimeOut could have been used, but it would have to be recursively called, which can me done automatically with setInterval
  timer = setInterval(updateTimerOnScreen,1000);
  }

  function updatedMovesOnScreen(){
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
      matchedCards++;
    }else{
      //if the cards didnt match the cards will be flipped face down and be ready to be clicked on again
      cardsToMatch[0].classList.toggle('face__down');
      cardsToMatch[1].classList.toggle('face__down');
      cardsToMatch[0].classList.toggle('clicked');
      cardsToMatch[1].classList.toggle('clicked');
    }
    //after it has been decided if the cards selected matched or not they will be eliminated from the array of cards to match
    cardsToMatch.pop();
    cardsToMatch.pop();
    checkWinGame();
  }

function respondBoardClick(event){
      //if the element in the board was a card (an <LI> element) and there were 2 or less cards selected then it will check if they match )
      if (event.target.nodeName === 'LI' && (cardsToMatch.length < 2) ){
        //when a card is clicked on, if the card was face up then ill turn it back face down and if it was face down then it will show it face up
        //Im going to allow the user to pick the same card twice (put face up and again face down) but it will be counted as a move
          event.target.classList.toggle('face__down');
          event.target.classList.toggle("clicked");
          // console.log(event.target.classList);
          cardsToMatch.push(event.target);
          // counterClicks++;

          //if two cards have been selected then we will check if they match
          if (cardsToMatch.length == 2){
            cardsToMatch[0].classList.toggle('show__Animation');
            cardsToMatch[1].classList.toggle('show__Animation');
            setTimeout(checkMatch,800);
            // once two cards have been clicked the number of moves must be updated and depending on the number of moves the ratings will change
            updatedMovesOnScreen();
            updateRatingsOnScreen();

            }
        }//end IF

}

function resetGame(){
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
  play();
}

let seconds = 0;
let minutes = 0;
let win = false;
let timer;
let cardsToMatch = [];
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

function play(){
  shuffleArray(cards);
  loadCardsToHtml(cards);
  updateRatingsOnScreen();
  board.addEventListener('click', respondBoardClick);
  const reset = document.getElementById("reset");
  reset.addEventListener('click', resetGame);
}

document.addEventListener("DOMContentLoaded", play());
