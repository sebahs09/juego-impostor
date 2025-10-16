// Toast Notification System
function showToast(message, type = 'info', title = '') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        error: '❌',
        success: '✅',
        info: 'ℹ️'
    };
    
    const titles = {
        error: title || 'Error',
        success: title || 'Éxito',
        info: title || 'Información'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">${icons[type]}</div>
        <div class="toast-content">
            <div class="toast-title">${titles[type]}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Database of words by theme
const wordDatabase = {
    minecraft: [
        "Creeper", "Enderman", "Diamante", "Netherite", 
        "Steve", "Aldeano", "Zombie", "Esqueleto", 
        "Wither", "Ender Dragon", "Blaze", "Ghast",
        "Redstone", "Obsidiana", "Portal", "Elytra"
    ],
    futbol: [
        "Lionel Messi", "Cristiano Ronaldo", "Kylian Mbappé", "Erling Haaland",
        "Neymar Jr", "Luka Modrić", "Robert Lewandowski", "Kevin De Bruyne",
        "Vinícius Jr", "Mohamed Salah", "Harry Kane", "Jude Bellingham",
        "Antoine Griezmann", "Bruno Fernandes", "Phil Foden", "Bukayo Saka",
        "Pedri", "Gavi", "Rodri", "Toni Kroos", "Karim Benzema", "Marcus Rashford",
        "Frenkie de Jong", "João Félix", "Rafael Leão", "Son Heung-min",
        "Casemiro", "Bernardo Silva", "Jack Grealish", "Ousmane Dembélé",
        "Achraf Hakimi", "Theo Hernández", "Marc-André ter Stegen", "Thibaut Courtois",
        "Emiliano Martínez", "Alisson Becker", "Ederson Moraes", "Mike Maignan",
        "Jamal Musiala", "Joshua Kimmich", "Ilkay Gündogan", "Martin Ødegaard",
        "Virgil van Dijk", "Rúben Dias", "Lisandro Martínez", "Julián Álvarez",
        "Enzo Fernández", "Lautaro Martínez", "Ángel Di María", "Paulo Dybala",
        "Federico Valverde", "Eduardo Camavinga", "Aurélien Tchouaméni", "Declan Rice",
        "Kai Havertz", "Christopher Nkunku", "Rasmus Højlund", "Darwin Núñez",
        "Alejandro Garnacho", "Nicolás Otamendi", "Sergio Ramos", "Gerard Piqué",
        "Jordi Alba", "Daniel Carvajal", "Kyle Walker", "John Stones",
        "Antonio Rüdiger", "Eder Militão", "Dayot Upamecano", "Matthijs de Ligt",
        "Ronald Araújo", "Marquinhos", "Thiago Silva", "Raphaël Varane",
        "João Cancelo", "Andrew Robertson", "Trent Alexander-Arnold", "Jérémy Doku",
        "Takefusa Kubo", "Nico Williams", "Ansu Fati", "Mason Mount",
        "Raheem Sterling", "Richarlison", "Gabriel Jesus", "Rodrygo",
        "Alexis Sánchez", "James Rodríguez", "Luis Díaz", "Wojciech Szczęsny",
        "Dominik Szoboszlai", "Nicolo Barella", "Federico Chiesa", "Leon Goretzka",
        "Serge Gnabry", "Kingsley Coman", "Álvaro Morata", "Memphis Depay",
        "Gerard Moreno", "Granit Xhaka", "Christian Pulisic"
    ],
    comida: [
        "Pizza", "Hamburguesa", "Sushi", "Tacos", 
        "Pasta", "Asado", "Empanadas", "Milanesa", 
        "Helado", "Chocolate", "Paella", "Ramen",
        "Hot Dog", "Burrito", "Lasaña", "Croissant"
    ],
    clashroyale: [
        // Tropas
        "Caballero", "Arqueras", "Esqueletos", "Bárbaros", "Gólem", "Mini P.E.K.K.A",
        "Mosquetera", "Gigante", "Príncipe", "Bebé Dragón", "Bruja", "Valquiria",
        "Globo Bombástico", "Ejército de Esqueletos", "Mago", "Horda de Esbirros",
        "Duendes", "Duendes con Lanza", "Montapuercos", "P.E.K.K.A", "Mago de Hielo",
        "Mago Eléctrico", "Chispitas", "Dragón Eléctrico", "Leñador", "Megaesbirro",
        "Megacaballero", "Minero", "Príncipe Oscuro", "Bandida", "Fantasma Real",
        "Bruja Nocturna", "Cazador", "Pescador", "Arquero Mágico", "Esqueleto Gigante",
        "Dragón Infernal", "Gigante Noble", "Gigante Eléctrico", "Duende Gigante",
        "Curandera Guerrera", "Guardias", "Reclutas Reales", "Bárbaros de Élite",
        "Puercos Reales", "Duendes Reales", "Murciélagos", "Esbirros", "Dragones Esqueleto",
        "Espíritu de Hielo", "Espíritu de Fuego", "Espíritu Eléctrico", "Espíritu Sanador",
        "Bombardero", "Lanzarrocas", "Verdugo", "Lanzadardos", "Trío de Mosqueteras",
        "Máquina Voladora", "Gólem de Hielo", "Gólem de Elixir", "Duende Lanzadardos",
        "Guardabosques", "Duendes con Hacha",
        // Hechizos
        "Flechas", "Bola de Fuego", "Rayo", "Descarga", "Cohete", "Veneno", "Tornado",
        "El Tronco", "Terremoto", "Hielo", "Clon", "Bola de Nieve", "Furia", "Espejo",
        "Cementerio", "Barril de Duendes", "Barril de Bárbaros", "Paquete Real",
        // Estructuras
        "Torre Bombardera", "Ballesta", "Cañón", "Mortero", "Torre Infernal", "Torre Tesla",
        "Choza de Bárbaros", "Choza de Duendes", "Lápida", "Horno", "Recolector de Elixir",
        "Jaula del Forzudo",
        // Campeones
        "Reina Arquera", "Rey Esqueleto", "Caballero Dorado", "Minero Poderoso", "Monje"
    ]
};

// Game state
let gameState = {
    mode: 'local',
    onlineMode: 'oral', // 'oral' or 'chat'
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
let chatMessages = [];
let currentTurnIndex = 0;
let playerOrder = [];
let turnsFinished = false;
let playerScores = {}; // { playerId: points }
let currentImpostors = []; // IDs de los impostores actuales
let currentRound = 1; // Ronda actual (cada ronda vale más puntos)

// DOM Elements - Welcome Screen
const welcomeScreen = document.getElementById('welcome-screen');

// DOM Elements - Mode Selection
const modeScreen = document.getElementById('mode-screen');
const localModeBtn = document.getElementById('local-mode-btn');
const onlineModeBtn = document.getElementById('online-mode-btn');

// DOM Elements - Online Mode Selection
const onlineModeScreen = document.getElementById('online-mode-screen');
const oralModeBtn = document.getElementById('oral-mode-btn');
const chatModeBtn = document.getElementById('chat-mode-btn');
const backFromOnlineModeBtn = document.getElementById('back-from-online-mode');

// DOM Elements - Turns
const turnSectionOral = document.getElementById('turn-section-oral');
const turnSectionChat = document.getElementById('turn-section-chat');
const currentTurnOral = document.getElementById('current-turn-oral');
const currentTurnChat = document.getElementById('current-turn-chat');
const nextTurnOralBtn = document.getElementById('next-turn-oral-btn');
const nextTurnChatBtn = document.getElementById('next-turn-chat-btn');
const discussionSectionOral = document.getElementById('discussion-section-oral');
const discussionSectionChat = document.getElementById('discussion-section-chat');
const nextRoundOralBtn = document.getElementById('next-round-oral-btn');
const startVoteBtn = document.getElementById('start-vote-btn');
const victoryButtonsOral = document.getElementById('victory-buttons-oral');
const victoryButtonsChat = document.getElementById('victory-buttons-chat');
const impostorWinOralBtn = document.getElementById('impostor-win-oral-btn');
const crewWinOralBtn = document.getElementById('crew-win-oral-btn');
const impostorWinChatBtn = document.getElementById('impostor-win-chat-btn');
const crewWinChatBtn = document.getElementById('crew-win-chat-btn');

// DOM Elements - Online
const onlineRoomScreen = document.getElementById('online-room-screen');
const onlineRoomTitle = document.getElementById('online-room-title');
const createRoomBtn = document.getElementById('create-room-btn');
const joinRoomBtn = document.getElementById('join-room-btn');
const roomCodeInput = document.getElementById('room-code');
const backToOnlineModeBtn = document.getElementById('back-to-online-mode');

// DOM Elements - Lobby
const lobbyScreen = document.getElementById('lobby-screen');
const roomCodeDisplay = document.getElementById('room-code-display');
const shareCode = document.getElementById('share-code');
const copyCodeBtn = document.getElementById('copy-code-btn');
const playerNameLobby = document.getElementById('player-name');
const playersList = document.getElementById('players-list');
const hostControls = document.getElementById('host-controls');
const themeLobby = document.getElementById('theme-lobby');
const impostorsLobby = document.getElementById('impostors-lobby');
const startOnlineGameBtn = document.getElementById('start-online-game');
const scoreTableEl = document.getElementById('score-table');
const currentRoundDisplay = document.getElementById('current-round-display');
const nextRoundPoints = document.getElementById('next-round-points');
const leaveRoomBtn = document.getElementById('leave-room-btn');

// DOM Elements - Local Setup
const setupScreen = document.getElementById('setup-screen');
const backFromSetupBtn = document.getElementById('back-from-setup');
const startButton = document.getElementById('start-game');

// DOM Elements - Game Screens
const gameScreen = document.getElementById('game-screen');
const onlineGameScreen = document.getElementById('online-game-screen');
const chatGameScreen = document.getElementById('chat-game-screen');
const currentPlayerNumber = document.getElementById('current-player-number');
const revealCard = document.getElementById('reveal-card');
const wordDisplay = document.getElementById('word-display');
const wordDisplayOnline = document.getElementById('word-display-online');
const wordDisplayChat = document.getElementById('word-display-chat');
const onlinePlayerName = document.getElementById('online-player-name');
const chatPlayerName = document.getElementById('chat-player-name');
const readyStatus = document.getElementById('ready-status');
const backToLobbyBtn = document.getElementById('back-to-lobby');
const backToLobbyChatBtn = document.getElementById('back-to-lobby-chat');
const toggleWordBtn = document.getElementById('toggle-word-btn');
const toggleWordChatBtn = document.getElementById('toggle-word-chat-btn');

// DOM Elements - Chat
const chatMessagesDiv = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendMessageBtn = document.getElementById('send-message-btn');

// DOM Elements - Voting
const votingScreen = document.getElementById('voting-screen');
const votingOptions = document.getElementById('voting-options');
const voteResults = document.getElementById('vote-results');
const revealResultsBtn = document.getElementById('reveal-results-btn');
const backFromVoteBtn = document.getElementById('back-from-vote');

// DOM Elements - Game Controls
const nextPlayerButton = document.getElementById('next-player');
const playAgainButton = document.getElementById('play-again');
const gameEndButtons = document.getElementById('game-end-buttons');
const nextRoundLocalBtn = document.getElementById('next-round-local');
const newGameLocalBtn = document.getElementById('new-game-local');

// DOM Elements - Rules Modal
const rulesModal = document.getElementById('rules-modal');
const showRulesBtn = document.getElementById('show-rules-btn');
const closeRulesBtn = document.getElementById('close-rules-btn');

// Event Listeners - Welcome Screen
welcomeScreen.addEventListener('click', () => {
    // Agregar animación de salida
    welcomeScreen.classList.add('exit');
    
    // Esperar a que termine la animación
    setTimeout(() => {
        welcomeScreen.classList.add('hidden');
        modeScreen.classList.remove('hidden');
        modeScreen.classList.add('mode-screen-enter');
    }, 800);
});

// Event Listeners - Rules Modal
showRulesBtn.addEventListener('click', () => {
    rulesModal.classList.remove('hidden');
});

closeRulesBtn.addEventListener('click', () => {
    rulesModal.classList.add('hidden');
});

// Cerrar modal al hacer clic fuera del contenido
rulesModal.addEventListener('click', (e) => {
    if (e.target === rulesModal) {
        rulesModal.classList.add('hidden');
    }
});

// Event Listeners - Mode Selection
localModeBtn.addEventListener('click', () => {
    gameState.mode = 'local';
    modeScreen.classList.add('hidden');
    setupScreen.classList.remove('hidden');
});

onlineModeBtn.addEventListener('click', () => {
    gameState.mode = 'online';
    modeScreen.classList.add('hidden');
    onlineModeScreen.classList.remove('hidden');
});

// Event Listeners - Online Mode Selection
oralModeBtn.addEventListener('click', () => {
    gameState.onlineMode = 'oral';
    onlineModeScreen.classList.add('hidden');
    onlineRoomScreen.classList.remove('hidden');
    onlineRoomTitle.textContent = 'Modo Oral - Online';
});

chatModeBtn.addEventListener('click', () => {
    gameState.onlineMode = 'chat';
    onlineModeScreen.classList.add('hidden');
    onlineRoomScreen.classList.remove('hidden');
    onlineRoomTitle.textContent = 'Modo Chat - Online';
});

backFromOnlineModeBtn.addEventListener('click', () => {
    onlineModeScreen.classList.add('hidden');
    modeScreen.classList.remove('hidden');
});

// Event Listeners - Online Room
createRoomBtn.addEventListener('click', createRoom);
joinRoomBtn.addEventListener('click', joinRoom);
backToOnlineModeBtn.addEventListener('click', () => {
    onlineRoomScreen.classList.add('hidden');
    onlineModeScreen.classList.remove('hidden');
});

// Event Listeners - Lobby
copyCodeBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(gameState.roomCode);
    copyCodeBtn.textContent = '✓ Copiado!';
    setTimeout(() => {
        copyCodeBtn.textContent = 'Copiar Código';
    }, 2000);
});

