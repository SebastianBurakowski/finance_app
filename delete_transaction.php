<?php
session_start();
header('Content-Type: application/json');
include 'db.php';



$transaction_id = $_POST['transaction_id'];
$fee_id = isset($_POST['fee_id']) ? $_POST['fee_id'] : null;
$goal_id = isset($_POST['goal_id']) ? $_POST['goal_id'] : null;
$user_id = $_SESSION['user_id'];

$response = array();

// Sprawdź, czy transakcja istnieje
$check_query = "SELECT amount FROM transactions WHERE id = ? AND user_id = ?";
$check_stmt = $conn->prepare($check_query);
if (!$check_stmt) {
    error_log("Error preparing check statement: " . $conn->error);
    echo json_encode(['success' => false, 'error' => $conn->error]);
    exit;
}
$check_stmt->bind_param("ii", $transaction_id, $user_id);
$check_stmt->execute();
$check_result = $check_stmt->get_result();
$transaction = $check_result->fetch_assoc();


$amount_paid = $transaction['amount'];
$check_stmt->close();

// Usuń transakcję
$sql = "DELETE FROM transactions WHERE id = ? AND user_id = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    error_log("Error preparing delete statement: " . $conn->error);
    echo json_encode(['success' => false, 'error' => $conn->error]);
    exit;
}
$stmt->bind_param("ii", $transaction_id, $user_id);

if ($stmt->execute()) {
    if ($fee_id) {
      
    }

    if ($goal_id) {
        // Zaktualizuj cel
        $sql_update = "UPDATE goals SET paid = paid - ? WHERE id = ? AND user_id = ?";
        $update_stmt = $conn->prepare($sql_update);
        if (!$update_stmt) {
            error_log("Error preparing update statement: " . $conn->error);
            echo json_encode(['success' => false, 'error' => $conn->error]);
            exit;
        }
        $update_stmt->bind_param("dii", $amount_paid, $goal_id, $user_id);
        if (!$update_stmt->execute()) {
            error_log("Error updating goal: " . $update_stmt->error);
        }
        $update_stmt->close();
    }

    $response['success'] = true;
    $response['availableMoney'] = getAvailableMoney($conn, $user_id);
} else {
    $response['success'] = false;
    $response['error'] = $stmt->error;
    error_log("Error deleting transaction: " . $stmt->error);
}

$stmt->close();
$conn->close();

echo json_encode($response);

function getAvailableMoney($conn, $user_id) {
    $sql = "SELECT SUM(amount) as total FROM transactions WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        error_log("Error preparing available money statement: " . $conn->error);
        echo json_encode(['success' => false, 'error' => $conn->error]);
        exit;
    }
    $stmt->bind_param("i", $user_id);
    if (!$stmt->execute()) {
        error_log("Error fetching available money: " . $stmt->error);
    }
    $result = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    return $result['total'];
}
?>
