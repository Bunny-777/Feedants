import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TRANSLATIONS } from '../constants/translations';

export default function FixedBottomBar({
  competition,
  userState,
  language,
  onPressAction,
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  if (!competition) return null;

  const totalSpots = competition.totalSpots || 20;
  const bookedSpots = competition.bookedSpots || 0;
  const spotsLeft = Math.max(0, totalSpots - bookedSpots);
  const isFull = spotsLeft === 0;

  const isRegistered = userState?.isRegistered;
  const hasSubmitted = userState?.hasSubmitted;

  return (
    <View style={styles.container}>
      {isRegistered ? (
        // User is registered: Show Upload Submission or View Submission
        <TouchableOpacity
          style={[styles.primaryButton, hasSubmitted && styles.submittedButton]}
          onPress={onPressAction}
          activeOpacity={0.85}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonTitle}>
              {hasSubmitted ? t.viewSubmission : t.uploadSubmission}
            </Text>
            <View style={styles.badgeRow}>
              <Ionicons name="checkmark-circle" size={12} color="#ccecee" />
              <Text style={styles.buttonSubtitle}>
                {hasSubmitted ? t.submittedBadge : t.registered}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : isFull ? (
        // Competition is full
        <View style={[styles.primaryButton, styles.disabledButton]}>
          <Text style={styles.disabledText}>{t.soldOut}</Text>
          <Text style={styles.disabledSubtitle}>All {totalSpots} spots booked</Text>
        </View>
      ) : (
        // User is not registered: Show Register Now
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onPressAction}
          activeOpacity={0.85}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonTitle}>
              {t.registerNow} • ₹{competition.entryFee}
            </Text>
            <Text style={styles.buttonSubtitle}>
              {t.spotsLeft.replace('{count}', spotsLeft)}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  primaryButton: {
    backgroundColor: '#09535d',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#09535d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submittedButton: {
    backgroundColor: '#0a6470',
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  buttonSubtitle: {
    color: '#b6e0e6',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  disabledButton: {
    backgroundColor: '#cbd5e1',
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledText: {
    color: '#475569',
    fontSize: 15,
    fontWeight: '700',
  },
  disabledSubtitle: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },
});
