<?php
session_start();
header('Content-Type: application/json');
include 'db.php';

$user_id = $_SESSION['user_id'];
$id = $_POST['id'];
$spent = $_POST['spent'];

$sql = "UPDATE budgets SET spent = ? WHERE id = ? AND user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("dii", $spent, $id, $user_id);

if ($stmt->execute()) {
    $response = ['success' => true];
} else {
    $response = ['success' => false, 'error' => $stmt->error];
}

$stmt->close();
$conn->close();

echo json_encode($response);
?>
