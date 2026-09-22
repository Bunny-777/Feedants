import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { TRANSLATIONS } from '../constants/translations';

export default function BottomNavBar({ language, activeNav = 'Competitions', onSelectNav }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <View style={styles.container}>
      {/* Home */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onSelectNav?.('Home')}
        activeOpacity={0.7}
      >
        <Ionicons
          name="home-outline"
          size={22}
          color={activeNav === 'Home' ? '#09535d' : '#94a3b8'}
        />
        <Text style={[styles.navLabel, activeNav === 'Home' && styles.navLabelActive]}>
          {t.home}
        </Text>
      </TouchableOpacity>

      {/* Explore */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onSelectNav?.('Explore')}
        activeOpacity={0.7}
      >
        <Ionicons
          name="search-outline"
          size={22}
          color={activeNav === 'Explore' ? '#09535d' : '#94a3b8'}
        />
        <Text style={[styles.navLabel, activeNav === 'Explore' && styles.navLabelActive]}>
          {t.explore}
        </Text>
      </TouchableOpacity>

      {/* Center + Button */}
      <TouchableOpacity
        style={styles.centerAddButton}
        onPress={() => onSelectNav?.('Create')}
        activeOpacity={0.85}
      >
        <Feather name="plus" size={24} color="#ffffff" />
      </TouchableOpacity>

      {/* Competitions (Active) */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onSelectNav?.('Competitions')}
        activeOpacity={0.7}
      >
        <Ionicons
          name="trophy"
          size={22}
          color={activeNav === 'Competitions' ? '#09535d' : '#94a3b8'}
        />
        <Text
          style={[styles.navLabel, activeNav === 'Competitions' && styles.navLabelActive]}
        >
          {t.competitions}
        </Text>
      </TouchableOpacity>

      {/* Profile */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onSelectNav?.('Profile')}
        activeOpacity={0.7}
      >
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
          }}
          style={[
            styles.profileAvatar,
            activeNav === 'Profile' && styles.profileAvatarActive,
          ]}
        />
        <Text
          style={[styles.navLabel, activeNav === 'Profile' && styles.navLabelActive]}
        >
          {t.profile}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
  },
  navLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 2,
  },
  navLabelActive: {
    color: '#09535d',
    fontWeight: '800',
  },
  centerAddButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#09535d',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#09535d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  profileAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  profileAvatarActive: {
    borderColor: '#09535d',
    borderWidth: 2,
  },
});
