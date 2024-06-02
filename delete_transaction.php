<?php
session_start();
header('Content-Type: application/json');
include 'db.php';

$stmt = null; // Inicjalizacja zmiennej $stmt

try {
    if (!isset($_SESSION['user_id'])) {
        throw new Exception('User not logged in');
    }

    $user_id = $_SESSION['user_id'];
    $transaction_id = isset($_POST['transaction_id']) ? (int)$_POST['transaction_id'] : 0;
    $goal_id = isset($_POST['goal_id']) ? (int)$_POST['goal_id'] : null;

    if ($transaction_id === 0) {
        throw new Exception('Invalid transaction ID');
    }

    // Debugging: Logowanie wartości
    error_log("User ID: $user_id, Transaction ID: $transaction_id, Goal ID: $goal_id");

    // Pobierz transakcję przed usunięciem
    $sql = "SELECT amount FROM transactions WHERE id = ? AND user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $transaction_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $transaction = $result->fetch_assoc();

    if (!$transaction) {
        throw new Exception('Transaction not found.');
    }

    // Usuń transakcję z bazy danych
    $sql = "DELETE FROM transactions WHERE id = ? AND user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $transaction_id, $user_id);
    $stmt->execute();

    // Jeśli transakcja była związana z celem, zaktualizuj kwotę wpłaconą na cel
    $amount = $transaction['amount'];
    if ($goal_id) {
        $sql = "UPDATE goals SET paid = paid - ? WHERE id = ? AND user_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("dii", $amount, $goal_id, $user_id);
        $stmt->execute();
    }

    // Pobranie wszystkich transakcji użytkownika w celu obliczenia dostępnych środków
    $sql = "SELECT SUM(amount) as total FROM transactions WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $available_money = $row['total'];

    $response = array('success' => true, 'availableMoney' => $available_money);
    echo json_encode($response);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
} finally {
    if ($stmt) {
        $stmt->close();
    }
    if ($conn) {
        $conn->close();
    }
}
?>



