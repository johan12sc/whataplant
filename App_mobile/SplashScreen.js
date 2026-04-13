import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const [videoComplete, setVideoComplete] = useState(false);
  const [progressComplete, setProgressComplete] = useState(false);
  const [skipPressed, setSkipPressed] = useState(false);
  
  const progressAnim = useRef(new Animated.Value(0)).current;

  const player = useVideoPlayer(require('../assets/splash.mp4'), player => {
    player.loop = false;
    player.play();
  });

  const { status } = useEvent(player, 'statusChange', { status: player.status });

  useEffect(() => {
    if (status === 'idle' && player.currentTime > 0) {
      setVideoComplete(true);
    }
  }, [status]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 8000,
      useNativeDriver: false,
    }).start(() => {
      setProgressComplete(true);
    });
  }, []);

  useEffect(() => {
    if (progressComplete && videoComplete) {
      setTimeout(() => {
        onFinish();
      }, 300);
    }
  }, [progressComplete, videoComplete]);

  const skipVideo = () => {
    setSkipPressed(true);
    setVideoComplete(true);
    setProgressComplete(true);
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>

      {/* Fond vert visible derrière la vidéo */}
      <LinearGradient
        colors={['#1D9E75', '#0D6B4A', '#064E3B']}
        style={StyleSheet.absoluteFill}
      />

      {/* Vidéo par dessus */}
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
      />

      {/* PAS D'OVERLAY pour que le fond vert soit visible */}

      {!skipPressed && !videoComplete && (
        <TouchableOpacity style={styles.skipButton} onPress={skipVideo}>
          <Text style={styles.skipText}>Passer →</Text>
        </TouchableOpacity>
      )}

      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <Animated.View 
            style={[styles.progressBarFill, { width: progressWidth }]} 
          />
        </View>
        <Text style={styles.progressText}>
          {progressComplete && videoComplete ? 'Démarrage...' : 'Chargement...'}
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#064E3B',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  skipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 60,
    left: 30,
    right: 30,
    alignItems: 'center',
  },
  progressBarBackground: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 10,
    opacity: 0.8,
  },
});