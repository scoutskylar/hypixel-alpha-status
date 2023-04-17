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

{
    // clear local storage when the query parameter `clear-local-storage` exists
    let q = new URLSearchParams(location.search);
    if (q.get('clear-local-storage') !== null) {
        localStorage.clear();
        q.delete('clear-local-storage');
        history.replaceState(null, '', location.origin + location.pathname + (q.toString() ? '?' + q.toString() : '') + location.hash);
    }
}

{
    // save the webhook URL from the query parameter to local storage
    let q = new URLSearchParams(location.search);
    let webhookString = q.get('set-webhook')?.match(/^(?:https:\/\/discord.com\/api\/webhooks\/)?(\d+\/[^/]+)\/?$/)?.[1];
    if (webhookString) {
        localStorage.setItem('hypixel-alpha-status/webhook', webhookString);
        q.delete('set-webhook');
        history.replaceState(null, '', location.origin + location.pathname + (q.toString() ? '?' + q.toString() : '') + location.hash);
    }
}

{
    // get webhook URL from local storage
    let webhookString = localStorage.getItem('hypixel-alpha-status/webhook');
    if (webhookString && webhookString.match(/^\d+\/[^/]+$/)) webhook_URL_1 = 'https://discord.com/api/webhooks/' + webhookString;
}

if (webhook_URL_1 || webhook_URL_2) {
    document.getElementById('webhook-status-icon').style.display = '';
}
