import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import {
  getGlobalLeaderboard,
  getWeeklyLeaderboard,
  getCurrentUser,
} from '../services/firebaseService';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Leaderboard'>;
};

type LeaderEntry = {
  rank: number;
  uid: string;
  username: string;
  totalScore: number;
  wordsFound: number;
  location?: string;
};

export default function LeaderboardScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'global' | 'weekly'>('global');
  const [data, setData] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res =
        activeTab === 'global'
          ? await getGlobalLeaderboard()
          : await getWeeklyLeaderboard();
      setData(res as LeaderEntry[]);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return COLORS.gold;
    if (rank === 2) return COLORS.silver;
    if (rank === 3) return COLORS.bronze;
    return COLORS.textMuted;
  };

  const renderItem = ({ item }: { item: LeaderEntry }) => {
    const isMe = item.uid === user?.uid;
    return (
      <View style={[styles.row, isMe && styles.myRow]}>
        <Text style={[styles.rank, { color: getRankColor(item.rank) }]}>
          {getRankIcon(item.rank)}
        </Text>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(item.username || '?')[0].toUpperCase()}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, isMe && { color: COLORS.primary }]}>
            {item.username || 'Unknown'}
            {isMe ? ' (You)' : ''}
          </Text>
          <Text style={styles.location}>
            📍 {item.location || 'India'}
          </Text>
        </View>
        <View style={styles.scoreArea}>
          <Text style={styles.rowScore}>
            {activeTab === 'global' ? item.totalScore : item.wordsFound}
          </Text>
          <Text style={styles.rowScoreLabel}>
            {activeTab === 'global' ? 'pts' : 'words'}
          </Text>
        </View>
      </View>
    );
  };

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
        <Text style={styles.title}>🏆 Leaderboard</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['global', 'weekly'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.tabTextActive,
            ]}>
              {tab === 'global' ? '🌍 Global' : '📅 Weekly'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator
          color={COLORS.primary}
          style={{ marginTop: 40 }}
        />
      ) : data.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🏆</Text>
          <Text style={styles.emptyText}>
            Koi data nahi! Pehle game khelo.
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(_, i) => i.toString()}
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

  tabs: {
    flexDirection: 'row',
    margin: SPACING.lg,
    backgroundColor: COLORS.border,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: {
    color: COLORS.textSec,
    fontWeight: '600',
    fontSize: SIZES.sm,
  },
  tabTextActive: { color: '#fff' },

  list: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  myRow: {
    borderColor: COLORS.primary + '60',
    backgroundColor: COLORS.primaryLight,
  },
  rank: {
    width: 36,
    textAlign: 'center',
    fontSize: SIZES.lg,
    fontWeight: '800',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
    marginLeft: 4,
  },
  avatarText: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: SIZES.md,
  },
  info: { flex: 1 },
  name: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: SIZES.md,
  },
  location: {
    color: COLORS.textMuted,
    fontSize: SIZES.xs,
    marginTop: 2,
  },
  scoreArea: { alignItems: 'flex-end' },
  rowScore: {
    color: COLORS.primary,
    fontWeight: '900',
    fontSize: SIZES.xl,
  },
  rowScoreLabel: {
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