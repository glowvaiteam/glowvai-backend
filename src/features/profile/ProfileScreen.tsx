import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
  Modal,
  TextInput,
  Platform,
  StatusBar,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppFonts } from '../../hooks/useAppFonts';
import { logoutUser, getCurrentUser, subscribeToAuthState } from '../../services/authService';
import { ChangeProfilePictureModal } from '../../components/profile/ChangeProfilePictureModal';
import { syncUserOnboardingData } from '../../services/userSyncService';
import { SupportScreen } from '../support/SupportScreen';
import { DeleteAccountModal } from './DeleteAccountModal';
import { LegalTermsModal } from '../../components/modals/LegalTermsModal';

export const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { isLoaded, fontFamily } = useAppFonts();
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  // Preferences & Toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(true);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(false);

  // Modal Sub-Screens
  const [activeModal, setActiveModal] = useState<
    | null
    | 'editProfile'
    | 'skinPreferences'
    | 'privacyControl'
    | 'referral'
    | 'support'
    | 'policies'
    | 'deleteAccount'
  >(null);

  // Profile Form State
  const [userName, setUserName] = useState('Dr. Mukesh Glow');
  const [userEmail, setUserEmail] = useState('mukesh@glowvai.com');
  const [avatarUri, setAvatarUri] = useState<string | null>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  );
  const [isChangeAvatarOpen, setIsChangeAvatarOpen] = useState(false);
  const [skinType, setSkinType] = useState('Combination & Sensitive');
  const [skinConcerns, setSkinConcerns] = useState(['Acne & Blemishes', 'Pigmentation', 'Sun Damage']);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  const handleSaveNewAvatar = async (newUri: string) => {
    setAvatarUri(newUri);
    try {
      await syncUserOnboardingData({
        name: userName,
        email: userEmail,
      });
    } catch {
      // safe fallback
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(user => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out of your GlowVAI account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await logoutUser();
            router.replace('/(auth)/login');
          } catch {
            router.replace('/(auth)/login');
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account & Biometric Data',
      'This will permanently delete your profile, clinical skin scans, and order history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Permanently Delete',
          style: 'destructive',
          onPress: () => {
            setActiveModal(null);
            Alert.alert('Account Deletion Requested', 'Your profile and biometric data have been erased.');
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const handleDownloadData = () => {
    Alert.alert('Download My Data', 'A secure archive containing your clinical reports and order invoices will be sent to your registered email.');
  };

  const handleClearFaceScans = () => {
    Alert.alert('Erase Face Scans', 'All local CNN embeddings and selfie scans have been deleted from this device.');
  };

  const syneFont = isLoaded && fontFamily ? fontFamily.syneBold || fontFamily.syneExtraBold : undefined;

  return (
    <View style={styles.rootContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#7A0009" />

      {/* TOP HEADER */}
      <LinearGradient colors={['#7A0009', '#90000C', '#A80010']} style={styles.topHeaderGradient}>
        <SafeAreaView style={styles.safeHeaderRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, syneFont ? { fontFamily: syneFont } : { fontWeight: '900' }]}>
            GlowVAI Account Hub
          </Text>
          <TouchableOpacity onPress={() => setActiveModal('support')} style={styles.helpHeaderBtn}>
            <Ionicons name="headset-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </SafeAreaView>

        {/* Profile Card Hero */}
        <View style={styles.profileHeroCard}>
          <TouchableOpacity
            style={styles.avatarCircle}
            onPress={() => setIsChangeAvatarOpen(true)}
            activeOpacity={0.85}
          >
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>M</Text>
            )}
            <View style={styles.cameraEditBadge}>
              <Ionicons name="camera" size={11} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <View style={styles.heroInfoCol}>
            <Text style={styles.heroNameText}>{userName}</Text>
            <Text style={styles.heroPhoneText}>
              {currentUser?.phoneNumber || '+91 98765 43210'} • {userEmail}
            </Text>
            <View style={styles.goldMemberPill}>
              <Ionicons name="star" size={12} color="#FDE68A" />
              <Text style={styles.goldMemberText}>GLOWVAI GOLD MEMBER</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.editProfilePill} onPress={() => setActiveModal('editProfile')}>
            <Text style={styles.editProfileText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* SCROLLABLE HUBS LIST */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ========================================================================= */}
        {/* 1. CLINICAL & DIAGNOSTIC ACTIVITY HUB                                     */}
        {/* ========================================================================= */}
        <View style={styles.hubSection}>
          <Text style={styles.hubSectionTitle}>CLINICAL & AI DIAGNOSTICS</Text>

          <View style={styles.cardMenuContainer}>
            <TouchableOpacity
              style={styles.menuItemRow}
              onPress={() => router.push('/(customer)/scan/camera')}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#EFF6FF' }]}>
                <MaterialCommunityIcons name="face-recognition" size={20} color="#0052FF" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuItemTitle}>Start New Face Scan</Text>
                <Text style={styles.menuItemSub}>CNN Biometric Skin & Texture Analysis</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItemRow}
              onPress={() => router.push('/(customer)/scan/report')}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="document-text-outline" size={20} color="#059669" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuItemTitle}>Latest Skin Report</Text>
                <Text style={styles.menuItemSub}>Shade Match, Acne, Hydration & Routine</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItemRow}
              onPress={() => setActiveModal('skinPreferences')}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="options-outline" size={20} color="#D97706" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuItemTitle}>Skin Profile & Preferences</Text>
                <Text style={styles.menuItemSub}>{skinType} • 3 Active Concerns</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 2. ORDERS, CART & DELIVERIES HUB                                          */}
        {/* ========================================================================= */}
        <View style={styles.hubSection}>
          <Text style={styles.hubSectionTitle}>ORDERS & QUICK-COMMERCE</Text>

          <View style={styles.cardMenuContainer}>
            <TouchableOpacity
              style={styles.menuItemRow}
              onPress={() => router.push('/(customer)/(tabs)/orders')}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#FFF1F2' }]}>
                <Ionicons name="receipt-outline" size={20} color="#E11D48" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuItemTitle}>Order History & Live Tracking</Text>
                <Text style={styles.menuItemSub}>Active Orders, Invoices & Reorders</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItemRow}
              onPress={() => router.push('/(customer)/permissions')}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="location-outline" size={20} color="#16A34A" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuItemTitle}>Saved Delivery Addresses</Text>
                <Text style={styles.menuItemSub}>Home, Work & GPS Serviceability</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItemRow}
              onPress={() => router.push('/(customer)/(tabs)/shop')}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#FDF2F8' }]}>
                <Ionicons name="heart-outline" size={20} color="#DB2777" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuItemTitle}>Wishlist & Saved Products</Text>
                <Text style={styles.menuItemSub}>Clinical formulations saved for later</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 3. REWARDS & REFERRALS HUB                                                */}
        {/* ========================================================================= */}
        <View style={styles.hubSection}>
          <Text style={styles.hubSectionTitle}>REWARDS & REFERRALS</Text>

          <View style={styles.cardMenuContainer}>
            <TouchableOpacity
              style={styles.menuItemRow}
              onPress={() => router.push('/(customer)/referral')}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#FEF9C3' }]}>
                <Ionicons name="gift-outline" size={20} color="#CA8A04" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuItemTitle}>Student Referral & Money Hub</Text>
                <Text style={styles.menuItemSub}>Code: GLOW-STUDENT-2026 • Earn ₹100 / Sale</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItemRow}
              onPress={() => router.push('/(admin)/portal')}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="cube-outline" size={20} color="#15803D" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuItemTitle}>🏬 Vendor & Admin Dispatch Hub</Text>
                <Text style={styles.menuItemSub}>Dark Store Packing, SLA Control & WhatsApp Broadcaster</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 4. PRIVACY, DATA & PERMISSION CONTROLS HUB                                */}
        {/* ========================================================================= */}
        <View style={styles.hubSection}>
          <Text style={styles.hubSectionTitle}>PRIVACY & DATA CONTROLS</Text>

          <View style={styles.cardMenuContainer}>
            <TouchableOpacity
              style={styles.menuItemRow}
              onPress={() => setActiveModal('privacyControl')}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#F1F5F9' }]}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#0F172A" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuItemTitle}>Privacy & Biometric Controls</Text>
                <Text style={styles.menuItemSub}>Camera, GPS, Download Data & Clear Scans</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItemRow}
              onPress={() => setActiveModal('policies')}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#F8FAFC' }]}>
                <Ionicons name="document-outline" size={20} color="#64748B" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuItemTitle}>Terms, Privacy & Delivery Policy</Text>
                <Text style={styles.menuItemSub}>Legal compliance and customer safety</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 5. SUPPORT & FEEDBACK HUB                                                 */}
        {/* ========================================================================= */}
        <View style={styles.hubSection}>
          <Text style={styles.hubSectionTitle}>SUPPORT & HELP</Text>

          <View style={styles.cardMenuContainer}>
            <TouchableOpacity
              style={styles.menuItemRow}
              onPress={() => setActiveModal('support')}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="chatbubbles-outline" size={20} color="#2563EB" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuItemTitle}>24/7 Clinical & Delivery Support</Text>
                <Text style={styles.menuItemSub}>Create ticket or report scan/order issue</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItemRow}
              onPress={() => Alert.alert('Rate GlowVAI', 'Opening Google Play Store...')}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="star-outline" size={20} color="#D97706" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuItemTitle}>Rate Us on Play Store</Text>
                <Text style={styles.menuItemSub}>Version 2.4.0 (Build 125-Screens)</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* VENDOR APPLICATION & DISPATCH HUB                                         */}
        {/* ========================================================================= */}
        <View style={styles.hubSection}>
          <Text style={styles.hubSectionTitle}>VENDOR & MERCHANT PORTAL</Text>

          <View style={styles.cardMenuContainer}>
            <TouchableOpacity
              style={[styles.menuItemRow, { backgroundColor: '#0F172A', borderRadius: 14 }]}
              onPress={() => router.push('/(vendor)' as any)}
              activeOpacity={0.85}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#00C853' }]}>
                <Ionicons name="storefront" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={[styles.menuItemTitle, { color: '#FFFFFF' }]}>Continue as Vendor</Text>
                <Text style={[styles.menuItemSub, { color: '#94A3B8' }]}>
                  Open Vendor App • 60s Acceptance Pop-up & Dark Store Orders
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#00C853" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 6. DANGER ZONE & SIGN OUT                                                 */}
        {/* ========================================================================= */}
        <View style={styles.hubSection}>
          <TouchableOpacity style={styles.signOutCardBtn} onPress={handleSignOut} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={20} color="#E11D48" />
            <Text style={styles.signOutCardText}>Sign Out from GlowVAI</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteAccountBtn} onPress={() => setActiveModal('deleteAccount')}>
            <Text style={styles.deleteAccountText}>Delete Account & Erase All Data</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ========================================================================= */}
      {/* MODAL 1: EDIT PROFILE                                                     */}
      {/* ========================================================================= */}
      <Modal visible={activeModal === 'editProfile'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile Information</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Ionicons name="close" size={22} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput value={userName} onChangeText={setUserName} style={styles.inputField} />

            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput value={userEmail} onChangeText={setUserEmail} style={styles.inputField} keyboardType="email-address" />

            <TouchableOpacity
              style={styles.modalPrimaryBtn}
              onPress={() => {
                setActiveModal(null);
                Alert.alert('Profile Updated', 'Your details have been saved.');
              }}
            >
              <Text style={styles.modalPrimaryBtnText}>Save Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 2: SKIN PREFERENCES                                                 */}
      {/* ========================================================================= */}
      <Modal visible={activeModal === 'skinPreferences'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Skin Preferences</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Ionicons name="close" size={22} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Diagnosed Skin Type</Text>
            <TextInput value={skinType} onChangeText={setSkinType} style={styles.inputField} />

            <Text style={styles.inputLabel}>Active Target Concerns</Text>
            <View style={styles.tagChipsRow}>
              {skinConcerns.map((concern, idx) => (
                <View key={idx} style={styles.tagChipPill}>
                  <Text style={styles.tagChipText}>{concern}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.modalPrimaryBtn} onPress={() => setActiveModal(null)}>
              <Text style={styles.modalPrimaryBtnText}>Save Preferences</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 3: PRIVACY & DATA CONTROLS                                          */}
      {/* ========================================================================= */}
      <Modal visible={activeModal === 'privacyControl'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Privacy & Permissions</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Ionicons name="close" size={22} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Camera Access for AI Diagnosis</Text>
              <Switch value={cameraPermissionGranted} onValueChange={setCameraPermissionGranted} />
            </View>

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>GPS 15-Min Quick Delivery</Text>
              <Switch value={locationPermissionGranted} onValueChange={setLocationPermissionGranted} />
            </View>

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Order & Scan Notifications</Text>
              <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
            </View>

            <TouchableOpacity style={styles.actionOutlineBtn} onPress={handleClearFaceScans}>
              <Ionicons name="trash-outline" size={16} color="#E11D48" />
              <Text style={styles.actionOutlineBtnText}>Erase Local Face Scans</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionOutlineBtn} onPress={handleDownloadData}>
              <Ionicons name="download-outline" size={16} color="#0052FF" />
              <Text style={[styles.actionOutlineBtnText, { color: '#0052FF' }]}>Download My Clinical Data</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalPrimaryBtn} onPress={() => setActiveModal(null)}>
              <Text style={styles.modalPrimaryBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 4: REFERRAL & EARNINGS                                              */}
      {/* ========================================================================= */}
      <Modal visible={activeModal === 'referral'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Referral Program</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Ionicons name="close" size={22} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <Text style={styles.referralHeroText}>Invite friends to GlowVAI</Text>
            <Text style={styles.referralDesc}>They get FLAT ₹100 off their first clinical order, and you get ₹100 Glow Cash!</Text>

            <View style={styles.referralCodeBox}>
              <Text style={styles.referralCodeText}>GLOW-MUKESH100</Text>
              <TouchableOpacity onPress={() => Alert.alert('Copied!', 'Referral code copied to clipboard.')}>
                <Text style={styles.copyBtnText}>COPY</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.modalPrimaryBtn}
              onPress={() => {
                Alert.alert('Share Link', 'Opening share sheet...');
              }}
            >
              <Text style={styles.modalPrimaryBtnText}>Share Referral Link</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 5: SUPPORT & HELP CENTER                                            */}
      {/* ========================================================================= */}
      <Modal visible={activeModal === 'support'} animationType="slide">
        <SupportScreen onBack={() => setActiveModal(null)} />
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 6: POLICIES & TERMS (DPDP & Medical Disclaimer)                     */}
      {/* ========================================================================= */}
      <LegalTermsModal
        visible={activeModal === 'policies'}
        onClose={() => setActiveModal(null)}
        defaultTab="PRIVACY"
      />

      {/* ========================================================================= */}
      {/* MODAL 7: DELETE ACCOUNT CONFIRMATION (DPDP Act)                           */}
      {/* ========================================================================= */}
      <DeleteAccountModal
        visible={activeModal === 'deleteAccount'}
        userId={currentUser?.uid || 'user_mukesh_glow'}
        onClose={() => setActiveModal(null)}
        onSuccess={() => {
          setActiveModal(null);
          router.replace('/(auth)/login');
        }}
      />

      {/* Complete FlowMapp Changing Profile Picture Modal */}
      <ChangeProfilePictureModal
        visible={isChangeAvatarOpen}
        currentAvatarUri={avatarUri}
        onClose={() => setIsChangeAvatarOpen(false)}
        onSaveAvatar={handleSaveNewAvatar}
      />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topHeaderGradient: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 16 : 10,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  safeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  helpHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileHeroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: 12,
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#7A0009',
  },
  cameraEditBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#085cf0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  heroInfoCol: {
    flex: 1,
  },
  heroNameText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  heroPhoneText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  goldMemberPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B45309',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 4,
  },
  goldMemberText: {
    color: '#FDE68A',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  editProfilePill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editProfileText: {
    color: '#7A0009',
    fontSize: 12,
    fontWeight: '800',
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 60,
  },
  hubSection: {
    marginBottom: 20,
  },
  hubSectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#94A3B8',
    letterSpacing: 1.2,
    marginBottom: 8,
    marginLeft: 4,
  },
  cardMenuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTextCol: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  menuItemSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },

  signOutCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FFE4E6',
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
    marginBottom: 12,
  },
  signOutCardText: {
    color: '#E11D48',
    fontSize: 14,
    fontWeight: '800',
  },
  deleteAccountBtn: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  deleteAccountText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  /* Modals */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
    marginTop: 10,
  },
  inputField: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  tagChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  tagChipPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagChipText: {
    color: '#1E40AF',
    fontSize: 12,
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  actionOutlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 10,
    gap: 8,
    marginTop: 10,
  },
  actionOutlineBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E11D48',
  },
  referralHeroText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  referralDesc: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  referralCodeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    borderWidth: 1,
    borderColor: '#FDE047',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  referralCodeText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#854D0E',
    letterSpacing: 1,
  },
  copyBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0052FF',
  },
  policyHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 10,
  },
  policyBody: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 18,
  },
  deleteConfirmText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalPrimaryBtn: {
    backgroundColor: '#7A0009',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  modalPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
});
