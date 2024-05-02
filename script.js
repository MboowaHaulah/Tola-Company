document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('message').innerText = 'Registration successful!';
        } else {
            document.getElementById('message').innerText = data.message;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('message').innerText = 'An error occurred. Please try again.';
    }
});

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            window.location.href = '/welcome';
        } else {
            document.getElementById('loginMessage').innerText = data.message;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loginMessage').innerText = 'An error occurred. Please try again.';
    }
});
