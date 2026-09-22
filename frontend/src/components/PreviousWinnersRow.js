import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TRANSLATIONS } from '../constants/translations';

export default function PreviousWinnersRow({ winners, language, onSelectWinner }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  if (!winners || winners.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t.previousWinners}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {winners.map((winner, index) => (
          <TouchableOpacity
            key={index}
            style={styles.winnerCard}
            onPress={() => onSelectWinner(winner)}
            activeOpacity={0.8}
          >
            {/* Dancer Image + Overlay Play Icon */}
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: winner.photoUrl }}
                style={styles.dancerImage}
                resizeMode="cover"
              />
              <View style={styles.playOverlay}>
                <Ionicons name="play" size={12} color="#0d808e" style={{ marginLeft: 1 }} />
              </View>
            </View>

            {/* Winner Details */}
            <View style={styles.detailsWrapper}>
              <Text style={styles.winnerName} numberOfLines={1}>
                {winner.name}
              </Text>
              <Text style={styles.rankTitle} numberOfLines={1}>
                {winner.rankTitle}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#edf2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  winnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 6,
    paddingRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  imageWrapper: {
    position: 'relative',
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
  },
  dancerImage: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    right: 3,
    bottom: 3,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  detailsWrapper: {
    marginLeft: 8,
    justifyContent: 'center',
  },
  winnerName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
    maxWidth: 90,
  },
  rankTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0d808e',
    marginTop: 2,
  },
});
