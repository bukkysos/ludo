// Grab all DOM elements needed

let palleteCollection = [...document.getElementsByClassName("pallete")],
  dice = document.getElementById("button"),
  test = document.getElementById("test"),
  // Get start positions for the different pallete colors

  yellowStartPoint = document.getElementById("yellowStartPoint"),
  redStartPoint = document.getElementById("redStartPoint"),
  blueStartPoint = document.getElementById("blueStartPoint"),
  greenStartPoint = document.getElementById("greenStartPoint"),
  [...yellowSafeZone] = document.getElementsByName("yellow_safe_zone"),
  [...redSafeZone] = document.getElementsByName("red_safe_zone"),
  [...blueSafeZone] = document.getElementsByName("blue_safe_zone"),
  [...greenSafeZone] = document.getElementsByName("green_safe_zone"),
  firstPathTemp = [...document.getElementsByClassName("path1")],
  secondPathTemp = [...document.getElementsByClassName("path2")],
  thirdPathTemp = [...document.getElementsByClassName("path3")],
  fourthPathTemp = [...document.getElementsByClassName("path4")],
  firstPath = [],
  secondPath = [],
  thirdPath = [],
  fourthPath = [],
  path = [],
  players = {
    playerOne: true,
    playerTwo: false,
  },
  playerOneHomes = [],
  playerTwoHomes = [],
  [...homes] = document.getElementsByClassName("home"),
  playerOnePalletes = [],
  playerTwoPalletes = [],
  diceNumber;

function reverseArray(reversibleArray) {
  reversibleArray = reversibleArray.reverse();
  return reversibleArray;
}

function fetchPointIndex(pathForIndexing) {
  let reverseIndex = [];

  // Loop through to find 'reverse' items' index
  pathForIndexing.forEach((currentPoint, i) => {
    if (currentPoint.classList.contains("reverse")) {
      reverseIndex.push(i);
    }
  });
  return reverseIndex;
}

// Concat the first two path arrays (Yellow and Blue)
function concatFirstTwoPaths(currentPath, aggregatePath) {
  let pointIndex = fetchPointIndex(currentPath);
  const temp = currentPath.splice(
    pointIndex[0] + 1,
    pointIndex[pointIndex.length - 1]
  );
  currentPath.splice(pointIndex[0], 0, ...reverseArray(temp));
  return (aggregatePath = aggregatePath.concat(currentPath));
}

function concatThirdPath(currentPath, aggregatePath) {
  let pointIndex = fetchPointIndex(currentPath);
  const temp = currentPath.splice(
    pointIndex[0],
    pointIndex[pointIndex.length - 1]
  );
  let removedEl = currentPath.splice(0, 1);
  currentPath.splice(6, 0, removedEl);
  currentPath.splice(7, 0, ...reverseArray(temp));
  return (aggregatePath = aggregatePath.concat(currentPath));
}

function concatFourthPath(currentPath, aggregatePath) {
  let pointIndex = fetchPointIndex(currentPath);
  const temp = currentPath.splice(
    pointIndex[0] + 1,
    pointIndex[pointIndex.length - 1]
  );
  fetchPointIndex(currentPath);
  currentPath.splice(currentPath[0], 0, ...reverseArray(temp));
  currentPath.splice(6, 0, currentPath.pop());
  return (aggregatePath = aggregatePath.concat(currentPath));
}

// Starts the game
function startGame() {
  path = path.concat(
    ...concatFirstTwoPaths(firstPathTemp, firstPath),
    ...concatFirstTwoPaths(secondPathTemp, secondPath),
    ...concatThirdPath(thirdPathTemp, thirdPath),
    ...concatFourthPath(fourthPathTemp, fourthPath)
  );
  dice.addEventListener("click", rollDice);
  handleSelectHome();
}

// Loop through all homes and add a click event listener for addHomes(homes) function
function handleSelectHome() {
  homes.forEach((home) => {
    setHighlight(home);
    home.addEventListener("click", () => {
      addHomes(home);
    });
  });
}

