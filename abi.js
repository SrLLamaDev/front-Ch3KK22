// abi.js - ABI y dirección del contrato para Subscription Payment Layer

// Dirección del contrato desplegado (reemplaza con la tuya)
export const CONTRACT_ADDRESS = '0xTU_DIRECCION_DEL_CONTRATO';

// ABI del contrato (reemplaza con el JSON generado tras la compilación)
export const CONTRACT_ABI = [
  // Ejemplo de entrada ABI:
  {
    "inputs": [
      { "internalType": "uint256", "name": "_amount", "type": "uint256" },
      { "internalType": "uint256", "name": "_interval", "type": "uint256" }
    ],
    "name": "createSubscription",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [ { "internalType": "address", "name": "_user", "type": "address" } ],
    "name": "getUserSubscriptions",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "amount", "type": "uint256" },
          { "internalType": "uint256", "name": "interval", "type": "uint256" },
          { "internalType": "bool", "name": "active", "type": "bool" }
        ],
        "internalType": "struct SubscriptionPaymentLayer.Subscription[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
  // Agrega más métodos del contrato según sea necesario
];
