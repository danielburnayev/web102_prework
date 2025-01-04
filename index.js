/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)
var currSelectedButton = document.getElementsByClassName("selected-button")[0];

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
    // loop over each item in the data
    for (var i = 0; i < games.length; i++) {
        // create a new div element, which will become the game card
        const gameCard = document.createElement("div");
        // add the class game-card to the list
        gameCard.classList.add("game-card");

        // set the inner HTML using a template literal to display some info 
        // about each game
        const gameTemplate = `
            <div>
                <h1>${games[i].name}</h1>
                <p>${games[i].description}</p>
                <img class = "game-img" src = "${games[i].img}" />
            </div>
        `;
        gameCard.innerHTML = gameTemplate;

        // append the game to the games-container
        gamesContainer.appendChild(gameCard);
    }
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalBackers = GAMES_JSON.reduce((acc, game) => {
    return acc + game.backers;
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `
    <p id="num-contributions">
        ${totalBackers.toLocaleString('en-US')}
    </p>
`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const totalMoney = GAMES_JSON.reduce((acc, game) => {
    return acc + game.pledged;
}, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `
    <p id="total-raised">
        $${totalMoney.toLocaleString('en-US')}
    </p>
`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = `
    <p id="num-games">
        ${GAMES_JSON.length.toLocaleString('en-US')}
    </p>
`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let unfundedGames = GAMES_JSON.filter((game) => {
        return game.pledged < game.goal;
    });

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGames);
    
    if (unfundedBtn != currSelectedButton) {
        unfundedBtn.classList.add("selected-button");
        currSelectedButton.classList.remove("selected-button");
        currSelectedButton = unfundedBtn;
    }
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let fundedGames = GAMES_JSON.filter((game) => {
        return game.pledged >= game.goal;
    });

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedGames);

    if (fundedBtn != currSelectedButton) {
        fundedBtn.classList.add("selected-button");
        currSelectedButton.classList.remove("selected-button");
        currSelectedButton = fundedBtn;
    }
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);

    if (allBtn != currSelectedButton) {
        allBtn.classList.add("selected-button");
        currSelectedButton.classList.remove("selected-button");
        currSelectedButton = allBtn;
    }
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
let unfundedGames = GAMES_JSON.filter((games) => {
    return games.pledged < games.goal;
});
const numOfUnfunded = unfundedGames.length;

// create a string that explains the number of unfunded games using the ternary operator
const unfundedStr = `So far, $${GAMES_JSON.reduce((acc, game) => {
    return acc + game.pledged;
}, 0).toLocaleString('en-US')} have been raised, ${(numOfUnfunded != GAMES_JSON.length) 
    ? `allowing ${GAMES_JSON.length - numOfUnfunded} games to get the funding they 
        needed to finish them and branch out into the hands of games alike,` 
    : ``} 
but there are still ${numOfUnfunded} games that need your help to become the best and
most popular versions of themselves. To help these underfunded games, donate what you 
can here to help them get one step further into game-creating journey.`;

// create a new DOM element containing the template string and append it to the description container
const unfundedObject = document.createElement("p");
unfundedObject.innerHTML = unfundedStr; 
descriptionContainer.appendChild(unfundedObject);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");
const thirdGameContainer = document.getElementById("third-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second MOST FUNDED games
var first, second, third, rest;
[first, second, third, ...rest] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const topGameName = document.createElement("p");
topGameName.innerHTML = `<b>${first.name}</b>
<br>$${first.pledged.toLocaleString('en-US')} raised!`;
firstGameContainer.appendChild(topGameName);

// do the same for the runner up item
const secondGameName = document.createElement("p");
secondGameName.innerHTML = `<b>${second.name}</b>
<br>$${second.pledged.toLocaleString('en-US')} raised!`;
secondGameContainer.appendChild(secondGameName);

const thirdGameName = document.createElement("p");
thirdGameName.innerHTML = `<b>${third.name}</b>
<br>$${third.pledged.toLocaleString('en-US')} raised!`;
thirdGameContainer.appendChild(thirdGameName);