// Nombre se pide en el lobby online ahora

playerNameLobby.addEventListener('input', (e) => {
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
playAgainButton.addEventListener('click', resetGame);
nextRoundLocalBtn.addEventListener('click', startNextRoundLocal);
newGameLocalBtn.addEventListener('click', startNewGameLocal);
gameScreen.addEventListener('click', revealWord);

// Event Listeners - Toggle Word (Oral Mode)
let wordVisible = true;
toggleWordBtn.addEventListener('click', () => {
    wordVisible = !wordVisible;
    if (wordVisible) {
        wordDisplayOnline.style.opacity = '1';
        wordDisplayOnline.textContent = wordDisplayOnline.dataset.word;
        toggleWordBtn.textContent = '👁️ Ocultar Palabra';
    } else {
        wordDisplayOnline.style.opacity = '0.2';
        wordDisplayOnline.textContent = '***';
        toggleWordBtn.textContent = '👁️ Mostrar Palabra';
    }
});

// Event Listeners - Toggle Word (Chat Mode)
let wordVisibleChat = true;
toggleWordChatBtn.addEventListener('click', () => {
    wordVisibleChat = !wordVisibleChat;
    if (wordVisibleChat) {
        wordDisplayChat.style.opacity = '1';
        wordDisplayChat.textContent = wordDisplayChat.dataset.word;
        toggleWordChatBtn.textContent = '👁️ Ocultar Palabra';
    } else {
        wordDisplayChat.style.opacity = '0.2';
        wordDisplayChat.textContent = '***';
        toggleWordChatBtn.textContent = '👁️ Mostrar Palabra';
    }
});

backToLobbyBtn.addEventListener('click', () => {
    onlineGameScreen.classList.add('hidden');
    lobbyScreen.classList.remove('hidden');
    // Resetear tema
    document.body.classList.remove('impostor-theme', 'crew-theme');
});

backToLobbyChatBtn.addEventListener('click', () => {
    chatGameScreen.classList.add('hidden');
    lobbyScreen.classList.remove('hidden');
    // Resetear tema
    document.body.classList.remove('impostor-theme', 'crew-theme');
});

// Event Listeners - Turns
nextTurnOralBtn.addEventListener('click', () => {
    if (gameState.isHost) {
        nextTurn('oral');
    } else {
        showToast('Solo el anfitrión puede pasar turnos', 'error', 'Permiso Denegado');
    }
});

nextTurnChatBtn.addEventListener('click', () => {
    if (gameState.isHost) {
        nextTurn('chat');
    } else {
        showToast('Solo el anfitrión puede pasar turnos', 'error', 'Permiso Denegado');
    }
});

nextRoundOralBtn.addEventListener('click', () => {
    if (gameState.isHost) {
        startNewRound('oral');
    }
});

startVoteBtn.addEventListener('click', () => {
    if (gameState.isHost) {
        initVoting();
    }
});

// Event Listeners - Victory Buttons
impostorWinOralBtn.addEventListener('click', () => {
    if (gameState.isHost) {
        declareWinner('impostor', 'oral');
    }
});

crewWinOralBtn.addEventListener('click', () => {
    if (gameState.isHost) {
        declareWinner('crew', 'oral');
    }
});

impostorWinChatBtn.addEventListener('click', () => {
    if (gameState.isHost) {
        declareWinner('impostor', 'chat');
    }
});

crewWinChatBtn.addEventListener('click', () => {
    if (gameState.isHost) {
        declareWinner('crew', 'chat');
    }
});

// Event Listeners - Chat
sendMessageBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Event Listeners - Voting
revealResultsBtn.addEventListener('click', revealVoteResults);
backFromVoteBtn.addEventListener('click', () => {
    votingScreen.classList.add('hidden');
    chatGameScreen.classList.remove('hidden');
});

// ========== PEERJS ONLINE FUNCTIONS ==========

function createRoom() {
    const roomCode = generateRoomCode();
    
    // Resetear ronda
    currentRound = 1;
    
    // Mostrar indicador de carga
    createRoomBtn.disabled = true;
    createRoomBtn.textContent = 'Creando sala...';
    
    peer = new Peer(roomCode, {
        debug: 2,
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' },
                { urls: 'stun:stun3.l.google.com:19302' },
                { urls: 'stun:stun4.l.google.com:19302' }
            ],
            iceTransportPolicy: 'all'
        }
    });
    
    peer.on('open', (id) => {
        createRoomBtn.disabled = false;
        createRoomBtn.textContent = 'Crear Sala';
        gameState.roomCode = id;
        gameState.playerId = 'host';
        gameState.isHost = true;
        // Usar el nombre ingresado al inicio
        
        roomPlayers[gameState.playerId] = {
            id: gameState.playerId,
            name: gameState.playerName,
            isHost: true,
            connected: true
        };
        
        onlineRoomScreen.classList.add('hidden');
        lobbyScreen.classList.remove('hidden');
        
        roomCodeDisplay.textContent = id;
        shareCode.textContent = id;
        playerNameLobby.value = gameState.playerName;
        hostControls.classList.remove('hidden');
        
        updatePlayersList();
        showLiveChat();
    });
    
    peer.on('connection', (conn) => {
        handleNewConnection(conn);
    });
    
    peer.on('error', (err) => {
        console.error('Error de PeerJS:', err);
        createRoomBtn.disabled = false;
        createRoomBtn.textContent = 'Crear Sala';
        showToast('No se pudo crear la sala. Intenta de nuevo.', 'error', 'Error de Conexión');
    });
}

