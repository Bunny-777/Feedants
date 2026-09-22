import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { TRANSLATIONS } from '../constants/translations';

export default function HeaderBar({
  title,
  showBackButton = true,
  language,
  onToggleLanguage,
  onGoBack,
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <View style={styles.container}>
      <View style={styles.navRow}>
        {showBackButton ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onGoBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#1b2229" />
            <Text style={styles.backText}>{title || t.goBack}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.brandContainer}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>F</Text>
            </View>
            <Text style={styles.brandTitle}>{title || 'Feedants'}</Text>
          </View>
        )}

        {/* Bilingual Language Switcher */}
        <View style={styles.langToggleContainer}>
          <TouchableOpacity
            style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
            onPress={() => onToggleLanguage('en')}
            activeOpacity={0.8}
          >
            <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>
              ENG
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.langBtn, language === 'hi' && styles.langBtnActive]}
            onPress={() => onToggleLanguage('hi')}
            activeOpacity={0.8}
          >
            <Text style={[styles.langText, language === 'hi' && styles.langTextActive]}>
              हिंदी
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1b2229',
    marginLeft: 8,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: '#09535d',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 16,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#09535d',
    letterSpacing: -0.3,
  },
  langToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 2,
  },
  langBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  langBtnActive: {
    backgroundColor: THEME.colors.primary,
  },
  langText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  langTextActive: {
    color: '#ffffff',
  },
});
