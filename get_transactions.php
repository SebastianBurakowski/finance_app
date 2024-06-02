<?php
session_start();
header('Content-Type: application/json');
include 'db.php';

$user_id = $_SESSION['user_id'];

// Pobierz transakcje użytkownika
$sql = "SELECT id, name, amount, category, date FROM transactions WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$transactions = [];
while ($row = $result->fetch_assoc()) {
    $transactions[] = $row;
}

// Oblicz dostępne środki
$sql = "SELECT SUM(amount) as total FROM transactions WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$available_money = $row['total'] !== null ? $row['total'] : 0; // Ustawienie na 0 jeśli wynik jest null

$response = array('transactions' => $transactions, 'availableMoney' => $available_money);
echo json_encode($response);

$stmt->close();
$conn->close();
?>
