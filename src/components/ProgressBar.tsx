import { useEffect } from "react"
import { View } from "react-native"
import Animetad, { useAnimatedStyle, useSharedValue, withTiming, withDelay } from 'react-native-reanimated'
interface Props {
  progress?: number
}

export function ProgressBar({ progress = 0 }: Props) {

  const sharedProgress = useSharedValue(progress)

  const style = useAnimatedStyle(() => {
    return {
      width: `${sharedProgress.value}%`
    }
  })

  useEffect(() => {
    sharedProgress.value = withDelay(100, withTiming(progress))
  }, [progress])

  return (
    <View className="w-full h-3 rounded-lg bg-zinc-700 mt-4">
      <Animetad.View
        className="h-3 rounded-lg bg-violet-600"
        style={style} />
    </View>
  )
}