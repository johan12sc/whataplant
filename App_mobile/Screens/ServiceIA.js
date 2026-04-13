import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  FlatList, Image, StyleSheet, ActivityIndicator,
  KeyboardAvoidingView, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP from '../config';

// Configuration de l'API
// Pour émulateur: 10.0.2.2
// Pour téléphone réel: IP de ton PC (ex: 192.168.1.X)
const API_URL = `http://${IP}:8000`;

export default function ServiceIA({ navigation, route }) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  
  // Référence pour le FlatList (scroll automatique)
  const flatListRef = useRef(null);

  // Récupérer les paramètres de l'historique (si on vient de là)
  const prefillQuestion = route?.params?.prefillQuestion;
  const prefillAnswer = route?.params?.prefillAnswer;
  const prefillImage = route?.params?.prefillImage;

  // Récupérer l'ID utilisateur et charger la conversation pré-remplie
  useEffect(() => {
    const init = async () => {
      const id = await AsyncStorage.getItem('userId');
      if (id) {
        setUserId(parseInt(id));
        
        // Si on vient de l'historique avec une question pré-remplie
        if (prefillQuestion) {
          const userMessage = {
            id: Date.now().toString(),
            text: prefillQuestion,
            isUser: true,
            imageUrl: null
          };
          
          const botMessage = {
            id: (Date.now() + 1).toString(),
            text: prefillAnswer || "Voici ce que je t'avais répondu 🌿",
            isUser: false,
            imageUrl: prefillImage || null
          };
          
          setMessages([userMessage, botMessage]);
        }
      } else {
        navigation.navigate('Home');
      }
    };
    init();
  }, [prefillQuestion]);

  // Scroll automatique vers le bas quand un nouveau message arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!question.trim() || !userId) return;

    // Ajouter la question à l'affichage
    const userMessage = { 
      id: Date.now().toString(), 
      text: question, 
      isUser: true,
      imageUrl: null
    };
    setMessages(prev => [...prev, userMessage]);
    
    setLoading(true);
    const currentQuestion = question;
    setQuestion('');

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: userId,
          question: currentQuestion 
        })
      });

      const data = await response.json();
      
      const botResponse = { 
        id: (Date.now() + 1).toString(), 
        text: data.reponse, 
        isUser: false,
        imageUrl: data.image_url
      };
      setMessages(prev => [...prev, botResponse]);
      
    } catch (error) {
      alert('Erreur de connexion au serveur: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.message, item.isUser ? styles.userMessage : styles.botMessage]}>
      <Text style={item.isUser ? styles.userText : styles.botText}>
        {item.text}
      </Text>
      {item.imageUrl && (
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.messageImage}
          resizeMode="cover"
        />
      )}
    </View>
  );

  if (!userId) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#1D9E75" />
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
  style={styles.container}
  behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
  keyboardVerticalOffset={80}
>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}> Assistant Plante</Text>
        <TouchableOpacity onPress={() => navigation.navigate('HistoriqueIA')}>
          <Text style={styles.historyBtn}>Historique</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        renderItem={renderMessage}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>🌿</Text>
            <Text style={styles.emptyTitle}>Pose-moi une question !</Text>
            <Text style={styles.emptySubtitle}>
              Je peux t'aider à identifier des plantes,{'\n'}
              trouver des recettes ou des remèdes naturels.
            </Text>
          </View>
        }
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#1D9E75" />
          <Text style={styles.loadingText}>L'assistant réfléchit...</Text>
        </View>
      )}

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Pose ta question sur les plantes..."
          placeholderTextColor="#888"
          value={question}
          onChangeText={setQuestion}
          multiline
          returnKeyType="send"
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity 
          style={[styles.sendBtn, loading && styles.sendBtnDisabled]} 
          onPress={sendMessage}
          disabled={loading}
        >
          <Text style={styles.sendBtnText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#1D9E75',
  },
  backBtn: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  historyBtn: {
    fontSize: 20,
    color: '#fff',
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 8,
  },
  message: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#1D9E75',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
  },
  userText: {
    color: '#fff',
    fontSize: 15,
  },
  botText: {
    color: '#333',
    fontSize: 15,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginTop: 8,
  },
  inputArea: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1D9E75',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendBtnDisabled: {
    backgroundColor: '#aaa',
  },
  sendBtnText: {
    color: '#fff',
    fontSize: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fff',
  },
  loadingText: {
    marginLeft: 8,
    color: '#1D9E75',
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1D9E75',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});