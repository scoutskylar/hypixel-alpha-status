var intervalDelay = 60000;

const pingEndpointURL = 'https://7lce44jf0ekc.runkit.sh/json';

const statusNames = ['closed', 'unknown', 'maybe open', 'open'];

var intervalID = 0;
var prevData = {};

async function fetchAlphaData() {
    return await fetch(pingEndpointURL).then(response => response.json());
}

function generateMessage(max, online, timestamp) {
    let statusCode = max > 0 && (max > 60 || online >= 40 || prevData.max <= 60 && prevData.statusCode === 3) ? 3 : 0;
    
    // // Current implementation in HSW Bot
    // if (max === 0 || max <= 60 && online < 40 && (prevData.statusCode !== 3 || prevData.max > 60)) statusCode = 0;
    // else if (max > 60 && online < 20 && prevData.statusCode !== 3) statusCode = 2;
    // else statusCode = 3;
    
    if (prevData.max != max && prevData.max !== undefined) {
        // Player limit change
        console.log(`[${new Date(timestamp).toLocaleString()}] Player limit changed from ${prevData.max} to ${max}`);
        sendPlainWebhookMessage(`Player Limit Change: \`${prevData.online}/${prevData.max}\` :arrow_forward: \`${online}/${max}\``);
    }
    if (prevData.statusCode != statusCode && prevData.statusCode !== undefined) {
        // Alpha status change
        console.log(`[${new Date(timestamp).toLocaleString()}] Alpha status changed from ${statusNames[prevData.statusCode]} to ${statusNames[statusCode]}`);
        sendPlainWebhookMessage(`Alpha Status Change: \`${statusNames[prevData.statusCode]}\` :arrow_forward: \`${statusNames[statusCode]}\``);
    }
    prevData = { online, max, statusCode };
    
    return [
        `The <i>Alpha Hypixel Network</i> is currently <span style="color: #FF5555;">closed</span>.<br>The player limit is ${max}, which ${max == 0 ? '' : 'usually'} means the server is closed to the public.${online == 0 ? '' : `<br>There ${online == 1 ? 'is 1 player' : `are ${online} players`} online, but they are likely just ${online == 1 ? 'an admin' : `admins${online > 10 ? ' and testers' : ''}`}.`}`,
        'The <i>Alpha Hypixel Network</i> status has not yet been determined.',
        `The <i>Alpha Hypixel Network</i> is <span style="color: #FFFF55;">probably open</span> with a limit of <span style="color: #55FF55;">${max}</span> players.<br>There ${online == 0 ? "aren't any players" : (online == 1 ? 'is only 1 player' : `are only ${online} players`)} online, so the server may not actually be open.`,
        `The <i>Alpha Hypixel Network</i> is currently <span style="color: #55FF55;">open</span> with a limit of <span style="color: #55FF55;">${max}</span> players.<br>There are ${online} players online, so there ${online - max > 0 ? `${online - max == 1 ? 'is 1 player' : `are ${online - max} players`} in the queue.` : 'is currently <span style="color: #55FF55;">no queue</span>.'}`
    ][statusCode];
}

function onConnectionLost(e) {
    document.getElementById('internet-status-message').innerHTML = '<span style="color: #FF8888;">You are not connected to the internet.</span>';
    console.log(`[${new Date().toLocaleString()}] Network connection lost`);
    stop();
}
window.addEventListener('offline', onConnectionLost);

function onConnectionRestored(e) {
    document.getElementById('internet-status-message').innerHTML = '';
    console.log(`[${new Date().toLocaleString()}] Network connection restored`);
    restart();
}
window.addEventListener('online', onConnectionRestored);

async function updateMessage() {
    var alphaStatus = await fetchAlphaData();
    console.log(`[${new Date(alphaStatus.timestampMilliseconds).toLocaleString()}] ${alphaStatus.online}/${alphaStatus.max}`);
    // CSV style: `${new Date(alphaStatus.timestampMilliseconds).toISOString()},${alphaStatus.online},${alphaStatus.max}`
    document.getElementById('status-with-slash').innerText = alphaStatus.online + '/' + alphaStatus.max;
    document.getElementById('alpha-status-message').innerHTML = generateMessage(alphaStatus.max, alphaStatus.online, alphaStatus.timestampMilliseconds);
}

function stop() {
    clearInterval(intervalID);
}

function restart(status) {
    stop();
    if (status !== undefined) prevData.statusCode = status;
    updateMessage();
    intervalID = setInterval(updateMessage, intervalDelay);
}

function openPopup() {
    window.open(window.location.href, '_blank', 'menubar=no,width=640px,height=170px');
}

if (window.navigator.onLine) restart();
else {
    document.getElementById('alpha-status-message').innerHTML = '';
    onConnectionLost();
}
