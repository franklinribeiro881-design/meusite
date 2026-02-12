import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
    }
}

// FUNÇÃO PARA DELETAR MENSAGEM
window.deletarPost = async function(id) {
    if (confirm("Deseja mesmo apagar essa mensagem?")) {
        await deleteDoc(doc(db, "posts", id));
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
        snapshot.forEach((docSnap) => {
            const post = docSnap.data();
            const id = docSnap.id;
            const dataFormatada = post.data ? new Date(post.data.seconds * 1000).toLocaleString('pt-BR') : "Agora";
            
            // Só mostra o botão de excluir se o usuário logado for o autor
            const botaoExcluir = auth.currentUser.email === post.autor 
                ? `<button onclick="deletarPost('${id}')" style="background:none; color:red; width:auto; padding:5px; font-size:12px; margin-top:5px; border:1px solid red;">🗑️ Apagar</button>` 
                : "";

            lista.innerHTML += `
                <div class="post-item">
                    <strong>${post.autor}</strong>
                    <p>${post.texto}</p>
                    <small style="color: #888; font-size: 10px;">${dataFormatada}</small>
                    ${botaoExcluir}
                </div>
            `;
        });
    });
}

window.fazerLogout = () => signOut(auth);