// addHomes does the adding (by calling the addFirstPlayer and addSecondPlayer functions) and sets time out for removing the notifier
function addHomes(home) {
  if (playerOneHomes.length < 2) {
    addFirstPlayer(home);
  } else if (playerTwoHomes.length < 2) {
    addSecondPlayer(home);
  }
  if (playerTwoHomes.length === 2 && playerOneHomes.length === 2) {
    setTimeout(() => {
      [...document.getElementsByClassName("house_selected")].forEach(
        (el) => (el.style.display = "none")
      );
    }, 3000);
  }
  return;
}

// addFirstPlayer pushes first player homes to playerOneHomes array
function addFirstPlayer(home) {
  let homeColor = home.getAttribute("home");

  playerOneHomes.push(home);
  unsetHighlight(home);
  getPlayerPallettes(homeColor, "playerOne");
  home.children[1].innerHTML = `Player One has chosen ${homeColor}`;
  home.children[1].style.display = "block";

  if (playerOneHomes.includes(home)) {
    home.removeEventListener("click", () => addHomes(home));
  }
}

// addSecondPlayer pushes second player homes to playerTwoHomes array
function addSecondPlayer(home) {
  let homeColor = home.getAttribute("home");
  playerTwoHomes.push(home);

  unsetHighlight(home);
  getPlayerPallettes(homeColor, "playerTwo");
  home.children[1].innerHTML = `Player two has chosen ${homeColor}`;
  home.children[1].style.display = "block";

  // home.removeEventListener("click", () => addHomes(home))
  if (playerTwoHomes.includes(home)) {
    home.removeEventListener("click", () => addHomes(home));
  }
}

function rollDice() {
  let min = Math.ceil(1),
    max = Math.floor(6);
  diceNumber = Math.ceil(Math.random() * (max - min)) + min;
  document.getElementById("test").innerHTML = diceNumber;

  // To Do: Create a function for this
  if (players.playerOne && !players.playerTwo) {
    playerOnePalletes.forEach((pallete) => {
      pallete.addEventListener("click", assignMovement);
    });
  } else if (players.playerTwo && !players.playerOne) {
    playerTwoPalletes.forEach((pallete) => {
      pallete.addEventListener("click", assignMovement);
    });
  }

  handlePlayerTurns(diceNumber);
}

// Adds the pulsate effect from homes
function setHighlight(element) {
  element.classList.add("pulsate");
}

// Removes the pulsate effct from homes
function unsetHighlight(element) {
  element.classList.remove("pulsate");
}

// Activates palletes according to current player
function activatePalletes(diceValue, playerOne, playerTwo) {
  if (playerOne && !playerTwo && diceValue > 0) {
    playerOnePalletes.forEach((pallete) => {
      pallete.addEventListener("click", assignMovement);
    });
    playerTwoPalletes.forEach((pallete) => {
      pallete.removeEventListener("click", assignMovement);
    });
  } else if (playerTwo && !playerOne && diceValue > 0) {
    playerOnePalletes.forEach((pallete) => {
      pallete.removeEventListener("click", assignMovement);
    });
    playerTwoPalletes.forEach((pallete) => {
      pallete.addEventListener("click", assignMovement);
    });
  } else {
    playerOnePalletes.forEach((pallete) => {
      pallete.removeEventListener("click", assignMovement);
    });
    playerTwoPalletes.forEach((pallete) => {
      pallete.removeEventListener("click", assignMovement);
    });
  }
}

function assignMovement(e) {
  if (e.target.parentNode.classList[0] === "inner" && diceNumber === 6) {
    bringPalleteOutFromHome(e.target, e.target.getAttribute("type"));
  } else if (e.target.parentNode.classList[0] === "path" && diceNumber > 0) {
    getPalletePosition(e.target, path, diceNumber);
  }
  else if (e.target.parentNode.classList[1] === "safe_zone" || e.target.parentNode.getAttribute("name") === `${e.target.getAttribute("type")}_safe_zone` && diceNumber > 0) {
    getPalletePosition(e.target, [...document.getElementsByName(`${e.target.getAttribute("type")}_safe_zone`)], diceNumber);
  }
}

