<?php

error_reporting(0);
ini_set('display_errors', 0);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once 'dataBase.php';

// 1. On récupère le contenu brut de la requête (le JSON envoyé par React Native)
$json = file_get_contents('php://input');

// 2. On le décode pour transformer le JSON en objet PHP
$data = json_decode($json, true);

// 3. Maintenant, on récupère l'email et le password depuis $data au lieu de $_POST
$email = isset($data['email']) ? $data['email'] : null;
$password = isset($data['password']) ? $data['password'] : null;

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include 'dataBase.php';

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'];
$password = $data['password'];

$verif = $conn->prepare("SELECT * FROM users WHERE email = ?");
$verif->bind_param("s", $email);
$verif->execute();
$resultat = $verif->get_result();

if($resultat->num_rows == 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Email introuvable"
    ]);
    exit();
}

$user = $resultat->fetch_assoc();

if(password_verify($password, $user['password'])) {
    echo json_encode([
        "status" => "success",
        "message" => "Connexion réussie !",
        "user" => [
            "id" => $user['id'],
            "nom" => $user['nom'],
            "email" => $user['email']
        ]
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Mot de passe incorrect"
    ]);
}

?>











