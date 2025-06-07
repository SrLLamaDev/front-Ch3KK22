// Variables globales
let currentAccount = null;
let selectedAmount = 0.1;

// Elementos del DOM
const connectScreen = document.getElementById('screen-connect');
const amountScreen = document.getElementById('screen-amount');
const gameScreen = document.getElementById('screen-game');
const connectBtn = document.getElementById('connect-btn');
const amountButtons = document.querySelectorAll('.amount-btn');
const choiceCards = document.querySelectorAll('.choice-card');
const amountSelectedSpan = document.getElementById('amount-selected');

// Inicialización
function init() {
    connectBtn.addEventListener('click', connectWallet);
    
    amountButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedAmount = parseFloat(btn.dataset.amount);
            amountSelectedSpan.textContent = selectedAmount;
            showScreen('screen-game');
        });
    });
    
    choiceCards.forEach(card => {
        card.addEventListener('click', () => {
            const choice = card.dataset.choice;
            playGame(choice);
        });
    });
}

// Conectar MetaMask
async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            currentAccount = await signer.getAddress();
            showScreen('screen-amount');
        } catch (error) {
            console.error('Error al conectar la wallet:', error);
            alert('Error al conectar. Por favor, revisa la consola para más detalles.');
        }
    } else {
        alert('Por favor, instala MetaMask!');
    }
}

// Mostrar una pantalla específica
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Jugar
function playGame(choice) {
    if (!currentAccount) {
        alert('Por favor, conecta tu wallet primero.');
        return;
    }
    
    // Configuración de Sherry SDK
    const metadata = {
        url: window.location.href,
        icon: 'https://ejemplo.com/icon.png', // Cambia por tu icono
        title: 'Piedra, Papel o Tijeras',
        description: `Juego por ${selectedAmount} AVAX`,
        actions: [{
            type: 'blockchain',
            label: 'Jugar',
            address: '0x742d35Cc6734C0532925a3b8D4ccd306f6F4B26C', // Dirección del contrato
            abi: ['function playGame(uint8 choice) payable'],
            functionName: 'playGame',
            chains: { source: 'avalanche' },
            amount: selectedAmount,
            params: [{
                name: 'choice',
                type: 'number',
                value: choiceToNumber(choice),
                fixed: true
            }]
        }]
    };
    
    // Validar y usar la metadata
    try {
        const validated = SherrySDK.createMetadata(metadata);
        console.log('Metadata de Sherry:', validated);
        // Aquí podrías mostrar un modal o redirigir a la acción de Sherry
        alert('Transacción lista para ser firmada. Revisa la consola para más detalles.');
    } catch (error) {
        console.error('Error en la metadata de Sherry:', error);
    }
}

// Convertir elección a número
function choiceToNumber(choice) {
    const choices = {
        'rock': 0,
        'paper': 1,
        'scissors': 2
    };
    return choices[choice];
}

// Iniciar la app cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);