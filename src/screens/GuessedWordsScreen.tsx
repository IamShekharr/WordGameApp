import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { getGuessedWords, getCurrentUser } from '../services/firebaseService';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'GuessedWords'>;
};

type WordEntry = {
  id: string;
  word: string;
  mode: string;
  score: number;
  foundAt: any;
};

export default function GuessedWordsScreen({ navigation }: Props) {
  const [words, setWords] = useState<WordEntry[]>([]);
  const [filtered, setFiltered] = useState<WordEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const user = getCurrentUser();

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (search) {
      setFiltered(
        words.filter((w) =>
          w.word.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFiltered(words);
    }
  }, [search, words]);

  const load = async () => {
    if (!user) return;
    try {
      const res = await getGuessedWords(user.uid);
      setWords(res as WordEntry[]);
      setFiltered(res as WordEntry[]);
    } finally {
      setLoading(false);
    }
  };

  const getModeIcon = (mode: string) => {
    if (mode === 'daily') return '⚡';
    if (mode === 'practice') return '🎯';
    return '🎨';
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: WordEntry;
    index: number;
  }) => (
    <View style={styles.row}>
      <View style={styles.numBox}>
        <Text style={styles.num}>
          {String(index + 1).padStart(2, '0')}
        </Text>
      </View>
      <View style={styles.wordInfo}>
        <Text style={styles.word}>{item.word}</Text>
        <Text style={styles.meta}>
          {getModeIcon(item.mode)} {item.mode} · Found recently
        </Text>
      </View>
      <View style={styles.scoreBox}>
        <Text style={styles.score}>+{item.score}</Text>
        <Text style={styles.scoreLabel}>pts</Text>
      </View>
    </View>
  );

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
        <Text style={styles.title}>📝 Guessed Words</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a word"
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
      </View>

      <Text style={styles.count}>{filtered.length} words found</Text>

      {loading ? (
        <ActivityIndicator
          color={COLORS.primary}
          style={{ marginTop: 40 }}
        />
      ) : filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyText}>
            Koi words nahi! Pehle game khelo.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

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

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: SIZES.md,
    paddingVertical: SPACING.md,
  },

  count: {
    color: COLORS.textMuted,
    fontSize: SIZES.xs,
    marginLeft: SPACING.lg,
    marginBottom: SPACING.sm,
  },

  list: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  numBox: { marginRight: SPACING.md },
  num: {
    color: COLORS.textMuted,
    fontSize: SIZES.sm,
    fontWeight: '700',
  },
  wordInfo: { flex: 1 },
  word: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: SIZES.lg,
  },
  meta: {
    color: COLORS.textMuted,
    fontSize: SIZES.xs,
    marginTop: 2,
  },
  scoreBox: { alignItems: 'flex-end' },
  score: {
    color: COLORS.primary,
    fontWeight: '900',
    fontSize: SIZES.xl,
  },
  scoreLabel: {
    color: COLORS.textMuted,
    fontSize: SIZES.xs,
  },

  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.md },
  emptyText: { color: COLORS.textSec, fontSize: SIZES.md },
});