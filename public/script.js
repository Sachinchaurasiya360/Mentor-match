document.getElementById('chatForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const message = document.getElementById('messageInput').value;
    const responseOutput = document.getElementById('responseOutput');

    try {
        const response = await fetch('/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        responseOutput.innerText = data.reply;
    } catch (error) {
        responseOutput.innerText = 'Error: Unable to get a response.';
    }
});
