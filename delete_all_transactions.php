<?php
session_start();
include 'db.php';

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    $sql = "DELETE FROM transactions WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Błąd podczas usuwania transakcji."]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "error" => "Nieprawidłowe żądanie."]);
}

$conn->close();
?>
