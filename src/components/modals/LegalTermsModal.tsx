/**
 * Legal Terms, DPDP Act 2023 Privacy Policy & Medical Disclaimer Modal
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface LegalTermsModalProps {
  visible: boolean;
  onClose: () => void;
  defaultTab?: 'PRIVACY' | 'TERMS' | 'MEDICAL_DISCLAIMER';
}

export const LegalTermsModal: React.FC<LegalTermsModalProps> = ({
  visible,
  onClose,
  defaultTab = 'MEDICAL_DISCLAIMER',
}) => {
  const [activeTab, setActiveTab] = useState<'PRIVACY' | 'TERMS' | 'MEDICAL_DISCLAIMER'>(defaultTab);

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={s.root}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={onClose} style={s.closeBtn}>
            <Ionicons name="close" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Legal, Privacy & Compliance</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Tab Navigation */}
        <View style={s.tabBar}>
          <TouchableOpacity
            style={[s.tabItem, activeTab === 'MEDICAL_DISCLAIMER' && s.tabItemActive]}
            onPress={() => setActiveTab('MEDICAL_DISCLAIMER')}
          >
            <Text style={[s.tabText, activeTab === 'MEDICAL_DISCLAIMER' && s.tabTextActive]}>
              AI Disclaimer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.tabItem, activeTab === 'PRIVACY' && s.tabItemActive]}
            onPress={() => setActiveTab('PRIVACY')}
          >
            <Text style={[s.tabText, activeTab === 'PRIVACY' && s.tabTextActive]}>
              DPDP Privacy
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.tabItem, activeTab === 'TERMS' && s.tabItemActive]}
            onPress={() => setActiveTab('TERMS')}
          >
            <Text style={[s.tabText, activeTab === 'TERMS' && s.tabTextActive]}>
              Terms of Service
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Body */}
        <ScrollView style={s.content} contentContainerStyle={s.contentContainer}>
          {activeTab === 'MEDICAL_DISCLAIMER' && (
            <View style={s.section}>
              <View style={s.alertBanner}>
                <MaterialCommunityIcons name="alert-decagram" size={28} color="#DC2626" />
                <Text style={s.alertBannerTitle}>Non-Medical Device Disclaimer</Text>
                <Text style={s.alertBannerBody}>
                  GlowVAI AI Skin Diagnostic provides cosmetic routine guidance and is NOT a substitute for professional clinical medical advice, diagnosis, or treatment.
                </Text>
              </View>

              <Text style={s.h2}>1. Nature of the Service</Text>
              <Text style={s.p}>
                The AI face scanner operates as an automated cosmetic guidance tool. It evaluates visible surface skin characteristics (pigmentation, hydration levels, pore visibility, and texture) using computer vision models.
              </Text>

              <Text style={s.h2}>2. Dermatologist Escalation</Text>
              <Text style={s.p}>
                If you experience severe acne, cyst-like lesions, persistent rashes, bleeding moles, or chronic skin allergies, discontinue topical cosmetic product use and consult a certified medical dermatologist immediately.
              </Text>
            </View>
          )}

          {activeTab === 'PRIVACY' && (
            <View style={s.section}>
              <Text style={s.h1}>DPDP Act 2023 Compliant Privacy Policy</Text>
              <Text style={s.timestamp}>Last Updated: August 2026 • India Jurisdiction</Text>

              <Text style={s.h2}>1. Data We Collect</Text>
              <Text style={s.p}>
                • Biometric Facial Imagery: Processed strictly in-memory for CNN cosmetic inference. Image data is never sold to third-party ad brokers.
                {'\n'}• Precise Geolocation: Used solely to calculate the 10–12 minute delivery polygon from our Vijayawada darkstore.
                {'\n'}• Contact & Order Data: Name, mobile number, and delivery address to fulfill orders.
              </Text>

              <Text style={s.h2}>2. Your Rights Under DPDP Act 2023</Text>
              <Text style={s.p}>
                You have the absolute right to:
                {'\n'}• Access and review all data associated with your account.
                {'\n'}• Request immediate erasure of your profile and face scans via the in-app Delete Account modal.
                {'\n'}• Nominate a representative in case of incapacity.
              </Text>

              <Text style={s.h2}>3. Grievance Redressal</Text>
              <Text style={s.p}>
                Grievance Officer: Dr. Mukesh Glow{'\n'}Email: grievance@glowvai.com{'\n'}Response SLA: Within 24 business hours.
              </Text>
            </View>
          )}

          {activeTab === 'TERMS' && (
            <View style={s.section}>
              <Text style={s.h1}>Terms of Service</Text>
              <Text style={s.timestamp}>Version 2.0 • GlowVAI Platforms Private Limited</Text>

              <Text style={s.h2}>1. Q-Commerce Delivery SLA</Text>
              <Text style={s.p}>
                Deliveries are fulfilled from hyper-local darkstores within a 2–4 km radius. While we target 10–12 minutes, delivery times may vary slightly during extreme weather or severe urban traffic congestion.
              </Text>

              <Text style={s.h2}>2. Returns & Replacements</Text>
              <Text style={s.p}>
                Skincare products are intimate health items. We accept instant returns at delivery for damaged, expired, or incorrect products verified via the delivery OTP.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default LegalTermsModal;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', backgroundColor: '#F8FAFC' },
  tabItem: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabItemActive: { borderBottomColor: '#0F172A', backgroundColor: '#FFFFFF' },
  tabText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  tabTextActive: { color: '#0F172A', fontWeight: '800' },
  content: { flex: 1 },
  contentContainer: { padding: 20 },
  section: { gap: 12 },
  alertBanner: {
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
    marginBottom: 10,
  },
  alertBannerTitle: { fontSize: 15, fontWeight: '900', color: '#991B1B', marginTop: 6, textAlign: 'center' },
  alertBannerBody: { fontSize: 12, color: '#7F1D1D', textAlign: 'center', marginTop: 4, lineHeight: 18 },
  h1: { fontSize: 20, fontWeight: '900', color: '#0F172A' },
  timestamp: { fontSize: 11, color: '#94A3B8', marginBottom: 10 },
  h2: { fontSize: 14, fontWeight: '800', color: '#1E293B', marginTop: 10 },
  p: { fontSize: 13, color: '#475569', lineHeight: 20 },
});
