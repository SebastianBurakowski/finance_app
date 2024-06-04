<?php
session_start();
header('Content-Type: application/json');
include 'db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Nie jesteś zalogowany.']);
    exit;
}

$user_id = $_SESSION['user_id'];
$fee_id = $_POST['fee_id'];

$sql = "DELETE FROM fees WHERE id = ? AND user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $fee_id, $user_id);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Błąd podczas usuwania opłaty.']);
}

$stmt->close();
$conn->close();
?>
