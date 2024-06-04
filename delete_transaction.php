<?php
session_start();
header('Content-Type: application/json');
include 'db.php';

$user_id = $_SESSION['user_id'];
$transaction_id = $_POST['transaction_id'];

// Pobierz transakcję przed usunięciem
$sql = "SELECT amount FROM transactions WHERE id = ? AND user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $transaction_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();
$transaction = $result->fetch_assoc();

// Usuń transakcję z bazy danych
$sql = "DELETE FROM transactions WHERE id = ? AND user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $transaction_id, $user_id);
$stmt->execute();

// Jeśli transakcja była związana z opłatą, zaktualizuj odpowiednio
$amount = $transaction['amount'];
$fee_id = isset($_POST['fee_id']) ? $_POST['fee_id'] : null;
if ($fee_id) {
    $sql = "UPDATE fees SET amount = amount + ? WHERE id = ? AND user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("dii", $amount, $fee_id, $user_id);
    $stmt->execute();
}

// Pobranie wszystkich transakcji użytkownika w celu obliczenia dostępnych środków
$sql = "SELECT SUM(amount) as total FROM transactions WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$available_money = $row['total'];

$response = array('success' => true, 'availableMoney' => $available_money);
echo json_encode($response);

$stmt->close();
$conn->close();
?>
