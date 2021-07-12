const socket = io('/')

let local = null;
const myPeer = new Peer(
    {
      port: 443,
      ssl: {
        key: '/path/to/your/ssl/key/here.key',
        cert: '/path/to/your/ssl/certificate/here.crt'
      }
    }
  )
const videos = document.getElementById("video")
videos.muted = true
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    videos.srcObject = stream
    local = stream
    videos.play();

})


//message
const ChatBox = document.getElementById("chatbox")

//printing prev message
let mssgArray = []
if (ROOM_ID == sessionStorage.getItem('room_ID')) {
    mssgArray = sessionStorage.getItem('messageArray')? JSON.parse(sessionStorage.getItem('messageArray')):[]

}
else {
    sessionStorage.setItem('room_ID', ROOM_ID)
    sessionStorage.setItem('messageArray', mssgArray)
}
if(mssgArray!=null||mssgArray!=[])mssgArray.forEach(printPrevMessage)

function printPrevMessage(item) {
    let NAME = item['name']
    let MSSG = item['mssg']
    let TIME = item['time']
    if (" "+localStorage.getItem('names') == NAME) {
        var printtext = document.getElementById('chatmsg');

        var currentdate = new Date();

        var copiedtext = MSSG;

        var printnow = '<div class="sent">' + '<span class=" sent1 " >' + '<span style="padding-right:22px">' + copiedtext + '</span>' + '<span class="senttime" >' + TIME + '</span>' + '</span>' + '</div>';

        printtext.insertAdjacentHTML('beforeend', printnow);

        var box = document.getElementById('journal-scroll');
        box.scrollTop = box.scrollHeight;

    }
    else {

        var printtext = document.getElementById('chatmsg');

        var printnow = '<div class="receive">' + '<div class=" receive1" >' + '<div class="receiveMessage">' + '<p class="name">' + NAME + '</p>' + '<p class="message">' + MSSG + '</p>' + '</div>' + '<span class="time">' + TIME + '</span>' + '</div>' + '</div>';
        printtext.insertAdjacentHTML('beforeend', printnow);

        var box = document.getElementById('journal-scroll');
        box.scrollTop = box.scrollHeight;

    }
}
//recieving message
socket.on(ROOM_ID, text => {
    var currentdate = new Date();
    if(text.NAME==null||text.NAME==undefined)text.NAME = "GUEST"
    if (socket.id != text.userId) {



        var printtext = document.getElementById('chatmsg');

        
        var printnow = '<div class="receive">' + '<div class=" receive1" >' + '<div class="receiveMessage">' + '<p class="name">' + text.NAME + '</p>' + '<p class="message">' + text.messagE + '</p>' + '</div>' + '<span class="time">' + currentdate.getHours() + ':' + currentdate.getMinutes() + '</span>' + '</div>' + '</div>';
        printtext.insertAdjacentHTML('beforeend', printnow);

        var box = document.getElementById('journal-scroll');
        box.scrollTop = box.scrollHeight;

    }
    let item = {
        'name': text.NAME,
        'mssg': text.messagE,
        'time': currentdate.getHours() + ':' + currentdate.getMinutes(),
        'id': text.userId

    }
    mssgArray.push(item);
    sessionStorage.setItem('messageArray', JSON.stringify(mssgArray))

});
//sending message
var Input = document.getElementById("typemsg");


Input.addEventListener("keydown", function(event) {
 
  if (event.code === "Enter") {
   
    event.preventDefault();
    
    if(Input.value!="")document.getElementById("message").click();
  }
});
document.getElementById('message').onclick = () => {
    var copytext = document.getElementById('typemsg');
    socket.emit('mssg', {
        mess: copytext.value,
        roomid: ROOM_ID,
        NAME: localStorage.getItem("names")
    })


    var printtext = document.getElementById('chatmsg');

    var currentdate = new Date();

    var copiedtext = copytext.value;

    var printnow = '<div class="sent">' + '<span class=" sent1 " >' + '<span style="padding-right:22px">' + copiedtext + '</span>' + '<span class="senttime" >' + currentdate.getHours() + ':' + currentdate.getMinutes() + '</span>' + '</span>' + '</div>';

    printtext.insertAdjacentHTML('beforeend', printnow);

    var box = document.getElementById('journal-scroll');
    box.scrollTop = box.scrollHeight;
    copytext.value = "";
}

// join or exit room
const JoinRoom = (e) => {
    window.location.href = `/room/${ROOM_ID}`
}
const exit = (e) => {
    window.location.href = `/profile`
}

// mic cam share
const mic = document.getElementById('mute')

const camera = document.getElementById('camera')
localStorage.setItem("camera", "on");
localStorage.setItem("mic", "on");
camera.onclick = function () {
    const camera_svg = document.getElementById("cam")
    const t = videos.srcObject.getTracks()[1]
    t.enabled = !t.enabled
    if (camera_svg.style.backgroundColor == 'crimson') {
        camera_svg.style.backgroundColor = '#1b1a1a'
        localStorage.setItem("camera", "on");


    }
    else {
        camera_svg.style.backgroundColor = 'crimson'
        localStorage.setItem("camera", "off");
    }

}

mic.onclick = function () {
    // console.log('mic of');
    const mic_svg = document.getElementById("Layer_1")
    const t = videos.srcObject.getTracks()[0]
    t.enabled = !t.enabled
    if (mic_svg.style.backgroundColor == 'crimson') {
        mic_svg.style.backgroundColor = '#1B1A1A'
        localStorage.setItem("mic", "on");


    }
    else {
        mic_svg.style.backgroundColor = 'crimson'
        localStorage.setItem("mic", "off");
    }

}

const openmodal = document.getElementById("show_room")
const closemodal = document.getElementById("close_room")
const room_id = document.getElementById("room_id")
openmodal.onclick = () => {
    room_id.style.display = "flex";

}

closemodal.onclick = () => {
    room_id.style.display = "none";

}

  
function CopyToClipboard()
{

  var elem = document.createElement("textarea");
  document.body.appendChild(elem);
  elem.value = ROOM_ID;
  elem.select();
  document.execCommand("copy");
  document.body.removeChild(elem);
}