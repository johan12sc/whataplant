import mysql.connector

def get_db_connection():
    """Connexion à la base MySQL"""
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="whataplant"
    )

def sauvegarder_conversation(user_id, question, reponse, image_url=None):
    """Sauvegarde une conversation dans l'historique"""
    conn = get_db_connection()
    cursor = conn.cursor()
    sql = "INSERT INTO historique_conversations (user_id, question, reponse, image_url) VALUES (%s, %s, %s, %s)"
    cursor.execute(sql, (user_id, question, reponse, image_url))
    conn.commit()
    cursor.close()
    conn.close()

def chercher_historique(user_id, question):
    """Cherche si la même question a déjà été posée"""
    conn = get_db_connection()
    cursor = conn.cursor()
    sql = "SELECT reponse, image_url FROM historique_conversations WHERE user_id = %s AND question = %s ORDER BY date_conversation DESC LIMIT 1"
    cursor.execute(sql, (user_id, question))
    resultat = cursor.fetchone()
    cursor.close()
    conn.close()
    if resultat:
        return {
            "reponse": resultat[0],
            "image_url": resultat[1]
        }
    return None

def get_user_conversations(user_id, limit=50):
    """Récupère l'historique complet d'un utilisateur"""
    conn = get_db_connection()
    cursor = conn.cursor()
    sql = "SELECT question, reponse, image_url, date_conversation FROM historique_conversations WHERE user_id = %s ORDER BY date_conversation DESC LIMIT %s"
    cursor.execute(sql, (user_id, limit))
    resultats = cursor.fetchall()
    cursor.close()
    conn.close()
    
    conversations = []
    for row in resultats:
        conversations.append({
            "question": row[0],
            "reponse": row[1],
            "image_url": row[2],
            "date": row[3].strftime("%Y-%m-%d %H:%M")
        })
    return conversations

def chercher_image_locale(nom_plante, type_recherche):
    """Cherche une image dans la base de données"""
    conn = get_db_connection()
    cursor = conn.cursor()
    sql = "SELECT image_url FROM images_plantes WHERE nom_plante = %s AND type = %s LIMIT 1"
    cursor.execute(sql, (nom_plante, type_recherche))
    resultat = cursor.fetchone()
    cursor.close()
    conn.close()
    if resultat:
        return resultat[0]
    return None

def sauvegarder_image_google(nom_plante, type_recherche, image_url):
    """Sauvegarde une image trouvée par Google"""
    conn = get_db_connection()
    cursor = conn.cursor()
    sql = "INSERT INTO images_plantes (nom_plante, type, image_url) VALUES (%s, %s, %s)"
    cursor.execute(sql, (nom_plante, type_recherche, image_url))
    conn.commit()
    cursor.close()
    conn.close()