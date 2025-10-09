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
    mode: 'local', // 'local' or 'online'
    theme: '',
    players: 0,
    impostors: 0,
    playerWords: [],
    impostorWord: '',
    civilianWord: '',
    currentPlayer: 0,
    votes: {},
    impostorIndices: [],
    revealed: false,
    roomCode: '',
    playerId: '',
    playerName: '',
    isHost: false
};

// Online state
let onlineRoom = null;
let updateInterval = null;

// DOM Elements - Mode Selection
const modeScreen = document.getElementById('mode-screen');
const localModeBtn = document.getElementById('local-mode-btn');
const onlineModeBtn = document.getElementById('online-mode-btn');

// DOM Elements - Online
const onlineRoomScreen = document.getElementById('online-room-screen');
const createRoomBtn = document.getElementById('create-room-btn');
const joinRoomBtn = document.getElementById('join-room-btn');
const roomCodeInput = document.getElementById('room-code');
const backToModeBtn = document.getElementById('back-to-mode');

// DOM Elements - Lobby
const lobbyScreen = document.getElementById('lobby-screen');
const roomCodeDisplay = document.getElementById('room-code-display');
const shareCode = document.getElementById('share-code');
const copyCodeBtn = document.getElementById('copy-code-btn');
const playerNameInput = document.getElementById('player-name');
const playersList = document.getElementById('players-list');
const hostControls = document.getElementById('host-controls');
const themeLobby = document.getElementById('theme-lobby');
const impostorsLobby = document.getElementById('impostors-lobby');
const startOnlineGameBtn = document.getElementById('start-online-game');
const leaveRoomBtn = document.getElementById('leave-room-btn');

// DOM Elements - Local Setup
const setupScreen = document.getElementById('setup-screen');
const backFromSetupBtn = document.getElementById('back-from-setup');
const startButton = document.getElementById('start-game');

// DOM Elements - Game Screens
const gameScreen = document.getElementById('game-screen');
const onlineGameScreen = document.getElementById('online-game-screen');
const currentPlayerNumber = document.getElementById('current-player-number');
const revealCard = document.getElementById('reveal-card');
const wordDisplay = document.getElementById('word-display');
const wordDisplayOnline = document.getElementById('word-display-online');
const onlinePlayerName = document.getElementById('online-player-name');
const readyStatus = document.getElementById('ready-status');
const backToLobbyBtn = document.getElementById('back-to-lobby');

// DOM Elements - Voting & Results
const votingScreen = document.getElementById('voting-screen');
const votingOptions = document.getElementById('voting-options');
const resultsScreen = document.getElementById('results-screen');
const resultsContent = document.getElementById('results-content');
const nextPlayerButton = document.getElementById('next-player');
const startVotingButton = document.getElementById('start-voting');
const revealImpostorsButton = document.getElementById('reveal-impostors');
const playAgainButton = document.getElementById('play-again');

// Event Listeners - Mode Selection
localModeBtn.addEventListener('click', () => {
    gameState.mode = 'local';
    modeScreen.classList.add('hidden');
    setupScreen.classList.remove('hidden');
});

onlineModeBtn.addEventListener('click', () => {
    gameState.mode = 'online';
    modeScreen.classList.add('hidden');
    onlineRoomScreen.classList.remove('hidden');
});

// Event Listeners - Online Room
createRoomBtn.addEventListener('click', createRoom);
joinRoomBtn.addEventListener('click', joinRoom);
backToModeBtn.addEventListener('click', () => {
    onlineRoomScreen.classList.add('hidden');
    modeScreen.classList.remove('hidden');
});

// Event Listeners - Lobby
copyCodeBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(gameState.roomCode);
    copyCodeBtn.textContent = '✓ Copiado!';
    setTimeout(() => {
        copyCodeBtn.textContent = 'Copiar Código';
    }, 2000);
});

playerNameInput.addEventListener('input', (e) => {
    if (gameState.roomCode && e.target.value.trim()) {
        updatePlayerName(e.target.value.trim());
    }
});

