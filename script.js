const pingEndpointURL = 'https://untitled-7lce44jf0ekc.runkit.sh/json';

var intervalID = 0;
var currentStatusCode = -1;

async function fetchAlphaStatus() {
    return await fetch(`${pingEndpointURL}`).then(response => response.json());
}

function generateMessage(max, online) {
    var statusCode = max === 0 ? 0 : (max > 50) * 2 + (online >= 20);

    if (currentStatusCode >= 0 && currentStatusCode != statusCode) {
        console.log(`Alpha status code changed from ${currentStatusCode} to ${statusCode}`);
        sendWebhookMessage(`The Alpha Hypixel Network ${webhookMessages[statusCode]}.`);
    }
    currentStatusCode = statusCode;
    
    return [
        `The <i>Alpha Hypixel Network</i> is currently <span style="color: #FF5555;">closed</span>.<br>The player limit is ${max}, which ${max == 0 ? '' : 'usually'} means the server is closed to the public.${online == 0 ? '' : `<br>There ${online == 1 ? 'is 1 player' : `are ${online} players`} online, but they are likely just ${online == 1 ? 'an admin' : `admins${online > 10 ? 'and testers' : ''}`}`}.`,
        `The <i>Alpha Hypixel Network</i> is currently <span style="color: #FFFF55;">possibly open</span>.<br>The player limit is ${max}, which usually means the server is closed to the public.<br>However, there are ${online} players online, so it might actually be open.`,
        `The <i>Alpha Hypixel Network</i> is currently <span style="color: #00AA00;">probably open</span> with a limit of <span style="color: #55FF55;">${max}</span> players.<br>However, there ${online == 0 ? "aren't any players" : (online == 1 ? 'is only 1 player' : `are only ${online} players`)} online, so the server may not actually be open.`,
        `The <i>Alpha Hypixel Network</i> is currently <span style="color: #55FF55;">open</span> with a limit of <span style="color: #55FF55;">${max}</span> players.<br>There are ${online} players online, so there ${online - max > 0 ? `${online - max == 1 ? 'is 1 player' : `are ${online - max} players`} in the queue.` : 'is currently <span style="color: #55FF55;">no queue</span>.'}`
    ][statusCode];
}

const webhookMessages = [
    'has **closed**',
    'is **possibly open**',
    'is **probably open**',
    'is now **open**'
]
async function updateMessage() {
    var alphaStatus = await fetchAlphaStatus();
    console.log(alphaStatus);
    document.getElementById('status-with-slash').innerText = alphaStatus.online + '/' + alphaStatus.max;
    document.getElementById('status-message').innerHTML = generateMessage(alphaStatus.max, alphaStatus.online);
}

function stop() {
    clearInterval(intervalID);
}

function start() {
    stop();
    updateMessage();
    intervalID = setInterval(updateMessage, 60000);
}

function openPopup() {
    window.open(window.location.origin + window.location.pathname + '?popup', '_blank', 'menubar=no,width=640px,height=150px');
}

if (window.location.search.match(/[?&]popup/)) {
    document.getElementById('popup-button-container').style.display = 'none';
}

start();
