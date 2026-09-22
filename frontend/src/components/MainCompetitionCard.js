import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { TRANSLATIONS } from '../constants/translations';

export default function MainCompetitionCard({
  competition,
  userState,
  language,
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  if (!competition) return null;

  const totalSpots = competition.totalSpots || 20;
  const bookedSpots = competition.bookedSpots || 0;
  const spotsLeft = Math.max(0, totalSpots - bookedSpots);
  const progressRatio = Math.min(1, bookedSpots / totalSpots);

  const isRegistered = userState?.isRegistered;
  const isFull = spotsLeft === 0;

  return (
    <View style={styles.card}>
      {/* Title & Registration Badge */}
      <View style={styles.topRow}>
        <Text style={styles.title}>{competition.title}</Text>
        
        {isRegistered ? (
          <View style={styles.registeredBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#0d808e" />
            <Text style={styles.registeredBadgeText}>{t.registered}</Text>
          </View>
        ) : isFull ? (
          <View style={styles.soldOutBadge}>
            <Text style={styles.soldOutBadgeText}>{t.soldOut}</Text>
          </View>
        ) : (
          <View style={styles.openBadge}>
            <Text style={styles.openBadgeText}>{t.registrationOpen}</Text>
          </View>
        )}
      </View>

      {/* Tags & Certificate Perk */}
      <View style={styles.tagsRow}>
        <View style={styles.pillTag}>
          <Text style={styles.pillTagText}>{t.dance}</Text>
        </View>
        <View style={styles.pillTag}>
          <Text style={styles.pillTagText}>{t.multiWin}</Text>
        </View>
        <View style={styles.perkContainer}>
          <MaterialCommunityIcons name="trophy-outline" size={15} color="#0d808e" />
          <Text style={styles.perkText}>{t.certificatePerk}</Text>
        </View>
      </View>

      {/* Stats Section: Prize Pool, Entry Fee & Spots Left */}
      <View style={styles.statsContainer}>
        {/* Prize Pool */}
        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>{t.prizePool}</Text>
          <Text style={styles.prizePoolValue}>₹ {competition.prizePool?.toLocaleString('en-IN')}</Text>
        </View>

        {/* Entry Fee */}
        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>{t.entryFee}</Text>
          <Text style={styles.entryFeeValue}>₹ {competition.entryFee}</Text>
        </View>

        {/* Spots Booking & Progress Bar */}
        <View style={styles.spotsColumn}>
          <View style={styles.spotsHeader}>
            <Ionicons name="people-outline" size={15} color="#0d808e" />
            <Text style={styles.spotsCountText}>
              {t.spotsLeft.replace('{count}', spotsLeft)}
            </Text>
          </View>
          
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${Math.max(5, progressRatio * 100)}%` }]} />
          </View>
          
          <Text style={styles.bookedText}>
            {t.booked.replace('{booked}', bookedSpots).replace('{total}', totalSpots)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#edf2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f7f8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#ccecee',
  },
  registeredBadgeText: {
    color: '#0d808e',
    fontSize: 12,
    fontWeight: '700',
  },
  openBadge: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  openBadgeText: {
    color: '#4f46e5',
    fontSize: 11,
    fontWeight: '600',
  },
  soldOutBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  soldOutBadgeText: {
    color: '#dc2626',
    fontSize: 11,
    fontWeight: '700',
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  pillTag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pillTagText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '500',
  },
  perkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  perkText: {
    color: '#0d808e',
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  statColumn: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
    marginBottom: 2,
  },
  prizePoolValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0d808e',
  },
  entryFeeValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  spotsColumn: {
    flex: 1.4,
    alignItems: 'flex-end',
  },
  spotsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  spotsCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0d808e',
  },
  progressBarBackground: {
    width: '100%',
    height: 5,
    backgroundColor: '#e2e8f0',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0d808e',
    borderRadius: 999,
  },
  bookedText: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '500',
  },
});