// handlePlayerTurns() toggles player turns to ensure that the right player plays their turn
function handlePlayerTurns(diceValue) {
  let { playerOne, playerTwo } = players;

  if (diceValue < 6) {
    activatePalletes(diceValue, playerOne, playerTwo);
    players.playerOne = !players.playerOne;
    players.playerTwo = !players.playerTwo;
  }
  activatePalletes(diceValue, playerOne, playerTwo);

  return;
}

// Allocates the corresponding palletes to players based on selected homes
function getPlayerPallettes(homeType, player) {
  let [...currentPalletes] = document.getElementsByClassName(
    `${homeType}_pallete`
  );

  if (player === "playerOne") {
    playerOnePalletes = playerOnePalletes.concat(currentPalletes);
  } else if (player === "playerTwo") {
    playerTwoPalletes = playerTwoPalletes.concat(currentPalletes);
  }
}

// Bring out palletes from home
function bringPalleteOutFromHome(
  pallete,
  palleteColor = pallete.getAttribute("type")
) {
  let startPoint = document.getElementById(
    `${(palleteColor = pallete.getAttribute("type"))}StartPoint`
  );
  startPoint.append(pallete);

  // To Do: Create a function for this
  if (players.playerOne) {
    playerOnePalletes.forEach((pallete) => {
      pallete.removeEventListener("click", assignMovement);
    });
  } else if (players.playerTwo) {
    playerTwoPalletes.forEach((pallete) => {
      pallete.removeEventListener("click", assignMovement);
    });
  }
}

function getPalletePosition(pallete, currentPalletePath = path, dice) {
  const palletePosition = currentPalletePath.indexOf(pallete.parentNode);
  movePalletes(pallete, palletePosition, dice, currentPalletePath);
}

// Move pallete along the game path
function movePalletes(pallete, palletePosition, index, palletePath) {
  let counter = 1,
    newPosition = palletePosition + counter, pathLength = palletePath.length;
  handleMultiplePalleteDisplay(palletePath);

  // If current position is safe zone entrance or already in home
  // Move into safe zone
  if (pallete.parentNode.getAttribute("name") === `${pallete.getAttribute("type")}_safe_zone`) {
    changePalletePathToSafeZone(pallete, index);
    return;;
  } else if ([...palletePath[palletePosition].classList].includes(`go_home_${pallete.getAttribute("type")}`)) {
    changePalletePathToSafeZone(pallete, index - 1);
    return
  } else {
    let pathLoop = setInterval(() => {
      if (counter <= index) {
        if (newPosition < pathLength) {
          newPosition = palletePosition + counter;
          palletePath[newPosition].appendChild(pallete);

          // If pallete is on the pathpoint close to its home
          if ([...palletePath[newPosition].classList].includes(`go_home_${pallete.getAttribute("type")}`)) {
            clearInterval(pathLoop);

            // Subtract 1 fron dice value (index) to prevent pallete from moving extra step(s) in home when coming in from outside path
            changePalletePathToSafeZone(pallete, index - 1, counter);
          }
        } else {
          palletePosition = -counter;
          newPosition = palletePosition + counter;
          palletePath[newPosition].appendChild(pallete);
        }
      } else {
        getPathPointPalletes(palletePath[newPosition]);
        clearInterval(pathLoop);
        handleMultiplePalleteDisplay(palletePath);
      }
      counter++;
    }, 500);
  }

  // To Do: Create a function for this
  playerOnePalletes.forEach((pallete) => {
    pallete.removeEventListener("click", assignMovement);
  });
  playerTwoPalletes.forEach((pallete) => {
    pallete.removeEventListener("click", assignMovement);
  });
}

