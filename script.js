import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBX6q4bTflyR0kva3IYgih2G3QEZWx3Smw",
  authDomain: "red-social-be117.firebaseapp.com",
  projectId: "red-social-be117",
  storageBucket: "red-social-be117.firebasestorage.app",
  messagingSenderId: "746982738864",
  appId: "1:746982738864:web:645bf1910e04fcf9506475",
  measurementId: "G-28N3LXTQ1S"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.fazerLogin = function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (!email || !password) { alert("Preencha e-mail e senha!"); return; }

    signInWithEmailAndPassword(auth, email, password)
      .catch(() => createUserWithEmailAndPassword(auth, email, password))
      .then(() => console.log("Usuário logado!"))
      .catch((err) => alert("Erro: " + err.message));
}

onAuthStateChanged(auth, (user) => {
    const loginArea = document.getElementById('login-area');
    const userArea = document.getElementById('user-area');
    if (user) {
        loginArea.style.display = 'none';
        userArea.style.display = 'block';
        document.getElementById('user-email').innerText = user.email;
    } else {
        loginArea.style.display = 'block';
        userArea.style.display = 'none';
    }
});

window.fazerLogout = () => signOut(auth);
