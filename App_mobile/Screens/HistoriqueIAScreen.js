import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP from '../config';

// Configuration de l'API - pour FastAPI (port 8000)
const API_URL = `http://${IP}:8000`;  // ← PORT 8000, pas 8080 !

export default function HistoriqueIAScreen({ navigation }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getHistory = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        fetchHistorique(parseInt(userId));
      } else {
        navigation.navigate('Home');
      }
    };
    getHistory();
  }, []);

  const fetchHistorique = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/historique`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });

      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error(error);
      alert('Erreur: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const openConversation = (item) => {
    navigation.navigate('ServiceIA', {
      prefillQuestion: item.question,
      prefillAnswer: item.reponse,
      prefillImage: item.image_url
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#1D9E75" />
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📋 Historique IA</Text>
        <View style={{ width: 30 }} />
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openConversation(item)}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.question}>{item.question}</Text>
            <Text style={styles.reponse} numberOfLines={2}>{item.reponse}</Text>
            {item.image_url && (
              <Text style={styles.hasImage}>📷 Avec image</Text>
            )}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>📭</Text>
            <Text style={styles.emptyTitle}>Aucun historique</Text>
            <Text style={styles.emptySubtitle}>
              Pose des questions à l'assistant pour commencer
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#1D9E75',
  },
  backBtn: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  date: { fontSize: 11, color: '#888', marginBottom: 8 },
  question: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  reponse: { fontSize: 14, color: '#666' },
  hasImage: { fontSize: 11, color: '#1D9E75', marginTop: 8 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#1D9E75', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#888', textAlign: 'center' },
});