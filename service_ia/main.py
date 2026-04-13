from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import db_config
import grok_client

# ============================================
# INITIALISATION
# ============================================
app = FastAPI(title="WhatAPlant IA Service")

# Autoriser React Native à communiquer avec l'API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# MODÈLES DE DONNÉES
# ============================================
class QuestionRequest(BaseModel):
    user_id: int
    question: str

class UserRequest(BaseModel):
    user_id: int

# ============================================
# ROUTES
# ============================================
@app.get("/")
def root():
    return {"status": "online", "service": "WhatAPlant IA"}

@app.post("/chat")
async def chat(request: QuestionRequest):
    """
    Endpoint principal du chatbot
    - Vérifie le cache
    - Appelle Groq si besoin
    - Sauvegarde et retourne
    """
    user_id = request.user_id
    question = request.question
    
    print(f"📝 Reçu: user_id={user_id}, question={question[:50]}...")
    
    # 1. Vérifier si la question existe déjà dans l'historique
    existe = db_config.chercher_historique(user_id, question)
    
    if existe:
        print("✅ Trouvé dans historique!")
        return {
            "status": "success",
            "from_cache": True,
            "reponse": existe["reponse"],
            "image_url": existe["image_url"]
        }
    
    # 2. Appeler Groq pour obtenir réponse + image
    # ✅ CORRIGÉ : passer user_id
    reponse, image_url = await grok_client.appeler_groq(question, user_id)
    
    # 3. Sauvegarder la conversation
    db_config.sauvegarder_conversation(user_id, question, reponse, image_url)
    
    return {
        "status": "success",
        "from_cache": False,
        "reponse": reponse,
        "image_url": image_url
    }
    
@app.post("/historique")
async def get_historique(request: UserRequest):
    """
    Récupère l'historique des conversations d'un utilisateur
    """
    user_id = request.user_id
    conversations = db_config.get_user_conversations(user_id)
    
    return {
        "status": "success",
        "conversations": conversations
    }