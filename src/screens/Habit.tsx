import { View, ScrollView, Text } from 'react-native';
import { useRoute } from '@react-navigation/native'
import { BackButton } from './../components/BackButton';
import dayjs from 'dayjs';
import { ProgressBar } from '../components/ProgressBar';
import { CheckBox } from '../components/CheckBox';
interface Params {
  date: string
}

interface Props {
  progress?: number
}
export function Habit({ progress = 67 }: Props) {
  const route = useRoute()
  const { date } = route.params as Params

  const parsedDate = dayjs(date)
  const dayOfWeek = parsedDate.format('dddd')
  const dayAndMonth = parsedDate.format('DD/MM')

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
        <ProgressBar progress={progress} />
        <View className='mt-6'>
          <CheckBox
            title='Beber 2 litros de água'
            checked={false}
          />
          <CheckBox
            title='Beber 3 litros de água'
            checked={true}
          />
          <CheckBox
            title='Beber 4 litros de água'
            checked={true}
          />
          <CheckBox
            title='Beber 5 litros de água'
            checked={false}
          />
        </View>
      </ScrollView>
    </View>
  )
}