startOnlineGameBtn.addEventListener('click', startOnlineGame);
leaveRoomBtn.addEventListener('click', leaveRoom);

// Event Listeners - Local Setup
backFromSetupBtn.addEventListener('click', () => {
    setupScreen.classList.add('hidden');
    modeScreen.classList.remove('hidden');
});

startButton.addEventListener('click', startLocalGame);

// Event Listeners - Game
nextPlayerButton.addEventListener('click', nextPlayer);
startVotingButton.addEventListener('click', showVotingScreen);
revealImpostorsButton.addEventListener('click', revealImpostors);
playAgainButton.addEventListener('click', resetGame);
gameScreen.addEventListener('click', revealWord);
backToLobbyBtn.addEventListener('click', () => {
    onlineGameScreen.classList.add('hidden');
    lobbyScreen.classList.remove('hidden');
});

// ========== ONLINE FUNCTIONS ==========

function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generatePlayerId() {
    return 'player_' + Math.random().toString(36).substring(2, 11);
}

function createRoom() {
    const roomCode = generateRoomCode();
    const playerId = generatePlayerId();
    
    const room = {
        code: roomCode,
        host: playerId,
        players: {},
        theme: 'minecraft',
        impostors: 1,
        gameStarted: false,
        gameData: null
    };
    
    room.players[playerId] = {
        id: playerId,
        name: 'Anfitrión',
        isHost: true
    };
    
    localStorage.setItem(`room_${roomCode}`, JSON.stringify(room));
    
    gameState.roomCode = roomCode;
    gameState.playerId = playerId;
    gameState.isHost = true;
    
    onlineRoomScreen.classList.add('hidden');
    lobbyScreen.classList.remove('hidden');
    
    roomCodeDisplay.textContent = roomCode;
    shareCode.textContent = roomCode;
    hostControls.classList.remove('hidden');
    
    startRoomSync();
}

function joinRoom() {
    const roomCode = roomCodeInput.value.trim().toUpperCase();
    
    if (!roomCode) {
        alert('Por favor ingresa un código de sala');
        return;
    }
    
    const roomData = localStorage.getItem(`room_${roomCode}`);
    
    if (!roomData) {
        alert('Sala no encontrada');
        return;
    }
    
    const room = JSON.parse(roomData);
    const playerId = generatePlayerId();
    
    room.players[playerId] = {
        id: playerId,
        name: `Jugador ${Object.keys(room.players).length + 1}`,
        isHost: false
    };
    
    localStorage.setItem(`room_${roomCode}`, JSON.stringify(room));
    
    gameState.roomCode = roomCode;
    gameState.playerId = playerId;
    gameState.isHost = false;
    
    onlineRoomScreen.classList.add('hidden');
    lobbyScreen.classList.remove('hidden');
    
    roomCodeDisplay.textContent = roomCode;
    shareCode.textContent = roomCode;
    hostControls.classList.add('hidden');
    
    startRoomSync();
}

function startRoomSync() {
    updateLobby();
    updateInterval = setInterval(updateLobby, 1000);
}

function updateLobby() {
    const roomData = localStorage.getItem(`room_${gameState.roomCode}`);
    
    if (!roomData) {
        clearInterval(updateInterval);
        alert('La sala ha sido cerrada');
        leaveRoom();
        return;
    }
    
    const room = JSON.parse(roomData);
    onlineRoom = room;
    
    // Update players list
    playersList.innerHTML = '<h3>Jugadores en la sala:</h3>';
    Object.values(room.players).forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.className = `player-item ${player.isHost ? 'host' : ''}`;
        playerDiv.innerHTML = `
            <span>${player.name}</span>
            ${player.isHost ? '<span class="host-badge">ANFITRIÓN</span>' : ''}
        `;
        playersList.appendChild(playerDiv);
    });
    
    // Check if game started
    if (room.gameStarted && room.gameData) {
        clearInterval(updateInterval);
        loadOnlineGame(room.gameData);
    }
}

