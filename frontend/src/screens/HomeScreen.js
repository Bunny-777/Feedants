import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

export default function HomeScreen({
  currentUser,
  competitions,
  loading,
  onSelectCompetition,
  onNavigateExplore,
  language,
}) {
  const isHi = language === 'hi';

  const registeredComps = competitions.filter((c) => c.isRegistered);
  const featured = competitions.find((c) => c.slug === 'feedants-classical-dance') || competitions[0];

  const categories = [
    { name: 'Classical', icon: 'award', color: '#09535d' },
    { name: 'Bollywood', icon: 'film', color: '#db2777' },
    { name: 'Hip-Hop', icon: 'radio', color: '#d97706' },
    { name: 'Folk', icon: 'globe', color: '#059669' },
  ];

  if (loading && competitions.length === 0) {
    return (
      <View style={styles.centerLoading}>
        <ActivityIndicator size="large" color="#09535d" />
        <Text style={styles.loadingText}>Loading Feedants Stages...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 1. User Welcome Header */}
      <View style={styles.greetingHeader}>
        <View>
          <Text style={styles.greetingTitle}>
            {isHi ? `नमस्ते, ${currentUser?.name?.split(' ')[0]} 👋` : `Hello, ${currentUser?.name?.split(' ')[0]} 👋`}
          </Text>
          <Text style={styles.greetingSubtitle}>
            {isHi ? 'भारत के सर्वश्रेष्ठ ऑनलाइन डांस मुकाबले' : 'Discover top dance competitions & stages'}
          </Text>
        </View>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
          }}
          style={styles.userAvatar}
        />
      </View>

      {/* 2. Featured Competition Hero Banner */}
      {featured && (
        <TouchableOpacity
          style={styles.featuredCard}
          onPress={() => onSelectCompetition(featured.slug)}
          activeOpacity={0.9}
        >
          <View style={styles.featuredBadge}>
            <Ionicons name="flame" size={14} color="#ffffff" />
            <Text style={styles.featuredBadgeText}>{isHi ? 'विशेष मंच' : 'FEATURED STAGE'}</Text>
          </View>

          <Text style={styles.featuredTitle}>{featured.title}</Text>
          <Text style={styles.featuredJudge}>
            Judge: {featured.judge?.name} ({featured.judge?.role})
          </Text>

          <View style={styles.featuredStatsRow}>
            <View style={styles.featuredStat}>
              <Text style={styles.statLabelWhite}>{isHi ? 'पुरस्कार' : 'Prize Pool'}</Text>
              <Text style={styles.statValWhite}>₹ {featured.prizePool?.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.featuredStat}>
              <Text style={styles.statLabelWhite}>{isHi ? 'प्रवेश' : 'Entry Fee'}</Text>
              <Text style={styles.statValWhite}>₹ {featured.entryFee}</Text>
            </View>
            <View style={styles.featuredStat}>
              <Text style={styles.statLabelWhite}>{isHi ? 'सीटें' : 'Remaining'}</Text>
              <Text style={styles.statValHighlight}>{featured.spotsLeft} {isHi ? 'शेष' : 'spots'}</Text>
            </View>
          </View>

          <View style={styles.featuredActionRow}>
            <Text style={styles.featuredActionText}>
              {featured.isRegistered
                ? (isHi ? 'विवरण और प्रस्तुति देखें →' : 'View Details & Submit Entry →')
                : (isHi ? 'अभी भाग लें और जीतें →' : 'Enter Competition Now →')}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* 3. My Active Enrolled Competitions (if registered) */}
      {registeredComps.length > 0 && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>
              {isHi ? 'मेरे पंजीकृत मुकाबले' : 'My Registered Competitions'}
            </Text>
            <View style={styles.countPill}>
              <Text style={styles.countPillText}>{registeredComps.length}</Text>
            </View>
          </View>

          {registeredComps.map((comp) => (
            <TouchableOpacity
              key={comp._id}
              style={styles.myRegCard}
              onPress={() => onSelectCompetition(comp.slug)}
              activeOpacity={0.8}
            >
              <View style={styles.myRegIconCircle}>
                <Ionicons name="checkmark-done" size={18} color="#09535d" />
              </View>
              <View style={styles.myRegDetails}>
                <Text style={styles.myRegTitle}>{comp.title}</Text>
                <Text style={styles.myRegSubtitle}>
                  {isHi ? 'पंजीकृत • प्रस्तुति अपलोड करने के लिए टैप करें' : 'Registered • Tap to upload your entry'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* 4. Quick Category Filters */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeading}>{isHi ? 'शैलियां' : 'Dance Categories'}</Text>
        <View style={styles.categoryRow}>
          {categories.map((cat, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.catBox}
              onPress={onNavigateExplore}
              activeOpacity={0.7}
            >
              <View style={[styles.catIconCircle, { backgroundColor: `${cat.color}15` }]}>
                <Feather name={cat.icon} size={20} color={cat.color} />
              </View>
              <Text style={styles.catName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 5. Trending Competitions List */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>
            {isHi ? 'सभी सक्रिय प्रतियोगिताएं' : 'All Active Competitions'}
          </Text>
          <TouchableOpacity onPress={onNavigateExplore}>
            <Text style={styles.seeAllText}>{isHi ? 'सभी देखें' : 'See all'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.compList}>
          {competitions.map((item) => (
            <TouchableOpacity
              key={item._id}
              style={styles.competitionItem}
              onPress={() => onSelectCompetition(item.slug)}
              activeOpacity={0.85}
            >
              <View style={styles.compTopRow}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{item.category || 'Dance'}</Text>
                </View>
                {item.isRegistered ? (
                  <View style={styles.regBadgeGreen}>
                    <Text style={styles.regBadgeGreenText}>✓ Registered</Text>
                  </View>
                ) : (
                  <Text style={styles.spotsCounterText}>
                    👥 Only {item.spotsLeft} spots left
                  </Text>
                )}
              </View>

              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.judgeName}>
                Judge: {item.judge?.name || 'Professional Jury'}
              </Text>

              <View style={styles.compBottomRow}>
                <View>
                  <Text style={styles.prizePoolSmall}>Prize Pool: ₹ {item.prizePool?.toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.entryFeePill}>
                  <Text style={styles.entryFeePillText}>Entry ₹{item.entryFee}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  greetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  greetingSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  userAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#09535d',
  },
  featuredCard: {
    backgroundColor: '#09535d',
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#09535d',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d7d8c',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
    marginBottom: 8,
  },
  featuredBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  featuredTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 4,
  },
  featuredJudge: {
    color: '#b6e0e6',
    fontSize: 12,
    marginBottom: 16,
  },
  featuredStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
  },
  featuredStat: {
    alignItems: 'center',
  },
  statLabelWhite: {
    color: '#ccecee',
    fontSize: 10,
    fontWeight: '600',
  },
  statValWhite: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  statValHighlight: {
    color: '#5eead4',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  featuredActionRow: {
    alignItems: 'center',
  },
  featuredActionText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginTop: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  countPill: {
    backgroundColor: '#e6f7f8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countPillText: {
    fontSize: 11,
    color: '#09535d',
    fontWeight: '800',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#09535d',
  },
  myRegCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccecee',
    marginBottom: 8,
  },
  myRegIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e6f7f8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  myRegDetails: {
    flex: 1,
  },
  myRegTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  myRegSubtitle: {
    fontSize: 11,
    color: '#0d808e',
    marginTop: 2,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  catBox: {
    alignItems: 'center',
    width: '23%',
  },
  catIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  catName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  compList: {
    gap: 12,
  },
  competitionItem: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#edf2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  compTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '700',
  },
  regBadgeGreen: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  regBadgeGreenText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '800',
  },
  spotsCounterText: {
    fontSize: 11,
    color: '#0d808e',
    fontWeight: '700',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  judgeName: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 10,
  },
  compBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
  },
  prizePoolSmall: {
    fontSize: 13,
    fontWeight: '800',
    color: '#09535d',
  },
  entryFeePill: {
    backgroundColor: '#09535d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  entryFeePillText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
});
