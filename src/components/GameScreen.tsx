import { createMetadata, Metadata } from '@sherrylinks/sdk';

const GameScreen = ({ amount, wallet }) => {
  const [userChoice, setUserChoice] = useState<string | null>(null);
  const [result, setResult] = useState('');

  const choices = [
    { id: 'rock', name: 'Piedra', image: 'tijera.jpg' },
    { id: 'paper', name: 'Papel', image: 'papel.jpg' },
    { id: 'scissors', name: 'Tijera', image: 'tijera.jpg' }
  ];

  const playGame = (choice: string) => {
    setUserChoice(choice);
    // Lógica del juego aquí
    
    // Integración con Sherry SDK
    const metadata: Metadata = {
      url: window.location.href,
      icon: 'https://tujuego.com/icon.png',
      title: 'Piedra, Papel o Tijeras',
      description: `Juego por ${amount} AVAX`,
      actions: [{
        type: 'blockchain',
        label: 'Jugar',
        address: '0xContractAddress', // Dirección de tu contrato
        abi: ['function playGame(uint8 choice) payable'],
        functionName: 'playGame',
        chains: { source: 'avalanche' },
        amount: amount,
        params: [{
          name: 'choice',
          label: 'Elección',
          type: 'number',
          value: choices.findIndex(c => c.id === choice),
          fixed: true
        }]
      }]
    };

    const validated = createMetadata(metadata);
    console.log('Sherry Metadata:', validated);
  };

  return (
    <div className="screen">
      <h2>Jugar por {amount} AVAX</h2>
      
      {!userChoice ? (
        <div className="choices">
          {choices.map((choice) => (
            <div key={choice.id} className="choice-card" onClick={() => playGame(choice.id)}>
              <img src={choice.image} alt={choice.name} />
              <span>{choice.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="result">
          <h3>Resultado: {result}</h3>
          <button onClick={() => setUserChoice(null)}>Jugar de nuevo</button>
        </div>
      )}
    </div>
  );
};