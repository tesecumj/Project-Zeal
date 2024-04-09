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

function addAgent(id, name) {
    agents.set(id, {
        id: id,
        name: name,
        ready: false,
        busy: false,
        referral: null
    });
}

agentsData.forEach((name, id) => {
    addAgent(id, name);
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

function addReferrals(referralNumbers) {
    manualReferrals.push(...referralNumbers);
    updateOutput("Referrals added.");
    assignReferral();
}

function updateOutput(message) {
    const outputDiv = document.getElementById("output");
    const newMessage = document.createElement("div");
    newMessage.textContent = message;
    outputDiv.appendChild(newMessage);
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
    const referralsInput = prompt("Enter referral number(s) separated by commas:");
    if (referralsInput !== null) {
        const referrals = referralsInput.split(",").map(referral => parseInt(referral.trim()));
        addReferrals(referrals);
    }
}

function handleExit() {
    updateOutput("Exiting program.");
    // Add any necessary clean-up logic here
}

// Event listeners for button clicks
document.getElementById("sign-in-btn").addEventListener("click", handleSignIn);
document.getElementById("agent-ready-btn").addEventListener("click", handleAgentReady);
document.getElementById("add-referrals-btn").addEventListener("click", handleAddReferrals);
document.getElementById("exit-btn").addEventListener("click", handleExit);