function joinRoom() {
    const roomCode = roomCodeInput.value.trim().toLowerCase();
    
    if (!roomCode) {
        showToast('Por favor ingresa un código de sala válido', 'error', 'Código Requerido');
        return;
    }
    
    // Mostrar indicador de carga
    joinRoomBtn.disabled = true;
    joinRoomBtn.textContent = 'Conectando...';
    
    const playerId = generatePlayerId();
    
    peer = new Peer(playerId, {
        debug: 2,
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' },
                { urls: 'stun:stun3.l.google.com:19302' },
                { urls: 'stun:stun4.l.google.com:19302' }
            ],
            iceTransportPolicy: 'all'
        }
    });
    
    peer.on('open', () => {
        joinRoomBtn.textContent = 'Uniéndose...';
        const conn = peer.connect(roomCode);
        
        conn.on('open', () => {
            gameState.roomCode = roomCode;
            gameState.playerId = playerId;
            gameState.isHost = false;
            // Usar el nombre ingresado al inicio
            
            conn.send({
                type: 'join',
                player: {
                    id: playerId,
                    name: gameState.playerName,
                    isHost: false,
                    connected: true
                }
            });
            
            connections.push(conn);
            
            onlineRoomScreen.classList.add('hidden');
            lobbyScreen.classList.remove('hidden');
            
            roomCodeDisplay.textContent = roomCode;
            shareCode.textContent = roomCode;
            playerNameLobby.value = gameState.playerName;
            hostControls.classList.add('hidden');
            
            joinRoomBtn.disabled = false;
            joinRoomBtn.textContent = 'Unirse a Sala';
            
            setupConnectionHandlers(conn);
            showLiveChat();
        });
        
        conn.on('error', (err) => {
            joinRoomBtn.disabled = false;
            joinRoomBtn.textContent = 'Unirse a Sala';
            showToast('No se pudo conectar. Verifica el código de sala.', 'error', 'Error de Conexión');
        });
    });
    
    peer.on('error', (err) => {
        joinRoomBtn.disabled = false;
        joinRoomBtn.textContent = 'Unirse a Sala';
        showToast('Error de conexión. Intenta de nuevo.', 'error', 'Error');
    });
}

