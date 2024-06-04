<?php
session_start();
header('Content-Type: application/json');
include 'db.php';

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
    $name = $_POST['name'];
    $amount = $_POST['amount'];

    $sql = "INSERT INTO fees (user_id, name, amount) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isd", $user_id, $name, $amount);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "id" => $stmt->insert_id]);
    } else {
        echo json_encode(["success" => false, "error" => "Błąd podczas dodawania opłaty."]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "error" => "Nieprawidłowe żądanie."]);
}

$conn->close();
?>
