# Memory-Game
Browser-based card matching game (also known as Concentration)

![Screenshot](memGamScreenshot.jpg)

## How to play.
1. CLick/Open a card.
2. Open another card. If they match, then return to step 1.  Otherwise remember the cards previously opened and try to find pairs of matching cards.
3. Now do this until all the cards have been opened in the minimum amount of moves and time.

### Using the keyboard.
Keyboard accessibility has been implemented using the following keys.
- To move through the cards:
  * To the right card press the Right Arrow (→) or Tab ( ↹ ) key.
  * To the left card press the Left Arrow (←) or Shift + Tab ( ⇧ + ↹ ) keys.
- To flip/open a card press Enter ( ↵ )
- To restart the game press the R key.
- To continue after winning a game and close/exit the popup modal window press Enter ( ↵ )

## Future Improvements.
- Implement a _Settings_ option:
  * Add the option to set a countdown timer. (just as a challenge for the player)
  * Let the user set a difficulty level (pick the number of cards). See **Note.**
- ~~Implement keyboard accessibility~~. : keyboard accessibility has been implemented but code optimization could be improved.
- Improve the way the rating is calculated. Right now the (stars) rating is calculated solely based on the amount of moves. It would be better to also take into account the time spent solving the game.
- Implement a Score Panel: Allow users to input their names and record their scores and display a panel with those result ordered from best to ..... not so good.
- Improve accessibility issues: I tested playing the Memory Game using ChromeVox screen reader, but the reader reads the symbol description of each card. I tried changing the alt attribute of each card to cardN where N is a distinct number assigned to each card but the reader still reads the symbol descriptions.


#### Note
The function loadCardsToHtml (in the file scripts.js) allows to load a series/array of cards of any length to the board. So it would be possible to allow players to select the amount of cards (set the difficulty) to play, as long as there are an even number of cards.
```
function loadCardsToHtml(series){
  let msgHTML = "";
  for ( let card of series) {
    msgHTML += `<li data-type="${card.symbolDescription}" class="card face__down" alt="${card.symbolDescription}"> ${card.symbol} </li> \n`;
  }
  board.innerHTML = msgHTML;
}//end loadCardsToHtml
```
To test this feature simply comment out 2n (an even amount) cards from the file scrips.js
```
let cards = [];
cards[0] = new card('🍺', 'beer');
cards[1] = new card('🍺', 'beer');
// cards[2] = new card('☘', 'clover');
// cards[3] = new card('☘', 'clover');
// 2n cards commented out
...
```
## Specifications met
1. Memory Game logic
2. Congratulations Popup
3. Restart button
4. Star rating
5. Timer
6. Moves Counter
7. Styling
8. Responsiveness
9. Keyboard Accessibility
10. Comments
11. README
