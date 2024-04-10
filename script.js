const agentsData = new Map([
    // Existing agents
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
    ["626", "Ginelly Rivera"],
    // New listers
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
    ["649", "Tammy Bacab"],
    // New data entry agents
    ["785", "Carlene Jones"],
    ["769", "Breanna Reyes"],
    ["768", "Brandy James"],
    ["766", "Alinie Cruz"],
    ["786", "Lizannie Patt"],
    ["770", "Mariangel Santos"],
    ["771", "Zenelly Guerra"],
    // New downloaders
    ["393", "Aura Tzib"],
    ["395", "Charles Harrison"],
    ["318", "Edgardo Serrut"],
    ["454", "Adolfo Medina"],
    ["042", "Ernesto Orellana"]
]);

const agents = new Map();
const queue = [];
const manualReferrals = [];
let lastMessage = ""; // Variable to store the last message

function addAgent(id, name, category) {
    agents.set(id, {
        id: id,
        name: name,
        ready: false,
        busy: false,
        referral: null,
        category: category // Add category property
    });
}

agentsData.forEach((name, id) => {
    // Determine category based on agent ID
    let category;
    if (id.startsWith("5")) {
        category = "Lister";
    } else if (id.startsWith("7")) {
        category = "Data Entry";
    } else if (id.startsWith("3")) {
        category = "Downloader";
    } else {
        category = "Guidelines"; // Assuming guidelines agents have IDs starting with other digits
    }
    addAgent(id, name, category);
});

function assignReferralToAgent(agent) {
    if (agent.referral === null) {
        if (manualReferrals.length > 0) {
            const referralNumber = manualReferrals.shift();
            agent.referral = referralNumber;
            agent.busy = true;
            updateOutput(`Referral ${referralNumber} assigned to ${agent.name} (ID: ${agent.id}).`);
        } else {
            updateOutput("No manual referrals available.");
        }
    } else {
        updateOutput(`${agent.name} (ID: ${agent.id}) already has a referral assigned.`);
    }
}

function assignReferral() {
    for (const agent of queue) {
        if (agent.ready && !agent.busy) {
            if (manualReferrals.length > 0) {
                const referralNumber = manualReferrals.shift();
                agent.referral = referralNumber;
                agent.busy = true;
                updateOutput(`Referral ${referralNumber} assigned to ${agent.name} (ID: ${agent.id}).`);
            } else {
                updateOutput("No manual referrals available.");
            }
        }
    }
    if (!queue.some(agent => agent.ready && !agent.busy)) {
        updateOutput("No agents available in the queue to process remaining referrals. They will be assigned to the next available agent.");
    }
}

function agentReady(agentId) {
    const agent = agents.get(agentId);
    if (agent) {
        if (agent.busy) {
            agent.busy = false;
            agent.referral = null;
            updateOutput(`${agent.name} marked as ready.`);
            assignReferralToAgent(agent);
        } else {
            updateOutput(`${agent.name} is already ready.`);
        }
    } else {
        updateOutput("Agent ID not found.");
    }
}

function addReferrals(referralNumbers, isRush = false) {
    if (isRush) {
        // Add rush referrals to the beginning of the queue
        manualReferrals.unshift(...referralNumbers);
    } else {
        manualReferrals.push(...referralNumbers);
    }
    updateOutput("Referrals added.");
    assignReferral();
}

function updateOutput(message) {
    const outputDiv = document.getElementById("output");
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

function clearOutput() {
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";
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
            updateOutput(`${agent.name} signed into the queue and is ready to receive referrals.`);
            assignReferral();
        } else {
            updateOutput(`${agent.name} is already in the queue.`);
        }
    } else {
        updateOutput("Agent ID not found.");
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
    updateOutput("Exiting program.");
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
