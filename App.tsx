import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import ThemeGameScreen from './src/screens/ThemeGameScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import WordJourneyScreen from './src/screens/WordJourneyScreen';
import GuessedWordsScreen from './src/screens/GuessedWordsScreen';
import AuthScreen from './src/screens/AuthScreen';

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  Game: { mode: 'daily' | 'practice'; theme?: string };
  ThemeGame: undefined;
  Leaderboard: undefined;
  WordJourney: undefined;
  GuessedWords: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="Auth"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
          <Stack.Screen name="ThemeGame" component={ThemeGameScreen} />
          <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
          <Stack.Screen name="WordJourney" component={WordJourneyScreen} />
          <Stack.Screen name="GuessedWords" component={GuessedWordsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
