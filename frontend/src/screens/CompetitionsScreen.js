import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CompetitionsScreen({
  competitions,
  currentUser,
  loading,
  onSelectCompetition,
  language,
}) {
  const [filterTab, setFilterTab] = useState('live'); // 'live' | 'my' | 'past'

  const filtered = competitions.filter((comp) => {
    if (filterTab === 'my') {
      return comp.isRegistered;
    }
    if (filterTab === 'past') {
      return comp.status === 'completed';
    }
    // 'live'
    return comp.status !== 'completed';
  });

  return (
    <View style={styles.container}>
      {/* Tab Switcher */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, filterTab === 'live' && styles.tabBtnActive]}
          onPress={() => setFilterTab('live')}
        >
          <Text style={[styles.tabText, filterTab === 'live' && styles.tabTextActive]}>
            Live & Open ({competitions.filter((c) => c.status !== 'completed').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, filterTab === 'my' && styles.tabBtnActive]}
          onPress={() => setFilterTab('my')}
        >
          <Text style={[styles.tabText, filterTab === 'my' && styles.tabTextActive]}>
            My Entries ({competitions.filter((c) => c.isRegistered).length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, filterTab === 'past' && styles.tabBtnActive]}
          onPress={() => setFilterTab('past')}
        >
          <Text style={[styles.tabText, filterTab === 'past' && styles.tabTextActive]}>
            Past Results
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <ScrollView style={styles.listArea} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.centerLoading}>
            <ActivityIndicator size="large" color="#09535d" />
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="trophy-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>
              {filterTab === 'my'
                ? 'No registered competitions yet'
                : 'No competitions in this category'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {filterTab === 'my'
                ? 'Browse live stages and register to participate!'
                : 'Check back soon for new announcements.'}
            </Text>
          </View>
        ) : (
          filtered.map((comp) => {
            const isClassical = comp.slug === 'feedants-classical-dance';
            return (
              <TouchableOpacity
                key={comp._id}
                style={[styles.card, isClassical && styles.featuredHighlight]}
                onPress={() => onSelectCompetition(comp.slug)}
                activeOpacity={0.85}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.tagGroup}>
                    <View style={styles.categoryPill}>
                      <Text style={styles.categoryPillText}>{comp.category}</Text>
                    </View>
                    {isClassical && (
                      <View style={styles.primaryBadge}>
                        <Text style={styles.primaryBadgeText}>Assignment Screen</Text>
                      </View>
                    )}
                  </View>

                  {comp.isRegistered ? (
                    <View style={styles.registeredBadge}>
                      <Ionicons name="checkmark-circle" size={13} color="#0d808e" />
                      <Text style={styles.registeredBadgeText}>Registered</Text>
                    </View>
                  ) : comp.spotsLeft <= 3 ? (
                    <View style={styles.urgentBadge}>
                      <Text style={styles.urgentBadgeText}>Only {comp.spotsLeft} spots left!</Text>
                    </View>
                  ) : (
                    <View style={styles.openBadge}>
                      <Text style={styles.openBadgeText}>{comp.spotsLeft} spots left</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.cardTitle}>{comp.title}</Text>
                <Text style={styles.judgeSubtitle}>
                  Judge: {comp.judge?.name} • {comp.judge?.role}
                </Text>

                <View style={styles.statsRow}>
                  <View style={styles.statCol}>
                    <Text style={styles.statLabel}>PRIZE POOL</Text>
                    <Text style={styles.statPrize}>₹ {comp.prizePool?.toLocaleString('en-IN')}</Text>
                  </View>

                  <View style={styles.statCol}>
                    <Text style={styles.statLabel}>ENTRY FEE</Text>
                    <Text style={styles.statEntry}>₹ {comp.entryFee}</Text>
                  </View>

                  <View style={styles.statColRight}>
                    <TouchableOpacity
                      style={styles.openDetailsBtn}
                      onPress={() => onSelectCompetition(comp.slug)}
                    >
                      <Text style={styles.openDetailsBtnText}>
                        {comp.isRegistered ? 'Open & Submit →' : 'View Stage →'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: '#09535d',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#09535d',
    fontWeight: '800',
  },
  listArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  centerLoading: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#334155',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#edf2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featuredHighlight: {
    borderColor: '#b6e0e6',
    borderWidth: 1.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  primaryBadge: {
    backgroundColor: '#09535d',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  primaryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ffffff',
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f7f8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: '#ccecee',
  },
  registeredBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0d808e',
  },
  urgentBadge: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  urgentBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#dc2626',
  },
  openBadge: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  openBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  judgeSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  statCol: {
    flex: 1,
  },
  statColRight: {
    alignItems: 'flex-end',
  },
  statLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '700',
  },
  statPrize: {
    fontSize: 14,
    fontWeight: '800',
    color: '#09535d',
    marginTop: 2,
  },
  statEntry: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
    marginTop: 2,
  },
  openDetailsBtn: {
    backgroundColor: '#09535d',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  openDetailsBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
});
