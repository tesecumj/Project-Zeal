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
    ["649", "Tammy Bacab"],
    ["785", "Carlene Jones"],
    ["769", "Breanna Reyes"],
    ["768", "Brandy James"],
    ["766", "Alinie Cruz"],
    ["786", "Lizannie Patt"],
    ["770", "Mariangel Santos"],
    ["771", "Zenelly Guerra"],
    ["393", "Aura Tzib"],
    ["395", "Charles Harrison"],
    ["318", "Edgardo Serrut"],
    ["454", "Adolfo Medina"],
    ["042", "Ernesto Orellana"],
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

function addAgent(id, name, type) {
    agents.set(id, {
        id: id,
        name: name,
        type: type,
        ready: false,
        busy: false,
        referral: null
    });
}

// Adding listers
agentsData.forEach((name, id) => {
    if (id === "571" || id === "681" || id === "514" || id === "774" || id === "775" || id === "773" || id === "776" || id === "382" || id === "661" || id === "647" || id === "421" || id === "414" || id === "662" || id === "678" || id === "737" || id === "541" || id === "649") {
        addAgent(id, name, "Lister");
    } else if (id === "785" || id === "769" || id === "768" || id === "766" || id === "786" || id === "770" || id === "771") {
        addAgent(id, name, "Data Entry");
    } else if (id === "393" || id === "395" || id === "318" || id === "454" || id === "042") {
        addAgent(id, name, "Downloader");
    } else {
        addAgent(id, name, "Guideline");
    }
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
