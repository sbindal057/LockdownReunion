const socket = io('/')

window.addEventListener("DOMContentLoaded", () => {
  const firebaseConfig = {
    apiKey: "AIzaSyC1uz2XvnZYW3OHL7aneH-ZLKgnG0iRWjI",
    authDomain: "videochat-shweta.firebaseapp.com",
    databaseURL: "https://videochat-shweta-default-rtdb.firebaseio.com",
    projectId: "videochat-shweta",
    storageBucket: "videochat-shweta.appspot.com",
    messagingSenderId: "252477914872",
    appId: "1:252477914872:web:23c0ee6f159eb45976c50d",
    measurementId: "G-6EYDS5R6H8"
  };

  firebase.initializeApp(firebaseConfig);

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

  document
    .getElementById("answerButton")
    .addEventListener("click", (event) => {
      const login = document.getElementById("name").value;
      const password = document.getElementById("callInput").value;

      firebase
        .auth()
        .signInWithEmailAndPassword(login, password)
        .then(({ user }) => {
          return user.getIdToken().then((idToken) => {
            return fetch("/sessionLogin", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "CSRF-Token": Cookies.get("XSRF-TOKEN"),
              },
              body: JSON.stringify({ idToken }),
            });
          });
        })
               
        .then(() => {
          return firebase.auth().signOut();
        })
        .then(() => {
          window.location.assign("/profile");
        })
        .catch((error)=>{
          alert(error.message);
        }

        )
        
        ;
        
      return false;
      
    });

 


    document
    .getElementById("google_signin")
    .addEventListener('click', (event) => {
  
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.
      auth().
      signInWithPopup(provider)
      .then(({ user }) => {
        return user.getIdToken().then((idToken) => {
          return fetch("/sessionLogin", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "CSRF-Token": Cookies.get("XSRF-TOKEN"),
            },
            body: JSON.stringify({ idToken }),
          });
        });
      })
      .then(() => {
        return firebase.auth().signOut();
      })
      .then(() => {
        window.location.assign("/profile");
      });
      

  });

  
  document
  .getElementById("ms_signin")
  .addEventListener('click', (event) => {
  
  const provider =  new firebase.auth.OAuthProvider('microsoft.com');
  
  firebase.
    auth().
    signInWithPopup(provider)
    .then(({ user }) => {
      return user.getIdToken().then((idToken) => {
        return fetch("/sessionLogin", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "CSRF-Token": Cookies.get("XSRF-TOKEN"),
          },
          body: JSON.stringify({ idToken }),
        });
      });
    })
    .then(() => {
      return firebase.auth().signOut();
    })
    .then(() => {
      window.location.assign("/profile");
    });

});
  const github_signin = document.getElementById("github_signin");


  github_signin.addEventListener('click', () => {
    const provider = new firebase.auth.GithubAuthProvider();
    firebase.
      auth().
      signInWithPopup(provider)
      .then(({ user }) => {
        return user.getIdToken().then((idToken) => {
          return fetch("/sessionLogin", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "CSRF-Token": Cookies.get("XSRF-TOKEN"),
            },
            body: JSON.stringify({ idToken }),
          });
        });
      })
      .then(() => {
        return firebase.auth().signOut();
      })
      .then(() => {
        window.location.assign("/profile");
      });

  });

})
