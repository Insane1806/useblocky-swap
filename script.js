
const fromAmount = document.getElementById("fromAmount");
const fromError = document.getElementById("fromError");
const swapButton = document.getElementById("swapButton");

const statusMessage = document.getElementById("statusMessage");
const statusTitle = document.getElementById("statusTitle");
const statusText = document.getElementById("statusText");

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

    showStatus(
        "success",
        "Amount looks good",
        "Your entered amount is valid."
    );
});
