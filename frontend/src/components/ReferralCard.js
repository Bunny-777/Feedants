import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Clipboard } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { TRANSLATIONS } from '../constants/translations';

export default function ReferralCard({ referral, language, onShare }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [copied, setCopied] = useState(false);

  const shareUrl = referral?.shareUrl || 'https://feedants.com/r/referral123';

  const handleCopy = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl);
      } else if (Clipboard) {
        Clipboard.setString(shareUrl);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.log('Copy failed:', e);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Ionicons name="megaphone-outline" size={20} color="#0d808e" />
        </View>
        <View style={styles.headerTextCol}>
          <Text style={styles.title}>{t.referTitle}</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        {/* URL Box with Copy Button */}
        <View style={styles.linkBox}>
          <Text style={styles.linkText} numberOfLines={1}>
            {shareUrl}
          </Text>
          <TouchableOpacity
            style={[styles.copyBtn, copied && styles.copiedBtn]}
            onPress={handleCopy}
            activeOpacity={0.7}
          >
            <Text style={[styles.copyBtnText, copied && styles.copiedBtnText]}>
              {copied ? t.copied : t.copyLink}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Refer Now Button */}
        <TouchableOpacity
          style={styles.referNowBtn}
          onPress={onShare}
          activeOpacity={0.8}
        >
          <Text style={styles.referNowText}>{t.referNow}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>{t.referEarnSubtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ebfaf5',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#c6f2e2',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTextCol: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065f46',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  linkBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingLeft: 8,
    paddingRight: 2,
    height: 38,
  },
  linkText: {
    flex: 1,
    fontSize: 11,
    color: '#334155',
    marginRight: 4,
  },
  copyBtn: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  copiedBtn: {
    backgroundColor: '#10b981',
  },
  copyBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  copiedBtnText: {
    color: '#ffffff',
  },
  referNowBtn: {
    backgroundColor: '#09535d',
    paddingHorizontal: 16,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  referNowText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '600',
    marginTop: 8,
  },
});
