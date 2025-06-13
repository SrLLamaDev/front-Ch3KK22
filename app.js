// app.js - Lógica compartida para Subscription Payment Layer

// Importa ethers si usas un bundler o mantén la referencia en HTML:
// <script src="https://cdn.jsdelivr.net/npm/ethers/dist/ethers.min.js"></script>

(async () => {
    // Inicializar provider y signer
    if (typeof window.ethereum === 'undefined') {
        console.error('MetaMask no instalado');
        return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Dirección y ABI del contrato (reemplaza con tus datos)
    const CONTRACT_ADDRESS = '<DIRECCIÓN_CONTRATO>'; // p.ej. '0x1234...';
    const CONTRACT_ABI = [
        // Pega aquí el ABI JSON de tu contrato
    ];

    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    // Función para crear suscripción
    window.createSubscription = async (amount, interval) => {
        try {
            const tx = await contract.createSubscription(
                ethers.utils.parseUnits(amount.toString(), 18),
                interval
            );
            await tx.wait();
            alert('Suscripción creada con éxito');
        } catch (err) {
            console.error('Error creando suscripción:', err);
            alert('Error al crear suscripción');
        }
    };

    // Función para obtener todas las suscripciones del usuario
    window.getSubscriptions = async (userAddress) => {
        try {
            const subs = await contract.getUserSubscriptions(userAddress);
            return subs.map(s => ({
                amount: ethers.utils.formatUnits(s.amount, 18),
                interval: s.interval.toNumber(),
                active: s.active
            }));
        } catch (err) {
            console.error('Error al obtener suscripciones:', err);
            return [];
        }
    };

    // Manejo de flujo por página
    const pathname = window.location.pathname.split('/').pop();
    const userAddress = sessionStorage.getItem('userAddress');

    if (!userAddress) {
        window.location.href = 'index.html';
        return;
    }

    if (pathname === 'subscribe.html') {
        document.getElementById('btnCreateSub').addEventListener('click', async () => {
            const amount = document.getElementById('amount').value;
            const interval = parseInt(document.getElementById('interval').value, 10);
            if (!amount || !interval) {
                alert('Completa todos los campos');
                return;
            }
            await window.createSubscription(amount, interval);
            window.location.href = 'dashboard.html';
        });
    }

    if (pathname === 'dashboard.html') {
        const list = document.getElementById('subscriptionList');
        const subs = await window.getSubscriptions(userAddress);
        if (subs.length === 0) {
            list.innerHTML = '<li>No tienes suscripciones activas.</li>';
        } else {
            subs.forEach((sub, idx) => {
                const li = document.createElement('li');
                li.textContent = `#${idx + 1}: ${sub.amount} every ${sub.interval} days (${sub.active ? 'active' : 'inactive'})`;
                list.appendChild(li);
            });
        }

        document.getElementById('btnLogout').addEventListener('click', () => {
            sessionStorage.removeItem('userAddress');
            window.location.href = 'index.html';
        });
    }
})();
