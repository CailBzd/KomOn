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
    value: '1,000+',
    label: 'Sportifs actifs!',
    color: 'orange.500',
    bgColor: 'orange.100',
  },
  {
    icon: Calendar,
    value: '500+',
    label: 'Événements créés!',
    color: 'blue.500',
    bgColor: 'blue.100',
  },
  {
    icon: MapPin,
    value: '50+',
    label: 'Villes couvertes!',
    color: 'green.500',
    bgColor: 'green.100',
  },
  {
    icon: Trophy,
    value: '95%',
    label: 'Satisfaction!',
    color: 'purple.500',
    bgColor: 'purple.100',
  },
]

export function Stats() {
  const bgGradient = useColorModeValue(
    'linear(to-r, orange.400, blue.600)',
    'linear(to-r, orange.500, blue.700)'
  )

  return (
    <Box
      bgGradient={bgGradient}
      py="20"
      position="relative"
      overflow="hidden"
    >
      {/* Background Pattern - Triangles dynamiques */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity="0.1"
        backgroundImage="url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpolygon points='30,5 55,45 5,45'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
      />

      <Container maxW="container.xl" position="relative" zIndex="1">
        <VStack spacing="12" textAlign="center">
          {/* Header */}
          <VStack spacing="4">
            <Text
              fontSize="2xl"
              color="white"
              fontWeight="bold"
            >
              La communauté KomOn! en chiffres
            </Text>
            <Text
              fontSize="lg"
              color="orange.100"
              fontWeight="medium"
            >
              Rejoins des milliers de sportifs motivés!
            </Text>
          </VStack>

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
                boxShadow="xl"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-8px)',
                  boxShadow: '2xl',
                }}
                border="1px solid"
                borderColor="gray.100"
              >
                <Box
                  w="16"
                  h="16"
                  bg={stat.bgColor}
                  borderRadius="2xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="lg"
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
                    fontSize="sm"
                    color="gray.600"
                    fontWeight="semibold"
                  >
                    {stat.label}
                  </Text>
                </VStack>
              </VStack>
            ))}
          </SimpleGrid>

          {/* Call to Action */}
          <VStack spacing="4" pt="8">
            <Text
              fontSize="xl"
              color="white"
              fontWeight="bold"
            >
              Prêt à rejoindre ces statistiques? KomOn!
            </Text>
            <Text
              color="orange.100"
              fontSize="lg"
              fontWeight="medium"
            >
              Télécharge l'application et commence à bouger avec nous!
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
} 