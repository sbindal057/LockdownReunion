<center> 

# **Teams Clone Project** <br><br> Microsoft Engage 2021

 



</center>




## About

All-in-one Web **App for video conferencing**, **Podcast** and **chatting**.
Used agile methodology to execute whole project. 


## How to use?

 - Go on website https://blooming-tor-03916.herokuapp.com/ and either create your own new account by signing up or direct login with Google, GitHub or Microsoft.
 - After that profile page appear from where you can create a podcast or meeting room, or join a existing room. 

## Chat Room

 - After clicking on create or join room the website will be redirected
   to chat room.
   
 - In chat room people can chat before starting the meet or can send and receive message from meeting room
 - Here the can also test their video. And can turn of their audio or video stream before entering to room
 - A share button is also present to share the room id.

   

## Meeting Room

 - On clicking on join room in chat room, the page will redirect to meeting room.
 - In meeting room people can do video conferencing with the option to mute or turn of their own video .
 - The name of all the meeting members are their in the bottom right of their video
 - with that they can also send or receive message by clicking on the chat button at top right corner and get a popup for received message if chat box is not open.
 - Employees can also raise their hand in between the meet and share their screen.
 - To zoom in a particular video they can click on it   and that video will come over the whole screen.
 - to leave the meet press end call button.
 After clicking on end call button the page will redirect to chat room where everyone can chat after the meet also.

## Podcast

 - **Create Podcast**
 By clicking on create-podcast the page will redirect to a podcast with random Id starting with podcast.
 In podcast room one can mute, turn of video, share screen



 
 - **Join Podcast**
  To join podcast add the room id to room id input place in profile page and click join room
	 After joining the room you can see the video or screen of the host.

 - In podcast anyone can send or receive message from chat box by clicking chat box button
	



# Agile methodology
Agile software development refers to a group of software development methodologies based on iterative development, where requirements and solutions evolve through collaboration between self-organizing cross-functional teams.


**MY SPRINTS**

  
 1. **Minimum Criterion**
		 
    To add video call feature.
	1. Started exploring different web technology to use.
	2. Decided to use WebRTC  peer to peer connection.
	3. Went through it's documentation and started implementing it.<br><br>
	

 2.  **Added multiple people in one call feature**
       1. Used WebSocket for it.
       2. Created the profile page to give choice of creating new room or joining an existing one.<br><br>


		
		
**Completed these 2 in 1st week.**<br>
	**For next week I completed following feature**


3. **Worked on its UI**<br>
		Worked on its frontend and video grid to make it presentable. <br><br>
4. **Deployed it on Heroku**<br>
		Deployed it on Heroku and tested it for connection on different network.<br><br>
5. **Added basic video, camera, share and end call button.**<br><br>
6. **Added Screen Share feature**  <br>
		1. Added screen share feature using Peerjs and "navigator.mediaDevices.getDisplayMedia".<br>
		2. This also gave me the idea to add enlarge one video block feature.<br><br>
		**For 3rd week**<br><br>
7. **Added authentication using firebase.** <br>
		1. Added basic login with Email ID & Password.<br>
		2. Use oauth2.0 to add login through Google, GitHub and Microsoft.<br>
		3. Designed and implemented frontend for it.<br><br>
	

**Started working on chat feature**
**In the 4th week**

8.  When the **adapt feature** came I almost completed my chat feature for meeting room. After that I added it to before and after meet, and worked un its UI.
9. In the end I added the **Podcast** feature. 
In between this process I always used to commit my changes in my repository to keep the track of previous work and test it side by side.

Therefore, by proper planning I am able to complete my project in 1 month.

## Developer

For local development:

 1. Clone the repository to your system.
 2. Install all the libraries used for it by running `npm install`
 3. Start the server by `npm run startt`
 4. In another powershell run peer server by  `npm run peer`
 5. now go to the http://localhost:3000/


 To deploy it on heroku:
 
 


		

		



		 
 

 



 
