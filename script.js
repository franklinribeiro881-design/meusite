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
    const nome = document.getElementById('nome-usuario').value;

    if (!email || !password || !nome) { 
        alert("Preencha Nome, E-mail e Senha para continuar!"); 
        return; 
    }

    localStorage.setItem('meuNome', nome);

    signInWithEmailAndPassword(auth, email, password)
      .catch(() => createUserWithEmailAndPassword(auth, email, password))
      .catch((err) => alert("Erro: " + err.message));
}

window.postarMensagem = async function() {
    const texto = document.getElementById('post-text').value;
    const user = auth.currentUser;
    const nomeSalvo = localStorage.getItem('meuNome') || user.email;

    if (texto && user) {
        await addDoc(collection(db, "posts"), {
            texto: texto,
            autorNome: nomeSalvo,
            autorEmail: user.email,
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
        document.getElementById('user-display-name').innerText = localStorage.getItem('meuNome') || user.email;
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
            
            const botaoExcluir = auth.currentUser && auth.currentUser.email === post.autorEmail 
                ? `<button onclick="deletarPost('${id}')" style="background:none; color:#ff4b4b; border:1px solid #ff4b4b; padding:4px 8px; border-radius:5px; cursor:pointer; font-size:11px; margin-left:10px;">🗑️ Apagar</button>` 
                : "";

            lista.innerHTML += `
                <div class="post-item" style="margin-bottom:15px; padding:15px; border-radius:15px; background:#f8f9fa; border-left:5px solid #1877f2; text-align:left;">
                    <strong style="display:block; color:#1877f2; font-size:14px;">${post.autorNome || post.autorEmail}</strong>
                    <p style="margin:8px 0; color:#333;">${post.texto}</p>
                    <div style="display:flex; align-items:center; margin-top:10px;">
                        <button onclick="curtirPost('${id}')" style="background:#e7f3ff; color:#1877f2; border:none; padding:5px 12px; border-radius:20px; cursor:pointer; font-weight:bold; font-size:12px;">❤️ ${curtidas}</button>
                        ${botaoExcluir}
                    </div>
                    <small style="color:#aaa; display:block; margin-top:8px; font-size:9px;">${dataFormatada}</small>
                </div>
            `;
        });
    });
}

window.fazerLogout = () => {
    localStorage.removeItem('meuNome');
    signOut(auth);
};
