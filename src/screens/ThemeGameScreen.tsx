import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { COLORS, SIZES, SPACING } from '../constants/theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ThemeGame'>;
};

const THEMES = [
  { key: 'animals',   label: 'Animals',   icon: '🦁', lvl: 1, color: '#FF8C42' },
  { key: 'food',      label: 'Food',       icon: '🍕', lvl: 1, color: '#F6AD55' },
  { key: 'science',   label: 'Science',    icon: '🔬', lvl: 2, color: '#38B2AC' },
  { key: 'countries', label: 'Countries',  icon: '🌍', lvl: 2, color: '#4F7FFA' },
  { key: 'valentine', label: 'Valentine',  icon: '❤️', lvl: 1, color: '#FC8181' },
  { key: 'music',     label: 'Music',      icon: '🎵', lvl: 2, color: '#9F7AEA' },
];

export default function ThemeGameScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🎨 Theme Game</Text>
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.subtitle}>Pick a theme and start playing</Text>

      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {THEMES.map((theme) => (
          <TouchableOpacity
            key={theme.key}
            style={[styles.themeCard, { borderColor: theme.color + '40' }]}
            onPress={() =>
              navigation.navigate('Game', {
                mode: 'practice',
                theme: theme.key,
              })
            }
            activeOpacity={0.85}
          >
            <Text style={styles.themeIcon}>{theme.icon}</Text>
            <Text style={[styles.themeLabel, { color: theme.color }]}>
              {theme.label}
            </Text>
            <View style={[
              styles.levelBadge,
              { backgroundColor: theme.color + '20' },
            ]}>
              <Text style={[styles.levelText, { color: theme.color }]}>
                Lvl {theme.lvl}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backText: { fontSize: 32, color: COLORS.text, marginTop: -4 },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: SIZES.xl,
    fontWeight: '800',
    color: COLORS.text,
  },

  subtitle: {
    textAlign: 'center',
    color: COLORS.textSec,
    fontSize: SIZES.sm,
    marginVertical: SPACING.lg,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    paddingBottom: 40,
  },
  themeCard: {
    width: '47%',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    minHeight: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  themeIcon: { fontSize: 44, marginBottom: SPACING.sm },
  themeLabel: { fontSize: SIZES.lg, fontWeight: '800', marginBottom: SPACING.sm },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  levelText: { fontSize: SIZES.xs, fontWeight: '700' },
});