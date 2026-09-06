/**
 * GlowVAI Customer Support & Help Center Screen
 * 
 * Features:
 * - Categorized FAQ Accordion (Order Tracking, Cancellations, Skin Scan, Payment)
 * - 1-Tap WhatsApp Support Deep-Link
 * - Direct Phone Dialer (+91 91234 56789)
 * - Email Support (support@glowvai.com)
 * - 10-Min Delivery Promise Assistance
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface FAQItem {
  id: string;
  category: 'Orders' | 'Delivery' | 'Skin Scan' | 'Payments';
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: '1',
    category: 'Delivery',
    question: 'How does the 10–12 minute delivery work?',
    answer:
      'GlowVAI operates localized micro-darkstores in Vijayawada. When you place an order, our sequential pick-path system picks and packs your skincare items in under 90 seconds, handing it over to a dedicated EV rider.',
  },
  {
    id: '2',
    category: 'Orders',
    question: 'Can I cancel or modify my order after placing it?',
    answer:
      'Due to our ultra-fast 90-second packing SLA, orders enter packing immediately. If you need urgent cancellation, tap the WhatsApp Support button below within 60 seconds of ordering.',
  },
  {
    id: '3',
    category: 'Skin Scan',
    question: 'Is the AI Skin Analysis accurate and medically certified?',
    answer:
      'GlowVAI AI uses a clinical multi-attribute CNN model trained on Indian skin dermatological datasets. It offers cosmetic routine guidance with 94%+ accuracy. It is not a prescription medical diagnostic device.',
  },
  {
    id: '4',
    category: 'Payments',
    question: 'What payment methods are supported?',
    answer:
      'We support Google Pay, PhonePe, Paytm, BHIM UPI, Net Banking, Credit/Debit Cards via Razorpay PG, and Cash on Delivery (COD with QR scan).',
  },
  {
    id: '5',
    category: 'Orders',
    question: 'What if an item is damaged or missing?',
    answer:
      'Every order is sealed with an OTP verification tag. If an item arrives damaged, send a photo to our WhatsApp support team for an instant refund or 10-minute replacement.',
  },
];

export const SupportScreen: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('1');

  const categories = ['All', 'Delivery', 'Orders', 'Skin Scan', 'Payments'];

  const filteredFaqs =
    selectedCategory === 'All'
      ? FAQS
      : FAQS.filter((f) => f.category === selectedCategory);

  const handleWhatsApp = () => {
    const text = encodeURIComponent('Hi GlowVAI Support, I need help with my 10-minute order.');
    Linking.openURL(`https://wa.me/918977855998?text=${text}`).catch(() => {
      Alert.alert('WhatsApp Support', 'WhatsApp us at +91 89778 55998');
    });
  };

  const handleCall = () => {
    Linking.openURL('tel:+918977855998').catch(() => {
      Alert.alert('Phone Call', 'Call our 24/7 hotline at +91 89778 55998');
    });
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@glowvai.com?subject=GlowVAI%20Support%20Request').catch(() => {
      Alert.alert('Email Support', 'Send an email to support@glowvai.com');
    });
  };

  return (
    <View style={s.root}>
      {/* Top Header */}
      <View style={s.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#1E293B" />
          </TouchableOpacity>
        )}
        <View style={s.headerTextCol}>
          <Text style={s.headerTitle}>Help & Support</Text>
          <Text style={s.headerSub}>24/7 Assistance • 10-Min Fast Resolution</Text>
        </View>
        <TouchableOpacity style={s.liveBadge} onPress={handleWhatsApp}>
          <View style={s.liveDot} />
          <Text style={s.liveText}>Online</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Quick Contact Cards */}
        <Text style={s.sectionHeader}>Instant Channels</Text>
        <View style={s.channelRow}>
          <TouchableOpacity style={[s.channelCard, s.whatsappCard]} onPress={handleWhatsApp} activeOpacity={0.8}>
            <View style={s.channelIconWrap}>
              <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
            </View>
            <Text style={s.channelTitle}>WhatsApp</Text>
            <Text style={s.channelSub}>Instant reply &lt; 2 mins</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[s.channelCard, s.callCard]} onPress={handleCall} activeOpacity={0.8}>
            <View style={s.channelIconWrap}>
              <Ionicons name="call" size={24} color="#0284C7" />
            </View>
            <Text style={s.channelTitle}>Direct Call</Text>
            <Text style={s.channelSub}>Speak to an agent</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[s.channelCard, s.emailCard]} onPress={handleEmail} activeOpacity={0.8}>
            <View style={s.channelIconWrap}>
              <Ionicons name="mail" size={24} color="#7C3AED" />
            </View>
            <Text style={s.channelTitle}>Email</Text>
            <Text style={s.channelSub}>Official grievances</Text>
          </TouchableOpacity>
        </View>

        {/* Category Pills */}
        <Text style={[s.sectionHeader, { marginTop: 24 }]}>Frequently Asked Questions</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.pillsRow}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[s.pill, isSelected && s.pillActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[s.pillText, isSelected && s.pillTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* FAQ List */}
        <View style={s.faqList}>
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;
            return (
              <TouchableOpacity
                key={faq.id}
                style={[s.faqCard, isExpanded && s.faqCardActive]}
                onPress={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                activeOpacity={0.8}
              >
                <View style={s.faqQuestionRow}>
                  <View style={s.categoryTag}>
                    <Text style={s.categoryTagText}>{faq.category}</Text>
                  </View>
                  <Text style={s.faqQuestion}>{faq.question}</Text>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color="#64748B"
                  />
                </View>
                {isExpanded && (
                  <View style={s.faqAnswerWrap}>
                    <Text style={s.faqAnswer}>{faq.answer}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* DPDP Grievance Notice */}
        <View style={s.grievanceCard}>
          <MaterialCommunityIcons name="shield-check" size={22} color="#059669" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={s.grievanceTitle}>DPDP Act Grievance Officer</Text>
            <Text style={s.grievanceText}>
              Dr. Mukesh Glow • grievance@glowvai.com • Response within 24 business hours.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SupportScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  headerTextCol: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  headerSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
  liveText: { fontSize: 11, fontWeight: '700', color: '#047857' },
  scrollContent: { padding: 20 },
  sectionHeader: { fontSize: 15, fontWeight: '800', color: '#1E293B', marginBottom: 12 },
  channelRow: { flexDirection: 'row', gap: 10 },
  channelCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  whatsappCard: { borderColor: '#BBF7D0' },
  callCard: { borderColor: '#BAE6FD' },
  emailCard: { borderColor: '#DDD6FE' },
  channelIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  channelTitle: { fontSize: 13, fontWeight: '800', color: '#0F172A' },
  channelSub: { fontSize: 10, color: '#64748B', marginTop: 2, textAlign: 'center' },
  pillsRow: { flexDirection: 'row', marginBottom: 16 },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  pillActive: { backgroundColor: '#0F172A', borderColor: '#0F172A' },
  pillText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  pillTextActive: { color: '#FFFFFF' },
  faqList: { gap: 10 },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  faqCardActive: { borderColor: '#CBD5E1' },
  faqQuestionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  categoryTag: { backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginRight: 8 },
  categoryTagText: { fontSize: 10, fontWeight: '700', color: '#475569' },
  faqQuestion: { flex: 1, fontSize: 13, fontWeight: '700', color: '#1E293B', paddingRight: 8 },
  faqAnswerWrap: { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  faqAnswer: { fontSize: 13, color: '#475569', lineHeight: 20 },
  grievanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 14,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  grievanceTitle: { fontSize: 12, fontWeight: '800', color: '#166534' },
  grievanceText: { fontSize: 11, color: '#15803D', marginTop: 2, lineHeight: 16 },
});
