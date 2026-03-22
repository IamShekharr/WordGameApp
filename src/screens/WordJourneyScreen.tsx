import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { getWordOfDay } from '../utils/gameLogic';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'WordJourney'>;
};

export default function WordJourneyScreen({ navigation }: Props) {
  const wod = getWordOfDay();
  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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
        <Text style={styles.title}>📖 Word Journey</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* Word of Day Card */}
        <Text style={styles.sectionLabel}>WORD OF THE DAY</Text>
        <Text style={styles.dateText}>📅 {today}</Text>

        <View style={styles.wodCard}>
          <Text style={styles.word}>{wod.word}</Text>

          <View style={styles.metaRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{wod.pos}</Text>
            </View>
            <Text style={styles.pronunciation}>{wod.pronunciation}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.defLabel}>DEFINITION</Text>
          <Text style={styles.definition}>{wod.definition}</Text>

          <View style={styles.divider} />

          <Text style={styles.defLabel}>SYNONYMS</Text>
          <View style={styles.synonymsRow}>
            {wod.synonyms.map((s, i) => (
              <View key={i} style={styles.synChip}>
                <Text style={styles.synText}>{s}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <Text style={styles.defLabel}>LONGEST WORD FORMED</Text>
          <Text style={styles.longestWord}>LOITER</Text>
        </View>

        {/* Tips Card */}
        <Text style={styles.sectionLabel}>💡 TIPS</Text>
        <View style={styles.tipCard}>
          {[
            '✦ Words with 6+ letters give bonus points!',
            '✦ Daily challenges reset at midnight',
            '✦ Faster answers give more timer bonus',
            '✦ Practice mode has no time limit',
          ].map((tip, i) => (
            <Text key={i} style={styles.tipText}>{tip}</Text>
          ))}
        </View>

        <View style={{ height: 40 }} />
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

  content: { padding: SPACING.lg },

  sectionLabel: {
    fontSize: SIZES.xs,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  dateText: {
    color: COLORS.textMuted,
    fontSize: SIZES.xs,
    marginBottom: SPACING.sm,
  },

  wodCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  word: {
    fontSize: 40,
    fontWeight: '900',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  badge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: SIZES.xs,
  },
  pronunciation: {
    color: COLORS.textMuted,
    fontSize: SIZES.sm,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  defLabel: {
    fontSize: SIZES.xs,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  definition: {
    color: COLORS.text,
    fontSize: SIZES.md,
    lineHeight: 22,
  },
  synonymsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  synChip: {
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  synText: { color: COLORS.text, fontSize: SIZES.sm },
  longestWord: {
    fontSize: SIZES.xxl,
    fontWeight: '900',
    color: COLORS.text,
  },

  tipCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tipText: {
    color: COLORS.textSec,
    fontSize: SIZES.sm,
    lineHeight: 22,
  },
});
