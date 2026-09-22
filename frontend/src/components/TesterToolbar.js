import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { THEME } from '../constants/theme';

export default function TesterToolbar({
  currentUser,
  onSwitchUser,
  onSimulateRush,
  onResetState,
  onSetSpots,
  spotsLeft,
  totalSpots,
  loading,
}) {
  const [collapsed, setCollapsed] = useState(true);

  const users = [
    { userId: 'user_registered_01', name: 'Kushal (Registered)', role: 'Registered' },
    { userId: 'user_unregistered_02', name: 'Priya (Unregistered)', role: 'Unregistered' },
    { userId: 'user_submitted_03', name: 'Rohit (Submitted)', role: 'Submitted Entry' },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.headerRow}
        onPress={() => setCollapsed(!collapsed)}
        activeOpacity={0.8}
      >
        <View style={styles.statusIndicator}>
          <View style={styles.statusDot} />
          <Text style={styles.headerTitle}>
            🧪 Evaluator Testing Suite & Concurrency Panel
          </Text>
        </View>
        <Text style={styles.toggleText}>{collapsed ? '▼ Show Controls' : '▲ Hide Controls'}</Text>
      </TouchableOpacity>

      {!collapsed && (
        <View style={styles.body}>
          <Text style={styles.subheading}>1. Switch Active User Session (Dynamic States):</Text>
          <View style={styles.buttonRow}>
            {users.map((u) => {
              const isActive = currentUser?.userId === u.userId;
              return (
                <TouchableOpacity
                  key={u.userId}
                  style={[styles.userBtn, isActive && styles.userBtnActive]}
                  onPress={() => onSwitchUser(u)}
                >
                  <Text style={[styles.userBtnText, isActive && styles.userBtnTextActive]}>
                    {u.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.subheading}>2. Stress Test & Concurrency Simulator:</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.rushBtn]}
              onPress={onSimulateRush}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.actionBtnText}>⚡ Fire 20 Concurrent Registrations</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.resetBtn]}
              onPress={onResetState}
            >
              <Text style={styles.resetBtnText}>🔄 Reset to Seed State</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subheading}>3. Test Spot Edge Cases (Capacity: {spotsLeft} / {totalSpots} left):</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.spotBtn}
              onPress={() => onSetSpots(1)}
            >
              <Text style={styles.spotBtnText}>19 spots left (Design state)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.spotBtn}
              onPress={() => onSetSpots(19)}
            >
              <Text style={styles.spotBtnText}>Only 1 spot left!</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.spotBtn, styles.soldOutBtn]}
              onPress={() => onSetSpots(20)}
            >
              <Text style={[styles.spotBtnText, styles.soldOutText]}>Sold Out (0 spots)</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    borderBottomWidth: 2,
    borderBottomColor: '#0ea5e9',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 8,
  },
  headerTitle: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  toggleText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '600',
  },
  body: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  subheading: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  userBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#334155',
  },
  userBtnActive: {
    backgroundColor: '#0284c7',
  },
  userBtnText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '500',
  },
  userBtnTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  rushBtn: {
    backgroundColor: '#d97706',
  },
  resetBtn: {
    backgroundColor: '#475569',
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  resetBtnText: {
    color: '#f1f5f9',
    fontSize: 11,
    fontWeight: '600',
  },
  spotBtn: {
    backgroundColor: '#334155',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  soldOutBtn: {
    backgroundColor: '#7f1d1d',
  },
  spotBtnText: {
    color: '#e2e8f0',
    fontSize: 10,
    fontWeight: '600',
  },
  soldOutText: {
    color: '#fca5a5',
  },
});
