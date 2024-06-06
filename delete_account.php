<?php
session_start();
header('Content-Type: application/json');
include 'db.php';

$user_id = $_SESSION['user_id'];

try {
    // Usuwanie transakcji powiązanych z użytkownikiem
    $stmt = $conn->prepare("DELETE FROM transactions WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $stmt->close();

    // Usuwanie celów powiązanych z użytkownikiem
    $stmt = $conn->prepare("DELETE FROM goals WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $stmt->close();

    // Usuwanie opłat powiązanych z użytkownikiem
    $stmt = $conn->prepare("DELETE FROM fees WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $stmt->close();

    // Usuwanie konta użytkownika
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $stmt->close();

    // Zniszczenie sesji
    session_destroy();

    echo json_encode(['success' => true, 'message' => 'Konto zostało pomyślnie usunięte.']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Wystąpił błąd podczas usuwania konta.']);
}

$conn->close();
?>
