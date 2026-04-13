<?php

error_reporting(0);
ini_set('display_errors', 0);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once 'dataBase.php';

// ici on initialise la base et les allows
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include 'dataBase.php';

// ici on recupere les info du user envoyé par js dans la partie SignupScreen

$data = json_decode(file_get_contents("php://input"), true);

$nom = $data['nom'];
$email = $data['email'];
$password = $data['password'];

// on verifie si l'email existe deja 

$verif = $conn->prepare("SELECT * FROM users WHERE email = ?");
$verif->bind_param("s", $email);
$verif->execute();
$resultat = $verif->get_result();

if($resultat->num_rows > 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Cet email existe déjà"
    ]);
    exit();
}

//  insertion du mot de passe et hasachage

$password_hash = password_hash($password, PASSWORD_BCRYPT);

$insert = $conn->prepare("INSERT INTO users (nom, email, password) VALUES (?, ?, ?)");
$insert->bind_param("sss", $nom, $email, $password_hash);

if($insert->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "Compte créé avec succès !"
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Erreur lors de la création du compte"
    ]);
}

?>
