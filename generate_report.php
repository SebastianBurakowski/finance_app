<?php
session_start();
header('Content-Type: application/json');
include 'db.php';

$type = $_POST['type'];
$month = $_POST['month'];
$year = $_POST['year'];
$user_id = $_SESSION['user_id'];

$response = [
    'success' => false,
    'data' => []
];

try {
    if ($type === 'month' && $month) {
        $sql = "SELECT * FROM transactions WHERE user_id = ? AND DATE_FORMAT(date, '%Y-%m') = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("is", $user_id, $month);
    } elseif ($type === 'year' && $year) {
        $sql = "SELECT * FROM transactions WHERE user_id = ? AND YEAR(date) = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $user_id, $year);
    } else {
        throw new Exception('Invalid report type or date');
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $transactions = [];
    while ($row = $result->fetch_assoc()) {
        $transactions[] = $row;
    }

    $response['success'] = true;
    $response['data'] = $transactions;

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    error_log($e->getMessage());
    $response['error'] = $e->getMessage();
}

echo json_encode($response);
?>
