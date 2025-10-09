// Database of words by theme
const wordDatabase = {
    minecraft: [
        "Creeper", "Enderman", "Diamante", "Netherite", 
        "Steve", "Aldeano", "Zombie", "Esqueleto", 
        "Wither", "Ender Dragon", "Blaze", "Ghast",
        "Redstone", "Obsidiana", "Portal", "Elytra"
    ],
    futbol: [
        "Messi", "Cristiano Ronaldo", "Neymar", "Mbappé", 
        "Haaland", "Lewandowski", "De Bruyne", "Benzema", 
        "Modric", "Vinicius Jr", "Salah", "Kane",
        "Pelé", "Maradona", "Zidane", "Ronaldinho"
    ],
    comida: [
        "Pizza", "Hamburguesa", "Sushi", "Tacos", 
        "Pasta", "Asado", "Empanadas", "Milanesa", 
        "Helado", "Chocolate", "Paella", "Ramen",
        "Hot Dog", "Burrito", "Lasaña", "Croissant"
    ],
    clashroyale: [
        "Megacaballero", "P.E.K.K.A", "Mago Eléctrico", "Princesa", 
        "Montapuercos", "Golem", "Minero", "Leñador", 
        "Bandida", "Bruja", "Dragón Infernal", "Gigante",
        "Caballero", "Valquiria", "Globo", "Tornado"
    ]
};

// Game state
let gameState = {
    theme: '',
    players: 0,
    impostors: 0,
    playerWords: [],
    impostorWord: '',
    civilianWord: '',
    currentPlayer: 0,
    votes: {},
    impostorIndices: [],
    revealed: false
};

// DOM Elements
const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const votingScreen = document.getElementById('voting-screen');
const resultsScreen = document.getElementById('results-screen');
const currentPlayerNumber = document.getElementById('current-player-number');
const revealCard = document.getElementById('reveal-card');
const wordDisplay = document.getElementById('word-display');
const votingOptions = document.getElementById('voting-options');
const resultsContent = document.getElementById('results-content');
const startButton = document.getElementById('start-game');
const nextPlayerButton = document.getElementById('next-player');
const startVotingButton = document.getElementById('start-voting');
const revealImpostorsButton = document.getElementById('reveal-impostors');
const playAgainButton = document.getElementById('play-again');

// Event Listeners
startButton.addEventListener('click', startGame);
nextPlayerButton.addEventListener('click', nextPlayer);
startVotingButton.addEventListener('click', showVotingScreen);
revealImpostorsButton.addEventListener('click', revealImpostors);
playAgainButton.addEventListener('click', resetGame);
gameScreen.addEventListener('click', revealWord);

// Initialize the game
function initGame() {
    gameState = {
        theme: '',
        players: 0,
        impostors: 0,
        playerWords: [],
        impostorWord: '',
        civilianWord: '',
        currentPlayer: 0,
        votes: {},
        impostorIndices: [],
        revealed: false
    };
}

// Start the game with selected options
function startGame() {
    const theme = document.getElementById('theme').value;
    const players = parseInt(document.getElementById('players').value);
    const impostors = parseInt(document.getElementById('impostors').value);

    // Validate inputs
    if (players <= impostors) {
        alert('Debe haber al menos un jugador más que la cantidad de impostores');
        return;
    }

    // Set up game state
    gameState.theme = theme;
    gameState.players = players;
    gameState.impostors = impostors;
    gameState.currentPlayer = 1;
    gameState.revealed = false;

    // Get words for the game
    const words = [...wordDatabase[theme]];
    gameState.civilianWord = words.splice(Math.floor(Math.random() * words.length), 1)[0];
    gameState.impostorWord = "IMPOSTOR";

    // Assign words to players
    gameState.playerWords = Array(players).fill(gameState.civilianWord);
    
    // Assign impostor words
    gameState.impostorIndices = [];
    while (gameState.impostorIndices.length < impostors) {
        const randomIndex = Math.floor(Math.random() * players);
        if (!gameState.impostorIndices.includes(randomIndex)) {
            gameState.impostorIndices.push(randomIndex);
            gameState.playerWords[randomIndex] = gameState.impostorWord;
        }
    }

    // Show game screen
    setupScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    // Update player number
    currentPlayerNumber.textContent = gameState.currentPlayer;
    revealCard.classList.add('hidden');
    nextPlayerButton.classList.add('hidden');
    startVotingButton.classList.add('hidden');
}

