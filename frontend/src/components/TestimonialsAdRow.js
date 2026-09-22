import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { TRANSLATIONS } from '../constants/translations';

export default function TestimonialsAdRow({ language, onOpenReviews }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <View style={styles.container}>
      {/* Testimonial Bar */}
      <TouchableOpacity
        style={styles.reviewCard}
        onPress={onOpenReviews}
        activeOpacity={0.7}
      >
        <View style={styles.leftReview}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="#111827" />
          <View style={styles.reviewTextCol}>
            <Text style={styles.reviewTitle}>{t.hearFromUsers}</Text>
            <Text style={styles.reviewSubtitle}>{t.seeWhatParticipantsSay}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
      </TouchableOpacity>

      {/* Ad Placeholder Banner */}
      <View style={styles.adBanner}>
        <Feather name="volume-2" size={14} color="#94a3b8" />
        <Text style={styles.adText}>{t.adHere}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 12,
    gap: 10,
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#edf2f7',
  },
  leftReview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reviewTextCol: {},
  reviewTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
  },
  reviewSubtitle: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  adBanner: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  adText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
});
