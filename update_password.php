<?php
session_start();
include 'db.php';

$user_id = $_SESSION['user_id'];
$new_password = password_hash($_POST['password'], PASSWORD_DEFAULT);


$sql = "UPDATE users SET password = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $new_password, $user_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Hasło zostało zaktualizowane.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Wystąpił błąd podczas aktualizacji hasła.']);
}

$stmt->close();
$conn->close();
?>
