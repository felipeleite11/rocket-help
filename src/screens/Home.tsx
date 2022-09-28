import { useState, useEffect } from 'react'
import { Alert } from 'react-native'
import { VStack, useTheme, HStack, IconButton, Text, Heading, FlatList, Center } from 'native-base'
import { ChatTeardropText, SignOut } from 'phosphor-react-native'
import { useNavigation } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

import Logo from '../assets/logo_secondary.svg'

import { Filter, StateProps } from '../components/Filter'
import { Order, OrderProps } from '../components/Order'
import { Button } from '../components/Button'
import { dateFormat } from '../utils/date-format'
import { Loader } from '../components/Loader'

export function Home() {
	const { colors } = useTheme()

	const navigation = useNavigation()

	const [isLoading, setIsLoading] = useState(true)
	const [selectedStatus, setSelectedStatus] = useState<StateProps>('open')
	const [orders, setOrders] = useState<OrderProps[]>([])

	function handleNewOrder() {
		navigation.navigate('register')
	}

	function handleOpenDetails(orderId: string) {
		navigation.navigate('details', { orderId })
	}

	function handleLogout() {
		auth().signOut()
			.catch(error => {
				return Alert.alert('Sair', 'Não foi possível sair.')
			})
	}

	useEffect(() => {
		setIsLoading(true)
	
		const subscriber = firestore()
			.collection('orders')
			.where('status', '==', selectedStatus)
			.onSnapshot(snapshop => {
				const data = snapshop.docs.map(doc => {
					const { patrimony, description, status, created_at } = doc.data()

					return {
						id: doc.id,
						patrimony,
						status,
						when: dateFormat(created_at)
					}
				})

				setOrders(data)

				setIsLoading(false)
			})

		return subscriber
	}, [selectedStatus])

	return (
		<VStack flex={1} pb={6} bg="gray.700">
			<HStack 
				w="full"
				justifyContent="space-between"
				alignItems="center"
				bg="gray.600"
				pt={12}
				pb={2}
				px={6}
			>
				<Logo />

				<IconButton 
					icon={<SignOut size={26} color={colors.gray[300]} />}
					onPress={handleLogout}
				/>
			</HStack>

			<VStack flex={1} px={6}>
				<HStack 
					w="full" 
					mt={8} 
					mb={4} 
					justifyContent="space-between" 
					alignItems="center"
				>
					<Heading color="gray.100">
						Meus chamados
					</Heading>

					<Text color="gray.200">
						{orders.length > 0 && orders.length}
					</Text>
				</HStack>

				<HStack 
					space={3}
					mb={8}
				>
					<Filter
						type="open"
						title="Em andamento"
						onPress={() => setSelectedStatus('open')}
						isActive={selectedStatus === 'open'}
					/>

					<Filter
						type="closed"
						title="Fechados"
						onPress={() => setSelectedStatus('closed')}
						isActive={selectedStatus === 'closed'}
					/>
				</HStack>

				{isLoading ? (
					<Loader />
				) : (
					<FlatList 
						data={orders}
						keyExtractor={item => item.id}
						renderItem={({ item }) => 
							<Order data={item} onPress={() => { handleOpenDetails(item.id) }} />
						}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{ paddingBottom: 100 }}
						ListEmptyComponent={() => (
							<Center>
								<ChatTeardropText color={colors.gray[300]} size={40} />

								<Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
									Você ainda não possui{'\n'} solicitações {selectedStatus === 'open' ? 'em aberto' : 'fechadas'}
								</Text>
							</Center>
						)}
					/>
				)}

				<Button title="Nova solicitação" onPress={handleNewOrder} />
			</VStack>
		</VStack>
	)
}