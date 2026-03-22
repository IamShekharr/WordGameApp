import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// ─── AUTH ────────────────────────────────────────────

export const registerUser = async (
  email: string,
  password: string,
  username: string
) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: username });
  await setDoc(doc(db, 'users', cred.user.uid), {
    username,
    email,
    totalScore: 0,
    wordsFound: 0,
    gamesPlayed: 0,
    longestWord: '',
    createdAt: serverTimestamp(),
    location: 'India',
  });
  return cred.user;
};

export const loginUser = async (email: string, password: string) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
};

export const logoutUser = () => signOut(auth);

export const getCurrentUser = (): User | null => auth.currentUser;

export const onAuthChange = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback);

// ─── USER DATA ───────────────────────────────────────

export const getUserData = async (uid: string) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
};

export const updateUserStats = async (
  uid: string,
  word: string,
  score: number
) => {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  const current = snap.data();
  await updateDoc(userRef, {
    totalScore: increment(score),
    wordsFound: increment(1),
    longestWord:
      (current?.longestWord?.length ?? 0) >= word.length
        ? current?.longestWord
        : word,
  });
};

export const incrementGamesPlayed = async (uid: string) => {
  await updateDoc(doc(db, 'users', uid), {
    gamesPlayed: increment(1),
  });
};

// ─── GUESSED WORDS ───────────────────────────────────

export const saveGuessedWord = async (
  uid: string,
  word: string,
  mode: string,
  score: number
) => {
  await addDoc(collection(db, 'users', uid, 'guessedWords'), {
    word,
    mode,
    score,
    foundAt: serverTimestamp(),
  });
  await updateUserStats(uid, word, score);
};

export const getGuessedWords = async (uid: string) => {
  const q = query(
    collection(db, 'users', uid, 'guessedWords'),
    orderBy('foundAt', 'desc'),
    limit(100)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ─── LEADERBOARD ─────────────────────────────────────

export const getGlobalLeaderboard = async (limitCount: number = 20) => {
  const q = query(
    collection(db, 'users'),
    orderBy('totalScore', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d, i) => ({
    rank: i + 1,
    uid: d.id,
    ...d.data(),
  }));
};

export const getWeeklyLeaderboard = async (limitCount: number = 20) => {
  const q = query(
    collection(db, 'users'),
    orderBy('wordsFound', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d, i) => ({
    rank: i + 1,
    uid: d.id,
    ...d.data(),
  }));
};

// ─── DAILY CHALLENGE ─────────────────────────────────

export const saveDailyChallengeScore = async (
  uid: string,
  username: string,
  score: number,
  wordsCount: number
) => {
  const today = new Date().toISOString().split('T')[0];
  await setDoc(
    doc(db, 'dailyChallenge', today, 'scores', uid),
    {
      username,
      score,
      wordsCount,
      submittedAt: serverTimestamp(),
    }
  );
};