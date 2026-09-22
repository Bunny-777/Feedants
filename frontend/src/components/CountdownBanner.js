import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { TRANSLATIONS } from '../constants/translations';

export default function CountdownBanner({ targetDate, language }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  
  const [timeLeft, setTimeLeft] = useState({
    days: '01',
    hours: '06',
    minutes: '28',
    seconds: '32',
    isExpired: false,
  });

  useEffect(() => {
    if (!targetDate) return;

    const calculate = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
          isExpired: true,
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
        isExpired: false,
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <View style={styles.banner}>
      <View style={styles.leftGroup}>
        <MaterialCommunityIcons name="timer-sand" size={16} color="#0d808e" />
        <Text style={styles.label}>{t.registrationClosesIn}</Text>
      </View>

      <Text style={styles.timerText}>
        {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
      </Text>

      <View style={styles.rightGroup}>
        <Ionicons name="stopwatch-outline" size={16} color="#0d808e" />
        <Text style={styles.hurryText}>{t.hurryUp}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#e6f7f8',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccecee',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1e293b',
  },
  timerText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#09535d',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.5,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hurryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#09535d',
  },
});
