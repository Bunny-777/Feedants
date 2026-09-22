import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TRANSLATIONS } from '../constants/translations';

export default function JudgeCard({ judge, language, onPlayIntroVideo }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  if (!judge) return null;

  return (
    <View style={styles.card}>
      {/* Judge Photo */}
      <Image
        source={{ uri: judge.avatarUrl }}
        style={styles.avatar}
        resizeMode="cover"
      />

      {/* Details */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>{t.judge}</Text>
        <Text style={styles.name}>{judge.name}</Text>
        <Text style={styles.role}>{judge.role}</Text>
        <Text style={styles.experience}>{judge.experience}</Text>
      </View>

      {/* Intro Video Button */}
      <TouchableOpacity
        style={styles.videoAction}
        onPress={onPlayIntroVideo}
        activeOpacity={0.8}
      >
        <View style={styles.playButtonCircle}>
          <Ionicons name="play" size={18} color="#0d808e" style={{ marginLeft: 2 }} />
        </View>
        <Text style={styles.videoText}>{t.introVideo}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#edf2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f1f5f9',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 14,
  },
  label: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
    marginBottom: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  role: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  experience: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  videoAction: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  playButtonCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#e6f7f8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  videoText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
});
