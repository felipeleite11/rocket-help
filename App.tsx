import { NativeBaseProvider, StatusBar } from 'native-base'
import { Roboto_400Regular, Roboto_700Bold, useFonts } from '@expo-google-fonts/roboto'

import { SignIn } from './src/screens/SignIn'

import { THEME } from './src/styles/theme'
import { Loader } from './src/components/Loader'

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {fontsLoaded ? (
        <SignIn />
      ) : <Loader />}

    </NativeBaseProvider>
  )
}
