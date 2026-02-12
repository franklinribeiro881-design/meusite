import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
const db = getFirestore(app);

window.fazerLogin = function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (!email || !password) { alert("Preencha e-mail e senha!"); return; }
    signInWithEmailAndPassword(auth, email, password)
      .catch(() => createUserWithEmailAndPassword(auth, email, password))
      .catch((err) => alert("Erro: " + err.message));
}

window.postarMensagem = async function() {
    const texto = document.getElementById('post-text').value;
    const user = auth.currentUser;
    if (texto && user) {
        await addDoc(collection(db, "posts"), {
            texto: texto,
            autor: user.email,
            data: new Date()
        });
        document.getElementById('post-text').value = "";
    } else {
        alert("Escreva algo antes de postar!");
    }
}

onAuthStateChanged(auth, (user) => {
    const loginArea = document.getElementById('login-area');
    const userArea = document.getElementById('user-area');
    if (user) {
        loginArea.style.display = 'none';
        userArea.style.display = 'block';
        document.getElementById('user-email').innerText = user.email;
        carregarFeed();
    } else {
        loginArea.style.display = 'block';
        userArea.style.display = 'none';
    }
});

function carregarFeed() {
    const q = query(collection(db, "posts"), orderBy("data", "desc"));
    onSnapshot(q, (snapshot) => {
        const lista = document.getElementById('mensagens-lista');
        lista.innerHTML = "";
        snapshot.forEach((doc) => {
            const post = doc.data();
            lista.innerHTML += `
                <div style="background: white; padding: 15px; border-radius: 10px; margin-bottom: 15px; border-left: 6px solid #1877f2; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <strong style="color: #1877f2; display: block; margin-bottom: 5px;">${post.autor}</strong>
                    <p style="margin: 0; color: #333; font-size: 16px;">${post.texto}</p>
                </div>
            `;
        });
    });
}

window.fazerLogout = () => signOut(auth);
