'use client'

import {
  Box,
  Container,
  SimpleGrid,
  VStack,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { Users, Calendar, MapPin, Trophy } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: '10,000+',
    label: 'Sportifs actifs',
    color: 'accent.success',
    bgColor: 'pastel.green',
  },
  {
    icon: Calendar,
    value: '500+',
    label: 'Événements organisés',
    color: 'accent.warning',
    bgColor: 'pastel.orange',
  },
  {
    icon: MapPin,
    value: '50+',
    label: 'Villes couvertes',
    color: 'accent.error',
    bgColor: 'pastel.pink',
  },
  {
    icon: Trophy,
    value: '95%',
    label: 'Satisfaction',
    color: 'accent.primary',
    bgColor: 'pastel.blue',
  },
]

export function Stats() {
  const bgGradient = useColorModeValue(
    'linear(to-r, pastel.indigo, pastel.purple)',
    'linear(to-r, gray.800, gray.900)'
  )

  return (
    <Box
      bgGradient={bgGradient}
      py="20"
      position="relative"
      overflow="hidden"
    >
      {/* Background Pattern */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity="0.1"
        backgroundImage="url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
      />

      <Container maxW="container.xl" position="relative" zIndex="1">
        <SimpleGrid
          columns={{ base: 2, md: 4 }}
          spacing="8"
          textAlign="center"
        >
          {stats.map((stat, index) => (
            <VStack
              key={index}
              spacing="4"
              p="6"
              bg="white"
              borderRadius="2xl"
              boxShadow="lg"
              transition="all 0.3s"
              _hover={{
                transform: 'translateY(-4px)',
                boxShadow: 'xl',
              }}
            >
              <Box
                w="16"
                h="16"
                bg={stat.bgColor}
                borderRadius="2xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="md"
              >
                <stat.icon color={stat.color} size={32} />
              </Box>

              <VStack spacing="2">
                <Text
                  fontSize="3xl"
                  fontWeight="bold"
                  color="gray.800"
                >
                  {stat.value}
                </Text>
                <Text
                  fontSize="md"
                  color="gray.600"
                  fontWeight="medium"
                >
                  {stat.label}
                </Text>
              </VStack>
            </VStack>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
} 