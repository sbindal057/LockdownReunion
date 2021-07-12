
const hri = window.humanReadableIds;
let room_ID = null;
const socket = io('/')
const JoinRoom = (e) => {
  room_ID = String(document.getElementById('callInput').value);
  let nameInput = String(document.getElementById("name").value);
  if (room_ID == "" && nameInput == "") alert("Please enter room id and name");
  else if (room_ID == "") alert("Please enter room id ");
  else if (nameInput == "") alert("Please enter name");
  else if(room_ID.substring(0,7)=='podcast')
  {
    window.location.href = `/podcast/${room_ID}`
    localStorage.setItem('names', nameInput);
    sessionStorage.setItem('Podcast','join')
  }
  else {
    // console.log(room_ID);
    window.location.href = `/chat/${room_ID}`
    localStorage.setItem('names', nameInput);
  }
}
const CreateRoom = (e) => {
  let nameInput = String(document.getElementById("name").value);
  if (nameInput == "") alert("Please enter name");
  else {
    localStorage.setItem('names', nameInput);

    room_ID = hri.random()
    sessionStorage.setItem('room_ID', room_ID)
    let array = []
    sessionStorage.setItem('messageArray',JSON.stringify(array))

    window.location.href = `/chat/${room_ID}`
  }

}
const CreatePodcast = (e) => {
  let nameInput = String(document.getElementById("name").value);
  if (nameInput == "") alert("Please enter name");
  else {
    localStorage.setItem('names', nameInput);
    sessionStorage.setItem('Podcast','create')
    room_ID = 'podcast' +hri.random();
    sessionStorage.setItem('room_ID', room_ID)
    let array = []
    sessionStorage.setItem('messageArray',JSON.stringify(array))

    window.location.href = `/podcast/${room_ID}`
  }

}