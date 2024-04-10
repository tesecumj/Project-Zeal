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

// Add agents for listers, data entry agents, and downloaders
const listersIds = ["571", "681", "514", "774", "775", "773", "776", "382", "661", "647", "421", "414", "662", "678", "737", "541", "649"];
const dataEntryIds = ["785", "769", "768", "766", "786", "770", "771"];
const downloadersIds = ["393", "395", "318", "454", "042"];

function addAgent(id, name, category) {
    agents.set(id, {
        id: id,
        name: name,
        ready: false,
        busy: false,
        referral: null,
        category: category
    });
}

function initializeAgents() {
    agentsData.forEach((name, id) => {
        if (listersIds.includes(id)) {
            addAgent(id, name, "Lister");
        } else if (dataEntryIds.includes(id)) {
            addAgent(id, name, "Data Entry");
        } else if (downloadersIds.includes(id)) {
            addAgent(id, name, "Downloader");
        } else {
            addAgent(id, name, "Guidelines");
        }
    });
}

initializeAgents();

function getOutputDiv(category) {
    switch (category) {
        case "Lister":
            return document.getElementById("listers-output");
        case "Data Entry":
            return document.getElementById("data-entry-output");
        case "Downloader":
            return document.getElementById("downloaders-output");
        default:
            return document.getElementById("output");
    }
}

function updateOutput(message, category) {
    const outputDiv = getOutputDiv(category);
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

function clearOutput(category) {
    const outputDiv = getOutputDiv(category);
    outputDiv.innerHTML = "";
}

function assignReferralToAgent(agent) {
    if (agent.referral === null) {
        if (manualReferrals.length > 0) {
            const referralNumber = manualReferrals.shift();
            agent.referral = referralNumber;
            agent.busy = true;
            updateOutput(`Referral ${referralNumber} assigned to ${agent.name} (ID: ${agent.id}).`, agent.category);
        } else {
            updateOutput("No manual referrals available.", agent.category);
        }
    } else {
        updateOutput(`${agent.name} (ID: ${agent.id}) already has a referral assigned.`, agent.category);
    }
}

function assignReferral() {
    for (const agent of queue) {
        if (agent.ready && !agent.busy) {
            if (manualReferrals.length > 0) {
                const referralNumber = manualReferrals.shift();
                agent.referral = referralNumber;
                agent.busy = true;
                updateOutput(`Referral ${referralNumber} assigned to ${agent.name} (ID: ${agent.id}).`, agent.category);
            } else {
                updateOutput("No manual referrals available.", agent.category);
            }
        }
    }
    if (!queue.some(agent => agent.ready && !agent.busy)) {
        updateOutput("No agents available in the queue to process remaining referrals. They will be assigned to the next available agent.", "Guidelines");
    }
}

function agentReady(agentId) {
    const agent = agents.get(agentId);
    if (agent) {
        if (agent.busy) {
            agent.busy = false;
            agent.referral = null;
            updateOutput(`${agent.name} marked as ready.`, agent.category);
            assignReferralToAgent(agent);
        } else {
            updateOutput(`${agent.name} is already ready.`, agent.category);
        }
    } else {
        updateOutput("Agent ID not found.", "Guidelines");
    }
}

function addReferrals(referralNumbers, isRush = false) {
    if (isRush) {
        // Add rush referrals to the beginning of the queue
        manualReferrals.unshift(...referralNumbers);
    } else {
        manualReferrals.push(...referralNumbers);
    }
    updateOutput("Referrals added.", "Guidelines");
    assignReferral();
}

function signIn(agentId) {
    if (agents.has(agentId)) {
        const agent = agents.get(agentId);
        if (agent.ready && !agent.busy) {
            assignReferralToAgent(agent);
            return;
        } else if (!queue.includes(agent)) {
            queue.push(agent);
            agent.ready = true;
            updateOutput(`${agent.name} signed into the queue and is ready to receive referrals.`, agent.category);
            assignReferral();
        } else {
            updateOutput(`${agent.name} is already in the queue.`, agent.category);
        }
    } else {
        updateOutput("Agent ID not found.", "Guidelines");
    }
}

function handleSignIn() {
    const agentId = prompt("Enter agent ID:");
    if (agentId !== null) {
        signIn(agentId);
    }
}

function handleAgentReady() {
    const agentId = prompt("Enter agent ID:");
    if (agentId !== null) {
        agentReady(agentId);
    }
}

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

function handleExit() {
    updateOutput("Exiting program.", "Guidelines");
    // Add any necessary clean-up logic here
}

document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login-btn');
    const errorMessage = document.getElementById('error-message');
    const loginForm = document.getElementById('login-form');
    const options = document.getElementById('options');

    loginButton.addEventListener('click', function() {
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (username === 'tesecumj' && password === 'oristech1234') {
            // Successful login
            loginForm.style.display = 'none';
            options.style.display = 'block';

            // Activate event listeners for option buttons
            document.getElementById("sign-in-btn").addEventListener("click", handleSignIn);
            document.getElementById("agent-ready-btn").addEventListener("click", handleAgentReady);
            document.getElementById("add-referrals-btn").addEventListener("click", handleAddReferrals);
            document.getElementById("exit-btn").addEventListener("click", handleExit);
        } else {
            // Failed login
            errorMessage.textContent = 'Invalid username or password';
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
