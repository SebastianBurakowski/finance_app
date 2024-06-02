<?php
session_start();
header('Content-Type: application/json');
include 'db.php';

$user_id = $_SESSION['user_id'];
$name = $_POST['name'];
$amount = floatval($_POST['amount']);
$category = $_POST['category'];
$date = $_POST['date'];

$sql = "INSERT INTO transactions (user_id, name, amount, category, date) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("isdss", $user_id, $name, $amount, $category, $date);
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

