<?php
session_start();
include 'db.php';

if (isset($_POST['goal_id']) && isset($_SESSION['user_id'])) {
    $goal_id = $_POST['goal_id'];
    $user_id = $_SESSION['user_id'];

    
    $sql = "DELETE FROM transactions WHERE goal_id = ? AND user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $goal_id, $user_id);
    $stmt->execute();
    $transactions_deleted = $stmt->affected_rows;
    $stmt->close();

    // Usuwanie celu
    $sql = "DELETE FROM goals WHERE id = ? AND user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $goal_id, $user_id);
    $stmt->execute();
    $goal_deleted = $stmt->affected_rows;
    $stmt->close();

    if ($goal_deleted > 0) {
        echo json_encode(["success" => true, "transactions_deleted" => $transactions_deleted]);
    } else {
        echo json_encode(["success" => false, "error" => "Błąd podczas usuwania celu."]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Nieprawidłowe żądanie."]);
}

$conn->close();
?>
