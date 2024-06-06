<?php
session_start();
include 'db.php';

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    // Pobierz wszystkie transakcje powiązane z celami
    $sql = "SELECT goal_id, amount FROM transactions WHERE user_id = ? AND goal_id IS NOT NULL";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $goals = [];
    while ($row = $result->fetch_assoc()) {
        if (!isset($goals[$row['goal_id']])) {
            $goals[$row['goal_id']] = 0;
        }
        $goals[$row['goal_id']] += $row['amount'];
    }
    $stmt->close();

    // Usuń wszystkie transakcje użytkownika
    $sql = "DELETE FROM transactions WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        // Zaktualizuj kolumnę paid w tabeli goals
        foreach ($goals as $goal_id => $amount) {
            $sql = "UPDATE goals SET paid = paid + ? WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("di", $amount, $goal_id);
            $stmt->execute();
        }

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
