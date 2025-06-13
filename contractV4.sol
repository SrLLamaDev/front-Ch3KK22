// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title Subscription Payment Layer
/// @notice Crea y gestiona suscripciones recurrentes sin custodia usando ERC20 y pull payments
contract SubscriptionPaymentLayer {
    // Dirección de USDC en Sepolia Testnet
    IERC20 public immutable token = IERC20(0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238);
    address public owner;

    struct Subscription {
        uint256 amount;
        uint256 interval;
        uint256 nextPayment;
        bool active;
    }

    // Lista de suscripciones por usuario
    mapping(address => Subscription[]) private subscriptions;

    event SubscriptionCreated(address indexed user, uint256 indexed id, uint256 amount, uint256 interval, uint256 nextPayment);
    event PaymentProcessed(address indexed user, uint256 indexed id, uint256 amount, uint256 timestamp);
    event SubscriptionCancelled(address indexed user, uint256 indexed id);

    constructor() {
        owner = msg.sender;
    }

    /// @notice Crea una nueva suscripción recurrente
    /// @param _amount Monto a pagar cada ciclo (en token's decimals)
    /// @param _interval Duración del ciclo en segundos
    function createSubscription(uint256 _amount, uint256 _interval) external {
        require(_amount > 0, "Amount must be > 0");
        require(_interval >= 1 days, "Interval too short");

        uint256 next = block.timestamp + _interval;
        subscriptions[msg.sender].push(Subscription({
            amount: _amount,
            interval: _interval,
            nextPayment: next,
            active: true
        }));

        uint256 id = subscriptions[msg.sender].length - 1;
        emit SubscriptionCreated(msg.sender, id, _amount, _interval, next);
    }

    /// @notice Devuelve las suscripciones de un usuario
    function getUserSubscriptions(address _user) external view returns (Subscription[] memory) {
        return subscriptions[_user];
    }

    /// @notice Procesa el pago de la suscripción si está vencida
    /// @param _id Índice de la suscripción
    function processPayment(uint256 _id) external {
        Subscription storage sub = subscriptions[msg.sender][_id];
        require(sub.active, "Subscription not active");
        require(block.timestamp >= sub.nextPayment, "Payment not due yet");

        // Pull payment pattern: el usuario debe aprobar previamente el contrato
        bool ok = token.transferFrom(msg.sender, owner, sub.amount);
        require(ok, "Token transfer failed");

        sub.nextPayment = block.timestamp + sub.interval;
        emit PaymentProcessed(msg.sender, _id, sub.amount, block.timestamp);
    }

    /// @notice Cancela una suscripción activa
    function cancelSubscription(uint256 _id) external {
        Subscription storage sub = subscriptions[msg.sender][_id];
        require(sub.active, "Already cancelled");
        sub.active = false;
        emit SubscriptionCancelled(msg.sender, _id);
    }
}