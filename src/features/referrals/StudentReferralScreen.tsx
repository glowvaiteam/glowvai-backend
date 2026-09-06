import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Modal,
  Platform,
  Alert,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppFonts } from '../../hooks/useAppFonts';

const { width } = Dimensions.get('window');

export const StudentReferralScreen: React.FC = () => {
  const router = useRouter();
  const { isLoaded, fontFamily } = useAppFonts();

  // State Management
  const [walletBalance, setWalletBalance] = useState(250);
  const [pendingCoins, setPendingCoins] = useState(150);
  const [totalReferredUsers, setTotalReferredUsers] = useState(4);
  const [activeTab, setActiveTab] = useState<'wallet' | 'referral' | 'history'>('wallet');

  // Modals matching uploaded images
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showQrTicketModal, setShowQrTicketModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('Your coins have been credited to your GlowVAI Wallet!');

  const referralCode = 'GLOW-STUDENT-2026';
  const referralLink = `https://glowvai.com/join?ref=${referralCode}`;

  const handleShareReferral = async () => {
    try {
      await Share.share({
        message: `Hey! Use my student code ${referralCode} to get FLAT ₹100 OFF your first clinical skincare order on GlowVAI! Download here: ${referralLink}`,
      });
    } catch {
      Alert.alert('Share Referral', `Code: ${referralCode}`);
    }
  };

  const handleClaimGiftCard = () => {
    Alert.prompt
      ? Alert.prompt('Claim Gift Card', 'Enter your 16-digit GlowVAI gift voucher code:', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Claim',
            onPress: () => {
              setWalletBalance(prev => prev + 500);
              setSuccessMessage('₹500 Gift Voucher successfully added to your balance!');
              setShowSuccessModal(true);
            },
          },
        ])
      : Alert.alert('Claim Gift Card', 'Voucher #GLOW-GIFT-500 claimed! ₹500 added to your wallet.', [
          {
            text: 'OK',
            onPress: () => {
              setWalletBalance(prev => prev + 500);
              setSuccessMessage('₹500 Gift Voucher successfully added to your balance!');
              setShowSuccessModal(true);
            },
          },
        ]);
  };

  const syneFont = isLoaded && fontFamily ? fontFamily.syneBold || fontFamily.syneExtraBold : undefined;

  return (
    <View style={styles.rootContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FCD34D" />

      {/* ========================================================================= */}
      {/* 1. TOP GLOWVAI MONEY HEADER (EXACT IMAGE 1: BLINKIT MONEY STYLE)          */}
      {/* ========================================================================= */}
      <LinearGradient
        colors={['#FBBF24', '#FCD34D', '#FDE68A']}
        style={styles.moneyHeroHeader}
      >
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.topNavRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.circleNavBtn}>
              <Ionicons name="arrow-back" size={20} color="#0F172A" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowAchievementModal(true)}
              style={styles.circleNavBtn}
            >
              <Ionicons name="trophy-outline" size={18} color="#0F172A" />
            </TouchableOpacity>
          </View>

          {/* 3D Glowing Wallet Icon */}
          <View style={styles.wallet3dIconWrapper}>
            <LinearGradient
              colors={['#65A30D', '#4D7C0F', '#3F6212']}
              style={styles.wallet3dCard}
            >
              <Text style={styles.rupee3dSymbol}>₹</Text>
            </LinearGradient>
          </View>

          {/* Brand Title */}
          <Text style={styles.brandSubtitle}>glowvai</Text>
          <Text
            style={[
              styles.brandMoneyTitle,
              syneFont ? { fontFamily: syneFont } : { fontWeight: '900' },
            ]}
          >
            MONEY
          </Text>
          <Text style={styles.balancePillText}>Available Balance: ₹{walletBalance}</Text>
        </SafeAreaView>

        {/* 3 Feature Cards (Single tap, Zero failures, Real-time refunds) */}
        <View style={styles.featureCardsContainer}>
          <View style={styles.featureCard}>
            <View style={styles.featureIconCircle}>
              <Ionicons name="phone-portrait-outline" size={22} color="#D97706" />
            </View>
            <View style={styles.featureTextCol}>
              <Text style={styles.featureTitle}>Single tap payments</Text>
              <Text style={styles.featureDesc}>
                Enjoy seamless payments without the wait for OTPs
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconCircle}>
              <Ionicons name="shield-checkmark-outline" size={22} color="#D97706" />
            </View>
            <View style={styles.featureTextCol}>
              <Text style={styles.featureTitle}>Zero failures</Text>
              <Text style={styles.featureDesc}>
                Zero payment failures ensure you never miss a 15-min drop
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconCircle}>
              <Ionicons name="flash-outline" size={22} color="#D97706" />
            </View>
            <View style={styles.featureTextCol}>
              <Text style={styles.featureTitle}>Real-time refunds</Text>
              <Text style={styles.featureDesc}>
                No need to wait for refunds. GlowVAI Money refunds are instant!
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* SCROLLABLE BODY */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollBodyContent}
      >
        {/* Green "Add Money" Button (Image 1) */}
        <TouchableOpacity
          style={styles.greenAddMoneyBtn}
          onPress={() => {
            setWalletBalance(prev => prev + 200);
            setSuccessMessage('₹200 successfully added to your GlowVAI Money balance!');
            setShowSuccessModal(true);
          }}
          activeOpacity={0.88}
        >
          <Text style={styles.greenAddMoneyBtnText}>Add Money</Text>
        </TouchableOpacity>

        {/* Claim Gift Card Row (Image 1) */}
        <TouchableOpacity
          style={styles.claimGiftCardRow}
          onPress={handleClaimGiftCard}
          activeOpacity={0.85}
        >
          <View style={styles.giftIconCircle}>
            <Ionicons name="gift" size={20} color="#D97706" />
          </View>
          <View style={styles.giftTextCol}>
            <Text style={styles.giftTitleText}>Claim Gift Card</Text>
            <Text style={styles.giftSubText}>
              Enter gift card details to claim your student voucher
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>

        {/* ========================================================================= */}
        {/* 2. STUDENT REFERRAL PROGRAM (V2) DASHBOARD                                 */}
        {/* ========================================================================= */}
        <View style={styles.studentProgramSection}>
          <View style={styles.programHeaderRow}>
            <View style={styles.studentBadgePill}>
              <Ionicons name="school" size={12} color="#FFFFFF" />
              <Text style={styles.studentBadgeText}>STUDENT EXCLUSIVE (V2)</Text>
            </View>
            <TouchableOpacity onPress={() => setShowInvoiceModal(true)}>
              <Text style={styles.viewHistoryLink}>Invoice & Orders ›</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.studentProgramTitle}>GlowVAI Student Referral Program</Text>
          <Text style={styles.studentProgramDesc}>
            Earn real coins when fellow students order genuine clinical skincare. Rewards are credited only after the return/refund window passes.
          </Text>

          {/* 3-Pill Coin Breakdown */}
          <View style={styles.coinBreakdownRow}>
            <View style={styles.coinStatCard}>
              <Text style={styles.coinStatValue}>₹{walletBalance}</Text>
              <Text style={styles.coinStatLabel}>Available Coins</Text>
            </View>

            <View style={[styles.coinStatCard, { borderColor: '#FEF08A' }]}>
              <Text style={[styles.coinStatValue, { color: '#CA8A04' }]}>₹{pendingCoins}</Text>
              <Text style={styles.coinStatLabel}>Pending (7-Day)</Text>
            </View>

            <View style={[styles.coinStatCard, { borderColor: '#E2E8F0' }]}>
              <Text style={[styles.coinStatValue, { color: '#059669' }]}>{totalReferredUsers}</Text>
              <Text style={styles.coinStatLabel}>Friends Joined</Text>
            </View>
          </View>

          {/* Referral Code Box */}
          <View style={styles.referralCodeBox}>
            <View>
              <Text style={styles.referralCodeLabel}>YOUR STUDENT CODE</Text>
              <Text style={styles.referralCodeValue}>{referralCode}</Text>
            </View>
            <TouchableOpacity
              style={styles.sharePillBtn}
              onPress={handleShareReferral}
              activeOpacity={0.85}
            >
              <Ionicons name="share-social" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.sharePillBtnText}>Share</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Action Shortcuts */}
          <View style={styles.quickShortcutsRow}>
            <TouchableOpacity
              style={styles.shortcutBtn}
              onPress={() => setShowQrTicketModal(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="qr-code-outline" size={18} color="#0052FF" />
              <Text style={styles.shortcutBtnText}>Delivery QR Pass</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shortcutBtn}
              onPress={() => setShowInvoiceModal(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="receipt-outline" size={18} color="#059669" />
              <Text style={styles.shortcutBtnText}>View Receipt</Text>
            </TouchableOpacity>
          </View>

          {/* Anti-Fraud & Regulatory Notice (India Compliant) */}
          <View style={styles.complianceNoticeBox}>
            <Ionicons name="shield-checkmark" size={16} color="#059669" style={{ marginRight: 6 }} />
            <Text style={styles.complianceNoticeText}>
              Compliant with Direct Selling Guidelines (India). Rewards arise strictly from delivered product sales with 100% refund protection.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ========================================================================= */}
      {/* MODAL 1: NEW ACHIEVEMENT UNLOCKED (EXACT IMAGE 2)                         */}
      {/* ========================================================================= */}
      <Modal visible={showAchievementModal} animationType="slide" transparent>
        <View style={styles.achievementOverlay}>
          <View style={styles.achievementCard}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.achievementCloseBtn}
              onPress={() => setShowAchievementModal(false)}
            >
              <Ionicons name="close" size={20} color="#6B21A8" />
            </TouchableOpacity>

            {/* Confetti & Title Header */}
            <Text style={styles.achievementHeaderTitle}>NEW ACHIEVEMENT UNLOCKED</Text>
            <Text style={styles.achievementRankSubtitle}>GOLD BEGINNER</Text>

            {/* 3D Gold Trophy */}
            <View style={styles.trophyContainer}>
              <LinearGradient
                colors={['#FBBF24', '#F59E0B', '#D97706']}
                style={styles.trophyCupBody}
              >
                <Ionicons name="star" size={32} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.trophyBase} />
            </View>

            {/* XP / Coins Badge */}
            <View style={styles.earnedXpPill}>
              <Text style={styles.earnedXpText}>EARNED +250 COINS</Text>
            </View>

            <Text style={styles.achievementDesc}>
              Congratulations! Your referred friend's first clinical order was delivered and passed the return window.
            </Text>

            {/* Continue Button */}
            <TouchableOpacity
              style={styles.achievementContinueBtn}
              onPress={() => setShowAchievementModal(false)}
              activeOpacity={0.88}
            >
              <Text style={styles.achievementContinueText}>CONTINUE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 2: INTERACTIVE INVOICE PRINTER (EXACT IMAGE 3)                      */}
      {/* ========================================================================= */}
      <Modal visible={showInvoiceModal} animationType="slide" transparent>
        <View style={styles.invoiceOverlay}>
          <View style={styles.invoiceSlotWrapper}>
            {/* Terminal Slot */}
            <View style={styles.terminalSlotBlack}>
              <View style={styles.terminalSlotGlow} />
            </View>

            {/* Receipt Coming Out of Slot */}
            <View style={styles.paperReceiptCard}>
              <View style={styles.receiptTopDottedRow}>
                <Text style={styles.receiptInvoiceTitle}>GlowVAI Quick-Commerce Invoice</Text>
                <Text style={styles.receiptOrderDate}>#GLOW-2026-INV • 15-Min Delivery</Text>
              </View>

              <View style={styles.receiptTotalRow}>
                <View>
                  <Text style={styles.receiptTotalLabel}>Total Paid</Text>
                  <Text style={styles.receiptTotalValue}>₹599</Text>
                </View>
                <View>
                  <Text style={styles.receiptTotalLabel}>Coins Earned</Text>
                  <Text style={styles.receiptTotalCoins}>+100 Coins</Text>
                </View>
              </View>

              {/* Items List */}
              <View style={styles.receiptItemsList}>
                <View style={styles.receiptItemRow}>
                  <Text style={styles.receiptItemName}>Minimalist 10% Niacinamide</Text>
                  <View style={styles.paidGreenBadge}>
                    <Text style={styles.paidGreenText}>✓ Delivered</Text>
                  </View>
                </View>

                <View style={styles.receiptItemRow}>
                  <Text style={styles.receiptItemName}>The Derma Co 1% Hyaluronic Sunscreen</Text>
                  <View style={styles.paidGreenBadge}>
                    <Text style={styles.paidGreenText}>✓ Delivered</Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.receiptActionsRow}>
                <TouchableOpacity
                  style={styles.receiptActionBtn}
                  onPress={() => {
                    setShowInvoiceModal(false);
                    Alert.alert('Invoice Downloaded', 'PDF invoice saved to downloads.');
                  }}
                >
                  <Text style={styles.receiptActionBtnText}>Download Invoice</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.receiptActionBtn, { backgroundColor: '#1E293B' }]}
                  onPress={() => setShowInvoiceModal(false)}
                >
                  <Text style={[styles.receiptActionBtnText, { color: '#FFFFFF' }]}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 3: 15-MIN QUICK DROP QR TICKET PASS (EXACT IMAGE 4)                 */}
      {/* ========================================================================= */}
      <Modal visible={showQrTicketModal} animationType="slide" transparent>
        <View style={styles.qrTicketOverlay}>
          <LinearGradient
            colors={['#ECFDF5', '#D1FAE5', '#A7F3D0']}
            style={styles.qrTicketCard}
          >
            {/* Top Verified Circle Badge */}
            <View style={styles.qrCheckCircle}>
              <Ionicons name="checkmark-circle" size={48} color="#059669" />
            </View>

            <Text style={styles.qrConfirmedTitle}>Order & Delivery Confirmed!</Text>
            <Text style={styles.qrConfirmedSub}>Your rider is en route to your doorstep.</Text>

            {/* Ticket Card with QR Code */}
            <View style={styles.innerTicketBox}>
              <View style={styles.ticketDetailsRow}>
                <View>
                  <Text style={styles.ticketLabel}>ESTIMATED DELIVERY</Text>
                  <Text style={styles.ticketValue}>15 Minutes</Text>
                </View>
                <View>
                  <Text style={styles.ticketLabel}>TOTAL PAID</Text>
                  <Text style={styles.ticketValue}>₹599</Text>
                </View>
              </View>

              {/* QR Code Graphic */}
              <View style={styles.qrCodeGraphicBox}>
                <Ionicons name="qr-code" size={100} color="#0F172A" />
                <Text style={styles.qrCodeInstruction}>
                  Show this QR pass to your GlowVAI delivery partner
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.qrDoneBtn}
              onPress={() => setShowQrTicketModal(false)}
              activeOpacity={0.88}
            >
              <Text style={styles.qrDoneBtnText}>Back to Home</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 4: UNIVERSAL SUCCESS ACTION SHEET (EXACT IMAGE 5)                   */}
      {/* ========================================================================= */}
      <Modal visible={showSuccessModal} animationType="fade" transparent>
        <View style={styles.successSheetOverlay}>
          <View style={styles.successSheetCard}>
            {/* Scalloped Green Seal with Checkmark */}
            <View style={styles.scallopedGreenSeal}>
              <Ionicons name="checkmark" size={36} color="#059669" />
            </View>

            <Text style={styles.successSheetTitle}>Successful</Text>
            <Text style={styles.successSheetMessage}>{successMessage}</Text>

            <TouchableOpacity
              style={styles.successDoneBtn}
              onPress={() => setShowSuccessModal(false)}
              activeOpacity={0.88}
            >
              <Text style={styles.successDoneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default StudentReferralScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  /* 1. GlowVAI Money Hero (Image 1) */
  moneyHeroHeader: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 16 : 10,
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerSafeArea: {
    alignItems: 'center',
  },
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  circleNavBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wallet3dIconWrapper: {
    marginVertical: 6,
  },
  wallet3dCard: {
    width: 68,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-8deg' }],
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  rupee3dSymbol: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
  },
  brandSubtitle: {
    color: '#78350F',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'lowercase',
  },
  brandMoneyTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 2,
    marginTop: -2,
  },
  balancePillText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },

  /* 3 Feature Cards */
  featureCardsContainer: {
    marginTop: 14,
    gap: 8,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  featureIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  featureTextCol: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  featureDesc: {
    fontSize: 11,
    color: '#78350F',
    marginTop: 1,
  },

  /* Scroll Body */
  scrollBodyContent: {
    padding: 16,
    paddingBottom: 50,
  },
  greenAddMoneyBtn: {
    backgroundColor: '#15803D',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#15803D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 12,
  },
  greenAddMoneyBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  claimGiftCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  giftIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  giftTextCol: {
    flex: 1,
  },
  giftTitleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  giftSubText: {
    fontSize: 11,
    color: '#64748B',
  },

  /* Student Referral Section */
  studentProgramSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  programHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  studentBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  studentBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  viewHistoryLink: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0052FF',
  },
  studentProgramTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  studentProgramDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 14,
  },
  coinBreakdownRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  coinStatCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  coinStatValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  coinStatLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  referralCodeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    borderWidth: 1,
    borderColor: '#FDE047',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  referralCodeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#854D0E',
    letterSpacing: 0.5,
  },
  referralCodeValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 1,
  },
  sharePillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#15803D',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  sharePillBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  quickShortcutsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  shortcutBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
  },
  shortcutBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  complianceNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    padding: 8,
  },
  complianceNoticeText: {
    fontSize: 10,
    color: '#166534',
    flex: 1,
    lineHeight: 14,
    fontWeight: '500',
  },

  /* Modal 1: Achievement (Image 2) */
  achievementOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  achievementCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#EDE9FE',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  achievementCloseBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DDD6FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementHeaderTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#581C87',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  achievementRankSubtitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#7C3AED',
    marginTop: 2,
    marginBottom: 14,
  },
  trophyContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  trophyCupBody: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D97706',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  trophyBase: {
    width: 50,
    height: 14,
    backgroundColor: '#78350F',
    borderRadius: 4,
    marginTop: -4,
  },
  earnedXpPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 10,
    marginBottom: 10,
  },
  earnedXpText: {
    color: '#7C3AED',
    fontSize: 11,
    fontWeight: '900',
  },
  achievementDesc: {
    fontSize: 12,
    color: '#6B21A8',
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 18,
  },
  achievementContinueBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
  },
  achievementContinueText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  /* Modal 2: Invoice (Image 3) */
  invoiceOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  invoiceSlotWrapper: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  terminalSlotBlack: {
    width: '90%',
    height: 24,
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  terminalSlotGlow: {
    width: '70%',
    height: 4,
    backgroundColor: '#38BDF8',
    borderRadius: 2,
  },
  paperReceiptCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    padding: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  receiptTopDottedRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    borderStyle: 'dashed',
    paddingBottom: 10,
    marginBottom: 10,
  },
  receiptInvoiceTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  receiptOrderDate: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  receiptTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  receiptTotalLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  receiptTotalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  receiptTotalCoins: {
    fontSize: 13,
    fontWeight: '900',
    color: '#059669',
  },
  receiptItemsList: {
    gap: 8,
    marginBottom: 14,
  },
  receiptItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptItemName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 6,
  },
  paidGreenBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  paidGreenText: {
    color: '#15803D',
    fontSize: 9,
    fontWeight: '800',
  },
  receiptActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  receiptActionBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  receiptActionBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },

  /* Modal 3: QR Pass (Image 4) */
  qrTicketOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  qrTicketCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
  },
  qrCheckCircle: {
    marginBottom: 6,
  },
  qrConfirmedTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#065F46',
    letterSpacing: -0.3,
  },
  qrConfirmedSub: {
    fontSize: 12,
    color: '#047857',
    marginTop: 2,
    marginBottom: 16,
  },
  innerTicketBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  ticketDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    borderStyle: 'dashed',
    paddingBottom: 10,
    marginBottom: 12,
  },
  ticketLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
  },
  ticketValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  qrCodeGraphicBox: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  qrCodeInstruction: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
  },
  qrDoneBtn: {
    backgroundColor: '#059669',
    borderRadius: 14,
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
  },
  qrDoneBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  /* Modal 4: Success Sheet (Image 5) */
  successSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  successSheetCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  scallopedGreenSeal: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#A7F3D0',
  },
  successSheetTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  successSheetMessage: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  successDoneBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
  },
  successDoneBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
