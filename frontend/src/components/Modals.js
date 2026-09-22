import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { TRANSLATIONS } from '../constants/translations';

/**
 * 1. Video Player Modal
 */
export function VideoModal({ visible, videoData, onClose }) {
  if (!visible || !videoData) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.videoCard}>
          <View style={styles.videoHeader}>
            <Text style={styles.videoTitle} numberOfLines={1}>
              {videoData.title || 'Video Player'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#1e293b" />
            </TouchableOpacity>
          </View>

          {/* Video Container */}
          <View style={styles.videoWrapper}>
            {Platform.OS === 'web' ? (
              <iframe
                src={videoData.url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                title={videoData.title}
                style={{ width: '100%', height: 260, border: 0, borderRadius: 12 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <View style={styles.mobileVideoPlaceholder}>
                <Ionicons name="play-circle" size={54} color="#0d808e" />
                <Text style={styles.mobileVideoText}>Playing: {videoData.title}</Text>
                <Text style={styles.mobileVideoSub}>{videoData.url}</Text>
              </View>
            )}
          </View>

          {videoData.subtitle && (
            <Text style={styles.videoDescription}>{videoData.subtitle}</Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

/**
 * 2. Registration & Razorpay Payment Modal
 */
export function RegisterModal({
  visible,
  competition,
  currentUser,
  loading,
  onConfirm,
  onClose,
  language,
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  if (!visible || !competition) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.sheetCard}>
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>{t.confirmRegistration}</Text>
              <Text style={styles.sheetSubtitle}>Powered by Razorpay Secure</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* User info */}
          <View style={styles.userInfoBox}>
            <Text style={styles.userInfoLabel}>Participant:</Text>
            <Text style={styles.userInfoName}>{currentUser?.name || 'Guest User'}</Text>
            <Text style={styles.userInfoEmail}>{currentUser?.email || 'user@feedants.com'}</Text>
          </View>

          {/* Price Breakdown */}
          <View style={styles.billTable}>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Competition Entry Fee</Text>
              <Text style={styles.billVal}>₹ {competition.entryFee}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Platform & Certification Fee</Text>
              <Text style={styles.billFree}>FREE (₹0)</Text>
            </View>
            <View style={[styles.billRow, styles.billTotalRow]}>
              <Text style={styles.billTotalLabel}>Total Amount Payable</Text>
              <Text style={styles.billTotalVal}>₹ {competition.entryFee}</Text>
            </View>
          </View>

          {/* Razorpay badge */}
          <View style={styles.securityRow}>
            <Feather name="shield" size={14} color="#059669" />
            <Text style={styles.securityText}>
              256-bit Bank-grade Encryption via Razorpay
            </Text>
          </View>

          {/* Pay Button */}
          <TouchableOpacity
            style={styles.payButton}
            onPress={onConfirm}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.payButtonText}>
                Pay ₹{competition.entryFee} & Confirm Spot
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/**
 * 3. Upload Submission Modal
 */
export function UploadSubmissionModal({
  visible,
  competition,
  currentUser,
  existingSubmission,
  loading,
  onSubmit,
  onClose,
  language,
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [title, setTitle] = useState(existingSubmission?.title || '');
  const [videoUrl, setVideoUrl] = useState(existingSubmission?.videoUrl || '');
  const [danceForm, setDanceForm] = useState(existingSubmission?.danceForm || 'Kathak');
  const [description, setDescription] = useState(existingSubmission?.description || '');
  const [errorMsg, setErrorMsg] = useState('');

  if (!visible) return null;

  const danceForms = ['Kathak', 'Bharatanatyam', 'Odissi', 'Kuchipudi', 'Mohiniyattam'];

  const handleFormSubmit = () => {
    if (!title.trim()) {
      setErrorMsg('Please enter your performance title.');
      return;
    }
    if (!videoUrl.trim()) {
      setErrorMsg('Please provide your video URL (YouTube, Drive, or video link).');
      return;
    }
    setErrorMsg('');
    onSubmit({
      competitionId: competition?._id,
      userId: currentUser?.userId,
      userName: currentUser?.name,
      title,
      videoUrl,
      danceForm,
      description,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.sheetCard}>
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>{t.submitTitle}</Text>
              <Text style={styles.sheetSubtitle}>{competition?.title}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll}>
            {errorMsg ? <Text style={styles.errorAlert}>{errorMsg}</Text> : null}

            {/* Performance Title */}
            <Text style={styles.inputLabel}>{t.enterTitle} *</Text>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Tarana in TeenTaal Kathak Solo"
              placeholderTextColor="#94a3b8"
            />

            {/* Dance Style */}
            <Text style={styles.inputLabel}>{t.danceForm} *</Text>
            <View style={styles.tagSelector}>
              {danceForms.map((df) => (
                <TouchableOpacity
                  key={df}
                  style={[styles.tagItem, danceForm === df && styles.tagItemActive]}
                  onPress={() => setDanceForm(df)}
                >
                  <Text
                    style={[
                      styles.tagItemText,
                      danceForm === df && styles.tagItemTextActive,
                    ]}
                  >
                    {df}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Video Link */}
            <Text style={styles.inputLabel}>{t.enterUrl} *</Text>
            <TextInput
              style={styles.textInput}
              value={videoUrl}
              onChangeText={setVideoUrl}
              placeholder="https://youtu.be/... or Google Drive link"
              placeholderTextColor="#94a3b8"
              autoCapitalize="none"
            />

            {/* Description */}
            <Text style={styles.inputLabel}>Description (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder={t.descriptionPlaceholder}
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={3}
            />
          </ScrollView>

          <TouchableOpacity
            style={styles.payButton}
            onPress={handleFormSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.payButtonText}>{t.submitBtn}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/**
 * 4. Concurrency Test Results Modal
 */
export function ConcurrencyResultModal({ visible, results, onClose }) {
  if (!visible || !results) return null;

  const { summary } = results;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.sheetCard}>
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>⚡ Concurrency Rush Simulation</Text>
              <Text style={styles.sheetSubtitle}>
                Atomic Race-Condition Verification
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#64748b" />
            </TouchableOpacity>
          </View>

          <View style={styles.resultSummary}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{summary.attempted}</Text>
              <Text style={styles.statSub}>Attempted</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: '#ecfdf5' }]}>
              <Text style={[styles.statNum, { color: '#059669' }]}>
                {summary.successfulRegistrations}
              </Text>
              <Text style={styles.statSub}>Succeeded</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: '#fef2f2' }]}>
              <Text style={[styles.statNum, { color: '#dc2626' }]}>
                {summary.rejectedDueToCapacity}
              </Text>
              <Text style={styles.statSub}>Rejected (Sold Out)</Text>
            </View>
          </View>

          <View style={styles.concurrencyProofBox}>
            <Ionicons name="shield-checkmark" size={24} color="#059669" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.proofTitle}>Data Consistency Guaranteed</Text>
              <Text style={styles.proofDesc}>
                Total booked spots ({summary.finalBookedSpots} / {summary.totalSpots})
                never exceeded capacity. MongoDB atomic operations successfully prevented
                overselling and race conditions!
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.payButton} onPress={onClose}>
            <Text style={styles.payButtonText}>Close Report</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/**
 * 5. Reviews / Testimonials Modal
 */
export function TestimonialsModal({ visible, onClose }) {
  if (!visible) return null;

  const reviews = [
    {
      name: 'Pooja Kashyap',
      rating: 5,
      comment: 'Participated in the last Kathak event. The feedback from the judge was invaluable for my stage practice!',
      date: '1 week ago',
    },
    {
      name: 'Aditya Swaminathan',
      rating: 5,
      comment: 'Super seamless registration and timely prize disbursement right into my UPI ID. Truly genuine platform.',
      date: '2 weeks ago',
    },
    {
      name: 'Tanvi Deshmukh',
      rating: 5,
      comment: 'Verified certificates are recognized and the competition standard is exceptionally high.',
      date: '3 weeks ago',
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.sheetCard}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Hear From Our Participants</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ maxHeight: 350 }}>
            {reviews.map((rev, idx) => (
              <View key={idx} style={styles.reviewCard}>
                <View style={styles.reviewCardHeader}>
                  <Text style={styles.reviewerName}>{rev.name}</Text>
                  <Text style={styles.reviewDate}>{rev.date}</Text>
                </View>
                <View style={styles.starsRow}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Ionicons key={i} name="star" size={14} color="#f59e0b" />
                  ))}
                </View>
                <Text style={styles.reviewBody}>{rev.comment}</Text>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.payButton} onPress={onClose}>
            <Text style={styles.payButtonText}>Back to Competition</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  sheetSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  userInfoBox: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  userInfoLabel: {
    fontSize: 10,
    color: '#94a3b8',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  userInfoName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
    marginTop: 2,
  },
  userInfoEmail: {
    fontSize: 12,
    color: '#64748b',
  },
  billTable: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billLabel: {
    fontSize: 12,
    color: '#475569',
  },
  billVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  billFree: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  billTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
    marginTop: 4,
  },
  billTotalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  billTotalVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#09535d',
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
    justifyContent: 'center',
  },
  securityText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  payButton: {
    backgroundColor: '#09535d',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  videoCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    alignSelf: 'center',
    width: '94%',
    maxWidth: 500,
  },
  videoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  videoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    flex: 1,
  },
  videoWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000000',
    minHeight: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileVideoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  mobileVideoText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 10,
  },
  mobileVideoSub: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  videoDescription: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 10,
    lineHeight: 18,
  },
  formScroll: {
    maxHeight: 380,
    marginBottom: 14,
  },
  errorAlert: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: 10,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    marginTop: 6,
  },
  textInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1e293b',
    marginBottom: 10,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  tagSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  tagItem: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
  },
  tagItemActive: {
    backgroundColor: '#09535d',
  },
  tagItemText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  tagItemTextActive: {
    color: '#ffffff',
  },
  resultSummary: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  statSub: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '600',
  },
  concurrencyProofBox: {
    backgroundColor: '#ecfdf5',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  proofTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065f46',
  },
  proofDesc: {
    fontSize: 11,
    color: '#047857',
    marginTop: 2,
    lineHeight: 16,
  },
  reviewCard: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  reviewCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  reviewDate: {
    fontSize: 10,
    color: '#94a3b8',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 6,
  },
  reviewBody: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
  },
});
