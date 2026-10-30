
const fromAmount = document.getElementById("fromAmount");
const fromError = document.getElementById("fromError");
const swapButton = document.getElementById("swapButton");
const connectButton = document.getElementById("connectButton");

const statusMessage = document.getElementById("statusMessage");
const statusTitle = document.getElementById("statusTitle");
const statusText = document.getElementById("statusText");

let walletAddress = null;

function showStatus(type, title, message) {
    statusMessage.hidden = false;
    statusMessage.className = "status " + type;
    statusTitle.textContent = title;
    statusText.textContent = message;
}

function clearStatus() {
    statusMessage.hidden = true;
}

function validateAmount() {
    const value = fromAmount.value.trim();
    const amount = Number(value);

    if (value === "") {
        fromError.textContent = "Please enter an amount.";
        return false;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        fromError.textContent =
            "Enter an amount greater than zero.";
        return false;
    }

    fromError.textContent = "";
    return true;
}

fromAmount.addEventListener("input", () => {
    validateAmount();
    clearStatus();
});

async function connectWallet() {

    if (!window.ethereum) {
        showStatus(
            "error",
            "Wallet not detected",
            "Install a compatible browser wallet to continue."
        );
        return;
    }

    connectButton.disabled = true;
    connectButton.textContent = "Connecting...";

    try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        });

        if (!accounts || accounts.length === 0) {
            throw new Error("No wallet account found.");
        }

        walletAddress = accounts[0];

        connectButton.textContent =
            walletAddress.slice(0, 6) +
            "..." +
            walletAddress.slice(-4);

        showStatus(
            "success",
            "Wallet connected",
            "Your wallet is connected successfully."
        );

    } catch (error) {

        if (error.code === 4001) {
            showStatus(
                "error",
                "Connection rejected",
                "You rejected the connection request. You can try again."
            );
        } else {
            showStatus(
                "error",
                "Connection failed",
                error.message || "Unable to connect wallet."
            );
        }

    } finally {
        connectButton.disabled = false;

        if (!walletAddress) {
            connectButton.textContent = "Connect Wallet";
        }
    }
}

connectButton.addEventListener("click", connectWallet);

swapButton.addEventListener("click", () => {

    clearStatus();

    if (!validateAmount()) {
        showStatus(
            "error",
            "Invalid amount",
            "Please correct the amount before continuing."
        );
        return;
    }

    if (!walletAddress) {
        showStatus(
            "info",
            "Connect your wallet",
            "Connect your wallet before starting a swap."
        );
        return;
    }

    showStatus(
        "info",
        "Swap unavailable",
        "Your wallet is connected, but a swap quote and transaction service have not been integrated. No transaction was submitted."
    );
});

if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {

        walletAddress = accounts[0] || null;

        if (!walletAddress) {
            connectButton.textContent = "Connect Wallet";
            showStatus(
                "info",
                "Wallet disconnected",
                "Connect your wallet to continue."
            );
        } else {
            connectButton.textContent =
                walletAddress.slice(0, 6) +
                "..." +
                walletAddress.slice(-4);
        }
    });
}
