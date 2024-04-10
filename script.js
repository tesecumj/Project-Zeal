const agentsData = new Map([
    ["571", "Joeanna Pech"],
    ["681", "Daja Flowers"],
    ["514", "Emilia Cunil"],
    ["774", "Hailey Perez"],
    ["775", "Emily Sanchez"],
    ["773", "Vinaya Martinez"],
    ["776", "Joshua Reyes"],
    ["382", "Adriel Pech"],
    ["661", "Jamina Quiroz"],
    ["647", "Bianka Aranda"],
    ["421", "Dylan Gentle"],
    ["414", "Melissa Ferguson"],
    ["662", "Julianna Moreno"],
    ["678", "Dania Arana"],
    ["737", "Kerstie Samos"],
    ["541", "Marialuz Polanco"],
    ["649", "Tammy Bacab"]
]);

const agents = new Map();
const queue = [];
const manualReferrals = [];
let lastMessage = "";

function addAgent(id, name, outputId) {
    agents.set(id, {
        id: id,
        name: name,
        ready: false,
        busy: false,
        referral: null,
        outputId: outputId
    });
}

// Add agents as listers with their respective output IDs
agentsData.forEach((name, id) => {
    addAgent(id, name, "output-listers");
});

// Function to update output in the specified output element
function updateOutput(message, outputId) {
    const outputDiv = document.getElementById(outputId);
    const newMessage = document.createElement("div");
    newMessage.textContent = message;

    // Check if the last message was "No manual referrals available."
    // If it was, don't add another one
    if (message !== lastMessage) {
        outputDiv.appendChild(newMessage);
        // Add a line break after each message
        outputDiv.appendChild(document.createElement("br"));
        // Update lastMessage with the current message
        lastMessage = message;
    } else {
        // Update lastMessage with the current message even if it's repeated
        lastMessage = message;
    }
}

// Rest of the code remains the same

// Initialize the event listeners when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners for login and option buttons
    const loginButton = document.getElementById('login-btn');
    const options = document.getElementById('options');

    loginButton.addEventListener('click', function() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'tesecumj' && password === 'oristech1234') {
            // Successful login
            document.getElementById('login-form').style.display = 'none';
            options.style.display = 'block';

            // Activate event listeners for option buttons
            document.getElementById("sign-in-btn").addEventListener("click", handleSignIn);
            document.getElementById("agent-ready-btn").addEventListener("click", handleAgentReady);
            document.getElementById("add-referrals-btn").addEventListener("click", handleAddReferrals);
            document.getElementById("exit-btn").addEventListener("click", handleExit);
        } else {
            // Failed login
            document.getElementById('error-message').textContent = 'Invalid username or password';
        }
    });

    // Event listener for "Enter" keypress
    document.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const activeElement = document.activeElement;
            if (activeElement.tagName === 'BUTTON') {
                activeElement.click();
            }
        }
    });
});
