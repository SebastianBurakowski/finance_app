<?php
session_start();

require(__DIR__ . '/fpdf186/fpdf.php');
include 'db.php';

$type = $_POST['type'];
$month = $_POST['month'];
$year = $_POST['year'];
$user_id = $_SESSION['user_id'];

class PDF extends FPDF {
    function Header() {
        $this->SetFont('Arial', 'B', 20);
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

    function ReportTableWithTotal($header, $data, $total) {
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
        
        $this->SetFont('Arial', 'B', 12);
        $this->Cell(40, 7, '', 0);
        $this->Cell(40, 7, '', 0);
        $this->Cell(40, 7, 'Suma Oplat', 1);
        $this->Cell(40, 7, number_format($total, 2) . ' pln', 1);
    }
}

try {
    error_log("Request received: " . print_r($_POST, true));

    $transactions_sql = "SELECT name, amount, category, date FROM transactions WHERE user_id = ?";
    $goals_sql = "SELECT name, date, paid, amount FROM goals WHERE user_id = ?";
    $fees_sql = "SELECT name, amount FROM fees WHERE user_id = ?";

    if ($type === 'month' && $month) {
        $transactions_sql .= " AND DATE_FORMAT(date, '%Y-%m') = ?";
    } elseif ($type === 'year' && $year) {
        $transactions_sql .= " AND YEAR(date) = ?";
    }

    $stmt = $conn->prepare($transactions_sql);
    if ($type === 'month' && $month) {
        $stmt->bind_param("is", $user_id, $month);
    } elseif ($type === 'year' && $year) {
        $stmt->bind_param("ii", $user_id, $year);
    } else {
        $stmt->bind_param("i", $user_id);
    }

    $stmt->execute();
    $transactions_result = $stmt->get_result();
    $transactions = [];
    $income_total = 0;
    $expense_total = 0;

    while ($row = $transactions_result->fetch_assoc()) {
        $transactions[] = $row;
        if ($row['category'] === 'income') {
            $income_total += $row['amount'];
        } else {
            $expense_total += abs($row['amount']);
        }
    }
    $stmt->close();

    error_log("Transactions fetched: " . print_r($transactions, true));

    $balance = $income_total - $expense_total;

    $stmt = $conn->prepare($goals_sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $goals_result = $stmt->get_result();
    $goals = [];
    while ($row = $goals_result->fetch_assoc()) {
       
        $row['remaining'] = $row['amount'] - $row['paid'];
        $goals[] = $row;
    }
    $stmt->close();

    error_log("Goals fetched: " . print_r($goals, true));

   
    $stmt = $conn->prepare($fees_sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $fees_result = $stmt->get_result();
    $fees = [];
    $fees_total = 0;
    while ($row = $fees_result->fetch_assoc()) {
        $fees[] = $row;
        $fees_total += $row['amount'];
    }
    $stmt->close();

    error_log("Fees fetched: " . print_r($fees, true));

    $conn->close();

    $pdf = new PDF();
    $pdf->AddPage();
    $header = ['Nazwa', 'Kwota', 'Kategoria', 'Data'];

    $pdf->SetFont('Arial', 'B', 16);
    $pdf->Cell(0, 10, 'Transakcje', 0, 1, 'C');
    $pdf->ReportTable($header, $transactions);

    $pdf->Ln(10);
    $pdf->SetFont('Arial', 'B', 16);
    $pdf->Cell(0, 10, 'Bilans', 0, 1, 'C');
    $pdf->SetFont('Arial', '', 12);
    $pdf->Cell(0, 5, 'Zarobki: ' . number_format($income_total, 2) . ' pln', 0, 1, 'C');
    $pdf->Cell(0, 5, 'Wydatki: ' . number_format($expense_total, 2) . ' pln', 0, 1, 'C');
    $pdf->Cell(0, 5, 'Bilans: ' . number_format($balance, 2) . ' pln', 0, 1, 'C');

   
    $pdf->Ln(10);
    $pdf->SetFont('Arial', 'B', 16);
    $pdf->Cell(0, 10, 'Cele Finansowe', 0, 1, 'C');
    $header = ['Nazwa', 'Data Koncowa', 'Oplacone', 'Calkowita Kwota', 'Pozostalo'];
    $pdf->ReportTable($header, $goals);

    
    $pdf->Ln(10);
    $pdf->SetFont('Arial', 'B', 16);
    $pdf->Cell(0, 10, 'Stale Oplaty', 0, 1, 'C');
    $header = ['Nazwa', 'Kwota'];
    $pdf->ReportTableWithTotal($header, $fees, $fees_total);

    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="Raport.pdf"');
    $pdf->Output('D', 'Raport.pdf');
} catch (Exception $e) {
    error_log("Error generating PDF: " . $e->getMessage());
    echo "Błąd: " . $e->getMessage();
}
?>