function handleNewConnection(conn) {
    connections.push(conn);
    
    conn.on('open', () => {
        conn.send({
            type: 'players_update',
            players: roomPlayers
        });
        
        if (gameState.onlineMode === 'chat') {
            conn.send({
                type: 'chat_history',
                messages: chatMessages
            });
        }
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
                if (roomPlayers[data.playerId]) {
                    roomPlayers[data.playerId].name = data.name;
                    updatePlayersList();
                }
                break;
                
            case 'start_game':
                loadOnlineGame(data.gameData);
                break;
                
            case 'chat_message':
                receiveMessage(data.message);
                break;
                
            case 'chat_history':
                chatMessages = data.messages;
                displayChatHistory();
                break;
                
            case 'start_vote':
                showVotingScreen();
                break;
                
            case 'vote':
                receiveVote(data.vote);
                break;
                
            case 'reveal_results':
                displayVoteResults(data.results);
                break;
                
            case 'live_chat':
                receiveLiveChatMessage(data.message);
                break;
                
            case 'next_turn':
                currentTurnIndex = data.turnIndex;
                updateCurrentTurn(data.mode);
                break;
                
            case 'turns_finished':
                turnsFinished = true;
                if (data.mode === 'oral') {
                    turnSectionOral.classList.add('hidden');
                    discussionSectionOral.classList.remove('hidden');
                } else {
                    turnSectionChat.classList.add('hidden');
                    discussionSectionChat.classList.remove('hidden');
                }
                break;
                
            case 'new_round':
                currentTurnIndex = 0;
                turnsFinished = false;
                // Sincronizar ronda
                if (data.round) {
                    currentRound = data.round;
                    updateScoreboard();
                }
                discussionSectionOral.classList.add('hidden');
                turnSectionOral.classList.remove('hidden');
                updateCurrentTurn(data.mode);
                break;
                
            case 'start_voting':
                chatGameScreen.classList.add('hidden');
                votingScreen.classList.remove('hidden');
                votingOptions.innerHTML = '';
                Object.values(roomPlayers).forEach(player => {
                    const option = document.createElement('div');
                    option.className = 'vote-option';
                    option.innerHTML = `
                        <h3>${player.name}</h3>
                        <button class="btn" onclick="castVote('${player.id}')">Votar</button>
                    `;
                    votingOptions.appendChild(option);
                });
                break;
                
            case 'update_score':
                playerScores = data.scores;
                updateScoreboard();
                // Mostrar mensaje con nombres de impostores y puntos
                const pointsText = data.winner === 'impostor' ? ` (+${data.round} pts)` : '';
                const message = data.winner === 'impostor' 
                    ? `🔴 El impostor era: ${data.impostorNames}${pointsText}` 
                    : `🔵 La tripulación ganó! El impostor era: ${data.impostorNames}`;
                showToast(message, 'success', `Fin de Ronda ${data.round}`);
                break;
                
            case 'back_to_lobby':
                onlineGameScreen.classList.add('hidden');
                chatGameScreen.classList.add('hidden');
                lobbyScreen.classList.remove('hidden');
                victoryButtonsOral.classList.add('hidden');
                victoryButtonsChat.classList.add('hidden');
                // Resetear tema
                document.body.classList.remove('impostor-theme', 'crew-theme');
                // Sincronizar ronda
                if (data.round) {
                    currentRound = data.round;
                }
                break;
        }
    });
    
    conn.on('close', () => {
        connections = connections.filter(c => c !== conn);
        // Marcar jugador como desconectado
        Object.keys(roomPlayers).forEach(playerId => {
            if (roomPlayers[playerId].peerId === conn.peer) {
                delete roomPlayers[playerId];
                updatePlayersList();
                broadcastPlayerUpdate();
            }
        });
    });
}

