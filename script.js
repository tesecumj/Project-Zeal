const agentsData = new Map([
    ["456", "Sheyla Morales"],
    ["111", "Mirian Gonzales"],
    ["385", "Brithney Howe"],
    ["633", "Jessica Rivera"],
    ["380", "Lucia Tesecum"],
    ["631", "Jenaa Nicholas"],
    ["718", "Adriannie Novelo"],
    ["562", "Alexus Kotch"],
    ["503", "Catherine Camal"],
    ["638", "Erika Tzib"],
    ["536", "Enrisen Tzib"],
    ["745", "Leila Escobar"],
    ["639", "Jacqueline Pott"],
    ["067", "Maria Yacab"],
    ["637", "Hienifer Rodriguez"],
    ["635", "Hector Montero"],
    ["624", "Janice Hernandez"],
    ["567", "Jorge Tesecum"],
    ["626", "Ginelly Rivera"]
]);

const agents = new Map();
const queue = [];
const manualReferrals = [];
let lastMessage = ""; // Variable to store the last message

// Add agents to the agents map
function addAgent(id, name) {
    agents.set(id, {
        id: id,
        name: name,
        ready: false,
        busy: false,
        referral: null
    });
}

// Initialize agents map with data from agentsData
agentsData.forEach((name, id) => {
    addAgent(id, name);
});

// Assign a referral to a specific agent
function assignReferralToAgent(agent) {
    if (agent.referral === null) {
        if (manualReferrals.length > 0) {
            const referralNumber = manualReferrals.shift();
            agent.referral = referralNumber;
            agent.busy = true;
            updateOutput(`Referral ${referralNumber} assigned to ${agent.name} (ID: ${agent.id}).`, "Listers"); // Updated to output to Listers
        } else {
            updateOutput("No manual referrals available.", "Listers"); // Updated to output to Listers
        }
    } else {
        updateOutput(`${agent.name} (ID: ${agent.id}) already has a referral assigned.`, "Listers"); // Updated to output to Listers
    }
}

// Assign referrals to agents in the queue
function assignReferral() {
    for (const agent of queue) {
        if (agent.ready && !agent.busy) {
            if (manualReferrals.length > 0) {
                const referralNumber = manualReferrals.shift();
                agent.referral = referralNumber;
                agent.busy = true;
                updateOutput(`Referral ${referralNumber} assigned to ${agent.name} (ID: ${agent.id}).`, "Listers"); // Updated to output to Listers
            } else {
                updateOutput("No manual referrals available.", "Listers"); // Updated to output to Listers
            }
        }
    }
    if (!queue.some(agent => agent.ready && !agent.busy)) {
        updateOutput("No agents available in the queue to process remaining referrals. They will be assigned to the next available agent.", "Listers"); // Updated to output to Listers
    }
}

// Mark an agent as ready
function agentReady(agentId) {
    const agent = agents.get(agentId);
    if (agent) {
        if (agent.busy) {
            agent.busy = false;
            agent.referral = null;
            updateOutput(`${agent.name} marked as ready.`, "Listers"); // Updated to output to Listers
            assignReferralToAgent(agent);
        } else {
            updateOutput(`${agent.name} is already ready.`, "Listers"); // Updated to output to Listers
        }
    } else {
        updateOutput("Agent ID not found.", "Listers"); // Updated to output to Listers
    }
}

// Add manual referrals to the queue
function addReferrals(referralNumbers, isRush = false) {
    if (isRush) {
        // Add rush referrals to the beginning of the queue
        manualReferrals.unshift(...referralNumbers);
    } else {
        manualReferrals.push(...referralNumbers);
    }
    updateOutput("Referrals added.", "Listers"); // Updated to output to Listers
    assignReferral();
}

// Update the output for a specific agent type
function updateOutput(message, outputType) {
    const outputDiv = document.getElementById(`${outputType.toLowerCase()}-output`);
    if (outputDiv) {
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
    } else {
        console.error("Output element not found:", outputType);
    }
}

// Clear the output for a specific agent type
function clearOutput(outputType) {
    const outputDiv = document.getElementById(`${outputType.toLowerCase()}-output`);
    if (outputDiv) {
        outputDiv.innerHTML = "";
    } else {
        console.error("Output element not found:", outputType);
    }
}

// Sign in an agent and mark them as ready
function signIn(agentId) {
    if (agents.has(agentId)) {
        const agent = agents.get(agentId);
        if (agent.ready && !agent.busy) {
            assignReferralToAgent(agent);
            return;
        } else if (!queue.includes(agent)) {
            queue.push(agent);
            agent.ready = true;
            updateOutput(`${agent.name} signed into the queue and is ready to receive referrals.`, "Listers"); // Updated to output to Listers
            assignReferral();
        } else {
            updateOutput(`${agent.name} is already in the queue.`, "Listers"); // Updated to output to Listers
        }
    } else {
        updateOutput("Agent ID not found.", "Listers"); // Updated to output to Listers
    }
}

// Event handler for signing in an agent
function handleSignIn() {
    const agentId = prompt("Enter agent ID:");
    if (agentId !== null) {
        signIn(agentId);
    }
}

// Event handler for marking an agent as ready
function handleAgentReady() {
    const agentId = prompt("Enter agent ID:");
    if (agentId !== null) {
        agentReady(agentId);
    }
}

// Event handler for adding referrals
function handleAddReferrals() {
    const referralType = prompt("Enter referral type (RUSH or MANUAL):");
    if (referralType !== null) {
        const referralNumbersInput = prompt("Enter referral number(s) separated by commas:");
        if (referralNumbersInput !== null) {
            const referralNumbers = referralNumbersInput.split(",").map(referral => parseInt(referral.trim()));
            if (referralType.toUpperCase() === "RUSH") {
                addReferrals(referralNumbers, true); // Pass true for rush referrals
            } else {
                addReferrals(referralNumbers);
            }
        }
    }
}

// Event handler for exiting the program
function handleExit() {
    updateOutput("Exiting program.", "Listers"); // Updated to output to Listers
    // Add any necessary clean-up logic here
}

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
