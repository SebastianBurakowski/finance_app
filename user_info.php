<?php
session_start();
header('Content-Type: application/json');
if (isset($_SESSION['user_name'])) {
    echo json_encode(['user_name' => $_SESSION['user_name']]);
} else {
    echo json_encode(['error' => 'User not logged in']);
}
?>
