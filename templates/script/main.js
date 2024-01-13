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

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; // 含最大值，含最小值
  }

fetch("http://shcloud.top:5000/new_chat", requestOptions)
    .then(response => response.json())
    .then(result => { document.getElementById("chatid").innerHTML = result["chat_id"]; chatid = result["chat_id"]; })
    .catch(error => window.alert(error));

function sendMessage(message) {
    var input = document.getElementById('message');
    var message = input.value;

    var chatContent = document.querySelector('#chat-content');

    chatContent.innerHTML += `<p  style='background-color: rgb(236, 236, 236);padding:5px;width:95%;border-radius:5px'>
        <strong>User: </strong><br><Br />` + message + `</p > `;

    var id = Math.floor(Math.random() * (9999999 - 1111111 + 1)) + 1111111;

    chatContent.innerHTML += `<p>
        <svg xmlns = "http://www.w3.org/2000/svg" xmlns: xlink = "http://www.w3.org/1999/xlink" fill = "none" version = "1.1" width = "10" height = "10" viewBox = "0 0 10 10"> <g><rect x="0" y="0" width="10" height="10" rx="5" fill="#000000" fill-opacity="1" /></g></svg> <strong>Bot: </strong><br><span id="` + String(id) + `" style="margin-left: 20px;">请稍等... ...</span>` + `</p > `;

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
        .then(result => { 
            var r = result["content"];
            var splitMessage = r.split("\\n")
            var i = 0 ; 
            var run = null;
            run = setInterval(function() {
                i++;
                if (i == splitMessage.length -1) {
                    clearInterval(run);
                }
                chatContent.innerHTML += `<p>
        <svg xmlns = "http://www.w3.org/2000/svg" xmlns: xlink = "http://www.w3.org/1999/xlink" fill = "none" version = "1.1" width = "10" height = "10" viewBox = "0 0 10 10"> <g><rect x="0" y="0" width="10" height="10" rx="5" fill="#000000" fill-opacity="1" /></g></svg> <strong>Bot: </strong><br><span style="margin-left: 20px;">`+ splitMessage[i] +`</span>` + `</p > `;
            } , getRandomIntInclusive(200,1000));
        } )
        .catch(error => { document.getElementById(id).innerHTML = "<span style='color: red;'" + error + "></span>" });
}

window.onload = function() {
    document.getElementById("message").addEventListener('keydown', function(event) {
        // event.key 或者 event.keyCode 可以用来获取按下的键
        if (event.keyCode == 13) {
            sendMessage();
        }
      });
}