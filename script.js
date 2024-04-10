<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Referral Queue System - Login</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Referral Queue System</h1>
        <div class="login-form" id="login-form">
            <input type="text" id="username" placeholder="Username">
            <input type="password" id="password" placeholder="Password">
            <button id="login-btn">Login</button>
            <div class="error-message" id="error-message"></div>
        </div>
        <div class="output" id="output"></div>
        <div class="options" id="options" style="display: none;">
            <button id="sign-in-btn">Agent Sign In</button>
            <button id="agent-ready-btn">Agent Ready</button>
            <button id="add-referrals-btn">Add Referral(s)</button>
            <button id="exit-btn">Exit</button>
        </div>
    </div>

    <script src="script.js"></script>
    <script>
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

        // Referral Queue System JavaScript
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
    </script>
</body>
</html>
