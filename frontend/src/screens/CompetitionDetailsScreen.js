import React from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';

import MainCompetitionCard from '../components/MainCompetitionCard';
import JudgeCard from '../components/JudgeCard';
import CountdownBanner from '../components/CountdownBanner';
import ImportantDatesGrid from '../components/ImportantDatesGrid';
import PreviousWinnersRow from '../components/PreviousWinnersRow';
import TabsSection from '../components/TabsSection';
import RewardsSection from '../components/RewardsSection';
import DisclaimerAndTrust from '../components/DisclaimerAndTrust';
import ReferralCard from '../components/ReferralCard';
import TestimonialsAdRow from '../components/TestimonialsAdRow';
import FixedBottomBar from '../components/FixedBottomBar';

export default function CompetitionDetailsScreen({
  competition,
  loading,
  refreshing,
  onRefresh,
  language,
  onPlayJudgeIntro,
  onSelectWinner,
  onWatchPrizeVideo,
  onOpenRefundPolicy,
  onShareReferral,
  onOpenReviews,
  onPrimaryAction,
}) {
  if (loading && !competition) {
    return (
      <View style={styles.centerLoading}>
        <ActivityIndicator size="large" color="#09535d" />
        <Text style={styles.loadingText}>Loading Competition Details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#09535d']} />
        }
      >
        {/* 1. Main Competition Card with Prize Pool & Spots */}
        <MainCompetitionCard
          competition={competition}
          userState={competition?.userState}
          language={language}
        />

        {/* 2. Judge Card with Intro Video */}
        <JudgeCard
          judge={competition?.judge}
          language={language}
          onPlayIntroVideo={onPlayJudgeIntro}
        />

        {/* 3. Live Dynamic Countdown Banner */}
        <CountdownBanner
          targetDate={competition?.registrationDeadline}
          language={language}
        />

        {/* 4. Important Dates 2x2 Grid */}
        <ImportantDatesGrid
          dates={competition?.importantDates}
          language={language}
        />

        {/* 5. Previous Winners Horizontal Carousel */}
        <PreviousWinnersRow
          winners={competition?.previousWinners}
          language={language}
          onSelectWinner={onSelectWinner}
        />

        {/* 6. Tabs Section (About, Parameters, Rules) */}
        <TabsSection
          competition={competition}
          language={language}
        />

        {/* 7. Rewards Breakdown (1st to 6th Rank) */}
        <RewardsSection
          rewards={competition?.rewards}
          language={language}
        />

        {/* 8. Disclaimer & Trust/Razorpay Box */}
        <DisclaimerAndTrust
          language={language}
          onWatchPrizeVideo={onWatchPrizeVideo}
          onOpenRefundPolicy={onOpenRefundPolicy}
        />

        {/* 9. Referral & Earn Discount Card */}
        <ReferralCard
          referral={competition?.referral}
          language={language}
          onShare={onShareReferral}
        />

        {/* 10. Testimonials & Ad Placeholder */}
        <TestimonialsAdRow
          language={language}
          onOpenReviews={onOpenReviews}
        />

        {/* Spacer for bottom bar */}
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Dynamic Fixed Action Button (Register Now / Upload Submission) */}
      <FixedBottomBar
        competition={competition}
        userState={competition?.userState}
        language={language}
        onPressAction={onPrimaryAction}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollArea: {
    flex: 1,
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
});
