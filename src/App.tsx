// App.tsx
import { useState } from 'react'; 
import WalletConnector from './components/WalletConnector';
import AmountSelector from './components/AmountSelector';
import GameScreen from './components/GameScreen';

function App() {
  const [step, setStep] = useState(1);
  const [wallet, setWallet] = useState('');
  const [amount, setAmount] = useState(0);

  return (
    <div className="app-container">
      {step === 1 && <WalletConnector onConnect={setWallet} nextStep={() => setStep(2)} />}
      {step === 2 && <AmountSelector onSelect={(amt) => {
        setAmount(amt);
        setStep(3);
      }} />}
      {step === 3 && <GameScreen amount={amount} wallet={wallet} />}
    </div>
  );
}