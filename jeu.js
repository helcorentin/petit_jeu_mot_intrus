let players = [];
let currentIndex = 0;
let intruderIndex = null;
let selectedPair = null;
let recallIndex = null;

// Liste JSON des mots
const wordPairs = [];

//création des joueurs
function createPlayers() {
	chargerJSON();
	
  const count = parseInt(document.getElementById("playerCount").value);
  const container = document.getElementById("playersInputs");
  container.innerHTML = "";
  players = [];

  for (let i = 0; i < count; i++) {
    container.innerHTML += `
      <input placeholder="Nom du joueur ${i + 1}" id="player-${i}">
      <br>
    `;
  }

  showStep(2);
}

//sauvegarde des joueurs
function startParticipation() {
  players = [];
  const inputs = document.querySelectorAll("#playersInputs input");

  inputs.forEach(input => {
    players.push({
      name: input.value,
      validated: false,
      word: ""
    });
  });

  currentIndex = 0;
  showParticipation();
  showStep(3);
}

function showParticipation() {
  document.getElementById("participationText").innerText =
    `Joueur ${currentIndex + 1} : ${players[currentIndex].name}`;
}

function validateParticipation() {
  players[currentIndex].validated = true;
  currentIndex++;

  if (currentIndex < players.length) {
    showParticipation();
  } else {
    setupWords();
    currentIndex = 0;
    showWordTurn();
    showStep(4);
  }
}

// Tirage au sort
function setupWords() {
  
	
  intruderIndex = Math.floor(Math.random() * players.length);
  selectedPair = wordPairs[Math.floor(Math.random() * wordPairs.length)];

  players.forEach((player, index) => {
    player.word = index === intruderIndex
      ? selectedPair.intruder
      : selectedPair.common;
  });
}

function showWordTurn() {
  document.getElementById("playerTurn").innerText =
    `Joueur ${currentIndex + 1} : ${players[currentIndex].name}`;

  document.getElementById("wordBox").style.display = "none";
}

function showWord() {
  document.getElementById("word").innerText = players[currentIndex].word;
  document.getElementById("wordBox").style.display = "block";
}

function nextPlayer() {
  currentIndex++;

  if (currentIndex < players.length) {
    showWordTurn();
  } else {
    showStep("end");
  }
}

// Gestion affichage étapes
function showStep(step) {
  ["step1", "step2", "step3", "step4", "end"].forEach(id => {
    document.getElementById(id).style.display = "none";
  });

  if (typeof step === "number") {
    document.getElementById(`step${step}`).style.display = "block";
  } else {
    document.getElementById(step).style.display = "block";
  }
}

function endGame() {
  document.getElementById("reveal").style.display = "block";

  document.getElementById("intruderReveal").innerText =
    `🕵️ L’intrus était : ${players[intruderIndex].name}`;

  document.getElementById("wordsReveal").innerText =
    `Mot commun : "${selectedPair.common}" | Mot intrus : "${selectedPair.intruder}"`;
}
function openRecall() {
  document.getElementById("recall").style.display = "block";
  document.getElementById("recallError").innerText = "";
  document.getElementById("recallConfirm").style.display = "none";
  document.getElementById("recallWordBox").style.display = "none";
}

function checkRecallPlayer() {
  const name = document.getElementById("recallName").value.trim();

  recallPlayerIndex = players.findIndex(
    p => p.name.toLowerCase() === name.toLowerCase()
  );

  if (recallPlayerIndex === -1) {
    document.getElementById("recallError").innerText =
      "Nom introuvable. Vérifie l’orthographe.";
    return;
  }

  document.getElementById("recallError").innerText = "";
  document.getElementById("recallConfirm").style.display = "block";
  document.getElementById("recallPlayer").innerText =
    `${players[recallPlayerIndex].name}, es-tu bien devant l’écran ?`;
}

function showRecallWord() {
  document.getElementById("recallWord").innerText =
    players[recallPlayerIndex].word;
  document.getElementById("recallWordBox").style.display = "block";
}

function closeRecall() {
  document.getElementById("recall").style.display = "none";
  document.getElementById("recallName").value = "";
  document.getElementById("recallConfirm").style.display = "none";
  document.getElementById("recallWordBox").style.display = "none";
}

function chargerJSON() {
	fetch("data.json")
		.then(r => r.json())
		.then(data => {
			wordPairs.push(...data);
		});
}