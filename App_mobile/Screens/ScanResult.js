import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ScanResult({ navigation, route }) {
  // On récupère le scan passé en paramètre
  const { scan } = route.params;

  // Sécurité : Si les détails arrivent en format texte (depuis la DB), on les transforme en objet
  const details = typeof scan.details === 'string' 
    ? JSON.parse(scan.details) 
    : (scan.details || {});

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🌿 Analyse complète</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* On affiche l'image capturée (ou l'URL de la base de données) */}
        <Image 
          source={{ uri: scan.image_uri || scan.image_url }} 
          style={styles.plantImage} 
        />
        
        <Text style={styles.plantName}>{scan.nom_fr || scan.nom_plante}</Text>
        
        {/* 1. SANTÉ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="medkit-outline" size={24} color="#32C59A" />
            <Text style={styles.sectionTitle}>🩺 Santé de la plante</Text>
          </View>
          <Text style={styles.sectionText}>
            <Text style={styles.label}>État : </Text>
            {details.sante?.etat || "Analyse en cours..."}
          </Text>
          {details.sante?.symptomes && (
            <Text style={styles.sectionText}>
              <Text style={styles.label}>Symptômes : </Text>
              {details.sante.symptomes}
            </Text>
          )}
          {details.sante?.traitements_naturels && (
            <Text style={styles.sectionText}>
              <Text style={styles.label}>🌱 Traitements naturels : </Text>
              {details.sante.traitements_naturels}
            </Text>
          )}
        </View>

        {/* 2. COMESTIBLE */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="restaurant-outline" size={24} color="#32C59A" />
            <Text style={styles.sectionTitle}>🍽️ Comestibilité</Text>
          </View>
          <Text style={styles.sectionText}>
            <Text style={styles.label}>Réponse : </Text>
            {details.comestible?.oui_non || "Non spécifié"}
          </Text>
          {details.comestible?.recettes && (
            <Text style={styles.sectionText}>
              <Text style={styles.label}>🍳 Recettes : </Text>
              {details.comestible.recettes}
            </Text>
          )}
        </View>

        {/* 3. MÉDICINALE */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="fitness-outline" size={24} color="#32C59A" />
            <Text style={styles.sectionTitle}>💊 Propriétés médicinales</Text>
          </View>
          <Text style={styles.sectionText}>
            {details.medicinale?.usages || "Aucun usage documenté trouvé."}
          </Text>
        </View>

        {/* 4. TOXICITÉ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="warning-outline" size={24} color="#FF6B6B" />
            <Text style={styles.sectionTitle}>⚠️ Toxicité</Text>
          </View>
          <Text style={styles.sectionText}>
            <Text style={styles.label}>Niveau : </Text>
            {details.toxicite?.niveau || "Inconnu"}
          </Text>
          {details.toxicite?.symptomes && (
            <Text style={styles.sectionText}>
              {details.toxicite.symptomes}
            </Text>
          )}
        </View>

        {/* 5. NUISIBILITÉ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="globe-outline" size={24} color="#32C59A" />
            <Text style={styles.sectionTitle}>🌍 Impact environnemental</Text>
          </View>
          <Text style={styles.sectionText}>
            {details.nuisibilite?.impact || "Aucun impact majeur signalé."}
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#102A21' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingTop: 50, 
    paddingHorizontal: 20, 
    paddingBottom: 20,
    backgroundColor: '#102A21',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  content: { padding: 20 },
  plantImage: { width: '100%', height: 250, borderRadius: 20, marginBottom: 20, backgroundColor: '#333' },
  plantName: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 20, textAlign: 'center' },
  section: { 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 16 
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#32C59A', marginLeft: 8 },
  sectionText: { fontSize: 14, color: '#fff', lineHeight: 20, marginBottom: 8 },
  label: { fontWeight: 'bold', color: '#32C59A' },
});