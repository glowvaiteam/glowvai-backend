import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from '../../../src/components/ui';

export default function ScanTab() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="AI Skin Diagnostics" />
      <View style={styles.content}>
        <View style={styles.scanTargetCircle}>
          <MaterialCommunityIcons name="face-recognition" size={80} color="#38BDF8" />
        </View>
        <Text style={styles.title}>Scan Your Skin</Text>
        <Text style={styles.subtitle}>
          Capture a clear selfie in natural light to analyze acne, texture, hydration, and dark spots.
        </Text>
        <TouchableOpacity style={styles.startScanBtn} activeOpacity={0.8}>
          <LinearGradient
            colors={['#1D4ED8', '#2563EB', '#38BDF8']}
            style={styles.btnGradient}
          >
            <Text style={styles.btnText}>Start Face Scan</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060B18',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanTargetCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#0F1E3D',
    borderWidth: 2,
    borderColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
    marginBottom: 32,
  },
  startScanBtn: {
    width: '100%',
    maxWidth: 260,
    borderRadius: 14,
    overflow: 'hidden',
  },
  btnGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
