import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { TRANSLATIONS } from '../constants/translations';

export default function TabsSection({ competition, language }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [activeTab, setActiveTab] = useState('about');
  const [isExpanded, setIsExpanded] = useState(false);

  if (!competition) return null;

  const aboutContent = competition.about?.[language] || competition.about?.en;
  const parameters = competition.judgingParameters || [];
  const rules = competition.rulesAndEligibility || [];

  return (
    <View style={styles.container}>
      {/* Tab Navigation Header */}
      <View style={styles.tabHeaders}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'about' && styles.tabBtnActive]}
          onPress={() => setActiveTab('about')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabTitle, activeTab === 'about' && styles.tabTitleActive]}>
            {t.aboutTab}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'judging' && styles.tabBtnActive]}
          onPress={() => setActiveTab('judging')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabTitle, activeTab === 'judging' && styles.tabTitleActive]}>
            {t.judgingTab}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'rules' && styles.tabBtnActive]}
          onPress={() => setActiveTab('rules')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabTitle, activeTab === 'rules' && styles.tabTitleActive]}>
            {t.rulesTab}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.contentBody}>
        {/* Tab 1: About Competition */}
        {activeTab === 'about' && (
          <View>
            <Text style={styles.descriptionText}>
              {isExpanded ? aboutContent?.full : aboutContent?.short}
            </Text>

            <TouchableOpacity
              style={styles.expandToggle}
              onPress={() => setIsExpanded(!isExpanded)}
              activeOpacity={0.7}
            >
              <Text style={styles.expandText}>
                {isExpanded ? t.viewLess : t.viewMore}
              </Text>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={14}
                color="#0d808e"
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Tab 2: Judging Parameters */}
        {activeTab === 'judging' && (
          <View style={styles.parametersList}>
            {parameters.map((param, index) => (
              <View key={index} style={styles.paramCard}>
                <View style={styles.paramHeader}>
                  <Text style={styles.paramTitle}>{param.title}</Text>
                  <View style={styles.weightageBadge}>
                    <Text style={styles.weightageText}>{param.weightage}%</Text>
                  </View>
                </View>
                {param.description && (
                  <Text style={styles.paramDesc}>{param.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Tab 3: Rules & Eligibility */}
        {activeTab === 'rules' && (
          <View style={styles.rulesList}>
            {rules.map((rule, index) => (
              <View key={index} style={styles.ruleRow}>
                <View style={styles.ruleBullet} />
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </View>
        )}
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
    borderWidth: 1,
    borderColor: '#edf2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  tabHeaders: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: '#0d808e',
  },
  tabTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
  },
  tabTitleActive: {
    color: '#0d808e',
    fontWeight: '800',
  },
  contentBody: {
    padding: 16,
  },
  descriptionText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
  },
  expandToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 4,
  },
  expandText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0d808e',
  },
  parametersList: {
    gap: 10,
  },
  paramCard: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  paramHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  paramTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
  },
  weightageBadge: {
    backgroundColor: '#e6f7f8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  weightageText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0d808e',
  },
  paramDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  rulesList: {
    gap: 10,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ruleBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0d808e',
    marginTop: 6,
    marginRight: 10,
  },
  ruleText: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
});
