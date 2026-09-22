import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { fetchUserProfile } from '../api';

export default function ProfileScreen({
  currentUser,
  onSelectCompetition,
  language,
}) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const res = await fetchUserProfile(currentUser?.userId);
        if (res.success) {
          setProfileData(res.data);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [currentUser?.userId]);

  if (loading && !profileData) {
    return (
      <View style={styles.centerLoading}>
        <ActivityIndicator size="large" color="#09535d" />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  const user = profileData?.user || currentUser;
  const stats = profileData?.stats || {
    competitionsJoined: 1,
    submissionsMade: 0,
    certificatesEarned: 1,
    walletBalance: 250,
  };
  const registrations = profileData?.registrations || [];
  const submissions = profileData?.submissions || [];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 1. Profile Banner & Info */}
      <View style={styles.headerCard}>
        <Image
          source={{
            uri: user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>

        <View style={styles.badgeRow}>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={13} color="#059669" />
            <Text style={styles.verifiedBadgeText}>Verified Classical Performer</Text>
          </View>
        </View>
      </View>

      {/* 2. Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statTile}>
          <Text style={styles.statNumber}>{stats.competitionsJoined}</Text>
          <Text style={styles.statTileLabel}>Stages Joined</Text>
        </View>

        <View style={styles.statTile}>
          <Text style={styles.statNumber}>{stats.submissionsMade}</Text>
          <Text style={styles.statTileLabel}>Submissions</Text>
        </View>

        <View style={styles.statTile}>
          <Text style={styles.statNumber}>{stats.certificatesEarned}</Text>
          <Text style={styles.statTileLabel}>Certificates</Text>
        </View>

        <View style={[styles.statTile, { backgroundColor: '#e6f7f8' }]}>
          <Text style={[styles.statNumber, { color: '#09535d' }]}>₹{stats.walletBalance}</Text>
          <Text style={[styles.statTileLabel, { color: '#09535d' }]}>Cash Wallet</Text>
        </View>
      </View>

      {/* 3. My Registered Competitions */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeading}>Active Competitions ({registrations.length})</Text>
        {registrations.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyCardText}>No active competition registrations.</Text>
          </View>
        ) : (
          registrations.map((reg) => (
            <TouchableOpacity
              key={reg._id}
              style={styles.compCard}
              onPress={() => onSelectCompetition(reg.competitionId?.slug || 'feedants-classical-dance')}
              activeOpacity={0.8}
            >
              <View style={styles.compCardIcon}>
                <Ionicons name="trophy" size={20} color="#09535d" />
              </View>
              <View style={styles.compCardDetails}>
                <Text style={styles.compCardTitle}>
                  {reg.competitionId?.title || 'Feedants Classical Dance'}
                </Text>
                <Text style={styles.compCardMeta}>
                  Status: Paid (₹{reg.amount}) • {new Date(reg.registeredAt).toLocaleDateString()}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* 4. My Submissions */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeading}>My Performance Submissions ({submissions.length})</Text>
        {submissions.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyCardText}>No entries submitted yet.</Text>
          </View>
        ) : (
          submissions.map((sub) => (
            <View key={sub._id} style={styles.submissionCard}>
              <View style={styles.subHeader}>
                <Text style={styles.subTitle}>{sub.title}</Text>
                <View style={styles.subStatusBadge}>
                  <Text style={styles.subStatusText}>{sub.status.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.subForm}>Style: {sub.danceForm}</Text>
              <Text style={styles.subUrl} numberOfLines={1}>URL: {sub.videoUrl}</Text>
            </View>
          ))
        )}
      </View>

      {/* 5. Settings / Support */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeading}>Support & Settings</Text>

        <TouchableOpacity style={styles.menuRow}>
          <Feather name="credit-card" size={18} color="#64748b" style={styles.menuIcon} />
          <Text style={styles.menuText}>Saved UPI Payout Details</Text>
          <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuRow}>
          <Feather name="file-text" size={18} color="#64748b" style={styles.menuIcon} />
          <Text style={styles.menuText}>Certificate Verification ID</Text>
          <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuRow}>
          <Feather name="help-circle" size={18} color="#64748b" style={styles.menuIcon} />
          <Text style={styles.menuText}>Feedants Participant FAQs</Text>
          <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  headerCard: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#09535d',
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  userEmail: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  badgeRow: {
    marginTop: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 14,
  },
  statTile: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#edf2f7',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  statTileLabel: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: '700',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 10,
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  emptyCardText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  compCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#edf2f7',
    marginBottom: 8,
  },
  compCardIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#e6f7f8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  compCardDetails: {
    flex: 1,
  },
  compCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  compCardMeta: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  submissionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#edf2f7',
    marginBottom: 8,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  subStatusBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  subStatusText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2563eb',
  },
  subForm: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 2,
  },
  subUrl: {
    fontSize: 10,
    color: '#94a3b8',
  },
  menuRow: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#edf2f7',
    marginBottom: 8,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
});
