import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HistoriqueScansScreen({ navigation }) {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const scansData = await AsyncStorage.getItem(`scans_${userId}`);
        if (scansData) {
          setScans(JSON.parse(scansData));
        }
      }
    } catch (error) {
      console.error(error);
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
        <View style={{ width: 30 }} />
      </View>

      {scans.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>📭</Text>
          <Text style={styles.emptyTitle}>Aucun scan</Text>
          <Text style={styles.emptySubtitle}>Scanne une plante pour commencer</Text>
        </View>
      ) : (
        <FlatList
          data={scans}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card}
              onPress={() => navigation.navigate('ScanResult', { scan: item })}
            >
              <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
              <Text style={styles.plantName}>{item.nom_fr}</Text>
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
  },
  date: { fontSize: 11, color: '#888', marginBottom: 8 },
  plantName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  seeDetails: { fontSize: 13, color: '#1D9E75' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#1D9E75', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#888', textAlign: 'center' },
});