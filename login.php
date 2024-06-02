<?php
session_start(); 

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "aplikacja_finansowa_praca_inzynierska";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$email = $_POST['email'];
$password = $_POST['password'];

$sql = "SELECT id, name, password FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    if (password_verify($password, $row['password'])) {
        $_SESSION['user_id'] = $row['id']; // Zapisanie ID użytkownika w sesji
        $_SESSION['user_name'] = $row['name']; // Zapisanie imienia użytkownika w sesji
        echo "Logowanie pomyślne.";
    } else {
        echo "Nieprawidłowe hasło.";
    }
} else {
    echo "Nie znaleziono użytkownika z takim adresem e-mail.";
}
$stmt->close();
$conn->close();
?>
