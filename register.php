<?php
// Łączenie z bazą danych
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "aplikacja_finansowa_praca_inzynierska";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Przetwarzanie danych formularza

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $name = $_POST['name'];
    $surname = $_POST['surname'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT); // Hashowanie hasła

    $sql = "INSERT INTO users (email, name, surname, password) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $email, $name, $surname, $password);
    $stmt->execute();
    ///ssss to string, i int, f float, d double


    // sprawdzanie czy odpalenie php wplynelo na jakis wiersz, przy insercie to czy dodalo cos do bazy
    if ($stmt->affected_rows > 0) {
        echo "Rejestracja przebiegła pomyślnie.";
    } else {
        echo "Błąd: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
