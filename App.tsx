import { NativeBaseProvider, StatusBar } from 'native-base'
import { Roboto_400Regular, Roboto_700Bold, useFonts } from '@expo-google-fonts/roboto'

import { THEME } from './src/styles/theme'

import { Loader } from './src/components/Loader'

import { Routes } from './src/routes'

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {fontsLoaded ? (
        <Routes />
      ) : <Loader />}

    </NativeBaseProvider>
  )
}
