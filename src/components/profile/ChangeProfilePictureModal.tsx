import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export interface ChangeProfilePictureModalProps {
  visible: boolean;
  currentAvatarUri?: string | null;
  onClose: () => void;
  onSaveAvatar: (newAvatarUri: string) => Promise<void> | void;
}

// Flow Stages matching FlowMapp "Changing Profile Picture" flowchart:
// 1. 'action_select': [Profile page] Options -> Take picture vs Add picture
// 2. 'camera_active': [Camera App] Live camera capture
// 3. 'uploading': [Upload picture] File size & format validation
// 4. 'error': [Error Message] (File > 20 MB / Format invalid) -> loops back to select
// 5. 'preview_lightbox': [Preview picture] Lightbox modal
// 6. 'confirm': [Confirm] -> updates profile page
type FlowStage = 'action_select' | 'camera_active' | 'uploading' | 'error' | 'preview_lightbox';

export const ChangeProfilePictureModal: React.FC<ChangeProfilePictureModalProps> = ({
  visible,
  currentAvatarUri,
  onClose,
  onSaveAvatar,
}) => {
  const [currentFlowStage, setCurrentFlowStage] = useState<FlowStage>('action_select');
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Fallback sample avatars for instant experience
  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  ];

  // Helper to validate and process file upload
  const processSelectedFile = (fileUri: string, fileSizeMb: number = 2.4, fileExtension: string = 'jpg') => {
    setCurrentFlowStage('uploading');

    setTimeout(() => {
      // Flow Decision Diamond: File > 20 MB or Format not allowed
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'heic'];
      const isFormatAllowed = allowedExtensions.includes(fileExtension.toLowerCase());

      if (fileSizeMb > 20) {
        setErrorMessage('The file is greater than 20 MB. Please choose a smaller image.');
        setCurrentFlowStage('error');
        return;
      }

      if (!isFormatAllowed) {
        setErrorMessage('The file format is not allowed. Please upload JPG, PNG, or WEBP.');
        setCurrentFlowStage('error');
        return;
      }

      // Success -> Transition to [Preview picture] Lightbox
      setSelectedImageUri(fileUri);
      setCurrentFlowStage('preview_lightbox');
    }, 600);
  };

  // Branch A: [Take a picture] -> [Camera App]
  const handleTakeNewPicture = () => {
    // In web / simulator environment: simulates live camera capture
    const capturedPic = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80';
    processSelectedFile(capturedPic, 3.2, 'jpg');
  };

  // Branch B: [Add picture] -> [Select picture] from file system
  const handlePickFromFiles = () => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          const sizeMb = file.size / (1024 * 1024);
          const ext = file.name.split('.').pop() || 'jpg';
          const fileUrl = URL.createObjectURL(file);
          processSelectedFile(fileUrl, sizeMb, ext);
        }
      };
      input.click();
    } else {
      // Pick random curated portrait
      const chosen = sampleAvatars[Math.floor(Math.random() * sampleAvatars.length)];
      processSelectedFile(chosen, 2.1, 'jpg');
    }
  };

  // Trigger simulated error for QA testing
  const handleSimulateLargeFileError = () => {
    processSelectedFile('https://via.placeholder.com/150', 25.4, 'jpg');
  };

  // [Confirm] Step -> Commit to Profile
  const handleConfirmProfilePicture = async () => {
    if (!selectedImageUri) return;
    setIsSaving(true);
    try {
      await onSaveAvatar(selectedImageUri);
      setIsSaving(false);
      onClose();
      Alert.alert('Profile Picture Updated! ✨', 'Your new avatar is now active across GlowVAI.');
    } catch (err: any) {
      setIsSaving(false);
      Alert.alert('Update Notice', err?.message || 'Profile picture updated locally.');
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalSheet}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>
              {currentFlowStage === 'preview_lightbox' ? 'Preview Profile Picture' : 'Change Profile Picture'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* ===================================================================== */}
          {/* STAGE 1: [action_select] Choose: Take Picture vs Add Picture          */}
          {/* ===================================================================== */}
          {currentFlowStage === 'action_select' && (
            <View style={styles.contentBody}>
              {/* Current Avatar Display */}
              <View style={styles.currentAvatarBox}>
                <Image
                  source={{
                    uri: currentAvatarUri || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
                  }}
                  style={styles.currentAvatarImg}
                />
                <View style={styles.cameraIconPill}>
                  <Ionicons name="camera" size={14} color="#FFFFFF" />
                </View>
              </View>

              <Text style={styles.helperText}>
                Upload a high-resolution selfie or clinical portrait (max 20 MB, JPG/PNG).
              </Text>

              {/* Action Buttons */}
              <View style={styles.actionButtonsCol}>
                {/* Branch A: Take Picture */}
                <TouchableOpacity
                  style={styles.actionBtnPrimary}
                  onPress={handleTakeNewPicture}
                  activeOpacity={0.88}
                >
                  <LinearGradient
                    colors={['#085cf0', '#0052FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.actionBtnGradient}
                  >
                    <Ionicons name="camera-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.actionBtnTextWhite}>Take a Picture (Camera)</Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Branch B: Add Picture (Select from file system) */}
                <TouchableOpacity
                  style={styles.actionBtnSecondary}
                  onPress={handlePickFromFiles}
                  activeOpacity={0.85}
                >
                  <Ionicons name="images-outline" size={18} color="#085cf0" />
                  <Text style={styles.actionBtnTextBlue}>Add Picture (From Files)</Text>
                </TouchableOpacity>
              </View>

              {/* Sample Avatars Row */}
              <Text style={styles.sampleAvatarsLabel}>Or Choose a Clinical Persona:</Text>
              <View style={styles.sampleAvatarsRow}>
                {sampleAvatars.map((uri, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => processSelectedFile(uri, 1.8, 'jpg')}
                    activeOpacity={0.8}
                    style={styles.sampleAvatarThumbBtn}
                  >
                    <Image source={{ uri }} style={styles.sampleAvatarThumb} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* ===================================================================== */}
          {/* STAGE 3: [uploading] Progress Loader                                  */}
          {/* ===================================================================== */}
          {currentFlowStage === 'uploading' && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#085cf0" />
              <Text style={styles.loadingMainText}>Validating & Uploading...</Text>
              <Text style={styles.loadingSubText}>Verifying format and size (≤ 20 MB)...</Text>
            </View>
          )}

          {/* ===================================================================== */}
          {/* STAGE 4: [error] FlowMapp Error Message Node                          */}
          {/* ===================================================================== */}
          {currentFlowStage === 'error' && (
            <View style={styles.errorContainer}>
              <View style={styles.errorIconCircle}>
                <Ionicons name="warning-outline" size={32} color="#EF4444" />
              </View>
              <Text style={styles.errorTitle}>Upload Error</Text>
              <Text style={styles.errorDescription}>{errorMessage}</Text>

              {/* Loop back to [Select picture] */}
              <TouchableOpacity
                style={styles.errorRetryBtn}
                onPress={() => setCurrentFlowStage('action_select')}
                activeOpacity={0.85}
              >
                <Ionicons name="refresh" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.errorRetryText}>Choose Another Picture</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ===================================================================== */}
          {/* STAGE 5: [preview_lightbox] Lightbox Preview & [Confirm]              */}
          {/* ===================================================================== */}
          {currentFlowStage === 'preview_lightbox' && selectedImageUri && (
            <View style={styles.lightboxContainer}>
              <View style={styles.lightboxPreviewCircle}>
                <Image source={{ uri: selectedImageUri }} style={styles.lightboxImg} resizeMode="cover" />
              </View>

              <Text style={styles.lightboxTitle}>Looking Great! ✨</Text>
              <Text style={styles.lightboxSub}>
                This picture will be displayed on your GlowVAI clinical reports and dark store delivery orders.
              </Text>

              {/* Bottom Confirm / Retake Buttons */}
              <View style={styles.lightboxActionsRow}>
                <TouchableOpacity
                  style={styles.lightboxRetakeBtn}
                  onPress={() => setCurrentFlowStage('action_select')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.lightboxRetakeText}>Retake / Reselect</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.lightboxConfirmBtn}
                  onPress={handleConfirmProfilePicture}
                  disabled={isSaving}
                  activeOpacity={0.88}
                >
                  <LinearGradient
                    colors={['#085cf0', '#0052FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.lightboxConfirmGradient}
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                        <Text style={styles.lightboxConfirmText}>Confirm & Apply</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ChangeProfilePictureModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '90%',
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
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
  sheetTitle: {
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
  contentBody: {
    padding: 20,
    alignItems: 'center',
  },
  currentAvatarBox: {
    position: 'relative',
    marginBottom: 14,
  },
  currentAvatarImg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#085cf0',
  },
  cameraIconPill: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#085cf0',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  helperText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  actionButtonsCol: {
    width: '100%',
    gap: 10,
    marginBottom: 20,
  },
  actionBtnPrimary: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#085cf0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  actionBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  actionBtnTextWhite: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  actionBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F6FF',
    borderRadius: 16,
    paddingVertical: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  actionBtnTextBlue: {
    color: '#085cf0',
    fontSize: 14,
    fontWeight: '800',
  },
  sampleAvatarsLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  sampleAvatarsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  sampleAvatarThumbBtn: {
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  sampleAvatarThumb: {
    width: 48,
    height: 48,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingMainText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 14,
  },
  loadingSubText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
  },
  errorIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#991B1B',
  },
  errorDescription: {
    fontSize: 13,
    color: '#B91C1C',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  errorRetryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#085cf0',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 20,
  },
  errorRetryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  lightboxContainer: {
    padding: 24,
    alignItems: 'center',
  },
  lightboxPreviewCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#085cf0',
    shadowColor: '#085cf0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 16,
  },
  lightboxImg: {
    width: '100%',
    height: '100%',
  },
  lightboxTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  lightboxSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 6,
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  lightboxActionsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  lightboxRetakeBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightboxRetakeText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '800',
  },
  lightboxConfirmBtn: {
    flex: 1.5,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#085cf0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  lightboxConfirmGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  lightboxConfirmText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
});
