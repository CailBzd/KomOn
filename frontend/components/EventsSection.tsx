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
    title: 'Tournoi de Football Amateur',
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
    title: 'Course à Pied - 10km',
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
    title: 'Match de Tennis en Double',
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
    title: 'Séance de Yoga en Plein Air',
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
              bg="pastel.green"
              color="accent.success"
              px="4"
              py="2"
              borderRadius="full"
              fontSize="sm"
              fontWeight="semibold"
            >
              🏃‍♂️ Événements à venir
            </Box>

            <Heading
              as="h2"
              size="2xl"
              fontWeight="bold"
              color="gray.800"
            >
              Découvrez les{' '}
              <Text
                as="span"
                bgGradient="linear(to-r, accent.primary, accent.secondary)"
                bgClip="text"
              >
                événements populaires
              </Text>
            </Heading>

            <Text
              fontSize="xl"
              color="gray.600"
              lineHeight="1.6"
            >
              Rejoignez des événements sportifs passionnants dans votre région. 
              Des activités pour tous les niveaux et tous les goûts.
            </Text>
          </VStack>

          {/* Events Grid */}
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 4 }}
            spacing="8"
            w="full"
          >
            {events.map((event) => (
              <Box
                key={event.id}
                bg="white"
                borderRadius="2xl"
                overflow="hidden"
                boxShadow="lg"
                border="1px solid"
                borderColor="gray.100"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: 'xl',
                }}
                cursor="pointer"
              >
                {/* Event Image */}
                <Box
                  h="48"
                  bgGradient="linear(to-br, pastel.blue, pastel.teal)"
                  position="relative"
                  overflow="hidden"
                >
                  <Image
                    src={event.image}
                    alt={event.title}
                    w="full"
                    h="full"
                    objectFit="cover"
                    fallback={
                      <Box
                        w="full"
                        h="full"
                        bgGradient="linear(to-br, pastel.blue, pastel.teal)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text
                          fontSize="2xl"
                          fontWeight="bold"
                          color="white"
                          textAlign="center"
                        >
                          {event.sport}
                        </Text>
                      </Box>
                    }
                  />

                  {/* Status Badge */}
                  <Badge
                    position="absolute"
                    top="4"
                    right="4"
                    colorScheme={event.status === 'disponible' ? 'green' : 'red'}
                    borderRadius="full"
                    px="3"
                    py="1"
                    fontSize="sm"
                    fontWeight="semibold"
                  >
                    {event.status === 'disponible' ? 'Disponible' : 'Complet'}
                  </Badge>

                  {/* Sport Badge */}
                  <Badge
                    position="absolute"
                    top="4"
                    left="4"
                    bg="white"
                    color="accent.primary"
                    borderRadius="full"
                    px="3"
                    py="1"
                    fontSize="sm"
                    fontWeight="semibold"
                  >
                    {event.sport}
                  </Badge>
                </Box>

                {/* Event Details */}
                <VStack spacing="4" p="6" align="stretch">
                  <Heading
                    as="h3"
                    size="md"
                    fontWeight="semibold"
                    color="gray.800"
                    noOfLines={2}
                  >
                    {event.title}
                  </Heading>

                  <VStack spacing="3" align="stretch">
                    <HStack spacing="3" color="gray.600">
                      <Calendar size={16} />
                      <Text fontSize="sm">{event.date} à {event.time}</Text>
                    </HStack>

                    <HStack spacing="3" color="gray.600">
                      <MapPin size={16} />
                      <Text fontSize="sm">{event.location}</Text>
                    </HStack>

                    <HStack spacing="3" color="gray.600">
                      <Users size={16} />
                      <Text fontSize="sm">{event.participants} participants</Text>
                    </HStack>

                    <HStack spacing="3" color="gray.600">
                      <Clock size={16} />
                      <Text fontSize="sm">{event.price}</Text>
                    </HStack>
                  </VStack>

                  <Box
                    bg={event.status === 'disponible' ? 'accent.primary' : 'gray.400'}
                    color="white"
                    py="3"
                    px="4"
                    borderRadius="xl"
                    textAlign="center"
                    fontWeight="semibold"
                    cursor="pointer"
                    transition="all 0.3s"
                    _hover={{
                      bg: event.status === 'disponible' ? 'accent.secondary' : 'gray.500',
                      transform: 'scale(1.02)',
                    }}
                  >
                    {event.status === 'disponible' ? 'S\'inscrire' : 'Liste d\'attente'}
                  </Box>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>

          {/* View All Button */}
          <Box
            bg="accent.primary"
            color="white"
            px="8"
            py="4"
            borderRadius="xl"
            fontWeight="semibold"
            cursor="pointer"
            transition="all 0.3s"
            _hover={{
              bg: 'accent.secondary',
              transform: 'scale(1.05)',
            }}
          >
            Voir tous les événements
          </Box>
        </VStack>
      </Container>
    </Box>
  )
} 