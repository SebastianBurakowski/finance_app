<?php
session_start();
include 'db.php';

$user_id = $_SESSION['user_id'];
$new_email = $_POST['email'];

// Sprawdź, czy email jest już używany
$email_check_sql = "SELECT id FROM users WHERE email = ?";
$stmt = $conn->prepare($email_check_sql);
$stmt->bind_param("s", $new_email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Ten adres email jest już używany.']);
    $stmt->close();
    $conn->close();
    exit();
}
$stmt->close();

// Aktualizacja emaila użytkownika
$sql = "UPDATE users SET email = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $new_email, $user_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Adres email został zaktualizowany.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Wystąpił błąd podczas aktualizacji adresu email.']);
}

$stmt->close();
$conn->close();
?>
