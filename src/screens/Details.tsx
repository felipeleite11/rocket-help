import { useState, useEffect } from 'react'
import { Alert } from 'react-native'
import { VStack, Text, HStack, useTheme, ScrollView } from 'native-base'
import { useNavigation, useRoute } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore'
import { CircleWavyCheck, Clipboard, DesktopTower, Hourglass } from 'phosphor-react-native'

import { Header } from '../components/Header'
import { OrderProps } from '../components/Order'
import { Loader } from '../components/Loader'
import { CardDetails } from '../components/CardDetails'
import { Input } from '../components/Input'
import { Button } from '../components/Button'

import { OrderDTO } from '../dto/OrderDTO'

import { dateFormat } from '../utils/date-format'

type RouteParams = {
	orderId: string
}

type OrderDetails = OrderProps & {
	description: string
	solution: string
	closed: string
}

export function Details() {
	const route = useRoute()

	const { colors } = useTheme()

	const navigation = useNavigation()

	const [isLoading, setIsLoading] = useState(true)
	const [solution, setSolution] = useState('')
	const [order, setOrder] = useState<OrderDetails>({} as OrderDetails)
	
	const { orderId } = route.params as RouteParams

	function handleCloseOrder() {
		if(!solution) {
			return Alert.alert('Encerramento', 'Preencha a solução do problema.')
		}

		firestore()
			.collection<OrderDTO>('orders')
			.doc(orderId)
			.update({
				status: 'closed',
				solution,
				closed_at: firestore.FieldValue.serverTimestamp()
			})
			.then(() => {
				Alert.alert('Encerramento', 'Solicitação encerrada!')

				navigation.goBack()
			})
			.catch(error => {
				console.log(error)

				return Alert.alert('Encerramento', 'Não foi possível encerrar a solicitação.')
			})
	}

	useEffect(() => {
		firestore()
			.collection<OrderDTO>('orders')
			.doc(orderId)
			.get()
			.then(doc => {
				const { patrimony, description, status, created_at, closed_at, solution } = doc.data()

				setOrder({
					id: doc.id,
					patrimony,
					description,
					status, 
					solution,
					when: dateFormat(created_at),
					closed: closed_at ? dateFormat(closed_at) : null
				})

				setIsLoading(false)
			})
	}, [])

	if(isLoading) {
		return <Loader />
	}

	return (
		<VStack flex={1} py={6} px={0} bg="gray.600">
			<Header title="Solicitação" />

			<HStack bg="gray.500" justifyContent="center" p={4}>
				{order.status === 'closed' ? (
					<CircleWavyCheck size={22} color={colors.green[300]} />
				) : (
					<Hourglass size={22} color={colors.secondary[700]} />
				)}

				<Text 
					fontSize="sm"
					color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
					ml={2}
					textTransform="uppercase"
				>
					{order.status === 'closed' ? 'Finalizado' : 'Em andamento'}
				</Text>
			</HStack>

			<ScrollView mx={5} showsVerticalScrollIndicator={false}>
				<CardDetails 
					title="equipamento"
					icon={DesktopTower}
					description={`Patrimônio ${order.patrimony}`}
					footer={order.when}
				/>

				<CardDetails 
					title="descrição do problema"
					icon={Clipboard}
					description={order.description}
				/>

				<CardDetails 
					title="solução"
					icon={CircleWavyCheck}
					footer={order.closed ? `Encerrado em ${order.closed}` : ''}
					description={order.status === 'closed' && order.solution}
				>
					{order.status === 'open' && (
						<Input 
							bg="gray.600"
							placeholder="Descrição da solução..."
							onChangeText={setSolution}
							textAlignVertical="top"
							multiline
							h={24}
						/>
					)}
				</CardDetails>
			</ScrollView>

			{order.status !== 'closed' && (
				<Button 
					mx={5}
					mt={5}
					title="Encerrar solicitação"
					onPress={handleCloseOrder}
				/>
			)}
		</VStack>
  	)
}

