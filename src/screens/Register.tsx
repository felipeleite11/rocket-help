import { Alert } from 'react-native'
import { Box, VStack } from 'native-base'
import { useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native'

import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { Input } from '../components/Input'

export function Register() {
	const [isLoading, setIsLoading] = useState(false)
	const [patrimony, setPatrimony] = useState('')
	const [description, setDescription] = useState('')

	const navigation = useNavigation()

	function handleOrderRegister() {
		if(!patrimony || !description) {
			return Alert.alert('Registrar', 'Preencha todos os campos.')
		}

		setIsLoading(true)

		firestore().collection('orders')
			.add({
				patrimony,
				description,
				status: 'open',
				created_at: firestore.FieldValue.serverTimestamp()
			})
			.then(() => {
				Alert.alert('Registrar', 'Solicitação registrada!')

				navigation.goBack()
			})
			.catch(error => {
				console.log(error)

				setIsLoading(false)

				return Alert.alert('Registrar', 'Não foi possível registrar sua solicitação.')
			})
	}

	return (
		<Box flex={1} pt={6} bg="gray.600">
			<Header title="Nova solicitação" />

			<VStack flex={1} px={6} pb={6}>
				<Input
					placeholder="Número do patrimônio"
					mt={4}
					onChangeText={setPatrimony}
				/>

				<Input
					placeholder="Descrição do problema"
					mt={5}
					flex={1}
					textAlignVertical="top"
					onChangeText={setDescription}
				/>

				<Button 
					title="Cadastrar" 
					mt={5} 
					isLoading={isLoading}
					onPress={handleOrderRegister}
				/>
			</VStack>
		</Box>
	)
}