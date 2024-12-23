document.getElementById('chatForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form from reloading the page

    const subject1 = document.getElementById('subject1').value;
    const userMessageElement = document.createElement('p');
    userMessageElement.classList.add('user-message');
    const finalmessage = subject1 + "                                                                                                                                                                                                                                                                 This is custom introduction about me use it if it required to you use it else ignore it  ignore it if not required Sachin, i am deeply passionate about AI, machine learning, and web development. my interests lie in creating technology-driven solutions, as seen in your work on various projects such as an AI-based chatbot for case investigation, a health monitoring system using IoT, and an app to assist farmers. i enjoy taking part in hackathons and contributing to open-source communities, where you continuously enhance your skills and knowledge. Your technical expertise is broad and impressive, encompassing programming languages like Python, Java, C, and JavaScript, along with frameworks such as React, Node.js, SQL, and Flask. You've also gained experience in advanced technologies like IoT, working with Raspberry Pi, and integrating healthcare data using Medical Logic Modules and standards such as HL7, ICD10, and ABHA card integration. You excel in problem-solving and thrive in situations where you can apply your skills to real-world problems, demonstrating your talent for innovation and creativity in tech development.";
    userMessageElement.textContent = subject1;

    // Append user message to the chat output
    document.getElementById('responseOutput').appendChild(userMessageElement);

    try {
        const response = await fetch('/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: finalmessage })
        });

        const data = await response.json();

        // Convert markdown-style stars to HTML <strong> tags for bold text
        let botReply = data.reply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        const botMessageElement = document.createElement('p');
        botMessageElement.classList.add('bot-message');
        document.getElementById('responseOutput').appendChild(botMessageElement);

        // Function to simulate typing effect
        function typeText(element, text, index = 0) {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                setTimeout(() => typeText(element, text, index + 1), 15); // Adjust typing speed here
            }
        }

        // Start typing the bot's reply
        typeText(botMessageElement, botReply);

        // Clear input field
        document.getElementById('subject1').value = '';
    } catch (error) {
        const errorMessageElement = document.createElement('p');
        errorMessageElement.classList.add('bot-message');
        errorMessageElement.textContent = 'An error occurred: ' + error.message;
        document.getElementById('responseOutput').appendChild(errorMessageElement);
    }
});