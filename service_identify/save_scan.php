<?php
error_reporting(0);
ini_set('display_errors', 0);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'dataBase.php';

// Récupérer les données JSON envoyées
$data = json_decode(file_get_contents("php://input"), true);

// Vérifier les données
if (!$data || !isset($data['user_id']) || !isset($data['nom_plante'])) {
    echo json_encode([
        "status" => "error", 
        "message" => "Données manquantes"
    ]);
    exit();
}

$user_id = $data['user_id'];
$nom_plante = $data['nom_plante'];
$nom_scientifique = $data['nom_scientifique'] ?? '';
$famille = $data['famille'] ?? '';
$score = $data['score'] ?? 0;
$details = json_encode($data['details'] ?? []);
$image_url = $data['image_url'] ?? '';

// Insérer dans la base
$sql = "INSERT INTO historique_scans (user_id, nom_plante, nom_scientifique, famille, score, details, image_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("isssiss", $user_id, $nom_plante, $nom_scientifique, $famille, $score, $details, $image_url);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success", 
        "message" => "Scan sauvegardé dans la base",
        "scan_id" => $stmt->insert_id
    ]);
} else {
    echo json_encode([
        "status" => "error", 
        "message" => "Erreur lors de la sauvegarde: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>