// Reveal word when screen is tapped
function revealWord(e) {
    // Only reveal if clicking on the game screen area (not buttons)
    if (e.target.tagName === 'BUTTON' || gameState.revealed) {
        return;
    }
    
    if (!revealCard.classList.contains('hidden')) {
        return;
    }
    
    // Show the word for current player
    const playerIndex = gameState.currentPlayer - 1;
    const isImpostor = gameState.impostorIndices.includes(playerIndex);
    const word = isImpostor ? "IMPOSTOR" : gameState.playerWords[playerIndex];
    
    wordDisplay.textContent = word;
    wordDisplay.style.color = isImpostor ? '#e74c3c' : '#2ecc71';
    
    revealCard.classList.remove('hidden');
    gameState.revealed = true;
    
    // Show appropriate button
    if (gameState.currentPlayer < gameState.players) {
        nextPlayerButton.classList.remove('hidden');
    } else {
        startVotingButton.classList.remove('hidden');
    }
}

// Move to next player
function nextPlayer() {
    gameState.currentPlayer++;
    gameState.revealed = false;
    
    currentPlayerNumber.textContent = gameState.currentPlayer;
    revealCard.classList.add('hidden');
    nextPlayerButton.classList.add('hidden');
    wordDisplay.textContent = '';
}

// Show voting screen
function showVotingScreen() {
    gameScreen.classList.add('hidden');
    votingScreen.classList.remove('hidden');
    
    // Create voting options
    votingOptions.innerHTML = '';
    
    for (let i = 1; i <= gameState.players; i++) {
        const option = document.createElement('div');
        option.className = 'vote-card';
        option.textContent = `Jugador ${i}`;
        option.dataset.player = i;
        option.onclick = () => castVote(i, option);
        votingOptions.appendChild(option);
    }
}

// Cast a vote
function castVote(playerNumber, element) {
    if (!gameState.votes[playerNumber]) {
        gameState.votes[playerNumber] = 0;
    }
    gameState.votes[playerNumber]++;
    
    // Update UI
    element.textContent = `Jugador ${playerNumber} (${gameState.votes[playerNumber]} votos)`;
    element.classList.add('voted');
}

// Reveal impostors and show results
function revealImpostors() {
    // Find player(s) with most votes
    let maxVotes = 0;
    let mostVotedPlayers = [];
    
    for (const [player, votes] of Object.entries(gameState.votes)) {
        if (votes > maxVotes) {
            maxVotes = votes;
            mostVotedPlayers = [parseInt(player)];
        } else if (votes === maxVotes) {
            mostVotedPlayers.push(parseInt(player));
        }
    }
    
    // Build results HTML
    let resultsHTML = '<div class="results-content">';
    
    // Show who was voted
    if (mostVotedPlayers.length > 0) {
        resultsHTML += `<h3>Más votado(s): Jugador ${mostVotedPlayers.join(', ')}</h3>`;
    } else {
        resultsHTML += '<h3>¡Nadie recibió votos!</h3>';
    }
    
    resultsHTML += '<br><h3>Revelación:</h3>';
    
    // Show all players and their roles
    for (let i = 0; i < gameState.players; i++) {
        const isImpostor = gameState.impostorIndices.includes(i);
        const word = gameState.playerWords[i];
        const className = isImpostor ? 'impostor' : 'civilian';
        const role = isImpostor ? 'IMPOSTOR' : 'CIVIL';
        
        resultsHTML += `
            <div class="result-item ${className}">
                <strong>Jugador ${i + 1}:</strong> ${word} - ${role}
            </div>
        `;
    }
    
    // Determine winner
    const correctVotes = mostVotedPlayers.filter(p => gameState.impostorIndices.includes(p - 1));
    
    if (correctVotes.length > 0) {
        resultsHTML += '<br><h2 style="color: #2ecc71;">¡Los Civiles Ganan! 🎉</h2>';
        resultsHTML += '<p>Atraparon al impostor correctamente</p>';
    } else {
        resultsHTML += '<br><h2 style="color: #e74c3c;">¡Los Impostores Ganan! 😈</h2>';
        resultsHTML += '<p>Los civiles votaron incorrectamente</p>';
    }
    
    resultsHTML += '</div>';
    
    resultsContent.innerHTML = resultsHTML;
    
    // Show results screen
    votingScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
}

// Reset the game
function resetGame() {
    initGame();
    resultsScreen.classList.add('hidden');
    votingScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    setupScreen.classList.remove('hidden');
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initGame();
});
