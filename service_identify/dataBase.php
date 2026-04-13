<?php
error_reporting(0);
ini_set('display_errors', 0);

$host = "localhost";
$utilisateur = "root";
$password = "";
$database = "whataplant";

$conn = new mysqli($host, $utilisateur, $password, $database);

if($conn->connect_error) {
    die(json_encode([
        "status" => "error",
        "message" => "Connexion à la base échouée"
    ]));
}
?>