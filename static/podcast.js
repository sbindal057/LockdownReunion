const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const peerid = []
const myPeer = new Peer(
  {
    port: 443,
    ssl: {
      key: '/path/to/your/ssl/key/here.key',
      cert: '/path/to/your/ssl/certificate/here.crt'
    }
  }
)


console.log(myPeer._id)
let localStream = null;
const peers = {}
function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()

  })

  videoGrid.append(video)
  Dish()


}
if (sessionStorage.getItem('Podcast') == 'create') {
  const myVideo = document.createElement('video')
  myVideo.muted = true
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: {
      echoCancellation: true,
      noiseSuppression: true

    }
  }).then(stream => {
    


    addVideoStream(myVideo, stream);

    localStream = stream
    socket.on('user-connected', userId => {

      let userName = null;
      const call = myPeer.call(userId, stream)
      peerid.push(userId)
      peers[userId] = call

    })
  })
  socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()


  })

  myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
  })

  const mic = document.getElementById('mute')
  const endCall = document.getElementById('hhh')
  const camera = document.getElementById('video')


  camera.onclick = function () {
    //console.log("cam")
    const camera_svg = document.getElementById("cam")
    const t = myVideo.srcObject.getTracks()[1]
    t.enabled = !t.enabled
    if (camera_svg.style.backgroundColor == 'crimson') {
      camera_svg.style.backgroundColor = '#1b1a1a'


    }
    else {
      camera_svg.style.backgroundColor = 'crimson'
    }

  }
  mic.onclick = function () {
    // console.log('mic of');
    const mic_svg = document.getElementById("Layer_1")
    const t = myVideo.srcObject.getTracks()[0]
    t.enabled = !t.enabled
    if (mic_svg.style.backgroundColor == 'crimson') {
      mic_svg.style.backgroundColor = '#1B1A1A'


    }
    else {
      mic_svg.style.backgroundColor = 'crimson'
    }

  }

  endCall.onclick = function () {
    for (let conns in myPeer.connections) {
      myPeer.connections[conns].forEach((conn, index, array) => {
        // console.log(`closing ${conn.connectionId} peerConnection (${index + 1}/${array.length})`, conn.peerConnection);
        conn.peerConnection.close();

        // close it using peerjs methods
        if (conn.close)
          conn.close();
      });
      socket.emit('disconnect');
    }
    myVideo.pause();
    myVideo.src = "";
    localStream.getTracks()[0].stop();
    localStream.getTracks()[1].stop();
    window.location.href = `/profile`
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





}
else {

  document.getElementById("xx").style.display = "none"
  navigator.mediaDevices.getUserMedia({
    video: false,
    audio: true
  }).then(stream => {
    myPeer.on('call', call => {

      const t = stream.getTracks()[0]
      t.enabled = !t.enabled

      call.answer(stream)
      const video = document.createElement('video')





      if (peerid.find(function (element) {
        return element == call.peer;
      }) == undefined) {
        peerid.push(call.peer)

        video.setAttribute("id", call.peer)
      }
      else {
        video.setAttribute("id", "sc" + call.peer)
        video.style.transform = "none"
      }



      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)

      })

    })
    socket.on('user-connected', userId => {

      let userName = null;

      if (peerid.find(function (element) {
        return element == userId;
      }) == undefined) {
        peerid.push(userId)

        connectToNewUser(userId, stream, userName)
      }
      else {
        const call = myPeer.call(userId, stream)

        const video = document.createElement('video')


        video.setAttribute("id", 'sc' + userId)
        video.style.transform = "none";
        call.on('stream', userVideoStream => {
          addVideoStream(video, userVideoStream)
        })
        call.on('close', () => {
          video.remove()
        })
      }

    })





  })



  socket.on('user-disconnected', userId => {
    console.log("dis")

    if (peers[userId]) peers[userId].close()
    const useridvideo = document.getElementById(userId);
    if (useridvideo != null) {
      useridvideo.remove();
    }

  })
  socket.on('screen-disconnected', userId => {

    const useridvideo = document.getElementById("sc" + userId);
    if (useridvideo != null) {
      useridvideo.remove();
      Dish();
    }

  })
  myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
  })
}


//messaging



const openChatBox = document.getElementById("chat")
const ChatBox = document.getElementById("chatbox")
openChatBox.onclick = () => {
  if (ChatBox.style.display === "none") {
    ChatBox.style.display = "block";
    videoGrid.style.width = '75vw';
    Dish()
  } else {
    ChatBox.style.display = "none";
    videoGrid.style.width = '100vw';
    Dish()
  }
}
//printing prev message
let mssgArray = []
if (ROOM_ID == sessionStorage.getItem('room_ID')) {
  mssgArray = sessionStorage.getItem('messageArray') ? JSON.parse(sessionStorage.getItem('messageArray')) : []

}
else {
  sessionStorage.setItem('room_ID', ROOM_ID)
  sessionStorage.setItem('messageArray', mssgArray)
}
if (mssgArray != null || mssgArray != []) { mssgArray.forEach(printPrevMessage) }