function updatePlayerName(name) {
    const roomData = localStorage.getItem(`room_${gameState.roomCode}`);
    if (!roomData) return;
    
    const room = JSON.parse(roomData);
    if (room.players[gameState.playerId]) {
        room.players[gameState.playerId].name = name;
        gameState.playerName = name;
        localStorage.setItem(`room_${gameState.roomCode}`, JSON.stringify(room));
    }
}

function startOnlineGame() {
    if (!onlineRoom) return;
    
    const playerCount = Object.keys(onlineRoom.players).length;
    const impostorCount = parseInt(impostorsLobby.value);
    
    if (playerCount < 3) {
        alert('Se necesitan al menos 3 jugadores');
        return;
    }
    
    if (playerCount <= impostorCount) {
        alert('Debe haber al menos un jugador más que la cantidad de impostores');
        return;
    }
    
    // Generate game data
    const theme = themeLobby.value;
    const words = [...wordDatabase[theme]];
    const civilianWord = words.splice(Math.floor(Math.random() * words.length), 1)[0];
    const impostorWord = "IMPOSTOR";
    
    const playerIds = Object.keys(onlineRoom.players);
    const playerWords = {};
    const impostorIndices = [];
    
    // Assign civilian word to all
    playerIds.forEach(id => {
        playerWords[id] = civilianWord;
    });
    
    // Assign impostor word
    while (impostorIndices.length < impostorCount) {
        const randomIndex = Math.floor(Math.random() * playerIds.length);
        if (!impostorIndices.includes(randomIndex)) {
            impostorIndices.push(randomIndex);
            playerWords[playerIds[randomIndex]] = impostorWord;
        }
    }
    
    const gameData = {
        theme,
        civilianWord,
        impostorWord,
        playerWords,
        impostorIndices,
        players: onlineRoom.players
    };
    
    onlineRoom.gameStarted = true;
    onlineRoom.gameData = gameData;
    
    localStorage.setItem(`room_${gameState.roomCode}`, JSON.stringify(onlineRoom));
    
    loadOnlineGame(gameData);
}

function loadOnlineGame(gameData) {
    lobbyScreen.classList.add('hidden');
    onlineGameScreen.classList.remove('hidden');
    
    const myWord = gameData.playerWords[gameState.playerId];
    const isImpostor = myWord === "IMPOSTOR";
    
    onlinePlayerName.textContent = gameState.playerName || 'Jugador';
    wordDisplayOnline.textContent = myWord;
    wordDisplayOnline.style.color = isImpostor ? '#ef4444' : '#10b981';
    
    readyStatus.innerHTML = `
        <p>Todos los jugadores han recibido sus palabras</p>
        <p>Discutan y descubran quién es el impostor</p>
    `;
    
    backToLobbyBtn.classList.remove('hidden');
}

function leaveRoom() {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
    
    if (gameState.roomCode) {
        const roomData = localStorage.getItem(`room_${gameState.roomCode}`);
        if (roomData) {
            const room = JSON.parse(roomData);
            delete room.players[gameState.playerId];
            
            if (Object.keys(room.players).length === 0 || gameState.isHost) {
                localStorage.removeItem(`room_${gameState.roomCode}`);
            } else {
                localStorage.setItem(`room_${gameState.roomCode}`, JSON.stringify(room));
            }
        }
    }
    
    lobbyScreen.classList.add('hidden');
    onlineGameScreen.classList.add('hidden');
    modeScreen.classList.remove('hidden');
    
    gameState.roomCode = '';
    gameState.playerId = '';
    gameState.isHost = false;
    onlineRoom = null;
}

// ========== LOCAL GAME FUNCTIONS ==========