function updatePlayersList() {
    playersList.innerHTML = '<h3>Jugadores en la sala:</h3>';
    Object.values(roomPlayers).forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-item';
        if (player.isHost) {
            playerDiv.classList.add('host');
        }
        playerDiv.textContent = `${player.name} ${player.isHost ? '👑' : ''}`;
        playersList.appendChild(playerDiv);
        
        // Inicializar puntos si no existen
        if (!playerScores[player.id]) {
            playerScores[player.id] = 0;
        }
    });
    
    // Actualizar tabla de puntuaciones
    updateScoreboard();
}

function broadcastPlayerUpdate() {
    if (!gameState.isHost) {
        if (connections[0]) {
            connections[0].send({
                type: 'player_name_update',
                playerId: gameState.playerId,
                name: gameState.playerName
            });
        }
    } else {
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
        showToast('Se necesitan al menos 3 jugadores para comenzar', 'error', 'Jugadores Insuficientes');
        return;
    }
    
    if (playerCount <= impostorCount) {
        showToast('Debe haber más civiles que impostores', 'error', 'Configuración Inválida');
        return;
    }
    
    const theme = themeLobby.value;
    const words = [...wordDatabase[theme]];
    const civilianWord = words.splice(Math.floor(Math.random() * words.length), 1)[0];
    const impostorWord = "IMPOSTOR";
    
    const playerIds = Object.keys(roomPlayers);
    const playerWords = {};
    const impostorIndices = [];
    
    playerIds.forEach(id => {
        playerWords[id] = civilianWord;
    });
    
    // Guardar IDs de impostores
    currentImpostors = [];
    while (impostorIndices.length < impostorCount) {
        const randomIndex = Math.floor(Math.random() * playerIds.length);
        if (!impostorIndices.includes(randomIndex)) {
            impostorIndices.push(randomIndex);
            const impostorId = playerIds[randomIndex];
            playerWords[impostorId] = impostorWord;
            currentImpostors.push(impostorId);
        }
    }
    
    // Crear orden aleatorio de turnos
    const shuffledPlayerIds = [...playerIds].sort(() => Math.random() - 0.5);
    
    const gameData = {
        theme,
        civilianWord,
        impostorWord,
        playerWords,
        impostorIndices,
        players: roomPlayers,
        mode: gameState.onlineMode,
        turnOrder: shuffledPlayerIds, // Orden aleatorio
        impostors: currentImpostors
    };
    
    connections.forEach(conn => {
        conn.send({
            type: 'start_game',
            gameData: gameData
        });
    });
    
    loadOnlineGame(gameData);
}

function loadOnlineGame(gameData) {
    lobbyScreen.classList.add('hidden');
    
    // Guardar impostores actuales
    currentImpostors = gameData.impostors || [];
    
    const myWord = gameData.playerWords[gameState.playerId];
    const isImpostor = myWord === "IMPOSTOR";
    
    // Actualizar roomPlayers con los datos del juego
    if (gameData.players) {
        roomPlayers = gameData.players;
    }
    
    // Usar orden aleatorio de turnos del host
    playerOrder = gameData.turnOrder || Object.keys(roomPlayers);
    currentTurnIndex = 0;
    turnsFinished = false;
    
    // Cambiar tema de color según el rol
    document.body.classList.remove('impostor-theme', 'crew-theme');
    if (isImpostor) {
        document.body.classList.add('impostor-theme');
    } else {
        document.body.classList.add('crew-theme');
    }
    
    if (gameData.mode === 'oral') {
        onlineGameScreen.classList.remove('hidden');
        onlinePlayerName.textContent = gameState.playerName || 'Jugador';
        wordDisplayOnline.textContent = myWord;
        wordDisplayOnline.dataset.word = myWord;
        wordDisplayOnline.style.color = isImpostor ? '#ef4444' : '#10b981';
        wordDisplayOnline.style.opacity = '1';
        wordVisible = true;
        
        // Mostrar primer turno
        turnSectionOral.classList.remove('hidden');
        discussionSectionOral.classList.add('hidden');
        updateCurrentTurn('oral');
        
        backToLobbyBtn.classList.remove('hidden');
    } else {
        chatGameScreen.classList.remove('hidden');
        chatPlayerName.textContent = gameState.playerName || 'Jugador';
        wordDisplayChat.textContent = myWord;
        wordDisplayChat.dataset.word = myWord;
        wordDisplayChat.style.color = isImpostor ? '#ef4444' : '#10b981';
        wordDisplayChat.style.opacity = '1';
        wordVisibleChat = true;
        
        // Mostrar primer turno
        turnSectionChat.classList.remove('hidden');
        discussionSectionChat.classList.add('hidden');
        updateCurrentTurn('chat');
    }
}

