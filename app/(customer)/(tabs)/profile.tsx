import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Header } from '../../../src/components/ui';
import { spacing, borderRadius } from '../../../src/design';
import { logoutUser, subscribeToAuthState, getCurrentUser } from '../../../src/services/authService';

export default function ProfileTab() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(user => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await logoutUser();
      router.replace('/(auth)/login');
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : 'Failed to sign out.';
      Alert.alert('Sign Out Error', errMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Your Profile" />
      <View style={styles.content}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {currentUser?.phoneNumber ? currentUser.phoneNumber.slice(-2) : '✦'}
          </Text>
        </View>
        <Text style={styles.userName}>
          {currentUser ? 'GlowVAI Verified User' : 'Guest User'}
        </Text>
        <Text style={styles.userPhone}>
          {currentUser?.phoneNumber || 'No phone number linked'}
        </Text>

        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <Ionicons name="location-outline" size={20} color="#38BDF8" />
            <Text style={styles.menuText}>Saved Addresses</Text>
            <Ionicons name="chevron-forward" size={18} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <Ionicons name="gift-outline" size={20} color="#38BDF8" />
            <Text style={styles.menuText}>Student Referral Program</Text>
            <Ionicons name="chevron-forward" size={18} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#38BDF8" />
            <Text style={styles.menuText}>Beauty Protection</Text>
            <Ionicons name="chevron-forward" size={18} color="#64748B" />
          </TouchableOpacity>
        </View>

        {currentUser ? (
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Sign out of GlowVAI"
          >
            <Ionicons name="log-out-outline" size={18} color="#EF4444" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        ) : null}
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
    padding: spacing.xl,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#38BDF8',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: spacing.xxl,
  },
  menuCard: {
    width: '100%',
    backgroundColor: '#131D33',
    borderRadius: borderRadius.xl,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: spacing.xxl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  menuText: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: 15,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    gap: 8,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
  },
});
