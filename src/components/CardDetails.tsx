import { ReactNode } from 'react'
import { HStack, VStack, Text, Box, useTheme } from 'native-base'
import { IconProps } from 'phosphor-react-native'

type Props = {
	title: string
	description?: string
	footer?: string
	icon: React.ElementType<IconProps>
	children?: ReactNode
}

export function CardDetails({ 
	title, 
	description, 
	footer = null, 
	icon: Icon, 
	children 
}: Props) {
	const { colors } = useTheme()

	return (
		<VStack bg="gray.500" p={5} mt={5} rounded="sm">
			<HStack mb={4} alignItems="center">
				<Icon color={colors.primary[700]} />

				<Text ml={2} fontSize="sm" textTransform="uppercase" color="gray.300">
					{title}
				</Text>
			</HStack>

			{!!description && (
				<Text color="gray.100" fontSize="md">
					{description}
				</Text>
			)}

			{children}

			{!!footer && (
				<Box borderTopWidth={1} borderTopColor="gray.400" mt={3}>
					<Text mt={3} color="gray.300" fontSize="sm">
						{footer}
					</Text>
				</Box>
			)}
		</VStack>
	)
}