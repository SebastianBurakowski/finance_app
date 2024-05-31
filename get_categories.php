<?php
session_start();
include 'db.php';

$user_id = $_SESSION['user_id'];
$sql = "SELECT id, name, type FROM categories WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$categories = [];
while ($row = $result->fetch_assoc()) {
    $categories[] = $row;
}

echo json_encode($categories);

$stmt->close();
$conn->close();
?>
