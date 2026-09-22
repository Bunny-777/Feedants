import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function CreateActionSheetModal({
  visible,
  onClose,
  onOpenSubmission,
  onHostStage,
  onRefer,
}) {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Feedants Actions</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#64748b" />
            </TouchableOpacity>
          </View>

          <View style={styles.actionsList}>
            {/* Action 1: Upload Submission */}
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {
                onClose();
                onOpenSubmission?.();
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#e6f7f8' }]}>
                <Feather name="upload" size={20} color="#09535d" />
              </View>
              <View style={styles.actionTextCol}>
                <Text style={styles.actionTitle}>Upload Competition Entry</Text>
                <Text style={styles.actionSubtitle}>
                  Submit your solo or duet dance video link
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
            </TouchableOpacity>

            {/* Action 2: Host Stage */}
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {
                onClose();
                onHostStage?.();
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="trophy-outline" size={20} color="#d97706" />
              </View>
              <View style={styles.actionTextCol}>
                <Text style={styles.actionTitle}>Host a Dance Championship</Text>
                <Text style={styles.actionSubtitle}>
                  Create custom judging criteria and prize pool
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
            </TouchableOpacity>

            {/* Action 3: Refer */}
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {
                onClose();
                onRefer?.();
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#ecfdf5' }]}>
                <Ionicons name="gift-outline" size={20} color="#059669" />
              </View>
              <View style={styles.actionTextCol}>
                <Text style={styles.actionTitle}>Invite Dancers & Earn ₹10</Text>
                <Text style={styles.actionSubtitle}>
                  Share your referral link for instant wallet credit
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  closeBtn: {
    padding: 4,
  },
  actionsList: {
    gap: 10,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionTextCol: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  actionSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
});