function printPrevMessage(item) {
  let NAME = item['name']
  let MSSG = item['mssg']
  let TIME = item['time']
  let ID = item['id']
  console.log(localStorage.getItem('names').length)
  console.log(NAME.length)
  if (" " + localStorage.getItem('names') == NAME) {

    var printtext = document.getElementById('chatmsg');

    var printnow = '<div class="sent">' + '<span class="sent1 " >' + MSSG + '<span class="senttime">' + TIME + '</span>' + '</span>' + '</div>';

    printtext.insertAdjacentHTML('beforeend', printnow);

    var box = document.getElementById('journal-scroll');
    box.scrollTop = box.scrollHeight;

  }
  else {

    var printtext = document.getElementById('chatmsg');
    var printnow = '<div class="receive">' + '<div class="receive1" >' + '<div class="receiveMessage">' + '<p class="name" >' + NAME + '</p>' + '<p class="message">' + MSSG + '</p>' + '</div>' + '<span class="time">' + TIME + '</span>' + '</div>' + '</div>';
    printtext.insertAdjacentHTML('beforeend', printnow);

    var box = document.getElementById('journal-scroll');
    box.scrollTop = box.scrollHeight;

  }
}
//recieving message
socket.on(ROOM_ID, text => {
  var currentdate = new Date();
  if (text.NAME == null || text.NAME == undefined) text.NAME = "GUEST"
  if (socket.id != text.userId) {
    var printtext = document.getElementById('chatmsg');



    var printnow = '<div class="receive">' + '<div class="receive1" >' + '<div class="receiveMessage">' + '<p class="name" >' + text.NAME + '</p>' + '<p class="message">' + text.messagE + '</p>' + '</div>' + '<span class="time">' + currentdate.getHours() + ':' + currentdate.getMinutes() + '</span>' + '</div>' + '</div>';
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


Input.addEventListener("keydown", function (event) {

  if (event.code === "Enter") {

    event.preventDefault();

    if (Input.value != "") document.getElementById("message").click();
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

  var printnow = '<div class="sent">' + '<span class="sent1 " >' + copiedtext + '<span class="senttime">' + currentdate.getHours() + ':' + currentdate.getMinutes() + '</span>' + '</span>' + '</div>';

  printtext.insertAdjacentHTML('beforeend', printnow);

  var box = document.getElementById('journal-scroll');
  box.scrollTop = box.scrollHeight;
  copytext.value = "";
}


// screensharing


const ScreenShare = document.getElementById("screenShare")
const ss_icon = document.getElementById("ss_icon")
let screenStream = null;
let screen = null;
let myId = null;
ScreenShare.onclick = () => {
  if (ss_icon.style.backgroundColor == "crimson") {
    ss_icon.style.backgroundColor = "#1b1a1a"

    screen.pause();
    screen.src = "";
    screenStream.getTracks()[0].stop();
    if (screen != null) { screen.remove(); Dish() }
    socket.emit('screen-sharing-disconnect')


  }
  else {
    ss_icon.style.backgroundColor = "crimson"
    screen = document.createElement('video')
    screen.style.transform = "none";
    navigator.mediaDevices.getDisplayMedia({
      video: {
        mediaSource: true,
        width: { max: '1920' },
        height: { max: '1080' },
        frameRate: { max: '10' }
      }
    }).then(stream => {
      screenStream = stream;
      addVideoStream(screen, stream, "")


      function addToPrevious(item) {

        var call = myPeer.call(item,
          stream);
      }
      peerid.forEach(addToPrevious)
      socket.on('user-connected', userId => {

        const call = myPeer.call(userId, stream)


      })


    })

  }

}


function Area(Increment, Count, Width, Height, Margin = 10) {
  let i = w = 0;
  let h = Increment * 0.75 + (Margin * 2);
  while (i < (Count)) {
    if ((w + Increment) > Width) {
      w = 0;
      h = h + (Increment * 0.75) + (Margin * 2);
    }
    w = w + Increment + (Margin * 2);
    i++;
  }
  if (h > Height) return false;
  else return Increment;
}

function Dish() {


  let Margin = 2;
  let Scenary = document.getElementById('video-grid');
  let Width = Scenary.offsetWidth - (Margin * 2);
  let Height = Scenary.offsetHeight - (Margin * 2);
  let Cameras = document.getElementsByTagName('video');
  let max = 0;

  let i = 1;
  while (i < 5000) {
    let w = Area(i, Cameras.length, Width, Height, Margin);
    if (w === false) {
      max = i - 1;
      break;
    }
    i++;
  }


  max = max - (Margin * 2);
  setWidth(max, Margin);
}


function setWidth(width, margin) {
  let Cameras = document.getElementsByTagName('video');
  for (var s = 0; s < Cameras.length; s++) {
    Cameras[s].style.width = width + "px";
    Cameras[s].style.margin = margin + "px";
    //Cameras[s].style.height = (width * 0.75) + "px";
  }
}

//copy to clipboard
function CopyToClipboard() {

  var elem = document.createElement("textarea");
  document.body.appendChild(elem);
  elem.value = ROOM_ID;
  elem.select();
  document.execCommand("copy");
  document.body.removeChild(elem);
}