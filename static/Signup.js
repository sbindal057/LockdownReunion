
var firebaseConfig = {
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
    .getElementById("signup")
    .addEventListener("click", () => {

        const login = document.getElementById("name");
        const password = document.getElementById("callInput");

        firebase
            .auth()
            .createUserWithEmailAndPassword(login, password)
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
                window.location.assign("/");
            })
            .catch((error) => {
                alert(error.message);
            }

            )
            ;
        return false;
    });