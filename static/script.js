const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const peerid = []
let mypeerid = null

const myPeer = new Peer(
  {
    port: 443,
    ssl: {
      key: '/path/to/your/ssl/key/here.key',
      cert: '/path/to/your/ssl/certificate/here.crt'
    }
  }
)

const myVideo = document.createElement('video')

let localStream = null;
const peers = {}
const screenpeers = {}
myVideo.muted = true

  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(stream => {

    addVideoStream(myVideo, stream, localStorage.getItem("names"));


    ((localStorage.getItem("camera") == "off") ? camera.click() : null);
    ((localStorage.getItem("mic") == "off") ? mic.click() : null)
    localStream = stream
    myPeer.on('call', call => {


      call.answer(stream)
      const video = document.createElement('video')

      if (peerid.find(function (element) {
        return element == call.peer;
      }) == undefined) {
        peerid.push(call.peer)

        video.setAttribute("id", call.peer)
      }
      else {
        //for screen sharing
        video.setAttribute("id", "sc" + call.peer)
        video.style.transform = "none"
      }

      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream, "")

      })

    })
    //for name
    myPeer.on('connection', function (conn) {

      conn.on('open', function () {

        conn.on('data', function (data) {
          (document.getElementById(conn.peer).parentNode).childNodes[1].innerHTML = data
        });
        conn.send(localStorage.getItem("names"));

      });

    });

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
          addVideoStream(video, userVideoStream, "")
        })
        call.on('close', () => {
          video.remove()
        })
        screenpeers[userId] = call
      }
      //name
      var conn = myPeer.connect(userId, localStorage.getItem("names"));
      conn.on('open', function () {

        // Send name
        conn.send(localStorage.getItem("names"));
      });
      conn.on('data', function (data) {
        userName = data;

        (document.getElementById(conn.peer).parentNode).childNodes[1].innerHTML = data
      });
    })
  },
  err => alert("Looks like your video could not be turned on. Please check if its being used anywhere other than this browser ")
  )


  socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
    const useridvideo = document.getElementById(userId);
    if (useridvideo != null) {
      useridvideo.parentNode.remove();
      Dish();
    }

  })
  socket.on('screen-disconnected', userId => {
    if (screenpeers[userId]) screenpeers[userId].close()

    const useridvideo = document.getElementById("sc" + userId);
    if (useridvideo != null) {
      useridvideo.parentNode.remove();
      Dish();
    }

  })
  myPeer.on('open', id => {
    mypeerid = myPeer._id
    socket.emit('join-room', ROOM_ID, id)
  })

  function connectToNewUser(userId, stream, NAME) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')

    video.setAttribute("id", userId)
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream, NAME)
    })
    call.on('close', () => {
      (video.parentNode).remove()
    })

    peers[userId] = call
  }
  function addVideoStream(video, stream, NAME) {
    const videoWrapper = document.createElement("div")
    videoWrapper.className = "videoWrapper"

    videoWrapper.append(video)
    const nameDiv = document.createElement("div")

    nameDiv.className = "videoName"
    videoWrapper.append(nameDiv)
    nameDiv.innerHTML = NAME
    video.srcObject = stream
    video.addEventListener("click", () => {

      document.getElementById("large_video").style.display = "block";

      var cln = video.cloneNode(true);


      cln.style.width = "auto";
      cln.style.height = "100vh";
      cln.style.marginLeft = "auto";
      cln.style.marginRight = "auto";




      cln.srcObject = stream
      cln.muted = true
      cln.play();
      document.getElementById("large_video").appendChild(cln);


    })
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })

    videoGrid.append(video.parentNode)
    Dish()

  }


//screenshare 
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
    if (screen != null) { screen.parentNode.remove(); Dish() }
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
//messaging



const openChatBox = document.getElementById("chat")
const ChatBox = document.getElementById("chatbox")
ChatBox.style.display = "none";
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

    if (ChatBox.style.display == "none") {
      var printte = document.getElementById("body");

      var printno = '<div class="receive" id = "messagePopup"style = "position:absolute;right:calc(50% - 10rem);">' + '<div class="receive1" >' + '<div class="receiveMessage">' + '<p class="name" >' + text.NAME + '</p>' + '<p class="message">' + text.messagE + '</p>' + '</div>' + '<span class="time">' + currentdate.getHours() + ':' + currentdate.getMinutes() + '</span>' + '</div>' + '</div>';
      printte.insertAdjacentHTML('beforeend', printno);
      setTimeout(function () { document.getElementById("messagePopup").remove() }, 3000);

    }
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

///end messaging

///cam mic handraise share endcall

const mic = document.getElementById('mute')
const endCall = document.getElementById('EndCall')
const camera = document.getElementById('video')

camera.onclick = function () {

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

      conn.peerConnection.close();
      if (conn.close)
        conn.close();
    });
    socket.emit('disconnect');
  }
  myVideo.pause();
  myVideo.src = "";
  localStream.getTracks()[0].stop();
  localStream.getTracks()[1].stop();
  window.location.href = `/chat/${ROOM_ID}`
}
//share

const openmodal = document.getElementById("show_room")
const closemodal = document.getElementById("close_room")
const room_id = document.getElementById("room_id")
openmodal.onclick = () => {
  room_id.style.display = "flex";

}

closemodal.onclick = () => {
  room_id.style.display = "none";

}

//hand raise
const hand = document.getElementById("handRaise")
const handSvg = document.getElementById("hr")

hand.onclick = function () {

  if (handSvg.style.fill == "rgb(255, 218, 54)") {

    myVideo.style.border = "0px "
    myVideo.style.padding = "0px "
    handSvg.style.fill = "whitesmoke"
    socket.emit('handRaise', {
      mess: "off",
      roomid: "hr" + ROOM_ID,
      id: mypeerid
    })

  }
  else {
    myVideo.style.border = "3px solid #03dac6"
    myVideo.style.padding = "3px "

    handSvg.style.fill = "#ffda36"
    socket.emit('handRaise', {
      mess: "on",
      roomid: "hr" + ROOM_ID,
      id: mypeerid
    })

  }




}

socket.on("hr" + ROOM_ID, text => {

  if (text.userId != mypeerid) {
    if (text.messagE == "on") {

      document.getElementById(text.userId).style.border = "3px solid #ffda36"
      document.getElementById(text.userId).style.padding = "3px "

    }

    else {
      document.getElementById(text.userId).style.border = "0px"
      document.getElementById(text.userId).style.padding = "0px "

    }
  }

})


//cam mic hangup




//video grid

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

  }
}

//full screen video
document.getElementById("large_video").addEventListener("click", () => {
  document.getElementById("large_video").innerHTML = '';
  document.getElementById("large_video").style.display = "none"
})

//copy to clipboard
function CopyToClipboard() {

  var elem = document.createElement("textarea");
  document.body.appendChild(elem);
  elem.value = ROOM_ID;
  elem.select();
  document.execCommand("copy");
  document.body.removeChild(elem);
}
