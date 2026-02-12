import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
            curtidas: 0,
            data: new Date()
        });
        document.getElementById('post-text').value = "";
    }
}

window.curtirPost = async function(id) {
    const postRef = doc(db, "posts", id);
    await updateDoc(postRef, { curtidas: increment(1) });
}

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
            const curtidas = post.curtidas || 0;
            const dataFormatada = post.data ? new Date(post.data.seconds * 1000).toLocaleString('pt-BR') : "Agora";
            
            const botaoExcluir = auth.currentUser && auth.currentUser.email === post.autor 
                ? `<button onclick="deletarPost('${id}')" style="background:none; color:red; border:1px solid red; padding:4px 8px; border-radius:5px; cursor:pointer; font-size:12px; margin-left:10px;">🗑️ Apagar</button>` 
                : "";

            lista.innerHTML += `
                <div class="post-item" style="margin-bottom:15px; padding:15px; border-radius:15px; background:#f8f9fa; border-left:5px solid #1877f2;">
                    <strong style="display:block; color:#1877f2;">${post.autor}</strong>
                    <p style="margin:10px 0;">${post.texto}</p>
                    <div style="display:flex; align-items:center;">
                        <button onclick="curtirPost('${id}')" style="background:#e7f3ff; color:#1877f2; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; font-weight:bold;">❤️ ${curtidas}</button>
                        ${botaoExcluir}
                    </div>
                    <small style="color:#888; display:block; margin-top:10px; font-size:10px;">${dataFormatada}</small>
                </div>
            `;
        });
    });
}

window.fazerLogout = () => signOut(auth);
