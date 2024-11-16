document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nume = document.getElementById('nume').value;
    const parola = document.getElementById('parola').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nume: nume, parola: parola }),
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('login-form').style.display = 'none';
            console.log(data.id);
            console.log(data.nume);
            console.log(data.parola);
        } else {
            alert('Autentificare eșuată: ' + data.message);
        }
    } catch (err) {
        console.error('Eroare la autentificare:', err);
        alert('A apărut o eroare. Încearcă din nou.');
    }
});