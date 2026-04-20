import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  FlatList, Image, StyleSheet, ActivityIndicator,
  KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config'; // Utilisation du port 5000
// import YoutubePlayer from 'react-native-youtube-iframe';

export default function ServiceIA({ navigation, route }) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const flatListRef = useRef(null);

  const prefill = route?.params;

  useEffect(() => {
    const init = async () => {
      const id = await AsyncStorage.getItem('userId');
      if (!id) { 
        navigation.navigate('Login'); 
        return; 
      }
      setUserId(parseInt(id));

      // Gestion du pré-remplissage (si on vient du Scanner)
      if (prefill?.prefillQuestion) {
        setMessages([
          { id: "1", text: prefill.prefillQuestion, isUser: true },
          { id: "2", text: prefill.prefillAnswer || "🌿", isUser: false, imageUrl: prefill.prefillImage }
        ]);
      }
    };
    init();
  }, []);

  const sendMessage = async () => {
    if (!question.trim() || !userId) return;

    const currentQuestion = question.trim();
    const userMsg = { id: Date.now().toString(), text: currentQuestion, isUser: true };
    
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setQuestion('');

    try {
      // APPEL UNIQUE AU SERVEUR PYTHON
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: userId, 
          question: currentQuestion 
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        const botMsg = { 
          id: (Date.now() + 1).toString(), 
          text: data.reponse, 
          isUser: false, 
          imageUrl: data.image_url,
          videoId: data.video_id 
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        Alert.alert("Erreur", data.message || "L'IA ne répond pas.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Connexion au serveur Python impossible.");
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.message, item.isUser ? styles.userMessage : styles.botMessage]}>
      <Text style={item.isUser ? styles.userText : styles.botText}>{item.text}</Text>
      {item.imageUrl && (
        <Image 
          source={{ uri: item.imageUrl.replace('http://', 'https://') }} 
          style={styles.messageImage} 
          resizeMode="cover"
          onError={(e) => console.log("Erreur image ServiceIA:", e.nativeEvent.error, "URL:", item.imageUrl)}
        />
      )}
    </View>
  );

  if (!userId) return <View style={styles.center}><ActivityIndicator size="large" color="#1D9E75" /></View>;

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🌿 Assistant WhatAPlant</Text>
        <TouchableOpacity onPress={() => navigation.navigate('HistoriqueIA')}>
          <Text style={styles.historyBtn}>📋</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        style={styles.chatArea}
        renderItem={renderMessage}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>🌿</Text>
            <Text style={styles.emptyTitle}>Pose-moi une question sur une plante !</Text>
            <Text style={styles.emptySubtitle}>Je peux te donner des recettes médicinales structurées.</Text>
          </View>
        }
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#1D9E75" />
          <Text style={styles.loadingText}>WhatAPlant réfléchit...</Text>
        </View>
      )}

      <View style={styles.inputArea}>
        <TextInput 
          style={styles.input} 
          placeholder="Ex: Recette avec de la menthe..." 
          value={question} 
          onChangeText={setQuestion} 
          multiline 
        />
        <TouchableOpacity 
          style={[styles.sendBtn, (!question.trim() || loading) && styles.sendBtnDisabled]} 
          onPress={sendMessage} 
          disabled={!question.trim() || loading}
        >
          <Text style={styles.sendBtnText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 16, 
    paddingTop: 50, 
    backgroundColor: '#1D9E75',
    elevation: 4
  },
  backBtn: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  historyBtn: { fontSize: 22, color: '#fff' },
  chatArea: { flex: 1, padding: 12 },
  message: { maxWidth: '85%', padding: 12, borderRadius: 20, marginBottom: 12 },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#1D9E75', borderBottomRightRadius: 4 },
  botMessage: { alignSelf: 'flex-start', backgroundColor: '#fff', borderBottomLeftRadius: 4, elevation: 1 },
  userText: { color: '#fff', fontSize: 15 },
  botText: { color: '#333', fontSize: 15, lineHeight: 22 },
  messageImage: { width: 220, height: 160, borderRadius: 12, marginTop: 10 },
  inputArea: { 
    flexDirection: 'row', 
    padding: 12, 
    backgroundColor: '#fff', 
    borderTopWidth: 1, 
    borderTopColor: '#eee',
    alignItems: 'center'
  },
  input: { 
    flex: 1, 
    backgroundColor: '#f0f0f0', 
    borderRadius: 25, 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    fontSize: 16,
    maxHeight: 100 
  },
  sendBtn: { 
    width: 45, 
    height: 45, 
    borderRadius: 23, 
    backgroundColor: '#1D9E75', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: 10 
  },
  sendBtnDisabled: { backgroundColor: '#ccc' },
  sendBtnText: { color: '#fff', fontSize: 18 },
  loadingContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 10 },
  loadingText: { marginLeft: 10, color: '#1D9E75', fontWeight: '500' },
  emptyContainer: { alignItems: 'center', marginTop: 50, padding: 20 },
  emptyText: { fontSize: 60, marginBottom: 10 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#1D9E75', textAlign: 'center' },
  emptySubtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 8 },
});