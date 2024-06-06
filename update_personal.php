<?php
session_start();
include 'db.php';

$user_id = $_SESSION['user_id'];
$new_name = $_POST['name'];
$new_surname = $_POST['surname'];

$sql = "UPDATE users SET name = ?, surname = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssi", $new_name, $new_surname, $user_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Dane zostały zaktualizowane.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Wystąpił błąd podczas aktualizacji danych.']);
}

$stmt->close();
$conn->close();
?>
