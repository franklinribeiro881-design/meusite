}

window.fazerLogout = () => {
    localStorage.removeItem('meuNome');
    signOut(auth);
};
