const pingEndpointURL = 'https://untitled-7lce44jf0ekc.runkit.sh/json';

const statusNames = ['closed', 'maybe open', 'maybe open', 'open'];

var intervalID = 0;
var prevData = {};

async function fetchAlphaData() {
    return await fetch(pingEndpointURL).then(response => response.json());
}

function setOpen() { prevData.statusCode = 3; restart(); }
function setClosed() { prevData.statusCode = 0; restart(); }

function generateMessage(max, online) {
    var oldStatusCode = prevData.statusCode;
    
    var statusCode = oldStatusCode || 0;
    if (max === 0) {
        statusCode = 0;
    } else if (online >= 50) {
        statusCode = 3;
    } else if (max > 60) {
        if (online >= 20) {
            statusCode = 3;
        } else if (oldStatusCode !== 3) {
            statusCode = 2;
        }
    } else if (online < 20 || oldStatusCode !== 3) {
        statusCode = 0;
    }
    
    if (prevData.max != max && prevData.max !== undefined) {
        // Player limit change
        console.log(`Player limit changed from ${prevData.max} to ${max}`);
        sendPlainWebhookMessage(`Player Limit Change: \`${prevData.online}/${prevData.max}\` :arrow_forward: \`${online}/${max}\``);
    }
    if (oldStatusCode != statusCode && oldStatusCode !== undefined) {
        // Alpha status change
        console.log(`Alpha status changed from ${statusNames[oldStatusCode]} to ${statusNames[statusCode]}`);
        sendPlainWebhookMessage(`Alpha Status Change: \`${statusNames[oldStatusCode]}\` :arrow_forward: \`${statusNames[statusCode]}\``);
    }
    prevData = { online, max, statusCode };
    
    return [
        `The <i>Alpha Hypixel Network</i> is currently <span style="color: #FF5555;">closed</span>.<br>The player limit is ${max}, which ${max == 0 ? '' : 'usually'} means the server is closed to the public.${online == 0 ? '' : `<br>There ${online == 1 ? 'is 1 player' : `are ${online} players`} online, but they are likely just ${online == 1 ? 'an admin' : `admins${online > 10 ? ' and testers' : ''}`}.`}`,
        `The <i>Alpha Hypixel Network</i> is <span style="color: #FFFF55;">probably open</span> with a limit of <span style="color: #55FF55;">${max}</span> players.<br>There ${online == 0 ? "aren't any players" : (online == 1 ? 'is only 1 player' : `are only ${online} players`)} online, so the server may not actually be open.`,
        `The <i>Alpha Hypixel Network</i> is <span style="color: #FFFF55;">probably open</span> with a limit of <span style="color: #55FF55;">${max}</span> players.<br>There ${online == 0 ? "aren't any players" : (online == 1 ? 'is only 1 player' : `are only ${online} players`)} online, so the server may not actually be open.`,
        `The <i>Alpha Hypixel Network</i> is currently <span style="color: #55FF55;">open</span> with a limit of <span style="color: #55FF55;">${max}</span> players.<br>There are ${online} players online, so there ${online - max > 0 ? `${online - max == 1 ? 'is 1 player' : `are ${online - max} players`} in the queue.` : 'is currently <span style="color: #55FF55;">no queue</span>.'}`
    ][statusCode];
}

async function updateMessage() {
    var alphaStatus = await fetchAlphaData();
    console.log(alphaStatus);
    document.getElementById('status-with-slash').innerText = alphaStatus.online + '/' + alphaStatus.max;
    document.getElementById('alpha-status-message').innerHTML = generateMessage(alphaStatus.max, alphaStatus.online);
}

function stop() {
    clearInterval(intervalID);
}

function restart() {
    stop();
    updateMessage();
    intervalID = setInterval(updateMessage, 60000);
}

function openPopup() {
    window.open(window.location.origin + window.location.pathname + '?popup', '_blank', 'menubar=no,width=640px,height=170px');
}

if (window.location.search.match(/[?&]popup/)) {
    document.getElementById('popup-button-container').style.display = 'none';
}

restart();
