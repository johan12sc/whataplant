import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config'; // On utilise le port 5000

export default function HistoriqueScansScreen({ navigation }) {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        setLoading(false);
        return;
      }

      // ON APPELLE LE SERVEUR PYTHON AU LIEU DU STORAGE LOCAL
      const response = await fetch(`${API_URL}/scans/${userId}`);
      const data = await response.json();

      if (data.status === 'success') {
        setScans(data.scans);
      } else {
        Alert.alert("Erreur", "Impossible de récupérer l'historique.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Le serveur Python ne répond pas.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#1D9E75" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📷 Historique des scans</Text>
        <TouchableOpacity onPress={loadScans}>
          <Text style={{ color: '#fff', fontSize: 18 }}>↻</Text>
        </TouchableOpacity>
      </View>

      {scans.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>📭</Text>
          <Text style={styles.emptyTitle}>Aucun scan trouvé</Text>
          <Text style={styles.emptySubtitle}>Tes scans sauvegardés sur MySQL apparaîtront ici.</Text>
        </View>
      ) : (
        <FlatList
          data={scans}
          keyExtractor={(item) => item.id.toString()} // On utilise l'ID de la DB
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card}
              onPress={() => navigation.navigate('ScanResult', { scan: item })}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.date}>{item.date_scan}</Text>
                <Text style={styles.score}>{Math.round(item.score * 100)}% Match</Text>
              </View>
              <Text style={styles.plantName}>{item.nom_plante}</Text>
              <Text style={styles.scientificName}>{item.nom_scientifique}</Text>
              <Text style={styles.seeDetails}>Voir les détails →</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#1D9E75',
  },
  backBtn: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  date: { fontSize: 12, color: '#999' },
  score: { fontSize: 12, color: '#1D9E75', fontWeight: 'bold' },
  plantName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  scientificName: { fontSize: 14, color: '#666', fontStyle: 'italic', marginBottom: 10 },
  seeDetails: { fontSize: 13, color: '#1D9E75', fontWeight: '600', textAlign: 'right' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText: { fontSize: 60, marginBottom: 15 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  emptySubtitle: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 10 },
});