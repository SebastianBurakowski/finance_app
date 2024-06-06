<?php
session_start();
header('Content-Type: application/json');
include 'db.php';

//błedy
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$name = $_POST['name'];
$amount = $_POST['amount'];
$user_id = $_SESSION['user_id'];

$sql = "INSERT INTO fees (name, amount, user_id) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sdi", $name, $amount, $user_id);

if ($stmt->execute()) {
    $fee_id = $stmt->insert_id;
    echo json_encode(['success' => true, 'id' => $fee_id]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>

