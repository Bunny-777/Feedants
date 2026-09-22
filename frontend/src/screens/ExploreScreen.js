import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ExploreScreen({
  competitions,
  onSelectCompetition,
  language,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Classical', 'Bollywood', 'Hip-Hop', 'Folk'];

  const filteredCompetitions = useMemo(() => {
    return competitions.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.judge?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === 'All' ||
        item.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        item.badges?.some((b) => b.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesCat;
    });
  }, [competitions, searchQuery, selectedCategory]);

  return (
    <View style={styles.container}>
      {/* Search Input Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#94a3b8" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search dance styles, judges, competitions..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Pills Row */}
      <View style={styles.pillsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.pill, selectedCategory === cat && styles.pillActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.pillText, selectedCategory === cat && styles.pillTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          Showing {filteredCompetitions.length} active stages
        </Text>
      </View>

      {/* Competitions Cards */}
      <ScrollView style={styles.listArea} showsVerticalScrollIndicator={false}>
        {filteredCompetitions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>No competitions found</Text>
            <Text style={styles.emptySubtitle}>Try searching for another dance form or category.</Text>
          </View>
        ) : (
          filteredCompetitions.map((comp) => (
            <TouchableOpacity
              key={comp._id}
              style={styles.card}
              onPress={() => onSelectCompetition(comp.slug)}
              activeOpacity={0.85}
            >
              <View style={styles.cardTop}>
                <Image
                  source={{
                    uri: comp.judge?.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
                  }}
                  style={styles.judgeThumb}
                />
                <View style={styles.cardTopInfo}>
                  <Text style={styles.cardCategory}>{comp.category} Stage</Text>
                  <Text style={styles.cardTitle}>{comp.title}</Text>
                  <Text style={styles.cardJudge}>Judge: {comp.judge?.name}</Text>
                </View>
                {comp.isRegistered ? (
                  <View style={styles.registeredTag}>
                    <Text style={styles.registeredTagText}>Registered</Text>
                  </View>
                ) : (
                  <View style={styles.spotsTag}>
                    <Text style={styles.spotsTagText}>{comp.spotsLeft} left</Text>
                  </View>
                )}
              </View>

              <View style={styles.cardBottom}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Prize Pool</Text>
                  <Text style={styles.metricValPrize}>₹ {comp.prizePool?.toLocaleString('en-IN')}</Text>
                </View>

                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Entry Fee</Text>
                  <Text style={styles.metricVal}>₹ {comp.entryFee}</Text>
                </View>

                <TouchableOpacity
                  style={styles.viewBtn}
                  onPress={() => onSelectCompetition(comp.slug)}
                >
                  <Text style={styles.viewBtnText}>View Stage →</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
  },
  pillsContainer: {
    marginTop: 10,
  },
  pillsRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  pillActive: {
    backgroundColor: '#09535d',
    borderColor: '#09535d',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  pillTextActive: {
    color: '#ffffff',
  },
  resultsHeader: {
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 6,
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  listArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#475569',
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
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#edf2f7',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  judgeThumb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
    backgroundColor: '#f1f5f9',
  },
  cardTopInfo: {
    flex: 1,
  },
  cardCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0d808e',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 1,
  },
  cardJudge: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  spotsTag: {
    backgroundColor: '#e6f7f8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  spotsTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#09535d',
  },
  registeredTag: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  registeredTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  metric: {
    justifyContent: 'center',
  },
  metricLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
  metricValPrize: {
    fontSize: 13,
    fontWeight: '800',
    color: '#09535d',
    marginTop: 2,
  },
  metricVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1e293b',
    marginTop: 2,
  },
  viewBtn: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#09535d',
  },
});
