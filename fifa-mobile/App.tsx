import React from 'react'
import { StatusBar, useColorScheme, type ColorSchemeName } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import HomeScreen from './src/screens/HomeScreen'
import MatchesScreen from './src/screens/MatchesScreen'
import MatchDetailScreen from './src/screens/MatchDetailScreen'
import StandingsScreen from './src/screens/StandingsScreen'
import TeamsScreen from './src/screens/TeamsScreen'
import TeamDetailScreen from './src/screens/TeamDetailScreen'
import BracketScreen from './src/screens/BracketScreen'
import { Ionicons } from '@expo/vector-icons'
import { colors } from './src/lib/theme'

export type RootStackParamList = {
  Home: undefined
  Matches: undefined
  MatchDetail: { id: string }
  Standings: undefined
  Teams: undefined
  TeamDetail: { id: string }
  Bracket: undefined
}

const HomeStack = createNativeStackNavigator()
const MatchesStack = createNativeStackNavigator()
const StandingsStack = createNativeStackNavigator()
const TeamsStack = createNativeStackNavigator()
const BracketStack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchInterval: 60_000,
    },
  },
})

function screenOptions(scheme: 'light' | 'dark') {
  const c = scheme === 'dark' ? colors.dark : colors.light
  return {
    headerStyle: { backgroundColor: c.card } as any,
    headerTintColor: c.foreground,
    headerTitleStyle: { fontWeight: '600' } as any,
    contentStyle: { backgroundColor: c.background } as any,
  }
}

function getScheme(s: ColorSchemeName): 'light' | 'dark' {
  return s === 'dark' ? 'dark' : 'light'
}

function HomeStackScreen({ navigation }: any) {
  const scheme = getScheme(useColorScheme())
  return (
    <HomeStack.Navigator screenOptions={screenOptions(scheme)}>
      <HomeStack.Screen name="HomePage" component={HomeScreen} options={{ title: 'World Cup 2026' }} />
      <HomeStack.Screen name="MatchDetail" component={MatchDetailScreen} options={{ title: 'Match' }} />
    </HomeStack.Navigator>
  )
}

function MatchesStackScreen({ navigation }: any) {
  const scheme = getScheme(useColorScheme())
  return (
    <MatchesStack.Navigator screenOptions={screenOptions(scheme)}>
      <MatchesStack.Screen name="MatchesPage" component={MatchesScreen} options={{ title: 'Matches' }} />
      <MatchesStack.Screen name="MatchDetail" component={MatchDetailScreen} options={{ title: 'Match' }} />
    </MatchesStack.Navigator>
  )
}

function StandingsStackScreen() {
  const scheme = getScheme(useColorScheme())
  return (
    <StandingsStack.Navigator screenOptions={screenOptions(scheme)}>
      <StandingsStack.Screen name="StandingsPage" component={StandingsScreen} options={{ title: 'Standings' }} />
    </StandingsStack.Navigator>
  )
}

function TeamsStackScreen({ navigation }: any) {
  const scheme = getScheme(useColorScheme())
  return (
    <TeamsStack.Navigator screenOptions={screenOptions(scheme)}>
      <TeamsStack.Screen name="TeamsPage" component={TeamsScreen} options={{ title: 'Teams' }} />
      <TeamsStack.Screen name="TeamDetail" component={TeamDetailScreen} options={{ title: 'Team' }} />
    </TeamsStack.Navigator>
  )
}

function BracketStackScreen() {
  const scheme = getScheme(useColorScheme())
  return (
    <BracketStack.Navigator screenOptions={screenOptions(scheme)}>
      <BracketStack.Screen name="BracketPage" component={BracketScreen} options={{ title: 'Bracket' }} />
    </BracketStack.Navigator>
  )
}

export default function App() {
  const scheme = getScheme(useColorScheme())
  const c = scheme === 'dark' ? colors.dark : colors.light

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: c.card, borderTopColor: c.border },
            tabBarActiveTintColor: c.primary,
            tabBarInactiveTintColor: c.mutedForeground,
            tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
          }}
        >
          <Tab.Screen
            name="HomeTab"
            component={HomeStackScreen}
            options={{ tabBarLabel: 'Home', tabBarIcon: ({ color, size }) => <Ionicons name="football" size={size} color={color} /> }}
          />
          <Tab.Screen
            name="MatchesTab"
            component={MatchesStackScreen}
            options={{ tabBarLabel: 'Matches', tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} /> }}
          />
          <Tab.Screen
            name="StandingsTab"
            component={StandingsStackScreen}
            options={{ tabBarLabel: 'Standings', tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} /> }}
          />
          <Tab.Screen
            name="TeamsTab"
            component={TeamsStackScreen}
            options={{ tabBarLabel: 'Teams', tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} /> }}
          />
          <Tab.Screen
            name="BracketTab"
            component={BracketStackScreen}
            options={{ tabBarLabel: 'Bracket', tabBarIcon: ({ color, size }) => <Ionicons name="trophy" size={size} color={color} /> }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  )
}
