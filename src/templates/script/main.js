var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
    "model": "chatglm_pro"
});

var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
};

fetch("http://shcloud.top:5000/new_chat", requestOptions)
    .then(response => response.json())
    .then(result => { document.getElementById("chatid").innerHTML = result["chat_id"]; chatid = result["chat_id"]; })
    .catch(error => window.alert(error));

function sendMessage(message) {
    var input = document.getElementById('message');
    var message = input.value;

    var chatContent = document.querySelector('#chat-content');

    chatContent.innerHTML += `<p>
        <svg xmlns = "http://www.w3.org/2000/svg" xmlns: xlink = "http://www.w3.org/1999/xlink" fill = "none" version = "1.1" width = "10" height = "10" viewBox = "0 0 10 10"> <g><rect x="0" y="0" width="10" height="10" rx="5" fill="#000000" fill-opacity="1" /></g></svg> <strong>User: </strong><br><span style="margin-left: 20px;">` + message + `</span></p > `;

    var id = Math.floor(Math.random() * (9999999 - 1111111 + 1)) + 1111111;

    chatContent.innerHTML += `<p>
        <svg xmlns = "http://www.w3.org/2000/svg" xmlns: xlink = "http://www.w3.org/1999/xlink" fill = "none" version = "1.1" width = "10" height = "10" viewBox = "0 0 10 10"> <g><rect x="0" y="0" width="10" height="10" rx="5" fill="#000000" fill-opacity="1" /></g></svg> <strong>Bot: </strong><br><span id="` + String(id) + `" style="margin-left: 20px;">Please wait</span>` + `</p > `;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "chat_id": chatid,
        "message": message
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://shcloud.top:5000/chat", requestOptions)
        .then(response => response.json())
        .then(result => { document.getElementById(id).innerHTML = result["content"] } )
        .catch(error => { document.getElementById(id).innerHTML = "<span style='color: red;'" + error + "></span>" });
}
