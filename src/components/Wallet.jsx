import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Wallet.css"; // Import styles

const Wallet = () => {
    const [userId, setUserId] = useState(""); // User ID input
    const [wallet, setWallet] = useState(null); // Wallet data
    const [error, setError] = useState(""); // Error message
    const [success, setSuccess] = useState(""); // Success message
    const [amount, setAmount] = useState(""); // Input for add/deduct amount

    // Fetch wallet details when userId changes
    const fetchWalletDetails = async () => {
        if (!userId) {
            setWallet(null);
            return;
        }
        try {
            const response = await axios.get(`http://localhost:3000/wallet/${userId}`);
            setWallet(response.data.wallet);
            setError("");
            setSuccess("");
        } catch (err) {
            console.error("Error fetching wallet details:", err);
            setWallet(null);
            setError("Could not fetch wallet details. Please check the User ID.");
        }
    };

    useEffect(() => {
        if (userId) fetchWalletDetails();
    }, [userId]);

    // Handle add money
    const handleAdd = async () => {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            setError("Please enter a valid amount to add.");
            return;
        }
        try {
            const response = await axios.post("http://localhost:3000/wallet/update", {
                user_id: userId,
                type: "add",
                amount: Number(amount),
            });
            setWallet({ ...wallet, available_balance: response.data.new_balance });
            setError("");
            setSuccess("Amount added successfully!");
        } catch (err) {
            console.error("Error adding money:", err);
            setError("Failed to add money. Please try again.");
        }
    };

    // Handle deduct money
    const handleDeduct = async () => {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            setError("Please enter a valid amount to deduct.");
            return;
        }
        if (Number(amount) > wallet.available_balance) {
            setError("Insufficient balance.");
            return;
        }
        try {
            const response = await axios.post("http://localhost:3000/wallet/update", {
                user_id: userId,
                type: "deduct",
                amount: Number(amount),
            });
            setWallet({ ...wallet, available_balance: response.data.new_balance });
            setError("");
            setSuccess("Amount deducted successfully!");
        } catch (err) {
            console.error("Error deducting money:", err);
            setError("Failed to deduct money. Please try again.");
        }
    };

    return (
        <div className="wallet-container">
            <h1>Wallet</h1>
            <div className="user-input">
                <input
                    type="text"
                    placeholder="Enter User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <button onClick={fetchWalletDetails}>Fetch Wallet</button>
            </div>
            {wallet ? (
                <div className="wallet-details">
                    <p>
                        <strong>Available Balance:</strong> $
                        {wallet.available_balance ? Number(wallet.available_balance).toFixed(2) : "0.00"}
                    </p>
                    <div className="transaction-input">
                        <input
                            type="text"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <button onClick={handleAdd}>Add</button>
                        <button onClick={handleDeduct}>Deduct</button>
                    </div>
                    {success && <p className="success-message">{success}</p>}
                    {error && <p className="error-message">{error}</p>}
                </div>
            ) : (
                <p>No wallet details available.</p>
            )}
        </div>
    );
};

export default Wallet;
