import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Header } from '../../../src/components/ui';

export default function OrdersTab() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Your Orders" />
      <View style={styles.content}>
        <Text style={styles.title}>No active orders</Text>
        <Text style={styles.subtitle}>Your quick-commerce and standard deliveries will appear here.</Text>
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
