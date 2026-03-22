import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { getCurrentUser, getUserData, logoutUser } from '../services/firebaseService';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { getWordOfDay } from '../utils/gameLogic';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  const [userData, setUserData] = useState<any>(null);
  const wordOfDay = getWordOfDay();
  const user = getCurrentUser();

  useEffect(() => {
    if (user) {
      getUserData(user.uid).then(setUserData);
    }
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back 👋</Text>
            <Text style={styles.username}>
              {userData?.username || user?.displayName || 'Player'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={async () => {
              await logoutUser();
              navigation.replace('Auth');
            }}
          >
            <Text style={styles.logoutText}>↩</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Score', value: userData?.totalScore || 0, icon: '⭐' },
            { label: 'Words', value: userData?.wordsFound || 0, icon: '💬' },
            { label: 'Games', value: userData?.gamesPlayed || 0, icon: '🎮' },
          ].map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Daily Challenge Card */}
        <View style={styles.dailyCard}>
          <View>
            <Text style={styles.dailyLabel}>⚡ Daily Challenge</Text>
            <Text style={styles.dailyTitle}>Play Now →</Text>
            <Text style={styles.dailySubtitle}>3 attempts · 90 seconds</Text>
          </View>
          <Text style={styles.dailyEmoji}>⚡</Text>
        </View>
        <TouchableOpacity
          style={styles.dailyBtn}
          onPress={() => navigation.navigate('Game', { mode: 'daily' })}
        >
          <Text style={styles.dailyBtnText}>Start Daily Challenge</Text>
        </TouchableOpacity>

        {/* Game Modes */}
        <Text style={styles.sectionLabel}>🎮 Game Modes</Text>
        <View style={styles.modesRow}>
          {[
            { label: 'Theme Game', icon: '🎨', screen: 'ThemeGame' },
            { label: 'Practice', icon: '🎯', screen: 'Game' },
            { label: 'History', icon: '📝', screen: 'GuessedWords' },
          ].map((m) => (
            <TouchableOpacity
              key={m.label}
              style={styles.modeCard}
              onPress={() =>
                navigation.navigate(
                  m.screen as any,
                  m.screen === 'Game' ? { mode: 'practice' } : undefined
                )
              }
            >
              <Text style={styles.modeIcon}>{m.icon}</Text>
              <Text style={styles.modeLabel}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Word of Day */}
        <Text style={styles.sectionLabel}>📅 Word of the Day</Text>
        <TouchableOpacity
          style={styles.wodCard}
          onPress={() => navigation.navigate('WordJourney')}
        >
          <Text style={styles.wodDate}>
            {new Date().toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </Text>
          <Text style={styles.wod}>{wordOfDay.word}</Text>
          <View style={styles.wodRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{wordOfDay.pos}</Text>
            </View>
            <Text style={styles.wodPron}>{wordOfDay.pronunciation}</Text>
          </View>
          <Text style={styles.wodDef}>{wordOfDay.definition}</Text>
        </TouchableOpacity>

        {/* More */}
        <Text style={styles.sectionLabel}>📊 More</Text>
        {[
          { label: '🏆 Leaderboard', screen: 'Leaderboard' },
          { label: '📝 Guessed Words', screen: 'GuessedWords' },
        ].map((n) => (
          <TouchableOpacity
            key={n.screen}
            style={styles.navCard}
            onPress={() => navigation.navigate(n.screen as any)}
          >
            <Text style={styles.navLabel}>{n.label}</Text>
            <Text style={styles.navArrow}>›</Text>
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1, paddingHorizontal: SPACING.lg },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  greeting: { fontSize: SIZES.sm, color: COLORS.textSec },
  username: { fontSize: SIZES.xxl, fontWeight: '800', color: COLORS.text },
  logoutBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  logoutText: { fontSize: 18, color: COLORS.textSec },

  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIcon: { fontSize: 20, marginBottom: 4 },
  statValue: { fontSize: SIZES.xl, fontWeight: '800', color: COLORS.text },
  statLabel: { fontSize: SIZES.xs, color: COLORS.textMuted, marginTop: 2 },

  dailyCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dailyLabel: { fontSize: SIZES.sm, color: 'rgba(255,255,255,0.8)' },
  dailyTitle: { fontSize: SIZES.xxl, fontWeight: '900', color: '#fff', marginTop: 4 },
  dailySubtitle: { fontSize: SIZES.xs, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  dailyEmoji: { fontSize: 48 },
  dailyBtn: {
    backgroundColor: 'rgba(79,127,250,0.15)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 14,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  dailyBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: SIZES.md },

  sectionLabel: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
    letterSpacing: 0.5,
  },
  modesRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  modeCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modeIcon: { fontSize: 28, marginBottom: 6 },
  modeLabel: { fontSize: SIZES.xs, fontWeight: '700', color: COLORS.text },

  wodCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  wodDate: { fontSize: SIZES.xs, color: COLORS.textMuted, marginBottom: 4 },
  wod: { fontSize: 36, fontWeight: '900', color: COLORS.primary, marginBottom: 8 },
  wodRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  badge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: { color: COLORS.primary, fontWeight: '700', fontSize: SIZES.xs },
  wodPron: { fontSize: SIZES.xs, color: COLORS.textMuted },
  wodDef: { fontSize: SIZES.sm, color: COLORS.textSec, lineHeight: 20 },

  navCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  navLabel: { fontSize: SIZES.md, fontWeight: '600', color: COLORS.text },
  navArrow: { fontSize: 22, color: COLORS.textMuted },
});