import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import {
  fetchCompetitions,
  fetchCompetitionDetails,
  registerForCompetition,
  uploadCompetitionSubmission,
  simulateConcurrencyRush,
  resetDatabaseState,
  setSpotsCount,
} from './src/api';

import TesterToolbar from './src/components/TesterToolbar';
import HeaderBar from './src/components/HeaderBar';
import BottomNavBar from './src/components/BottomNavBar';
import CreateActionSheetModal from './src/components/CreateActionSheetModal';

import HomeScreen from './src/screens/HomeScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import CompetitionsScreen from './src/screens/CompetitionsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CompetitionDetailsScreen from './src/screens/CompetitionDetailsScreen';

import {
  VideoModal,
  RegisterModal,
  UploadSubmissionModal,
  ConcurrencyResultModal,
  TestimonialsModal,
} from './src/components/Modals';

export default function App() {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('Competitions');
  const [selectedCompetitionSlug, setSelectedCompetitionSlug] = useState('feedants-classical-dance');

  const [currentUser, setCurrentUser] = useState({
    userId: 'user_registered_01',
    name: 'Kushal Sharma',
    email: 'kushal@example.com',
  });

  const [competitionsList, setCompetitionsList] = useState([]);
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Modals state
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [concurrencyResults, setConcurrencyResults] = useState(null);
  const [testimonialsOpen, setTestimonialsOpen] = useState(false);
  const [createSheetOpen, setCreateSheetOpen] = useState(false);

  // 1. Fetch all competitions list from MongoDB
  const loadAllCompetitions = useCallback(async (user = currentUser) => {
    try {
      const res = await fetchCompetitions(user.userId);
      if (res.success && res.data) {
        setCompetitionsList(res.data);
      }
    } catch (err) {
      console.error('Failed to load competitions list:', err);
    }
  }, [currentUser]);

  // 2. Fetch active competition details from MongoDB
  const loadActiveCompetition = useCallback(async (slug = selectedCompetitionSlug, user = currentUser) => {
    if (!slug) return;
    try {
      setLoading(true);
      const res = await fetchCompetitionDetails(slug, user.userId);
      if (res.success && res.data) {
        setCompetition(res.data);
      }
    } catch (err) {
      console.error('Failed to load competition details:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUser, selectedCompetitionSlug]);

  useEffect(() => {
    loadAllCompetitions(currentUser);
    if (selectedCompetitionSlug) {
      loadActiveCompetition(selectedCompetitionSlug, currentUser);
    }
  }, [currentUser.userId, selectedCompetitionSlug]);

  const onRefresh = () => {
    setRefreshing(true);
    loadAllCompetitions(currentUser);
    if (selectedCompetitionSlug) {
      loadActiveCompetition(selectedCompetitionSlug, currentUser);
    }
  };

  // Switch between mock users (Registered / Unregistered / Submitted)
  const handleSwitchUser = (user) => {
    setCurrentUser(user);
  };

  // Navigating to competition details
  const handleSelectCompetition = (slug) => {
    setSelectedCompetitionSlug(slug);
    setActiveTab('Competitions');
  };

  // Handle back button
  const handleGoBack = () => {
    if (selectedCompetitionSlug) {
      setSelectedCompetitionSlug(null);
    } else {
      setActiveTab('Home');
    }
  };

  // Video preview handlers
  const handlePlayJudgeIntro = () => {
    setSelectedVideo({
      title: `${competition?.judge?.name} - Judge Intro Video`,
      subtitle: `${competition?.judge?.role} • ${competition?.judge?.experience}`,
      url: competition?.judge?.introVideoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    });
  };

  const handleSelectWinner = (winner) => {
    setSelectedVideo({
      title: `${winner.name} - Winning Performance`,
      subtitle: `${winner.rankTitle} • Classical Dance`,
      url: winner.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    });
  };

  const handleWatchPrizeVideo = () => {
    setSelectedVideo({
      title: 'Prize Money Distribution & UPI Transfer Process',
      subtitle: 'Feedants Automated Payout Gateway Guide',
      url: competition?.supportInfo?.prizeMoneyVideoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    });
  };

  // Primary Action Button Handler (Register or Upload Submission)
  const handlePrimaryAction = () => {
    if (competition?.userState?.isRegistered) {
      setSubmissionModalOpen(true);
    } else {
      setRegisterModalOpen(true);
    }
  };

  // Register confirmation
  const handleConfirmRegistration = async () => {
    try {
      setActionLoading(true);
      const res = await registerForCompetition(competition._id, currentUser);

      if (res.success) {
        setRegisterModalOpen(false);
        const msg = 'Payment & Registration Successful! Your spot is confirmed in the database.';
        if (Platform.OS === 'web') {
          window.alert(msg);
        } else {
          Alert.alert('Success', msg);
        }
        await loadAllCompetitions(currentUser);
        await loadActiveCompetition(competition.slug, currentUser);
      } else {
        const msg = res.message || 'Registration failed.';
        if (Platform.OS === 'web') {
          window.alert(msg);
        } else {
          Alert.alert('Registration Error', msg);
        }
      }
    } catch (err) {
      if (Platform.OS === 'web') {
        window.alert(err.message || 'Error occurred during registration.');
      } else {
        Alert.alert('Error', err.message);
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Upload Submission confirmation
  const handleConfirmSubmission = async (submissionPayload) => {
    try {
      setActionLoading(true);
      const res = await uploadCompetitionSubmission(submissionPayload);

      if (res.success) {
        setSubmissionModalOpen(false);
        const msg = 'Performance entry submitted successfully to MongoDB! All the best!';
        if (Platform.OS === 'web') {
          window.alert(msg);
        } else {
          Alert.alert('Success', msg);
        }
        await loadAllCompetitions(currentUser);
        await loadActiveCompetition(competition.slug, currentUser);
      } else {
        if (Platform.OS === 'web') {
          window.alert(res.message || 'Submission failed.');
        } else {
          Alert.alert('Submission Error', res.message);
        }
      }
    } catch (err) {
      if (Platform.OS === 'web') {
        window.alert(err.message || 'Failed to upload submission.');
      } else {
        Alert.alert('Error', err.message);
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Concurrency Rush Stress Test
  const handleSimulateRush = async () => {
    try {
      setActionLoading(true);
      const res = await simulateConcurrencyRush(20);
      if (res.success) {
        setConcurrencyResults(res);
        await loadAllCompetitions(currentUser);
        await loadActiveCompetition(competition?.slug || 'feedants-classical-dance', currentUser);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Reset to initial seed state
  const handleResetState = async () => {
    try {
      setActionLoading(true);
      await resetDatabaseState();
      await loadAllCompetitions(currentUser);
      await loadActiveCompetition('feedants-classical-dance', currentUser);
      const msg = 'Local MongoDB reset to fresh initial seed state!';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert('Reset', msg);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Quick capacity toggle
  const handleSetSpots = async (bookedCount) => {
    try {
      setActionLoading(true);
      await setSpotsCount(bookedCount);
      await loadAllCompetitions(currentUser);
      await loadActiveCompetition(competition?.slug || 'feedants-classical-dance', currentUser);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Render current active screen
  const renderCurrentScreen = () => {
    // If viewing a specific competition details
    if (selectedCompetitionSlug) {
      return (
        <CompetitionDetailsScreen
          competition={competition}
          loading={loading}
          refreshing={refreshing}
          onRefresh={onRefresh}
          language={language}
          onPlayJudgeIntro={handlePlayJudgeIntro}
          onSelectWinner={handleSelectWinner}
          onWatchPrizeVideo={handleWatchPrizeVideo}
          onOpenRefundPolicy={() => {
            const msg = 'Refund Policy: 100% full refund guaranteed if competition is canceled or rescheduled.';
            if (Platform.OS === 'web') window.alert(msg);
            else Alert.alert('Refund Policy', msg);
          }}
          onShareReferral={() => {
            const msg = 'Referral link copied to share! You earn ₹10 for every registration.';
            if (Platform.OS === 'web') window.alert(msg);
            else Alert.alert('Referral Link', msg);
          }}
          onOpenReviews={() => setTestimonialsOpen(true)}
          onPrimaryAction={handlePrimaryAction}
        />
      );
    }

    // Otherwise render bottom tab screen
    switch (activeTab) {
      case 'Home':
        return (
          <HomeScreen
            currentUser={currentUser}
            competitions={competitionsList}
            loading={loading}
            onSelectCompetition={handleSelectCompetition}
            onNavigateExplore={() => setActiveTab('Explore')}
            language={language}
          />
        );
      case 'Explore':
        return (
          <ExploreScreen
            competitions={competitionsList}
            onSelectCompetition={handleSelectCompetition}
            language={language}
          />
        );
      case 'Profile':
        return (
          <ProfileScreen
            currentUser={currentUser}
            onSelectCompetition={handleSelectCompetition}
            language={language}
          />
        );
      case 'Competitions':
      default:
        return (
          <CompetitionsScreen
            competitions={competitionsList}
            currentUser={currentUser}
            loading={loading}
            onSelectCompetition={handleSelectCompetition}
            language={language}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Outer Shell centered for mobile viewport aesthetic */}
      <View style={styles.phoneContainer}>
        {/* Top Evaluator Testing Toolbar */}
        <TesterToolbar
          currentUser={currentUser}
          onSwitchUser={handleSwitchUser}
          onSimulateRush={handleSimulateRush}
          onResetState={handleResetState}
          onSetSpots={handleSetSpots}
          spotsLeft={competition?.spotsLeft ?? 19}
          totalSpots={competition?.totalSpots ?? 20}
          loading={actionLoading}
        />

        {/* Clean Application Header Bar */}
        <HeaderBar
          title={
            selectedCompetitionSlug
              ? (language === 'hi' ? 'वापस जाएं' : 'Go back')
              : activeTab === 'Competitions'
              ? 'Competitions'
              : activeTab === 'Explore'
              ? 'Explore Stages'
              : activeTab === 'Profile'
              ? 'My Profile'
              : 'Feedants'
          }
          showBackButton={!!selectedCompetitionSlug}
          language={language}
          onToggleLanguage={(lang) => setLanguage(lang)}
          onGoBack={handleGoBack}
        />

        {/* Dynamic Screen View */}
        <View style={styles.screenArea}>
          {renderCurrentScreen()}
        </View>

        {/* 5-Tab Navigation Bar */}
        <BottomNavBar
          language={language}
          activeNav={selectedCompetitionSlug ? 'Competitions' : activeTab}
          onSelectNav={(tab) => {
            if (tab === 'Create') {
              setCreateSheetOpen(true);
            } else {
              setSelectedCompetitionSlug(null);
              setActiveTab(tab);
            }
          }}
        />
      </View>

      {/* Interactive Modals */}
      <CreateActionSheetModal
        visible={createSheetOpen}
        onClose={() => setCreateSheetOpen(false)}
        onOpenSubmission={() => {
          setSelectedCompetitionSlug('feedants-classical-dance');
          setSubmissionModalOpen(true);
        }}
        onHostStage={() => {
          const msg = 'Host a Stage: Custom organizer portal opens soon for verified choreographers!';
          if (Platform.OS === 'web') window.alert(msg);
          else Alert.alert('Host Stage', msg);
        }}
        onRefer={() => {
          const msg = 'Your referral link: https://feedants.com/r/referral123 (Copied to clipboard!)';
          if (Platform.OS === 'web') window.alert(msg);
          else Alert.alert('Referral', msg);
        }}
      />

      <VideoModal
        visible={!!selectedVideo}
        videoData={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />

      <RegisterModal
        visible={registerModalOpen}
        competition={competition}
        currentUser={currentUser}
        loading={actionLoading}
        onConfirm={handleConfirmRegistration}
        onClose={() => setRegisterModalOpen(false)}
        language={language}
      />

      <UploadSubmissionModal
        visible={submissionModalOpen}
        competition={competition}
        currentUser={currentUser}
        existingSubmission={competition?.userState?.submissionDetails}
        loading={actionLoading}
        onSubmit={handleConfirmSubmission}
        onClose={() => setSubmissionModalOpen(false)}
        language={language}
      />

      <ConcurrencyResultModal
        visible={!!concurrencyResults}
        results={concurrencyResults}
        onClose={() => setConcurrencyResults(null)}
      />

      <TestimonialsModal
        visible={testimonialsOpen}
        onClose={() => setTestimonialsOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
    borderLeftWidth: Platform.OS === 'web' ? 1 : 0,
    borderRightWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  screenArea: {
    flex: 1,
  },
});
