import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { TRANSLATIONS } from '../constants/translations';

export default function RewardsSection({ rewards, language }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  if (!rewards || rewards.length === 0) return null;

  const renderIcon = (iconName, rank) => {
    if (rank === 1) {
      return <Ionicons name="trophy" size={20} color="#f59e0b" />;
    }
    if (rank === 2) {
      return <MaterialCommunityIcons name="medal" size={20} color="#94a3b8" />;
    }
    if (rank === 3) {
      return <MaterialCommunityIcons name="medal" size={20} color="#d97706" />;
    }
    return <Ionicons name="star-outline" size={18} color="#0d808e" />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.sectionTitle}>{t.rewardsTitle}</Text>
        <Text style={styles.subtitle}>{t.allPositions}</Text>
      </View>

      <View style={styles.list}>
        {rewards.map((reward, index) => (
          <View key={reward.rank || index} style={styles.rewardRow}>
            <View style={styles.rankInfo}>
              <View style={styles.iconBox}>{renderIcon(reward.icon, reward.rank)}</View>
              <Text style={styles.rankTitle}>{reward.title}</Text>
            </View>

            <Text style={styles.rewardAmount}>
              ₹ {reward.amount?.toLocaleString('en-IN')}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#edf2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  list: {
    gap: 10,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  rankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 24,
    alignItems: 'center',
  },
  rankTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  rewardAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0d808e',
  },
});
