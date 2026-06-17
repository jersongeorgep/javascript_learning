import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'

export interface NotificationData {
  type: 'match_start' | 'score_update' | 'match_end'
  matchId: string
  team1: string
  team2: string
  score1?: number
  score2?: number
  [key: string]: unknown
}

export async function registerForPushNotifications(): Promise<string | null> {
  if (Platform.OS === 'web') return null
  if (!Device.isDevice) return null

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    return null
  }

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync()
    return tokenData.data
  } catch {
    return null
  }
}

export async function setupNotificationChannel(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('match-events', {
      name: 'Match Events',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#16a34a',
    })
  }
}

export async function scheduleMatchReminder(
  matchId: string,
  team1: string,
  team2: string,
  dateStr: string,
  timeStr: string,
  minutesBefore: number = 15,
): Promise<string | null> {
  const matchTime = new Date(`${dateStr}T${timeStr || '20:00'}:00`)
  const reminderTime = new Date(matchTime.getTime() - minutesBefore * 60_000)

  if (reminderTime <= new Date()) return null

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Match Starting Soon',
      body: `${team1} vs ${team2} kicks off in ${minutesBefore} minutes!`,
      data: { type: 'match_start', matchId, team1, team2 } satisfies NotificationData,
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: reminderTime.getTime() },
  })
  return id
}

export async function cancelScheduledNotification(id: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(id)
}

export async function showLocalNotification(data: NotificationData): Promise<void> {
  let title: string
  let body: string

  switch (data.type) {
    case 'match_start':
      title = 'Match Live!'
      body = `${data.team1} vs ${data.team2} has started!`
      break
    case 'score_update':
      title = '⚽ Goal!'
      body = `${data.team1} ${data.score1 ?? 0} - ${data.score2 ?? 0} ${data.team2}`
      break
    case 'match_end':
      title = 'Full Time'
      body = `${data.team1} ${data.score1 ?? 0} - ${data.score2 ?? 0} ${data.team2}`
      break
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: null,
  })
}

export function setupForegroundHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  })
}
