import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { TRANSLATIONS } from '../constants/translations';

export default function DisclaimerAndTrust({ language, onWatchPrizeVideo, onOpenRefundPolicy }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <View style={styles.container}>
      {/* Disclaimer Banner */}
      <View style={styles.disclaimerBox}>
        <Ionicons name="information-circle-outline" size={18} color="#0284c7" style={styles.disclaimerIcon} />
        <Text style={styles.disclaimerText}>{t.disclaimer}</Text>
      </View>

      {/* Trust & Policy Grid */}
      <View style={styles.trustGrid}>
        {/* Prize Money Video Box */}
        <TouchableOpacity
          style={styles.trustCardLeft}
          onPress={onWatchPrizeVideo}
          activeOpacity={0.8}
        >
          <View style={styles.playIconCircle}>
            <Ionicons name="play" size={16} color="#0d808e" style={{ marginLeft: 2 }} />
          </View>
          <View style={styles.trustTextCol}>
            <Text style={styles.trustTitle}>{t.howReceivePrize}</Text>
            <Text style={styles.trustSubtitle}>{t.watchVideoPrize}</Text>
          </View>
        </TouchableOpacity>

        {/* Policies & Razorpay Box */}
        <View style={styles.trustCardRight}>
          <TouchableOpacity
            style={styles.policyRow}
            onPress={onOpenRefundPolicy}
            activeOpacity={0.7}
          >
            <Feather name="shield" size={14} color="#09535d" />
            <Text style={styles.policyText}>{t.refundPolicy}</Text>
          </TouchableOpacity>

          <View style={styles.policyRow}>
            <Feather name="shield" size={14} color="#09535d" />
            <Text style={styles.policyText}>{t.securePayments}</Text>
            <Text style={styles.razorpayBrand}> Razorpay</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  disclaimerBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  disclaimerIcon: {
    marginRight: 8,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: '#1e3a8a',
    lineHeight: 16,
    fontWeight: '500',
  },
  trustGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  trustCardLeft: {
    flex: 1.1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#edf2f7',
  },
  playIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#e6f7f8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  trustTextCol: {
    flex: 1,
  },
  trustTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: 14,
  },
  trustSubtitle: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  trustCardRight: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#edf2f7',
  },
  policyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  policyText: {
    fontSize: 10,
    color: '#334155',
    fontWeight: '600',
  },
  razorpayBrand: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0c2340',
    fontStyle: 'italic',
  },
});
