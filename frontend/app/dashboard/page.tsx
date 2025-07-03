'use client'

import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Button,
  Input,
  Select,
  InputGroup,
  InputLeftElement,
  IconButton,
  useToast,
  Avatar,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Flex,
  Spacer,
  Divider,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react'
import { 
  SearchIcon, 
  CalendarIcon, 
  StarIcon
} from '@chakra-ui/icons'
import { 
  FaMapMarkerAlt, 
  FaTrophy, 
  FaUsers, 
  FaFilter, 
  FaTrendingUp, 
  FaCreditCard 
} from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/api/auth'
import { useRouter } from 'next/navigation'

interface Event {
  id: string
  title: string
  description: string
  location: string
  startDate: string
  endDate: string
  sport: string
  organizer: string
  maxParticipants: number
  currentParticipants: number
  price: number
  image?: string
  distance?: number
}

interface UserStats {
  credits: number
  eventsCreated: number
  eventsParticipated: number
  totalEvents: number
  averageRating: number
  badges: string[]
  level: string
  experience: number
}

const sports = [
  'Football', 'Basketball', 'Tennis', 'Running', 'Cycling', 'Swimming',
  'Volleyball', 'Badminton', 'Golf', 'Rugby', 'Handball', 'Athletics'
]

export default function DashboardPage() {
  const { user, isAuthenticated, loading, logout } = useAuth()
  const router = useRouter()
  const toast = useToast()
  
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSport, setSelectedSport] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [userStats, setUserStats] = useState<UserStats>({
    credits: 5,
    eventsCreated: 12,
    eventsParticipated: 28,
    totalEvents: 40,
    averageRating: 4.7,
    badges: ['Organisateur', 'Participant Actif', 'Top 10%'],
    level: 'Expert',
    experience: 85
  })

  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')

  // Redirection si non connecté
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Vérifier aussi le localStorage avant de rediriger
      const savedToken = localStorage.getItem('auth_token')
      const savedUser = localStorage.getItem('auth_user')
      
      if (!savedToken || !savedUser) {
        // Délai pour éviter les redirections intempestives
        const timer = setTimeout(() => {
          if (!isAuthenticated) {
            router.push('/login')
          }
        }, 500)
        
        return () => clearTimeout(timer)
      }
    }
  }, [isAuthenticated, loading, router])

  // Données d'exemple pour les événements
  useEffect(() => {
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Match de Football Amical',
        description: 'Match de football amical dans le parc municipal. Tous niveaux acceptés !',
        location: 'Parc Municipal, Lyon',
        startDate: '2024-01-15T14:00:00',
        endDate: '2024-01-15T16:00:00',
        sport: 'Football',
        organizer: 'Club Sportif Lyon',
        maxParticipants: 22,
        currentParticipants: 18,
        price: 0,
        distance: 1.2
      },
      {
        id: '2',
        title: 'Course à Pied - 10km',
        description: 'Course à pied de 10km dans les rues de Lyon. Parcours urbain.',
        location: 'Place Bellecour, Lyon',
        startDate: '2024-01-20T09:00:00',
        endDate: '2024-01-20T11:00:00',
        sport: 'Running',
        organizer: 'Lyon Running Club',
        maxParticipants: 100,
        currentParticipants: 67,
        price: 15,
        distance: 2.1
      },
      {
        id: '3',
        title: 'Tournoi de Tennis',
        description: 'Tournoi de tennis en simple et double. Niveau intermédiaire requis.',
        location: 'Tennis Club de Lyon',
        startDate: '2024-01-18T10:00:00',
        endDate: '2024-01-18T18:00:00',
        sport: 'Tennis',
        organizer: 'Tennis Club Lyon',
        maxParticipants: 32,
        currentParticipants: 24,
        price: 25,
        distance: 3.5
      }
    ]
    setEvents(mockEvents)
    setFilteredEvents(mockEvents)
  }, [])

  // Filtrage des événements
  useEffect(() => {
    let filtered = events

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedSport) {
      filtered = filtered.filter(event => event.sport === selectedSport)
    }

    if (selectedLocation) {
      filtered = filtered.filter(event => event.location.includes(selectedLocation))
    }

    setFilteredEvents(filtered)
  }, [events, searchTerm, selectedSport, selectedLocation])

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
      toast({
        title: 'Déconnexion réussie',
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: 'Erreur lors de la déconnexion',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <Box bg={bgColor} minH="100vh" py={20}>
        <Container maxW="container.xl">
          <Text>Chargement...</Text>
        </Container>
      </Box>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="container.xl">
        {/* Header avec informations utilisateur */}
        <Card mb={8} bg={cardBg}>
          <CardBody>
            <HStack justify="space-between" align="center">
              <HStack spacing={4}>
                <Avatar 
                  size="lg" 
                  name={`${user?.firstName} ${user?.lastName}`}
                  src={user?.profilePictureUrl}
                />
                <VStack align="start" spacing={1}>
                  <Heading size="md">
                    Bonjour, {user?.firstName} !
                  </Heading>
                  <Text color="gray.600">
                    Niveau {userStats.level} • {userStats.experience}% d'expérience
                  </Text>
                </VStack>
              </HStack>
              <HStack spacing={4}>
                <Badge colorScheme="teal" fontSize="md" px={3} py={1}>
                  {userStats.credits} crédits
                </Badge>
                <Button colorScheme="red" variant="outline" onClick={handleLogout}>
                  Déconnexion
                </Button>
              </HStack>
            </HStack>
          </CardBody>
        </Card>

        <Grid templateColumns={{ base: '1fr', lg: '300px 1fr' }} gap={8}>
          {/* Sidebar - Statistiques et badges */}
          <VStack spacing={6} align="stretch">
            {/* Statistiques utilisateur */}
            <Card bg={cardBg}>
              <CardHeader>
                <Heading size="sm">Mes Statistiques</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  <Stat>
                    <StatLabel>Événements créés</StatLabel>
                    <StatNumber>{userStats.eventsCreated}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      23.36%
                    </StatHelpText>
                  </Stat>
                  
                  <Divider />
                  
                  <Stat>
                    <StatLabel>Événements participés</StatLabel>
                    <StatNumber>{userStats.eventsParticipated}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      12.5%
                    </StatHelpText>
                  </Stat>
                  
                  <Divider />
                  
                  <Stat>
                    <StatLabel>Note moyenne</StatLabel>
                    <StatNumber>{userStats.averageRating}/5</StatNumber>
                    <StatHelpText>
                      <StarIcon color="yellow.400" />
                      {userStats.averageRating} étoiles
                    </StatHelpText>
                  </Stat>
                </VStack>
              </CardBody>
            </Card>

            {/* Badges */}
            <Card bg={cardBg}>
              <CardHeader>
                <Heading size="sm">Mes Badges</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={2}>
                  {userStats.badges.map((badge, index) => (
                    <Badge key={index} colorScheme="purple" variant="subtle" px={3} py={1}>
                      {badge}
                    </Badge>
                  ))}
                </VStack>
              </CardBody>
            </Card>

            {/* Actions rapides */}
            <Card bg={cardBg}>
              <CardHeader>
                <Heading size="sm">Actions rapides</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={3}>
                  <Button colorScheme="teal" size="sm" w="full">
                    Créer un événement
                  </Button>
                  <Button colorScheme="blue" size="sm" w="full">
                    Acheter des crédits
                  </Button>
                  <Button colorScheme="purple" size="sm" w="full">
                    Modifier mon profil
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </VStack>

          {/* Contenu principal */}
          <VStack spacing={6} align="stretch">
            {/* Barre de recherche */}
            <Card bg={cardBg}>
              <CardBody>
                <VStack spacing={4}>
                  <Heading size="md">Rechercher des événements</Heading>
                  
                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap={4} w="full">
                    <InputGroup>
                      <InputLeftElement>
                        <SearchIcon color="gray.400" />
                      </InputLeftElement>
                      <Input
                        placeholder="Rechercher un événement..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                    
                    <Select
                      placeholder="Tous les sports"
                      value={selectedSport}
                      onChange={(e) => setSelectedSport(e.target.value)}
                    >
                      {sports.map(sport => (
                        <option key={sport} value={sport}>{sport}</option>
                      ))}
                    </Select>
                    
                    <InputGroup>
                      <InputLeftElement>
                        <FaMapMarkerAlt color="gray.400" />
                      </InputLeftElement>
                      <Input
                        placeholder="Localisation..."
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                      />
                    </InputGroup>
                  </Grid>
                </VStack>
              </CardBody>
            </Card>

            {/* Événements à proximité */}
            <Card bg={cardBg}>
              <CardHeader>
                <HStack justify="space-between">
                  <Heading size="md">Événements à proximité</Heading>
                  <Badge colorScheme="green">
                    {filteredEvents.length} événements trouvés
                  </Badge>
                </HStack>
              </CardHeader>
              <CardBody>
                {filteredEvents.length === 0 ? (
                  <Alert status="info">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>Aucun événement trouvé</AlertTitle>
                      <AlertDescription>
                        Essayez de modifier vos critères de recherche.
                      </AlertDescription>
                    </Box>
                  </Alert>
                ) : (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {filteredEvents.map(event => (
                      <Card key={event.id} variant="outline" _hover={{ shadow: 'md' }}>
                        <CardBody>
                          <VStack align="start" spacing={3}>
                            <HStack justify="space-between" w="full">
                              <Badge colorScheme="blue">{event.sport}</Badge>
                              <Text fontSize="sm" color="gray.500">
                                {event.distance}km
                              </Text>
                            </HStack>
                            
                            <Heading size="sm">{event.title}</Heading>
                            
                            <Text fontSize="sm" color="gray.600" noOfLines={2}>
                              {event.description}
                            </Text>
                            
                            <VStack align="start" spacing={1} w="full">
                              <HStack fontSize="sm" color="gray.500">
                                <FaMapMarkerAlt />
                                <Text>{event.location}</Text>
                              </HStack>
                              
                              <HStack fontSize="sm" color="gray.500">
                                <CalendarIcon />
                                <Text>{formatDate(event.startDate)}</Text>
                              </HStack>
                              
                              <HStack fontSize="sm" color="gray.500">
                                <FaUsers />
                                <Text>{event.currentParticipants}/{event.maxParticipants} participants</Text>
                              </HStack>
                            </VStack>
                            
                            <HStack justify="space-between" w="full">
                              <Text fontWeight="bold" color="teal.500">
                                {event.price === 0 ? 'Gratuit' : `${event.price}€`}
                              </Text>
                              <Button size="sm" colorScheme="teal">
                                S'inscrire
                              </Button>
                            </HStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                )}
              </CardBody>
            </Card>
          </VStack>
        </Grid>
      </Container>
    </Box>
  )
} 