// Check if more than one pallete is on a path point
function getPathPointPalletes(pathPoint) {
  const pathChildren = [...pathPoint.children],
    playerCheckData = checkForPlayerPalletes(pathChildren);
  let innerHome = [];

  if (pathChildren.length >= 2) {
    if (playerCheckData.status === "can kill") {
      playerCheckData.lostPlayerHome.forEach((home) => {
        if (
          playerCheckData.killedPallete.getAttribute("type") ===
          home.getAttribute("home")
        ) {
          innerHome = [...home.children[0].children[0].children];
        }
      });
      innerHome.forEach((inner) => {
        if (
          inner.getAttribute("tag") ===
          playerCheckData.killedPallete.getAttribute("tag")
        ) {
          inner.append(playerCheckData.killedPallete);
        }
      });
      sendPalleteHome(playerCheckData.savedPallete)
      diceNumber = 0;
      return;
    } else {
      pathPoint.classList.add("contains_multiple_palletes")
    }
  }

}

// Append pallete to appropriate home
function sendPalleteHome(pallete) {
  const savedHolder = document.getElementById(
    `triangle-safe-${pallete.getAttribute("type")}`
  );
  savedHolder.append(pallete);
}

// Start index for entering home
function changePalletePathToSafeZone(pallete, index, counter = 0) {
  const palleteColor = pallete.getAttribute("type");
  let safeZone = [...document.getElementsByName(`${palleteColor}_safe_zone`)],
    palletePosition = 0;

  let safeZoneRemainingMoves = index - counter;
  if (palleteColor === "red" || palleteColor === "blue") {
    safeZone = reverseArray(safeZone);
  }

  if (safeZone.indexOf(pallete.parentNode) > 0) {
    palletePosition = safeZone.indexOf(pallete.parentNode);
  }
  takePalleteToSafeZone(pallete, safeZoneRemainingMoves, safeZone, palletePosition);
}

function takePalleteToSafeZone(pallete, safeZoneRemainingMoves, safeZone, palletePosition, startCounter = 0) {
  let remainingSafePath = safeZone.length - (palletePosition + 1);

  if (safeZoneRemainingMoves - remainingSafePath > 1) {
    return
  } else {
    let newPosition = palletePosition + startCounter,
      homePathLoop = setInterval(() => {
        if (startCounter <= safeZoneRemainingMoves) {
          if ((safeZone.length - 1) === (newPosition)) {
            sendPalleteHome(pallete)
            clearInterval(homePathLoop);
            safeZoneRemainingMoves = 0;
          } else {
            newPosition = palletePosition + startCounter
            safeZone[newPosition].appendChild(pallete);
          }

        } else {
          clearInterval(homePathLoop);
        }
        startCounter++;
      }, 500);
  }
  // To Do: Create a function for this
  playerOnePalletes.forEach((pallete) => {
    pallete.removeEventListener("click", assignMovement);
  });
  playerTwoPalletes.forEach((pallete) => {
    pallete.removeEventListener("click", assignMovement);
  });
}

function checkForPlayerPalletes(pathChildren) {
  if (
    (playerOnePalletes.includes(pathChildren[0]) &&
      playerTwoPalletes.includes(pathChildren[1])) ||
    (playerTwoPalletes.includes(pathChildren[0]) &&
      playerOnePalletes.includes(pathChildren[1]))
  ) {
    return {
      status: "can kill",
      savedPallete: pathChildren[1],
      killedPallete: pathChildren[0],
      lostPlayerHome: playerOnePalletes.includes(pathChildren[0])
        ? playerOneHomes
        : playerTwoPalletes.includes(pathChildren[0])
          ? playerTwoHomes
          : null,
    };
  } else {
    return {
      status: "cannot kill",
    };
  }
}

function handleMultiplePalleteDisplay(palletePath) {
  palletePath.forEach((path) => {
    if (path.children.length < 2) {
      path.classList.remove("contains_multiple_palletes")
    }
  })
}

document.body.onload = startGame;




// const speak = (msg) => {

//   const sp = new SpeechSynthesisUtterance(msg);
//   [sp.voice] = speechSynthesis.getVoices();
//   speechSynthesis.speak(sp);
//   }

//   speak("My name is Humphrey! Hello world.")