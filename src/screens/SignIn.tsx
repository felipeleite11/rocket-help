import { Alert } from 'react-native'
import { VStack, Heading, Icon, useTheme } from 'native-base'
import { Envelope, Key } from 'phosphor-react-native'
import auth from '@react-native-firebase/auth'

import Logo from '../assets/logo_primary.svg'

import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { useState } from 'react'

export function SignIn() {
	const { colors } = useTheme()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	function handleSubmit() {
		if(!email || !password) {
			return Alert.alert('Login', 'Preencha o e-mail e a senha para entrar.')
		}

		setIsLoading(true)

		auth()
			.signInWithEmailAndPassword(email, password)
			.catch(error => {
				setIsLoading(false)

				if(error.code === 'auth/invalid-email') {
					return Alert.alert('Login', 'E-mail inválido.')
				}

				if(error.code === 'auth/user-not-found') {
					return Alert.alert('Login', 'Usuário não encontrado.')
				}

				if(error.code === 'auth/wrong-password') {
					return Alert.alert('Login', 'Senha incorreta.')
				}

				return Alert.alert('Login', 'Ocorreu um erro na autenticação.')
			})
	}

	return (
		<VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
			<Logo />

			<Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
				Acesse sua conta
			</Heading>

			<Input 
				placeholder="E-mail" 
				mb={4}
				InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
				onChangeText={setEmail}
				autoCapitalize="none"
			/>

			<Input 
				placeholder="Senha" 
				InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
				secureTextEntry
				mb={8}
				onChangeText={setPassword}
			/>

			<Button 
				title="Entrar"
				w="full"
				onPress={handleSubmit}
				isLoading={isLoading}
			/>
		</VStack>
	)
}