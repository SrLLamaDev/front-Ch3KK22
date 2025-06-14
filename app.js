// app.js - Lógica compartida para Subscription Payment Layer

let provider;
let signer;
let contract;

/**
 * Inicializa la conexión con el contrato
 * @param {{provider: any, abi: any[], contractAddress: string}} config
 */
export async function initApp({ provider: prov, abi, contractAddress }) {
  provider = prov;
  signer = provider.getSigner();
  contract = new ethers.Contract(contractAddress, abi, signer);
}

/**
 * Crea una nueva suscripción en el contrato
 * @param {string} amount - Monto en unidades de token (string con decimales)
 * @param {number} interval - Intervalo en días
 */
export async function createSubscription(amount, interval) {
  if (!contract) throw new Error('Contrato no inicializado');
  // Convierte a wei (18 decimales)
  const value = ethers.utils.parseUnits(amount.toString(), 18);
  // Convierte días a segundos
  const secs = interval * 24 * 60 * 60;
  const tx = await contract.createSubscription(value, secs);
  await tx.wait();
  return tx;
}

// No es necesario mejorar nada en el bloque seleccionado, ya que solo es un comentario JSDoc que documenta la función getSubscriptions.
// El código ya está correcto y sirve para que editores y herramientas de tipado entiendan la estructura del retorno.
// No afecta la funcionalidad del código.
export async function getSubscriptions(userAddress) {
  if (!contract) throw new Error('Contrato no inicializado');
  const subs = await contract.getUserSubscriptions(userAddress);
  return subs.map(s => ({
    amount: ethers.utils.formatUnits(s.amount, 18),
    interval: s.interval.toNumber() / (24 * 60 * 60), // devuelve en días
    nextPayment: s.nextPayment.toNumber(),
    active: s.active
  }));
}
