document.addEventListener('DOMContentLoaded', function () {
    console.log("Script.js loaded");

    fetch('user_info.php')
        .then(response => response.json())
        .then(data => {
            if (data.user_name) {
                document.getElementById('nav-welcome').textContent = `Witaj, ${data.user_name}!`;
            } else {
                console.error('Błąd podczas pobierania danych użytkownika:', data.error);
            }
        })
        .catch(error => console.error('Błąd podczas pobierania danych użytkownika:', error));
});
