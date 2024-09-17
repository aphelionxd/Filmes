const API_BASE_URL = 'http://localhost:3000';

// Registro de usuário
document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nickname = document.getElementById('nickname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const profileImage = document.getElementById('profileImage').files[0];

    const formData = new FormData();
    formData.append('nickname', nickname);
    formData.append('email', email);
    formData.append('password', password);
    if (profileImage) formData.append('profile_image', profileImage);

    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        document.getElementById('message').innerText = data.message;

        if (data.success) {
            document.getElementById('nickname').value = '';
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            document.getElementById('profileImage').value = '';
            document.getElementById('loginSection').style.display = 'block';
            document.getElementById('registerSection').style.display = 'none';
        }
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('message').innerText = 'Erro ao registrar o usuário.';
    }
});

// Login de usuário
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nickname = document.getElementById('loginNickname').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nickname, password })
        });
        const data = await response.json();
        document.getElementById('message').innerText = data.message;

        if (data.success) {
            document.getElementById('loginNickname').value = '';
            document.getElementById('loginPassword').value = '';
            window.location.href = `chat.html?nickname=${encodeURIComponent(nickname)}`;
        }
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('message').innerText = 'Erro ao fazer login.';
    }
});
