import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';

export default function RessourcesScreen({ navigation }) {
  const [downloading, setDownloading] = useState(false);

  // Chemin vers le PDF local (dans assets)
  const pdfLocal = require('../../assets/guide_plantes.pdf');

  // Fonction pour télécharger le PDF (si hébergé en ligne)
  const telechargerPDF = async () => {
    setDownloading(true);
    try {
      const pdfUrl = 'https://ton-site.com/guide_plantes.pdf'; // À remplacer par ton URL
      const destination = FileSystem.documentDirectory + 'guide_plantes.pdf';
      
      const download = FileSystem.createDownloadResumable(pdfUrl, destination);
      const { uri } = await download.downloadAsync();
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Erreur', 'Le partage n\'est pas disponible sur cet appareil');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de télécharger le PDF');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📚 Ressources</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        {/* Carte pour visualiser le PDF */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('VisualiserPDF')}
        >
          <Ionicons name="document-text-outline" size={40} color="#1D9E75" />
          <Text style={styles.cardTitle}>📖 Guide des plantes</Text>
          <Text style={styles.cardDesc}>Consulter le guide complet des plantes médicinales</Text>
        </TouchableOpacity>

        {/* Carte pour télécharger le PDF */}
        <TouchableOpacity
          style={styles.card}
          onPress={telechargerPDF}
          disabled={downloading}
        >
          {downloading ? (
            <ActivityIndicator size="large" color="#1D9E75" />
          ) : (
            <Ionicons name="download-outline" size={40} color="#1D9E75" />
          )}
          <Text style={styles.cardTitle}>⬇️ Télécharger le PDF</Text>
          <Text style={styles.cardDesc}>Télécharger le guide pour consultation hors ligne</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#1D9E75',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  content: { flex: 1, padding: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 10 },
  cardDesc: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 5 },
});