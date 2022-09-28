import { Heading, HStack, IconButton, StyledProps, useTheme } from 'native-base'
import { CaretLeft } from 'phosphor-react-native'
import { useNavigation } from '@react-navigation/native'

type Props = StyledProps & {
	title: string
}

export function Header({ title, ...rest }: Props) {
	const { colors } = useTheme()

	const navigation = useNavigation()

	function handleBack() {
		navigation.goBack()
	}

	return (
		<HStack 
			w="full" 
			justifyContent="space-between"  
			alignItems="center" 
			bg="gray.600" 
			pb={4} 
			pt={12}
			px={2}
			{...rest}
		>
			<IconButton 
				icon={<CaretLeft color={colors.gray[200]} size={24} />}
				onPress={handleBack}
			/>

			<Heading color="gray.100" textAlign="center" fontSize="lg" flex={1} ml={-6}>
				{title}
			</Heading>
		</HStack>
	)
}