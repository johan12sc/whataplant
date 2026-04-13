import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>

          <Text style={styles.titre}>Mot de passe oublié</Text>
          <Text style={styles.sousTitre}>Entre ton email pour recevoir un nouveau mot de passe 🌿</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <TouchableOpacity style={styles.bouton}>
            <Text style={styles.boutonTexte}>Envoyer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.lien}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.lienTexte}>Retour à la connexion</Text>
          </TouchableOpacity>

        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  card: { alignItems: 'center' },
  titre: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  sousTitre: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontSize: 15,
    marginBottom: 16,
  },
  bouton: {
    width: '100%',
    backgroundColor: '#1D9E75',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  boutonTexte: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lien: { marginTop: 8 },
  lienTexte: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
  },
});