function startLocalGame() {
    const theme = document.getElementById('theme').value;
    const players = parseInt(document.getElementById('players').value);
    const impostors = parseInt(document.getElementById('impostors').value);

    if (players <= impostors) {
        alert('Debe haber al menos un jugador más que la cantidad de impostores');
        return;
    }

    gameState.theme = theme;
    gameState.players = players;
    gameState.impostors = impostors;
    gameState.currentPlayer = 1;
    gameState.revealed = false;

    const words = [...wordDatabase[theme]];
    gameState.civilianWord = words.splice(Math.floor(Math.random() * words.length), 1)[0];
    gameState.impostorWord = "IMPOSTOR";

    gameState.playerWords = Array(players).fill(gameState.civilianWord);
    
    gameState.impostorIndices = [];
    while (gameState.impostorIndices.length < impostors) {
        const randomIndex = Math.floor(Math.random() * players);
        if (!gameState.impostorIndices.includes(randomIndex)) {
            gameState.impostorIndices.push(randomIndex);
            gameState.playerWords[randomIndex] = gameState.impostorWord;
        }
    }

    setupScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    currentPlayerNumber.textContent = gameState.currentPlayer;
    revealCard.classList.add('hidden');
    nextPlayerButton.classList.add('hidden');
    startVotingButton.classList.add('hidden');
}

function revealWord(e) {
    if (e.target.tagName === 'BUTTON' || gameState.revealed) {
        return;
    }
    
    if (!revealCard.classList.contains('hidden')) {
        return;
    }
    
    const playerIndex = gameState.currentPlayer - 1;
    const isImpostor = gameState.impostorIndices.includes(playerIndex);
    const word = isImpostor ? "IMPOSTOR" : gameState.playerWords[playerIndex];
    
    wordDisplay.textContent = word;
    wordDisplay.style.color = isImpostor ? '#e74c3c' : '#2ecc71';
    
    revealCard.classList.remove('hidden');
    gameState.revealed = true;
    
    if (gameState.currentPlayer < gameState.players) {
        nextPlayerButton.classList.remove('hidden');
    } else {
        startVotingButton.classList.remove('hidden');
    }
}

function nextPlayer() {
    gameState.currentPlayer++;
    gameState.revealed = false;
    
    currentPlayerNumber.textContent = gameState.currentPlayer;
    revealCard.classList.add('hidden');
    nextPlayerButton.classList.add('hidden');
    wordDisplay.textContent = '';
}

function showVotingScreen() {
    gameScreen.classList.add('hidden');
    votingScreen.classList.remove('hidden');
    
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

function castVote(playerNumber, element) {
    if (!gameState.votes[playerNumber]) {
        gameState.votes[playerNumber] = 0;
    }
    gameState.votes[playerNumber]++;
    
    element.textContent = `Jugador ${playerNumber} (${gameState.votes[playerNumber]} votos)`;
    element.classList.add('voted');
}

function revealImpostors() {
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
    
    let resultsHTML = '<div class="results-content">';
    
    if (mostVotedPlayers.length > 0) {
        resultsHTML += `<h3>Más votado(s): Jugador ${mostVotedPlayers.join(', ')}</h3>`;
    } else {
        resultsHTML += '<h3>¡Nadie recibió votos!</h3>';
    }
    
    resultsHTML += '<br><h3>Revelación:</h3>';
    
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
    
    votingScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
}

function resetGame() {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
    
    gameState = {
        mode: 'local',
        theme: '',
        players: 0,
        impostors: 0,
        playerWords: [],
        impostorWord: '',
        civilianWord: '',
        currentPlayer: 0,
        votes: {},
        impostorIndices: [],
        revealed: false,
        roomCode: '',
        playerId: '',
        playerName: '',
        isHost: false
    };
    
    resultsScreen.classList.add('hidden');
    votingScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    onlineGameScreen.classList.add('hidden');
    lobbyScreen.classList.add('hidden');
    setupScreen.classList.add('hidden');
    onlineRoomScreen.classList.add('hidden');
    modeScreen.classList.remove('hidden');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Juego del Impostor cargado');
});
