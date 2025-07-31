document.getElementById("user-input").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent accidental form submission
        sendMessage();
    }
});

async function sendMessage() {
    const API_KEY = "hj3yALqNaLNKIm8E8a0aJ5S7eudjLCtbPrNcs4yj"; // Replace with your real key
    const userInput = document.getElementById("user-input").value.trim();

    if (!userInput) {
        alert("Please enter a question!");
        return;
    }

    displayMessage(userInput, "You");

    // 🔽 Log user input to Google Sheets
    logSearchToSheet(userInput);

    try {
        const response = await fetch("https://api.cohere.ai/v1/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "command",
                prompt: userInput,
                max_tokens: 100
            })
        });

        const data = await response.json();
        console.log("AI Response:", data);

        if (data.generations && data.generations.length > 0) {
            displayMessage(data.generations[0].text, "AI");
        } else {
            displayMessage("AI response error. Try again!", "AI", "error");
        }
    } catch (error) {
        console.error("Error:", error);
        displayMessage("Error connecting to AI. Try again!", "AI", "error");
    }
}

function displayMessage(text, sender, type = "normal") {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("p");

    if (type === "error") {
        messageElement.style.color = "red";
    }

    messageElement.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ✅ Function to log user input to Google Sheet via Apps Script
function logSearchToSheet(searchText) {
    fetch("https://script.google.com/macros/s/AKfycbxCl4HdMDjFQ62NBjlLkPhcXNJPoqEbqLAWu6a6v4uERtORuUSw6oqe1zXpNB9fR6s/exec", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `search=${encodeURIComponent(searchText)}`
    })
    .then(response => response.text())
    .then(result => {
        console.log("Logged to sheet:", result);
    })
    .catch(error => {
        console.error("Error logging to sheet:", error);
    });
}
