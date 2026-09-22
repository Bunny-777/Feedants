import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { TRANSLATIONS } from '../constants/translations';

export default function ImportantDatesGrid({ dates, language }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const dateItems = [
    {
      id: 'reg_before',
      title: t.registerBefore,
      date: '10 Aug 26',
      time: '11:50 PM',
      icon: <Ionicons name="calendar-outline" size={20} color="#0d808e" />,
    },
    {
      id: 'sub_starts',
      title: t.submissionStarts,
      date: '6 Aug 26',
      time: '04:00 AM',
      icon: <Feather name="send" size={20} color="#0d808e" />,
    },
    {
      id: 'sub_ends',
      title: t.submissionEnds,
      date: '30 Aug 26',
      time: '11:55 PM',
      icon: <Feather name="upload" size={20} color="#0d808e" />,
    },
    {
      id: 'result_date',
      title: t.resultDate,
      date: '1 Sept 26',
      time: '11:50 PM',
      icon: <Ionicons name="trophy-outline" size={20} color="#0d808e" />,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t.importantDates}</Text>

      <View style={styles.grid}>
        {dateItems.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.dateCard,
              index % 2 === 0 ? styles.cardLeft : styles.cardRight,
              index < 2 ? styles.cardTop : styles.cardBottom,
            ]}
          >
            <View style={styles.iconWrapper}>{item.icon}</View>
            <View style={styles.textWrapper}>
              <Text style={styles.dateLabel}>{item.title}</Text>
              <Text style={styles.dateValue}>{item.date}</Text>
              <Text style={styles.timeValue}>{item.time}</Text>
            </View>
          </View>
        ))}
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
    padding: 16,
    borderWidth: 1,
    borderColor: '#edf2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 12,
    overflow: 'hidden',
  },
  dateCard: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
  },
  cardLeft: {
    borderRightWidth: 1,
    borderRightColor: '#f1f5f9',
  },
  cardRight: {},
  cardTop: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  cardBottom: {},
  iconWrapper: {
    marginRight: 10,
  },
  textWrapper: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '500',
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0d808e',
    marginBottom: 1,
  },
  timeValue: {
    fontSize: 11,
    color: '#1e293b',
    fontWeight: '700',
  },
});
