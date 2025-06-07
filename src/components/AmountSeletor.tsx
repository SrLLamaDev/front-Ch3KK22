const AmountSelector = ({ onSelect }) => {
  return (
    <div className="screen">
      <h2>Selecciona el monto</h2>
      <div className="amount-buttons">
        <button onClick={() => onSelect(0.1)}>0.1 AVAX</button>
        <button onClick={() => onSelect(0.5)}>0.5 AVAX</button>
      </div>
    </div>
  );
};