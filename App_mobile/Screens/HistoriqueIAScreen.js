import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config'; // Ton fichier config avec l'IP et le port 5000

const HistoriqueIAScreen = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fonction pour récupérer l'historique depuis Python
    const fetchHistorique = async () => {
    try {
        setLoading(true);
        // Utiliser la clé 'userId' comme dans LoginScreen
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
            const response = await fetch(`${API_URL}/historique-ia`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: parseInt(userId) }),
            });
            const data = await response.json();
            if (data.status === 'success') {
                setConversations(data.conversations);
            }
        }
    } catch (error) {
        console.error("Erreur récupération historique:", error);
    } finally {
        setLoading(false);
    }
};

    // focusEffect permet de recharger les données chaque fois qu'on clique sur l'onglet
    useFocusEffect(
        useCallback(() => {
            fetchHistorique();
        }, [])
    );

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            {/* Affichage de l'image Wikimedia si elle existe */}
            {item.image_url ? (
                <Image 
                    source={{ uri: item.image_url }} 
                    style={styles.imagePlat} 
                    resizeMode="cover"
                />
            ) : (
                <View style={[styles.imagePlat, styles.placeholderImage]}>
                    <Text style={styles.placeholderText}>Pas d'image</Text>
                </View>
            )}

            <View style={styles.content}>
                <Text style={styles.question}>🍴 {item.question}</Text>
                <Text style={styles.reponse}>{item.reponse}</Text>
                <Text style={styles.date}>{item.created_at || "Date inconnue"}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerTitle}>Mes Recettes & Conseils</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={conversations}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={styles.empty}>Aucune conversation pour le moment.</Text>}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    headerTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 15, color: '#2E7D32' },
    list: { padding: 15 },
    card: { 
        backgroundColor: '#FFF', 
        borderRadius: 12, 
        marginBottom: 20, 
        overflow: 'hidden',
        elevation: 3, 
        shadowColor: '#000', 
        shadowOpacity: 0.1, 
        shadowRadius: 5 
    },
    imagePlat: { width: '100%', height: 200 },
    placeholderImage: { backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' },
    placeholderText: { color: '#757575' },
    content: { padding: 15 },
    question: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    reponse: { fontSize: 14, color: '#666', lineHeight: 20 },
    date: { fontSize: 12, color: '#999', marginTop: 10, textAlign: 'right' },
    empty: { textAlign: 'center', marginTop: 50, color: '#999' }
});

export default HistoriqueIAScreen;