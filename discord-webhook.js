const webhookURL = ''; // redacted for the public repository, of course

// adapted from https://dev.to/oskarcodes/send-automated-discord-messages-through-webhooks-using-javascript-1p01
function sendWebhookMessage(message) {
    if (!webhookURL) return;
    
    const request = new XMLHttpRequest();
    request.open("POST", webhookURL);
    request.setRequestHeader('Content-type', 'application/json');
    request.send(JSON.stringify({ content: message }));
}
