<?php
session_start();
include 'db.php';

$type = $_GET['type'];
$user_id = $_SESSION['user_id'];

$response = [];

if ($type == 'monthlyExpenses' || $type == 'monthlyIncomes') {
    $category = $type == 'monthlyExpenses' ? 'expense' : 'income';
    $sql = "SELECT DATE_FORMAT(date, '%Y-%m') AS month, SUM(amount) AS total 
            FROM transactions 
            WHERE user_id = ? AND category = ? 
            GROUP BY month 
            ORDER BY month";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("is", $user_id, $category);
} elseif ($type == 'balance') {
    $sql = "SELECT DATE_FORMAT(date, '%Y-%m') AS month, 
                   SUM(CASE WHEN category = 'income' THEN amount ELSE 0 END) AS total_income, 
                   SUM(CASE WHEN category = 'expense' THEN ABS(amount) ELSE 0 END) AS total_expense 
            FROM transactions 
            WHERE user_id = ? 
            GROUP BY month 
            ORDER BY month";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
} elseif ($type == 'goals') {
    $sql = "SELECT name, amount, paid FROM goals WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
}

$stmt->execute();
$result = $stmt->get_result();

if ($type == 'monthlyExpenses' || $type == 'monthlyIncomes') {
    $labels = [];
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $labels[] = $row['month'];
        $data[] = abs($row['total']); // Używamy abs() tylko dla wydatków
    }
    $response['labels'] = $labels;
    $response['data'] = $data;
} elseif ($type == 'balance') {
    $labels = [];
    $incomes = [];
    $expenses = [];
    while ($row = $result->fetch_assoc()) {
        $labels[] = $row['month'];
        $incomes[] = $row['total_income'];
        $expenses[] = abs($row['total_expense']);
    }
    $response['labels'] = $labels;
    $response['incomes'] = $incomes;
    $response['expenses'] = $expenses;
} elseif ($type == 'goals') {
    $labels = [];
    $totalAmounts = [];
    $paidAmounts = [];
    while ($row = $result->fetch_assoc()) {
        $labels[] = $row['name'];
        $totalAmounts[] = $row['amount'];
        $paidAmounts[] = $row['paid'];
    }
    $response['labels'] = $labels;
    $response['goals'] = ['totalAmounts' => $totalAmounts, 'paidAmounts' => $paidAmounts];
}

$stmt->close();
$conn->close();

echo json_encode($response);
?>
