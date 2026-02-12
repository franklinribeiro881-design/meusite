/* Estilo Moderno - Rede Social do Franklin */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    color: #333;
}

#app {
    background: #ffffff;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 15px 35px rgba(0,0,0,0.2);
    width: 90%;
    max-width: 450px;
    text-align: center;
}

h1 {
    color: #4a4a4a;
    font-size: 24px;
    margin-bottom: 25px;
}

input, textarea {
    width: 100%;
    padding: 12px;
    margin: 10px 0;
    border: 2px solid #eee;
    border-radius: 12px;
    box-sizing: border-box;
    outline: none;
    transition: 0.3s;
}

input:focus, textarea:focus {
    border-color: #667eea;
}

button {
    width: 100%;
    padding: 14px;
    background: #1877f2;
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: bold;
    cursor: pointer;
    font-size: 16px;
    transition: 0.3s;
    margin-top: 10px;
}

button:hover {
    background: #145dbf;
    transform: translateY(-2px);
}

/* Estilo dos Balões de Mensagem */
#mensagens-lista div {
    background: #f0f2f5;
    padding: 15px;
    border-radius: 18px;
    margin-bottom: 15px;
    border-left: 6px solid #667eea;
    text-align: left;
    animation: fadeIn 0.5s ease;
}

#mensagens-lista strong {
    color: #764ba2;
    font-size: 13px;
    display: block;
    margin-bottom: 5px;
}

#mensagens-lista p {
    margin: 0;
    line-height: 1.5;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
