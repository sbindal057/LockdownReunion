<center> 

# **Lockdown Reunion** <br>  -- Video Calling & more -- <br><br> Microsoft Engage 2021
</center>

## 🎉 About the App

All-in-one Web App for **Video Conferencing**, **Podcast** and **Chatting**.

Used **Agile Methodology** to execute whole project. 

## How to use?
 - Go to https://lockdown-reunion.herokuapp.com/ 
 - Create your own new account by Signing up or one-click OAuth login with Google, GitHub or Microsoft.
 - The app would redirect to Profile page upon successful login, from where you can create a Podcast or Meeting Room, or Join an existing room. 
 
 P.S. You can also Create a custom Room ID by just writing it and clicking on Join Room.

## Chat Room
 - After clicking on "Create Room" or "Join Room", the website will be redirected to Chat lounge.
 - In Chat area, people can chat even before starting the meet. The chat is common across chat lounge and meeting room. 
 - Here you can also test Video, and can turn off their Audio or Video before entering to room.
 - You can easily share the Room ID using the Share Button present in the Video area.
 
 
 <center><img src="Screenshot (70).png" width="350" title="hover text"></center>

## Meeting Room
 - Upon clicking on Join Room in Chat lounge, the page will redirect to the Meeting room.
 - In Meeting room people can do Video Conferencing.
 - To preserve Privacy, there's also an option to mute the audio or turn off the video.
 - The name of all the Meeting members are shown in the bottom-right corner of their video.
 - One can also send or receive Messages by clicking on the Chat icon on the top-right corner, and get a toast for received messages if the chat box is in Closed state.
 - You can also raise hand in between the meet to gain attention of the participants.
 - There is also an option to share the screen, using which one can present a Tab, Window or Entire Screen with utmost ease and have a visual communication with the participants.
 - To Zoom in on a particular video stream like a person or the shared screens, you can click on it, and that video will cover the full Browser screen.
 - To leave the meet, press the End Call Button. After clicking on End Call Button you will be redirected to the Chat lounge, where everyone can chat even after the meet.

  <center><img src="Screenshot (72).png" width="350" title="hover text"></center>

## Podcast

 One of the unique features of this app is the ability to create a **Podcast/Streaming View** where only **One single person** will have the whole command over the meet.
 - **Creating a Podcast**<br>
 By clicking on **Create Podcast** the App will be redirected to a Podcast with Random ID starting with "podcast".<br>In podcast room also you can Mute, Turn off Video, and Share Screen.

 <center><img src="Screenshot (73).png" width="350" title="hover text"></center>

 - **Join Podcast**<br>
  To join podcast write the Room ID in profile page and click join room (just like any regular room).
  
  After joining the room you'll be able to see the Video of the host (Screen too, if it's being presented).

 - In podcast anyone can Send and Receive Messages from Chat box by clicking the Chat icon.

 <center><img src="Screenshot (75).png" width="350" title="hover text"></center>
	
# Agile Methodology
Agile software development refers to a group of software development methodologies based on iterative development, where requirements and solutions evolve through collaboration between self-organizing cross-functional teams.

**MY SPRINTS**
 
 1. **Minimum Criterion**
		 
    To add Video Call feature:
	1. Explored different Web technologies that can be used.
	2. Decided to go with WebRTC P2P connection due to extensive documentation and ease of usage.
	3. Researched about pre-existing solutions so as to avoid re-inventing the wheel.
	4. Found out that PeerJS implements and wraps WebRTC and more in a very simple interface.
	5. Went through its documentation and started implementing it.<br><br>
	

 2.  **Added multiple people in a single call feature**
       1. This feature was a breeze with PeerJS. I just had to do a few tweaks in Server side code and automatic Grid adjustments in UI.
       2. Also created the Profile Page to give choice of creating a New Room or Joining an existing one.<br><br>
		
**Completed these 2 in 1st week.**<br>

**For the next week I completed the following features**


3. **Worked on its UI**<br>
		Worked on its FrontEnd and Video Grid to make it visually appealing and usable by anyone. <br><br>
4. **Deployed it on Heroku**<br>
		***Should be extended*** <br>
		Deployed it on Heroku and tested it for connection on different network.
		Made a CI pipeline for automatic deployments to Heroku directly from GitHub.<br>
		For more info, check Developer's section at the end of this ReadMe.
		<br><br>
5. **Added  Video & Mic toggles, Share screen and End call buttons.**<br><br>


**For 3rd week**<br>

6. **Added Screen Share feature**  <br>
		1. Added Screen Share feature using PeerJS and WebRTC APIs (`navigator.mediaDevices.getDisplayMedia`).<br>
		2. This also gave me the idea to add enlarge one video tile feature.<br><br>

7. **Added authentication using firebase.** <br>
		1. Added native Login with Email ID & Password.<br>
		2. Used OAuth2.0 with Firebase to add login with Google, GitHub and Microsoft (Azure AD).<br>
		3. Designed and implemented Frontend for this view.<br><br>
	

**Started working on chat feature**
**In the 4th week**

8.  By the time  the ***adapt feature*** came I had almost completed my chat feature for meeting room. After that I added it to before and after meet, and worked on its UI.
9. In the end I added the **Podcast** feature. 

In between this process I always used to commit my changes in my repository to keep the track of previous work and test it side by side.

Therefore, by proper planning I was able to complete my project in a month.


## Developer's Guide
### For local development:
 1. Clone the repository on your machine.
 2. Install all the libraries used for it by running `npm install`.
 3. Start the server by `npm run startt`.
 4. In another terminal run peer server by  `npm run peer`.
 5. The app should be now listening on port 3000 and PeerJS on port 443. You can see the app by opening http://localhost:3000/ on your browser.


### To deploy on Heroku: 
 1. Create a new app.
 2. Push the code using Heroku CLI or connect the Heroku app to the GitHub repository containing this code (make a CI Pipeline).
 3. To enable WebSockets on Heroku, you need to enable http session affinity via  `heroku features:enable http-session-affinity -a {app-name}`
 4. Your WebApp must be up & running now.

 
### To set up Firebase authentication:

1. Login to https://firebase.google.com/ and go to console.
2. Create a Web App over there and go to Authentication.
3. Under Sign-in method enable different methods of authentication.
4. To get your Firebase config file go to `project settings -> general settings -> add your web app -> get the config file`. 

	**For OAuth2.0**

 	Get your Client ID and Secret from different platforms.
 
 	For Microsoft:
 	1. Go to "Azure Portal" and log in.
 	2. Search for Azure Active Directory and create an app.
 	3. Go to authentication -> add the redirect URL provided in Firebase and copy over the client ID and secret to Firebase console. 
	 
	 <br>

	For GitHub:

 	1. Go to `GitHub settings -> Developer's Settings -> OAuth apps`.
	2. Create a new app and get your client ID and secret.