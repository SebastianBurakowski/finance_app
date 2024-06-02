<?php
session_start();
include 'db.php';

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
    $name = $_POST['name'];
    $amount = $_POST['amount'];
    $date = $_POST['date'];

    $sql = "INSERT INTO goals (user_id, name, amount, date) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isds", $user_id, $name, $amount, $date);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "id" => $stmt->insert_id]);
    } else {
        echo json_encode(["success" => false, "error" => "Błąd podczas dodawania celu."]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "error" => "Nieprawidłowe żądanie."]);
}

$conn->close();
?>
