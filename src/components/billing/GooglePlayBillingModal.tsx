import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  GLOWVAI_PLAY_PRODUCTS,
  PlayProductItem,
  requestGooglePlayPurchase,
} from '../../services/googlePlayBillingService';

const { width } = Dimensions.get('window');

export interface GooglePlayBillingModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (productId: string) => void;
  defaultProductId?: string;
}

export const GooglePlayBillingModal: React.FC<GooglePlayBillingModalProps> = ({
  visible,
  onClose,
  onSuccess,
  defaultProductId = 'glowvai_beauty_insurance_monthly',
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(defaultProductId);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const selectedProduct = GLOWVAI_PLAY_PRODUCTS.find(p => p.productId === selectedProductId) || GLOWVAI_PLAY_PRODUCTS[0];

  const handlePurchase = async () => {
    setIsProcessing(true);
    try {
      const result = await requestGooglePlayPurchase(selectedProductId);
      setIsProcessing(false);

      if (result.success) {
        Alert.alert(
          'Google Play Billing Confirmed! 🎉',
          `Your subscription to ${selectedProduct.title} is now active. Entitlements synced to your account.`,
          [
            {
              text: 'Great!',
              onPress: () => {
                onClose();
                onSuccess?.(selectedProductId);
              },
            },
          ]
        );
      } else {
        Alert.alert('Billing Notice', result.message || 'Purchase could not be processed.');
      }
    } catch (err: any) {
      setIsProcessing(false);
      Alert.alert('Google Play Error', err?.message || 'Transaction failed.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalSheet}>
          {/* Header Bar */}
          <View style={styles.sheetHeader}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="logo-google-playstore" size={20} color="#085cf0" />
              <Text style={styles.headerTitle}>Google Play Billing</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Products Selector */}
            <Text style={styles.sectionLabel}>Select Entitlement / Plan</Text>
            {GLOWVAI_PLAY_PRODUCTS.map(product => {
              const isSelected = product.productId === selectedProductId;
              return (
                <TouchableOpacity
                  key={product.productId}
                  style={[styles.productCard, isSelected && styles.productCardSelected]}
                  onPress={() => setSelectedProductId(product.productId)}
                  activeOpacity={0.88}
                >
                  <View style={styles.productCardTop}>
                    <View style={styles.titleCol}>
                      {product.badgeText && (
                        <View style={styles.badgePill}>
                          <Text style={styles.badgeText}>{product.badgeText}</Text>
                        </View>
                      )}
                      <Text style={[styles.productTitle, isSelected && { color: '#085cf0' }]}>
                        {product.title}
                      </Text>
                    </View>
                    <Text style={styles.productPrice}>{product.price}</Text>
                  </View>

                  <Text style={styles.productDescription}>{product.description}</Text>

                  {/* Feature Bullets */}
                  <View style={styles.featuresList}>
                    {product.features.map((feat, idx) => (
                      <View key={idx} style={styles.featureItem}>
                        <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                        <Text style={styles.featureText}>{feat}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Google Play Security & Cancellation Notice */}
            <View style={styles.playTermsBox}>
              <Ionicons name="shield-checkmark" size={16} color="#085cf0" />
              <Text style={styles.playTermsText}>
                Secured by Google Play. Recurring billing, cancel anytime in Google Play Store settings.
              </Text>
            </View>
          </ScrollView>

          {/* Bottom Purchase Action Button */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.payBtn}
              onPress={handlePurchase}
              disabled={isProcessing}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={['#085cf0', '#0052FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.payGradient}
              >
                {isProcessing ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="logo-google-playstore" size={18} color="#FFFFFF" />
                    <Text style={styles.payBtnText}>Subscribe with Google Play • {selectedProduct.price}</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default GooglePlayBillingModal;

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    padding: 20,
    paddingBottom: 10,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  productCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  productCardSelected: {
    borderColor: '#085cf0',
    backgroundColor: '#F0F6FF',
  },
  productCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  titleCol: {
    flex: 1,
    marginRight: 10,
  },
  badgePill: {
    backgroundColor: '#085cf0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  productTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  productDescription: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 10,
  },
  featuresList: {
    gap: 6,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  playTermsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  playTermsText: {
    flex: 1,
    fontSize: 10,
    color: '#64748B',
    lineHeight: 14,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  payBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#085cf0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  payGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 8,
  },
  payBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
});