function updateCurrentTurn(mode) {
    if (!playerOrder || playerOrder.length === 0 || !roomPlayers) return;
    
    const currentPlayerId = playerOrder[currentTurnIndex];
    const currentPlayer = roomPlayers[currentPlayerId];
    
    if (!currentPlayer) return;
    
    const isLastTurn = currentTurnIndex === playerOrder.length - 1;
    const isHost = gameState.isHost;
    
    if (mode === 'oral') {
        currentTurnOral.textContent = currentPlayer.name;
        if (isHost) {
            nextTurnOralBtn.classList.remove('hidden');
            nextTurnOralBtn.textContent = isLastTurn ? 'Iniciar Discusión' : 'Pasar Turno';
        } else {
            nextTurnOralBtn.classList.add('hidden');
        }
    } else {
        currentTurnChat.textContent = currentPlayer.name;
        if (isHost) {
            nextTurnChatBtn.classList.remove('hidden');
            nextTurnChatBtn.textContent = isLastTurn ? 'Iniciar Discusión' : 'Pasar Turno';
        } else {
            nextTurnChatBtn.classList.add('hidden');
        }
    }
}

function nextTurn(mode) {
    currentTurnIndex++;
    
    if (currentTurnIndex >= playerOrder.length) {
        // Terminar turnos, iniciar discusión
        turnsFinished = true;
        
        if (mode === 'oral') {
            turnSectionOral.classList.add('hidden');
            discussionSectionOral.classList.remove('hidden');
            // Mostrar botones de victoria y siguiente ronda solo al anfitrión
            if (gameState.isHost) {
                victoryButtonsOral.classList.remove('hidden');
                nextRoundOralBtn.classList.remove('hidden');
            }
        } else {
            turnSectionChat.classList.add('hidden');
            discussionSectionChat.classList.remove('hidden');
            // Mostrar botones de victoria y votación solo al anfitrión
            if (gameState.isHost) {
                victoryButtonsChat.classList.remove('hidden');
                startVoteBtn.classList.remove('hidden');
            }
        }
        
        // Broadcast a todos
        connections.forEach(conn => {
            conn.send({
                type: 'turns_finished',
                mode: mode
            });
        });
    } else {
        updateCurrentTurn(mode);
        
        // Broadcast nuevo turno
        connections.forEach(conn => {
            conn.send({
                type: 'next_turn',
                turnIndex: currentTurnIndex,
                mode: mode
            });
        });
    }
}

function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    const msgData = {
        sender: gameState.playerName,
        senderId: gameState.playerId,
        text: message,
        timestamp: Date.now()
    };
    
    chatMessages.push(msgData);
    displayMessage(msgData, true);
    
    connections.forEach(conn => {
        conn.send({
            type: 'chat_message',
            message: msgData
        });
    });
    
    chatInput.value = '';
}

function receiveMessage(msgData) {
    chatMessages.push(msgData);
    displayMessage(msgData, false);
}

