<?php
session_start();
header('Content-Type: application/json');
include 'db.php';

$name = $_POST['name'];
$amount = $_POST['amount'];
$category = $_POST['category'];
$date = $_POST['date'];
$user_id = $_SESSION['user_id'];
$fee_id = isset($_POST['fee_id']) ? $_POST['fee_id'] : null;
$goal_id = isset($_POST['goal_id']) ? $_POST['goal_id'] : null;

$sql = "INSERT INTO transactions (name, amount, category, date, user_id, fee_id, goal_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sdssiii", $name, $amount, $category, $date, $user_id, $fee_id, $goal_id);

if ($stmt->execute()) {
    $transaction_id = $stmt->insert_id;
    echo json_encode(['success' => true, 'id' => $transaction_id, 'availableMoney' => getAvailableMoney($conn, $user_id)]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}

$stmt->close();
$conn->close();

function getAvailableMoney($conn, $user_id) {
    $sql = "SELECT SUM(amount) as total FROM transactions WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    return $result['total'];
}
?>