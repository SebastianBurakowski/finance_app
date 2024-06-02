<?php
session_start();
header('Content-Type: application/json');
include 'db.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$user_id = $_SESSION['user_id'];
$goal_id = $_POST['goal_id'];
$amount = $_POST['amount'];
$date = $_POST['date'];

// Aktualizacja zasilenia celu
$sql = "UPDATE goals SET paid = paid + ? WHERE id = ? AND user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("dii", $amount, $goal_id, $user_id);
$stmt->execute();

// Dodanie nowej transakcji do tabeli transactions jako wydatek
$sql = "INSERT INTO transactions (user_id, name, amount, category, date) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$category = "expense";
$name = "Zasilenie celu";
$amountNegative = -$amount; // Traktuj zasilenie celu jako wydatek
$stmt->bind_param("isdss", $user_id, $name, $amountNegative, $category, $date);
$stmt->execute();

$transaction_id = $stmt->insert_id;

// Pobranie wszystkich transakcji użytkownika w celu obliczenia dostępnych środków
$sql = "SELECT SUM(amount) as total FROM transactions WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$available_money = $row['total'];

$response = array('success' => true, 'id' => $transaction_id, 'availableMoney' => $available_money);
echo json_encode($response);

$stmt->close();
$conn->close();
?>
