import { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native'
import { View, ScrollView, Text, Alert } from 'react-native';
import { BackButton } from './../components/BackButton';
import { ProgressBar } from '../components/ProgressBar';
import { Loading } from './../components/Loading';
import { HabitsEmpty } from './../components/HabitsEmpty';
import { CheckBox } from '../components/CheckBox';
import { generateProgressPercentage } from '../utils/generate-progress-percentage'

import { api } from '../lib/axios'

import dayjs from 'dayjs';
import clsx from 'clsx';

interface Params {
  date: string
}

interface Props {
  progress?: number
}

interface HabitsInfo {
  possibleHabits: {
    id: string
    title: string,
    createdAt: string
  }[],
  completedHabits: string[]
}[]

export function Habit({ progress = 67 }: Props) {


  const [loading, setLoading] = useState(true)
  const [dayInfo, setDayInfo] = useState<HabitsInfo>()
  const [completedHabits, setCompletedHabits] = useState<string[]>([])

  const route = useRoute()
  const { date } = route.params as Params

  const parsedDate = dayjs(date)
  const isDateInPast = dayjs(date).endOf('day').isBefore(new Date())
  const dayOfWeek = parsedDate.format('dddd')
  const dayAndMonth = parsedDate.format('DD/MM')

  const habitsProgress = dayInfo?.possibleHabits.length
    ? generateProgressPercentage(dayInfo.possibleHabits.length, completedHabits.length)
    : 0

  async function fetchHabits() {
    try {
      setLoading(true)
      const response = await api.get('day', { params: { date } })
      setDayInfo(response.data)
      setCompletedHabits(response.data.completedHabits)
    } catch (error) {
      console.log(error)
      Alert.alert('Ops', 'Não foi possível atualizar carregar as informações de hábitos do dia')
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleHabit(habitId: string) {
    try {
      await api.patch(`/habits/${habitId}/toggle`)
      if (completedHabits.includes(habitId)) {
        setCompletedHabits(prevState => prevState.filter(habit => habit !== habitId))
      } else {
        setCompletedHabits(prevState => [...prevState, habitId])
      }

    } catch (error) {
      console.log(error)
      Alert.alert('Ops', 'Não foi possível atualizar o estado do hábito!')
    }
  }

  useEffect(() => {
    fetchHabits()
  }, [])

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <View className='flex-1 bg-background px-8 pt-16'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />
        <Text className='mt-6 text-zinc-400 font-bold text-base lowercase'>
          {dayOfWeek}
        </Text>
        <Text className='text-white font-extrabold text-3xl lowercase'>
          {dayAndMonth}
        </Text>
        <ProgressBar progress={habitsProgress} />

        <View className={clsx('mt-6', {
          ['opacity-50']: isDateInPast
        })}>
          {dayInfo?.possibleHabits ? dayInfo?.possibleHabits.map(habit => (
            <CheckBox
              key={habit.id}
              title={habit.title}
              checked={completedHabits.includes(habit.id)}
              disabled={isDateInPast}
              onPress={() => handleToggleHabit(habit.id)}
            />
          ))
            : <HabitsEmpty />
          }

          {
            isDateInPast && <Text className='text-white mt-10 text-center'>
              Você não pode editar hábitos de uma passada.
            </Text>
          }

        </View>
      </ScrollView>
    </View>
  )
}