import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  ScrollView,
  Vibration,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import {
  getTodayLetters,
  generateLetters,
  canFormWord,
  validateWord,
  calculateScore,
} from '../utils/gameLogic';
import {
  getCurrentUser,
  saveGuessedWord,
  incrementGamesPlayed,
  saveDailyChallengeScore,
} from '../services/firebaseService';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Game'>;
  route: RouteProp<RootStackParamList, 'Game'>;
};

const DAILY_TIME = 90;

export default function GameScreen({ navigation, route }: Props) {
  const { mode } = route.params;
  const isDaily = mode === 'daily';

  const [letters, setLetters] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [guessedWords, setGuessedWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DAILY_TIME);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState(COLORS.green);
  const [attemptsLeft, setAttemptsLeft] = useState(3);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const messageAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<any>(null);
  const user = getCurrentUser();

  useEffect(() => {
    const ls = isDaily ? getTodayLetters() : generateLetters(10);
    setLetters(ls);
    if (isDaily) {
      startTimer();
      if (user) incrementGamesPlayed(user.uid);
    }
    return () => clearInterval(timerRef.current);
  }, []);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const showMessage = (msg: string, color: string) => {
    setMessage(msg);
    setMessageColor(color);
    Animated.sequence([
      Animated.timing(messageAnim, {
        toValue: 1, duration: 200, useNativeDriver: true,
      }),
      Animated.delay(1200),
      Animated.timing(messageAnim, {
        toValue: 0, duration: 300, useNativeDriver: true,
      }),
    ]).start();
  };

  const shakeWord = () => {
    Vibration.vibrate(100);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const toggleLetter = (index: number) => {
    if (selectedIndices.includes(index)) {
      const n = selectedIndices.filter((i) => i !== index);
      setSelectedIndices(n);
      setCurrentWord(n.map((i) => letters[i]).join(''));
    } else {
      const n = [...selectedIndices, index];
      setSelectedIndices(n);
      setCurrentWord(n.map((i) => letters[i]).join(''));
    }
  };

  const clearSelection = () => {
    setSelectedIndices([]);
    setCurrentWord('');
  };

  const submitWord = async () => {
    if (currentWord.length < 3) {
      showMessage('Min 3 letters!', COLORS.red);
      shakeWord();
      return;
    }
    if (guessedWords.includes(currentWord)) {
      showMessage('Already found! ✓', COLORS.yellow);
      shakeWord();
      clearSelection();
      return;
    }
    if (!canFormWord(currentWord, letters)) {
      showMessage('Invalid letters!', COLORS.red);
      shakeWord();
      clearSelection();
      return;
    }
    const isValid = await validateWord(currentWord);
    if (!isValid) {
      if (isDaily) {
        const newAttempts = attemptsLeft - 1;
        setAttemptsLeft(newAttempts);
        if (newAttempts <= 0) {
          setGameOver(true);
          return;
        }
        showMessage(`Not a word! ${newAttempts} left`, COLORS.red);
      } else {
        showMessage('Not a valid word!', COLORS.red);
      }
      shakeWord();
      clearSelection();
      return;
    }

    const wordScore = calculateScore(
      currentWord,
      isDaily ? Math.floor(timeLeft / 10) : 0
    );
    const newGuessed = [...guessedWords, currentWord];
    const newScore = score + wordScore;
    setGuessedWords(newGuessed);
    setScore(newScore);
    showMessage(
      `+${wordScore} pts! ${currentWord.length >= 6 ? '🔥' : '✓'}`,
      COLORS.green
    );
    clearSelection();

    if (user) {
      await saveGuessedWord(user.uid, currentWord, mode, wordScore);
    }
  };

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const timerColor =
    timeLeft <= 10 ? COLORS.red : timeLeft <= 30 ? COLORS.yellow : COLORS.primary;

  // ── Game Over Screen ──
  if (gameOver) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverEmoji}>🎉</Text>
          <Text style={styles.gameOverTitle}>Game Over!</Text>
          <Text style={styles.gameOverScore}>{score} pts</Text>
          <Text style={styles.gameOverWords}>
            {guessedWords.length} words found
          </Text>
          <ScrollView
            style={styles.wordsList}
            showsVerticalScrollIndicator={false}
          >
            {guessedWords.map((w, i) => (
              <View key={i} style={styles.wordChip}>
                <Text style={styles.wordChipText}>{w}</Text>
                <Text style={styles.wordChipScore}>
                  +{calculateScore(w)}
                </Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => navigation.replace('Home')}
          >
            <Text style={styles.homeBtnText}>🏠 Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.leaderBtn}
            onPress={() => navigation.navigate('Leaderboard')}
          >
            <Text style={styles.leaderBtnText}>🏆 Leaderboard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Main Game ──
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
        <View style={styles.headerCenter}>
          <Text style={styles.modeLabel}>
            {isDaily ? '⚡ Daily Challenge' : '🎯 Practice'}
          </Text>
          {isDaily && (
            <Text style={[
              styles.attempts,
              { color: attemptsLeft > 1 ? COLORS.text : COLORS.red },
            ]}>
              {'◆ '.repeat(attemptsLeft)}{'◇ '.repeat(3 - attemptsLeft)}
            </Text>
          )}
        </View>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreValue}>{score}</Text>
          <Text style={styles.scoreLabel}>pts</Text>
        </View>
      </View>

      {/* Timer */}
      {isDaily && (
        <View style={styles.timerBox}>
          <Text style={[styles.timer, { color: timerColor }]}>
            {fmt(timeLeft)}
          </Text>
          <View style={styles.timerTrack}>
            <View style={[
              styles.timerFill,
              {
                width: `${(timeLeft / DAILY_TIME) * 100}%` as any,
                backgroundColor: timerColor,
              },
            ]} />
          </View>
        </View>
      )}

      {/* Word Display */}
      <Animated.View style={[
        styles.wordDisplay,
        { transform: [{ translateX: shakeAnim }] },
      ]}>
        <View style={styles.wordSlots}>
          {currentWord.length > 0 ? (
            currentWord.split('').map((ch, i) => (
              <View key={i} style={styles.slot}>
                <Text style={styles.slotText}>{ch}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.placeholder}>
              Select letters to build a word...
            </Text>
          )}
        </View>
        <View style={styles.wordMeta}>
          <Text style={styles.metaText}>Min. Word Length: 3</Text>
          <Text style={styles.metaText}>
            Possible words: {guessedWords.length} found
          </Text>
        </View>
      </Animated.View>

      {/* Toast Message */}
      <Animated.View style={[styles.toast, { opacity: messageAnim }]}>
        <Text style={[styles.toastText, { color: messageColor }]}>
          {message}
        </Text>
      </Animated.View>

      {/* Letter Grid */}
      <View style={styles.letterGrid}>
        {[0, 1].map((row) => (
          <View key={row} style={styles.letterRow}>
            {letters.slice(row * 5, row * 5 + 5).map((letter, col) => {
              const idx = row * 5 + col;
              const selected = selectedIndices.includes(idx);
              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.letterTile,
                    selected && styles.letterTileSelected,
                  ]}
                  onPress={() => toggleLetter(idx)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.letterText,
                    selected && styles.letterTextSelected,
                  ]}>
                    {letter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.clearBtn} onPress={clearSelection}>
          <Text style={styles.clearText}>✕ Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.submitBtn,
            currentWord.length < 3 && styles.submitBtnDisabled,
          ]}
          onPress={submitWord}
          disabled={currentWord.length < 3}
        >
          <Text style={styles.submitText}>Submit ↗</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backspaceBtn}
          onPress={() => {
            if (selectedIndices.length > 0) {
              const n = selectedIndices.slice(0, -1);
              setSelectedIndices(n);
              setCurrentWord(n.map((i) => letters[i]).join(''));
            }
          }}
        >
          <Text style={styles.backspaceText}>⌫</Text>
        </TouchableOpacity>
      </View>

      {/* Guessed Words */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.guessedRow}
        contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: 8 }}
      >
        {guessedWords.map((w, i) => (
          <View key={i} style={styles.miniChip}>
            <Text style={styles.miniChipText}>{w}</Text>
          </View>
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
  headerCenter: { flex: 1, alignItems: 'center' },
  modeLabel: { fontSize: SIZES.md, fontWeight: '700', color: COLORS.text },
  attempts: { fontSize: SIZES.xs, marginTop: 2 },
  scoreBox: { alignItems: 'flex-end' },
  scoreValue: { fontSize: SIZES.xl, fontWeight: '900', color: COLORS.primary },
  scoreLabel: { fontSize: SIZES.xs, color: COLORS.textMuted },

  timerBox: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  timer: {
    fontSize: SIZES.xxl,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 6,
  },
  timerTrack: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  timerFill: { height: '100%', borderRadius: 3 },

  wordDisplay: {
    margin: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 90,
    justifyContent: 'center',
  },
  wordSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    minHeight: 40,
  },
  slot: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotText: { color: '#fff', fontWeight: '800', fontSize: SIZES.lg },
  placeholder: {
    color: COLORS.textMuted,
    fontSize: SIZES.sm,
    textAlign: 'center',
  },
  wordMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  metaText: { fontSize: SIZES.xs, color: COLORS.textMuted },

  toast: {
    position: 'absolute',
    top: 170,
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  toastText: { fontSize: SIZES.md, fontWeight: '700' },

  letterGrid: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  letterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  letterTile: {
    width: 62,
    height: 54,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  letterTileSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  letterText: {
    fontSize: SIZES.xl,
    fontWeight: '800',
    color: COLORS.text,
  },
  letterTextSelected: { color: '#fff' },

  actions: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  clearBtn: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  clearText: {
    color: COLORS.textSec,
    fontWeight: '700',
    fontSize: SIZES.sm,
  },
  submitBtn: {
    flex: 2.5,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: SPACING.md,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  submitBtnDisabled: {
    backgroundColor: COLORS.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitText: { color: '#fff', fontWeight: '800', fontSize: SIZES.md },
  backspaceBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backspaceText: { fontSize: 20 },

  guessedRow: { marginTop: SPACING.md, maxHeight: 50 },
  miniChip: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  miniChipText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: SIZES.xs,
  },

  // Game Over
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.bg,
  },
  gameOverEmoji: { fontSize: 64, marginBottom: SPACING.md },
  gameOverTitle: {
    fontSize: SIZES.xxxl,
    fontWeight: '900',
    color: COLORS.text,
  },
  gameOverScore: {
    fontSize: SIZES.huge,
    fontWeight: '900',
    color: COLORS.primary,
    marginTop: 8,
  },
  gameOverWords: {
    fontSize: SIZES.lg,
    color: COLORS.textSec,
    marginTop: 4,
    marginBottom: SPACING.lg,
  },
  wordsList: {
    width: '100%',
    maxHeight: 200,
    marginBottom: SPACING.lg,
  },
  wordChip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  wordChipText: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: SIZES.md,
  },
  wordChipScore: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: SIZES.sm,
  },
  homeBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    width: '100%',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  homeBtnText: { color: '#fff', fontSize: SIZES.lg, fontWeight: '800' },
  leaderBtn: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    width: '100%',
    alignItems: 'center',
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  leaderBtnText: {
    color: COLORS.primary,
    fontSize: SIZES.lg,
    fontWeight: '800',
  },
});