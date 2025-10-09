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

// PeerJS state
let peer = null;
let connections = [];
let roomPlayers = {};

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
        gameState.playerName = e.target.value.trim();
        broadcastPlayerUpdate();
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

// ========== PEERJS ONLINE FUNCTIONS ==========

function createRoom() {
    const roomCode = generateRoomCode();
    
    // Crear peer con el código de sala como ID
    peer = new Peer(roomCode, {
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        }
    });
    
    peer.on('open', (id) => {
        gameState.roomCode = id;
        gameState.playerId = 'host';
        gameState.isHost = true;
        gameState.playerName = 'Anfitrión';
        
        roomPlayers[gameState.playerId] = {
            id: gameState.playerId,
            name: gameState.playerName,
            isHost: true
        };
        
        onlineRoomScreen.classList.add('hidden');
        lobbyScreen.classList.remove('hidden');
        
        roomCodeDisplay.textContent = id;
        shareCode.textContent = id;
        hostControls.classList.remove('hidden');
        
        updatePlayersList();
    });
    
    peer.on('connection', (conn) => {
        handleNewConnection(conn);
    });
    
    peer.on('error', (err) => {
        console.error('Error de PeerJS:', err);
        alert('Error al crear sala: ' + err.message);
    });
}

function joinRoom() {
    const roomCode = roomCodeInput.value.trim().toUpperCase();
    
    if (!roomCode) {
        alert('Por favor ingresa un código de sala');
        return;
    }
    
    const playerId = generatePlayerId();
    
    peer = new Peer(playerId, {
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        }
    });
    
    peer.on('open', () => {
        const conn = peer.connect(roomCode);
        
        conn.on('open', () => {
            gameState.roomCode = roomCode;
            gameState.playerId = playerId;
            gameState.isHost = false;
            gameState.playerName = `Jugador ${Math.floor(Math.random() * 1000)}`;
            
            // Enviar info al host
            conn.send({
                type: 'join',
                player: {
                    id: playerId,
                    name: gameState.playerName,
                    isHost: false
                }
            });
            
            connections.push(conn);
            
            onlineRoomScreen.classList.add('hidden');
            lobbyScreen.classList.remove('hidden');
            
            roomCodeDisplay.textContent = roomCode;
            shareCode.textContent = roomCode;
            hostControls.classList.add('hidden');
            
            setupConnectionHandlers(conn);
        });
        
        conn.on('error', (err) => {
            alert('No se pudo conectar a la sala. Verifica el código.');
        });
    });
}

function handleNewConnection(conn) {
    connections.push(conn);
    
    conn.on('open', () => {
        // Enviar lista actual de jugadores al nuevo jugador
        conn.send({
            type: 'players_update',
            players: roomPlayers
        });
    });
    
    setupConnectionHandlers(conn);
}

function setupConnectionHandlers(conn) {
    conn.on('data', (data) => {
        switch(data.type) {
            case 'join':
                if (gameState.isHost) {
                    roomPlayers[data.player.id] = data.player;
                    updatePlayersList();
                    broadcastPlayerUpdate();
                }
                break;
                
            case 'players_update':
                roomPlayers = data.players;
                updatePlayersList();
                break;
                
            case 'player_name_update':
                roomPlayers[data.playerId].name = data.name;
                updatePlayersList();
                break;
                
            case 'start_game':
                loadOnlineGame(data.gameData);
                break;
        }
    });
    
    conn.on('close', () => {
        connections = connections.filter(c => c !== conn);
    });
}

function updatePlayersList() {
    playersList.innerHTML = '<h3>Jugadores en la sala:</h3>';
    Object.values(roomPlayers).forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.className = `player-item ${player.isHost ? 'host' : ''}`;
        playerDiv.innerHTML = `
            <span>${player.name}</span>
            ${player.isHost ? '<span class="host-badge">ANFITRIÓN</span>' : ''}
        `;
        playersList.appendChild(playerDiv);
    });
}

function broadcastPlayerUpdate() {
    if (!gameState.isHost) {
        // Si no eres host, envía tu actualización al host
        if (connections[0]) {
            connections[0].send({
                type: 'player_name_update',
                playerId: gameState.playerId,
                name: gameState.playerName
            });
        }
    } else {
        // Si eres host, actualiza tu nombre y envía a todos
        roomPlayers[gameState.playerId].name = gameState.playerName;
        connections.forEach(conn => {
            conn.send({
                type: 'players_update',
                players: roomPlayers
            });
        });
        updatePlayersList();
    }
}

function startOnlineGame() {
    if (!gameState.isHost) return;
    
    const playerCount = Object.keys(roomPlayers).length;
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
    
    const playerIds = Object.keys(roomPlayers);
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
        players: roomPlayers
    };
    
    // Enviar a todos los jugadores
    connections.forEach(conn => {
        conn.send({
            type: 'start_game',
            gameData: gameData
        });
    });
    
    // Cargar para el host
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
    if (peer) {
        peer.destroy();
        peer = null;
    }
    
    connections.forEach(conn => conn.close());
    connections = [];
    roomPlayers = {};
    
    lobbyScreen.classList.add('hidden');
    onlineGameScreen.classList.add('hidden');
    modeScreen.classList.remove('hidden');
    
    gameState.roomCode = '';
    gameState.playerId = '';
    gameState.isHost = false;
}

function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generatePlayerId() {
    return 'player_' + Math.random().toString(36).substring(2, 11);
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
    if (peer) {
        peer.destroy();
        peer = null;
    }
    
    connections.forEach(conn => conn.close());
    connections = [];
    roomPlayers = {};
    
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
    console.log('Juego del Impostor con PeerJS cargado');
});
