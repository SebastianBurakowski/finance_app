<?php
session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php-error.log');

require(__DIR__ . '/fpdf186/fpdf.php'); // Użyj względnej ścieżki do FPDF 1.86
include 'db.php';

$type = $_POST['type'];
$month = $_POST['month'];
$year = $_POST['year'];
$user_id = $_SESSION['user_id'];

error_log("Request received: " . print_r($_POST, true));

class PDF extends FPDF {
    function Header() {
        $this->SetFont('Arial', 'B', 12);
        $this->Cell(0, 10, 'Raport Finansowy', 0, 1, 'C');
        $this->Ln(10);
    }

    function Footer() {
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 8);
        $this->Cell(0, 10, 'Strona ' . $this->PageNo(), 0, 0, 'C');
    }

    function ReportTable($header, $data) {
        $this->SetFont('Arial', 'B', 12);
        foreach ($header as $col) {
            $this->Cell(40, 7, $col, 1);
        }
        $this->Ln();
        $this->SetFont('Arial', '', 12);
        foreach ($data as $row) {
            foreach ($row as $col) {
                $this->Cell(40, 6, $col, 1);
            }
            $this->Ln();
        }
    }
}

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

    $stmt->close();
    $conn->close();

    error_log("Transactions fetched: " . print_r($transactions, true));

    if (empty($transactions)) {
        throw new Exception('No transactions found for the specified period.');
    }

    $pdf = new PDF();
    $pdf->AddPage();
    $header = ['ID', 'Nazwa', 'Kwota', 'Kategoria', 'Data'];

    // Dodanie testowego tekstu
    $pdf->SetFont('Arial', 'B', 16);
    $pdf->Cell(0, 10, 'Testowy tekst PDF', 0, 1, 'C');

    // Dodanie tabeli z transakcjami
    $pdf->ReportTable($header, $transactions);

    // Zapisanie pliku PDF lokalnie dla celów debugowania
    $pdf->Output('F', __DIR__ . '/Raport.pdf'); 

    // Wysłanie pliku PDF do przeglądarki
    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="Raport.pdf"');
    $pdf->Output('D', 'Raport.pdf');
} catch (Exception $e) {
    error_log($e->getMessage());
    echo "Błąd: " . $e->getMessage();
}
?>
