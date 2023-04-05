// const webhookURL = ''; // redacted for the public repository, of course
const webhookURL = 'https://discord.com/api/webhooks/1060046724925751376/G6aaFc90JXj1_tFIaoFPbY9U8MfvecaM-zjZA7_tA41MEBz7MoDZL8J4LhJELuxfgz4K';
const webhookURL_wiki = '';
const webhookUsername = "scoutskylar's Alpha Webhook";

// adapted from https://dev.to/oskarcodes/send-automated-discord-messages-through-webhooks-using-javascript-1p01
function sendWebhookMessage(title, message, color = 5814783) {
    if (!webhookURL) return;
    
    const request = new XMLHttpRequest();
    request.open("POST", webhookURL);
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
    if (!webhookURL) return;
    
    const request = new XMLHttpRequest();
    request.open("POST", webhookURL);
    request.setRequestHeader('Content-type', 'application/json');
    request.send(JSON.stringify({ "content": message, "username": webhookUsername }));

    if (webhookURL_wiki) {
        const request = new XMLHttpRequest();
        request.open("POST", webhookURL_wiki);
        request.setRequestHeader('Content-type', 'application/json');
        request.send(JSON.stringify({ "content": message, "username": webhookUsername }));
    }
}

if (webhookURL) {
    document.getElementById('webhook-status-message').innerHTML = '<span style="color: #55FF55;">» Discord Webhook Active</span>';
}
