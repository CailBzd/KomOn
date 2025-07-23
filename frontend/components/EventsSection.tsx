'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
  Image,
  useColorModeValue,
} from '@chakra-ui/react'
import { Calendar, MapPin, Users, Clock } from 'lucide-react'

const events = [
  {
    id: 1,
    title: 'Tournoi de Football Amateur!',
    sport: 'Football',
    date: '15 Déc 2024',
    time: '14:00',
    location: 'Stade Municipal',
    participants: '24/32',
    price: 'Gratuit',
    image: '/football-event.jpg',
    status: 'disponible',
  },
  {
    id: 2,
    title: 'Course à Pied - 10km!',
    sport: 'Running',
    date: '22 Déc 2024',
    time: '09:00',
    location: 'Parc Central',
    participants: '156/200',
    price: '15€',
    image: '/running-event.jpg',
    status: 'disponible',
  },
  {
    id: 3,
    title: 'Match de Tennis en Double!',
    sport: 'Tennis',
    date: '18 Déc 2024',
    time: '16:00',
    location: 'Tennis Club',
    participants: '8/8',
    price: '10€',
    image: '/tennis-event.jpg',
    status: 'complet',
  },
  {
    id: 4,
    title: 'Séance de Yoga en Plein Air!',
    sport: 'Yoga',
    date: '20 Déc 2024',
    time: '07:00',
    location: 'Jardin Public',
    participants: '18/25',
    price: 'Gratuit',
    image: '/yoga-event.jpg',
    status: 'disponible',
  },
]

export function EventsSection() {
  const bgColor = useColorModeValue('white', 'gray.800')

  return (
    <Box bg={bgColor} py="20">
      <Container maxW="container.xl">
        <VStack spacing="16">
          {/* Header */}
          <VStack spacing="6" textAlign="center" maxW="3xl">
            <Box
              bg="orange.500"
              color="white"
              px="4"
              py="2"
              borderRadius="full"
              fontSize="sm"
              fontWeight="bold"
              boxShadow="lg"
              border="2px solid"
              borderColor="orange.300"
            >
              🏃‍♂️ Événements à venir!
            </Box>

            <Heading
              as="h2"
              size="2xl"
              fontWeight="bold"
              color="gray.800"
            >
              Découvre les{' '}
              <Text
                as="span"
                bgGradient="linear(to-r, orange.500, blue.600)"
                bgClip="text"
              >
                événements sportifs
              </Text>{' '}
              de ta région!
            </Heading>

            <Text
              fontSize="xl"
              color="gray.600"
              maxW="2xl"
              lineHeight="1.6"
            >
              Rejoins des événements incroyables et rencontre des sportifs motivés 
              qui partagent ta passion! KomOn!
            </Text>
          </VStack>

          {/* Events Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing="8" w="full">
            {events.map((event) => (
              <Box
                key={event.id}
                bg="white"
                borderRadius="2xl"
                overflow="hidden"
                boxShadow="lg"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-8px)',
                  boxShadow: 'xl',
                }}
                border="1px solid"
                borderColor="gray.100"
              >
                {/* Event Image */}
                <Box
                  h="200px"
                  bgGradient="linear(to-br, orange.400, blue.600)"
                  position="relative"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text color="white" fontSize="4xl" fontWeight="bold">
                    {event.sport.charAt(0)}
                  </Text>
                  <Badge
                    position="absolute"
                    top="3"
                    right="3"
                    colorScheme={event.status === 'disponible' ? 'green' : 'red'}
                    borderRadius="full"
                    px="3"
                    py="1"
                    fontSize="xs"
                    fontWeight="bold"
                  >
                    {event.status === 'disponible' ? 'Disponible!' : 'Complet!'}
                  </Badge>
                </Box>

                {/* Event Content */}
                <VStack spacing="4" p="6" align="stretch">
                  <VStack spacing="2" align="stretch">
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      color="gray.800"
                      lineHeight="1.4"
                    >
                      {event.title}
                    </Text>
                    <Text
                      fontSize="sm"
                      color="gray.600"
                      fontWeight="medium"
                    >
                      {event.sport}
                    </Text>
                  </VStack>

                  <VStack spacing="3" align="stretch">
                    <HStack spacing="3">
                      <Calendar size={16} color="#FF6B35" />
                      <Text fontSize="sm" color="gray.600">
                        {event.date} à {event.time}
                      </Text>
                    </HStack>

                    <HStack spacing="3">
                      <MapPin size={16} color="#1E3A8A" />
                      <Text fontSize="sm" color="gray.600">
                        {event.location}
                      </Text>
                    </HStack>

                    <HStack spacing="3">
                      <Users size={16} color="#10B981" />
                      <Text fontSize="sm" color="gray.600">
                        {event.participants} participants
                      </Text>
                    </HStack>

                    <HStack spacing="3">
                      <Clock size={16} color="#F59E0B" />
                      <Text fontSize="sm" color="gray.600">
                        {event.price}
                      </Text>
                    </HStack>
                  </VStack>

                  <Box
                    bgGradient="linear(to-r, orange.500, orange.400)"
                    color="white"
                    py="3"
                    px="4"
                    borderRadius="xl"
                    textAlign="center"
                    fontWeight="bold"
                    cursor="pointer"
                    transition="all 0.3s"
                    _hover={{
                      bgGradient: 'linear(to-r, orange.600, orange.500)',
                      transform: 'scale(1.02)',
                      boxShadow: 'lg',
                    }}
                  >
                    Rejoins l'événement!
                  </Box>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>

          {/* Call to Action */}
          <VStack spacing="6" pt="8">
            <Text
              fontSize="xl"
              color="gray.700"
              fontWeight="semibold"
            >
              Tu ne trouves pas ton événement? KomOn!
            </Text>
            
            <Box
              bgGradient="linear(to-r, orange.500, blue.600)"
              p="8"
              borderRadius="2xl"
              boxShadow="xl"
              textAlign="center"
              maxW="2xl"
              w="full"
            >
              <VStack spacing="4">
                <Text
                  fontSize="2xl"
                  color="white"
                  fontWeight="bold"
                >
                  Crée ton propre événement!
                </Text>
                <Text
                  color="orange.100"
                  fontSize="lg"
                  lineHeight="1.6"
                >
                  Organise des événements sportifs et rejoins la communauté KomOn!
                </Text>
                <Box
                  bg="white"
                  color="orange.500"
                  py="3"
                  px="6"
                  borderRadius="xl"
                  fontWeight="bold"
                  cursor="pointer"
                  transition="all 0.3s"
                  _hover={{
                    bg: 'orange.50',
                    transform: 'scale(1.02)',
                    boxShadow: 'lg',
                  }}
                >
                  Créer un événement!
                </Box>
              </VStack>
            </Box>
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
} 