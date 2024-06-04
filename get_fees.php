<?php
session_start();
header('Content-Type: application/json');
include 'db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode([]);
    exit;
}

$user_id = $_SESSION['user_id'];

$sql = "SELECT id, name, amount FROM fees WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$fees = [];
while ($row = $result->fetch_assoc()) {
    $fees[] = $row;
}

echo json_encode($fees);

$stmt->close();
$conn->close();
?>
