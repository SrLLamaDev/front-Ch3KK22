import { ethers } from 'ethers';

const WalletConnector = ({ onConnect, nextStep }) => {
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        onConnect(address);
        nextStep();
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Por favor instala MetaMask!");
    }
  };

  return (
    <div className="screen">
      <h2>Conectar Wallet</h2>
      <button onClick={connectWallet} className="wallet-btn">
        Conectar con MetaMask
      </button>
    </div>
  );
};