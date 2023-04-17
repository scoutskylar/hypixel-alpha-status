var webhook_URL_1 = webhook_URL_1 || '';
var webhook_URL_2 = webhook_URL_2 || '';
const webhookUsername = "scoutskylar's Alpha Webhook";

// adapted from https://dev.to/oskarcodes/send-automated-discord-messages-through-webhooks-using-javascript-1p01
function sendWebhookMessage(title, message, color = 5814783) {
    if (!webhook_URL_1) return;
    
    const request = new XMLHttpRequest();
    request.open("POST", webhook_URL_1);
    request.setRequestHeader('Content-type', 'application/json');
    request.send(JSON.stringify({
        "content": null,
        "embeds": [
            {
                "title": title,
                "description": message,
                "color": color,
                "author": {
                    "name": "Alpha Hypixel Network Status 🔗",
                    "url": "https://scoutskylar.github.io/hypixel-alpha-status/",
                    "icon_url": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                },
                "timestamp": new Date().toISOString()
            }
        ],
        "username": webhookUsername,
        "attachments": []
    }));
}

function sendPlainWebhookMessage(message) {
    if (webhook_URL_1) {
        const request = new XMLHttpRequest();
        request.open("POST", webhook_URL_1);
        request.setRequestHeader('Content-type', 'application/json');
        request.send(JSON.stringify({ "content": message, "username": webhookUsername }));
    }

    if (webhook_URL_2) {
        const request = new XMLHttpRequest();
        request.open("POST", webhook_URL_2);
        request.setRequestHeader('Content-type', 'application/json');
        request.send(JSON.stringify({ "content": message, "username": webhookUsername }));
    }
}

if (webhook_URL_1) {
    document.getElementById('webhook-status-message').innerHTML = 'Discord webhook ready';
}