function displayMessage(msgData, isOwn) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${isOwn ? 'own' : ''}`;
    msgDiv.innerHTML = `
        <div class="sender">${msgData.sender}</div>
        <div class="text">${msgData.text}</div>
    `;
    chatMessagesDiv.appendChild(msgDiv);
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
}

function displayChatHistory() {
    chatMessagesDiv.innerHTML = '';
    chatMessages.forEach(msg => {
        displayMessage(msg, msg.senderId === gameState.playerId);
    });
}

function declareWinner(winner, mode) {
    // Obtener nombres de impostores
    const impostorNames = currentImpostors.map(id => roomPlayers[id]?.name || 'Desconocido').join(', ');
    
    // Actualizar puntos solo si ganaron los impostores (puntos = número de ronda)
    if (winner === 'impostor') {
        currentImpostors.forEach(impostorId => {
            if (!playerScores[impostorId]) {
                playerScores[impostorId] = 0;
            }
            playerScores[impostorId] += currentRound; // Suma puntos según la ronda
        });
    }
    
    // Mostrar mensaje con nombres de impostores y puntos ganados
    const pointsText = winner === 'impostor' ? ` (+${currentRound} pts)` : '';
    const message = winner === 'impostor' 
        ? `🔴 El impostor era: ${impostorNames}${pointsText}` 
        : `🔵 La tripulación ganó! El impostor era: ${impostorNames}`;
    showToast(message, 'success', `Fin de Ronda ${currentRound}`);
    
    // Volver al lobby inmediatamente
    if (mode === 'oral') {
        onlineGameScreen.classList.add('hidden');
    } else {
        chatGameScreen.classList.add('hidden');
    }
    lobbyScreen.classList.remove('hidden');
    
    // Resetear tema
    document.body.classList.remove('impostor-theme', 'crew-theme');
    
    // Resetear UI
    victoryButtonsOral.classList.add('hidden');
    victoryButtonsChat.classList.add('hidden');
    nextRoundOralBtn.classList.add('hidden');
    startVoteBtn.classList.add('hidden');
    
    // Actualizar tabla de puntuaciones
    updateScoreboard();
    
    // Broadcast a todos
    connections.forEach(conn => {
        conn.send({
            type: 'update_score',
            scores: playerScores,
            winner: winner,
            impostorNames: impostorNames,
            round: currentRound
        });
    });
    
    // Incrementar ronda para la siguiente
    currentRound++;
    
    // Broadcast volver al lobby
    connections.forEach(conn => {
        conn.send({
            type: 'back_to_lobby',
            round: currentRound
        });
    });
}

function updateScoreboard() {
    // Actualizar indicador de ronda
    currentRoundDisplay.textContent = currentRound;
    nextRoundPoints.textContent = currentRound;
    
    // Crear array de jugadores con puntos
    const playersWithScores = Object.keys(roomPlayers).map(playerId => ({
        id: playerId,
        name: roomPlayers[playerId].name,
        points: playerScores[playerId] || 0
    }));
    
    // Ordenar por puntos (mayor a menor)
    playersWithScores.sort((a, b) => b.points - a.points);
    
    // Renderizar tabla
    scoreTableEl.innerHTML = '';
    playersWithScores.forEach((player, index) => {
        const row = document.createElement('div');
        row.className = 'score-row';
        if (index === 0 && player.points > 0) {
            row.classList.add('top-player');
        }
        
        const rank = index + 1;
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
        
        row.innerHTML = `
            <div class="player-name">
                <span class="player-rank">${medal}</span>
                <span>${player.name}</span>
            </div>
            <span class="player-points">${player.points} pts</span>
        `;
        
        scoreTableEl.appendChild(row);
    });
}

function startNewRound(mode) {
    // Incrementar ronda
    currentRound++;
    
    // Actualizar indicador de ronda
    updateScoreboard();
    
    // Reiniciar turnos
    currentTurnIndex = 0;
    turnsFinished = false;
    nextRoundOralBtn.classList.add('hidden');
    victoryButtonsOral.classList.add('hidden');
    
    // Volver a fase de turnos
    discussionSectionOral.classList.add('hidden');
    turnSectionOral.classList.remove('hidden');
    updateCurrentTurn(mode);
    
    // Broadcast a todos
    connections.forEach(conn => {
        conn.send({
            type: 'new_round',
            mode: mode,
            round: currentRound
        });
    });
}

function initVoting() {
    chatGameScreen.classList.add('hidden');
    votingScreen.classList.remove('hidden');
    
    votingOptions.innerHTML = '';
    Object.values(roomPlayers).forEach(player => {
        const option = document.createElement('div');
        option.className = 'vote-option';
        option.innerHTML = `
            <h3>${player.name}</h3>
            <button class="btn" onclick="castVote('${player.id}')">Votar</button>
        `;
        votingOptions.appendChild(option);
    });
    
    // Broadcast a todos
    connections.forEach(conn => {
        conn.send({
            type: 'start_voting'
        });
    });
}

function startVoting() {
    if (!gameState.isHost) return;
    
    connections.forEach(conn => {
        conn.send({ type: 'start_vote' });
    });
    
    showVotingScreen();
}

function showVotingScreen() {
    chatGameScreen.classList.add('hidden');
    votingScreen.classList.remove('hidden');
    
    votingOptions.innerHTML = '';
    Object.values(roomPlayers).forEach(player => {
        const option = document.createElement('div');
        option.className = 'vote-card';
        option.textContent = player.name;
        option.dataset.playerId = player.id;
        option.onclick = () => castVote(player.id, option);
        votingOptions.appendChild(option);
    });
}

function castVote(playerId, element) {
    if (element.classList.contains('voted')) return;
    
    element.classList.add('voted');
    element.textContent += ' ✓';
    
    connections.forEach(conn => {
        conn.send({
            type: 'vote',
            vote: { voterId: gameState.playerId, votedId: playerId }
        });
    });
    
    revealResultsBtn.classList.remove('hidden');
}

function receiveVote(vote) {
    if (!gameState.votes) gameState.votes = {};
    if (!gameState.votes[vote.votedId]) gameState.votes[vote.votedId] = 0;
    gameState.votes[vote.votedId]++;
}

function revealVoteResults() {
    if (!gameState.isHost) return;
    
    const results = {
        votes: gameState.votes,
        impostors: [] // Aquí deberías tener los IDs de los impostores
    };
    
    connections.forEach(conn => {
        conn.send({
            type: 'reveal_results',
            results: results
        });
    });
    
    displayVoteResults(results);
}

function displayVoteResults(results) {
    voteResults.classList.remove('hidden');
    voteResults.innerHTML = '<h3>Resultados:</h3>';
    
    Object.entries(results.votes).forEach(([playerId, votes]) => {
        const player = roomPlayers[playerId];
        const isImpostor = results.impostors.includes(playerId);
        
        const voteDiv = document.createElement('div');
        voteDiv.className = `vote-item ${isImpostor ? 'impostor' : ''}`;
        voteDiv.innerHTML = `
            <span>${player.name} ${isImpostor ? '(IMPOSTOR)' : ''}</span>
            <span>${votes} votos</span>
        `;
        voteResults.appendChild(voteDiv);
    });
}

function leaveRoom() {
    if (peer) {
        peer.destroy();
        peer = null;
    }
    
    connections.forEach(conn => conn.close());
    connections = [];
    
    // Limpiar registro temporal de la sala
    roomPlayers = {};
    chatMessages = [];
    liveChatHistory = [];
    playerOrder = [];
    currentTurnIndex = 0;
    turnsFinished = false;
    
    lobbyScreen.classList.add('hidden');
    onlineGameScreen.classList.add('hidden');
    chatGameScreen.classList.add('hidden');
    votingScreen.classList.add('hidden');
    toggleChatBtn.classList.add('hidden');
    liveChatWidget.classList.add('hidden');
    modeScreen.classList.remove('hidden');
    
    gameState.roomCode = '';
    gameState.playerId = '';
    gameState.isHost = false;
}

function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toLowerCase();
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
        showToast('Debe haber más civiles que impostores', 'error', 'Configuración Inválida');
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
    playAgainButton.classList.add('hidden');
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
    
    // Cambiar tema de color según el rol
    document.body.classList.remove('impostor-theme', 'crew-theme');
    if (isImpostor) {
        document.body.classList.add('impostor-theme');
    } else {
        document.body.classList.add('crew-theme');
    }
    
    wordDisplay.textContent = word;
    wordDisplay.style.color = isImpostor ? '#e74c3c' : '#2ecc71';
    
    revealCard.classList.remove('hidden');
    gameState.revealed = true;
    
    if (gameState.currentPlayer < gameState.players) {
        nextPlayerButton.classList.remove('hidden');
    } else {
        // Mostrar botones de fin de juego
        gameEndButtons.classList.remove('hidden');
    }
}

function nextPlayer() {
    gameState.currentPlayer++;
    gameState.revealed = false;
    
    // Resetear tema al pasar al siguiente jugador
    document.body.classList.remove('impostor-theme', 'crew-theme');
    
    currentPlayerNumber.textContent = gameState.currentPlayer;
    revealCard.classList.add('hidden');
    nextPlayerButton.classList.add('hidden');
    gameEndButtons.classList.add('hidden');
    wordDisplay.textContent = '';
}

function startNextRoundLocal() {
    // Resetear tema
    document.body.classList.remove('impostor-theme', 'crew-theme');
    
    // Reiniciar turnos pero mantener las mismas palabras
    gameState.currentPlayer = 1;
    gameState.revealed = false;
    
    // Resetear UI
    currentPlayerNumber.textContent = '1';
    revealCard.classList.add('hidden');
    gameEndButtons.classList.add('hidden');
    wordDisplay.textContent = '';
    
    showToast('¡Siguiente ronda! Mismas palabras', 'success', 'Ronda Continúa');
}

function startNewGameLocal() {
    // Resetear tema
    document.body.classList.remove('impostor-theme', 'crew-theme');
    
    // Reiniciar el juego con nuevas palabras
    gameState.currentPlayer = 1;
    gameState.revealed = false;
    
    // Generar nuevas palabras
    const theme = gameState.theme;
    const words = [...wordDatabase[theme]];
    const civilianWord = words.splice(Math.floor(Math.random() * words.length), 1)[0];
    
    gameState.playerWords = Array(gameState.players).fill(civilianWord);
    gameState.impostorIndices = [];
    
    while (gameState.impostorIndices.length < gameState.impostors) {
        const randomIndex = Math.floor(Math.random() * gameState.players);
        if (!gameState.impostorIndices.includes(randomIndex)) {
            gameState.impostorIndices.push(randomIndex);
        }
    }
    
    // Resetear UI
    currentPlayerNumber.textContent = '1';
    revealCard.classList.add('hidden');
    gameEndButtons.classList.add('hidden');
    wordDisplay.textContent = '';
    
    showToast('¡Nueva partida con palabras diferentes!', 'success', 'Nueva Partida');
}

function resetGame() {
    if (peer) {
        peer.destroy();
        peer = null;
    }
    
    connections.forEach(conn => conn.close());
    connections = [];
    
    // Limpiar registro temporal completo
    roomPlayers = {};
    chatMessages = [];
    liveChatHistory = [];
    playerOrder = [];
    currentTurnIndex = 0;
    turnsFinished = false;
    
    gameState = {
        mode: 'local',
        onlineMode: 'oral',
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
    
    gameScreen.classList.add('hidden');
    onlineGameScreen.classList.add('hidden');
    chatGameScreen.classList.add('hidden');
    votingScreen.classList.add('hidden');
    lobbyScreen.classList.add('hidden');
    setupScreen.classList.add('hidden');
    onlineRoomScreen.classList.add('hidden');
    onlineModeScreen.classList.add('hidden');
    toggleChatBtn.classList.add('hidden');
    liveChatWidget.classList.add('hidden');
    modeScreen.classList.remove('hidden');
}

// ========== LIVE CHAT FUNCTIONS ==========

const liveChatWidget = document.getElementById('live-chat-widget');
const liveChatMessages = document.getElementById('live-chat-messages');
const liveChatInput = document.getElementById('live-chat-input');
const sendLiveChatBtn = document.getElementById('send-live-chat-btn');
const toggleChatBtn = document.getElementById('toggle-chat-btn');
const closeChatBtn = document.getElementById('close-chat-btn');

let liveChatHistory = [];
let chatOpen = false;

function showLiveChat() {
    toggleChatBtn.classList.remove('hidden');
}

function toggleLiveChatWidget() {
    chatOpen = !chatOpen;
    if (chatOpen) {
        liveChatWidget.classList.remove('hidden');
        toggleChatBtn.style.display = 'none';
        toggleChatBtn.classList.remove('has-unread');
    } else {
        liveChatWidget.classList.add('hidden');
        toggleChatBtn.style.display = 'flex';
    }
}

function sendLiveChatMessage() {
    const message = liveChatInput.value.trim();
    if (!message || !gameState.roomCode) return;
    
    const msgData = {
        sender: gameState.playerName || 'Jugador',
        senderId: gameState.playerId,
        text: message,
        timestamp: Date.now()
    };
    
    liveChatHistory.push(msgData);
    displayLiveChatMessage(msgData, true);
    
    // Broadcast a todos
    connections.forEach(conn => {
        conn.send({
            type: 'live_chat',
            message: msgData
        });
    });
    
    liveChatInput.value = '';
}

function receiveLiveChatMessage(msgData) {
    liveChatHistory.push(msgData);
    displayLiveChatMessage(msgData, false);
    
    // Si el chat está cerrado, mostrar notificación
    if (!chatOpen) {
        toggleChatBtn.classList.add('has-unread');
    }
}

function displayLiveChatMessage(msgData, isOwn) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `live-chat-message ${isOwn ? 'own' : ''}`;
    
    const time = new Date(msgData.timestamp).toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    msgDiv.innerHTML = `
        <div class="sender">${msgData.sender}</div>
        <div class="text">${msgData.text}</div>
        <div class="time">${time}</div>
    `;
    
    liveChatMessages.appendChild(msgDiv);
    liveChatMessages.scrollTop = liveChatMessages.scrollHeight;
}

// Event Listeners - Live Chat
toggleChatBtn.addEventListener('click', toggleLiveChatWidget);
closeChatBtn.addEventListener('click', toggleLiveChatWidget);
sendLiveChatBtn.addEventListener('click', sendLiveChatMessage);
liveChatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendLiveChatMessage();
});

// Detectar cuando el usuario cierra la página o recarga (F5)
window.addEventListener('beforeunload', (e) => {
    if (gameState.roomCode && peer) {
        // Notificar a otros jugadores que nos vamos
        if (gameState.isHost) {
            connections.forEach(conn => {
                conn.send({
                    type: 'host_disconnect'
                });
            });
        }
        
        // Cerrar conexión
        if (peer) {
            peer.destroy();
        }
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Juego del Impostor con PeerJS cargado - Versión mejorada');
});
