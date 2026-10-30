
const fromAmount = document.getElementById("fromAmount");
const fromError = document.getElementById("fromError");
const swapButton = document.getElementById("swapButton");
const connectButton = document.getElementById("connectButton");

const statusMessage = document.getElementById("statusMessage");
const statusTitle = document.getElementById("statusTitle");
const statusText = document.getElementById("statusText");

const networkName = document.getElementById("networkName");
const networkDetail = document.getElementById("networkDetail");

let walletAddress = null;
let currentChainId = null;

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
        fromError.textContent = "Enter an amount greater than zero.";
        return false;
    }

    fromError.textContent = "";
    return true;
}

function getNetworkName(chainId) {
    const networks = {
        "0x1": "Ethereum",
        "0xaa36a7": "Sepolia",
        "0x89": "Polygon",
        "0xa4b1": "Arbitrum",
        "0xa": "Optimism",
        "0x2105": "Base"
    };

    return networks[chainId] || "Unknown Network";
}

function updateNetwork(chainId) {
    currentChainId = chainId;

    const name = getNetworkName(chainId);

    networkName.textContent = name;
    networkDetail.textContent = name;
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

        if (!accounts.length) {
            throw new Error("No wallet account found.");
        }

        walletAddress = accounts[0];

        const chainId = await window.ethereum.request({
            method: "eth_chainId"
        });

        updateNetwork(chainId);

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
                "You rejected the connection request."
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
        showStatus("error", "Invalid amount",
            "Please correct the amount before continuing.");
        return;
    }

    if (!walletAddress) {
        showStatus("info", "Connect your wallet",
            "Connect your wallet before starting a swap.");
        return;
    }

    showStatus("info", "Swap unavailable",
        "A real swap quote and transaction service have not been integrated. No transaction was submitted.");
});

if (window.ethereum) {

    window.ethereum.on("chainChanged", (chainId) => {
        updateNetwork(chainId);

        showStatus(
            "info",
            "Network changed",
            "Your wallet network changed. Please verify it before continuing."
        );
    });

    window.ethereum.on("accountsChanged", (accounts) => {

        walletAddress = accounts[0] || null;

        if (!walletAddress) {
            connectButton.textContent = "Connect Wallet";
            networkName.textContent = "Not connected";
            networkDetail.textContent = "Not connected";

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
