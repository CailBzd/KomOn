'use client'

import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Badge,
  HStack,
  Divider
} from '@chakra-ui/react'
import { useAuth } from '@/lib/api/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ProfileSection from '@/components/ProfileSection'
import LogoutButton from '@/components/LogoutButton'

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')

  // Redirection si non connecté
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

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

  const userStats = {
    eventsCreated: 12,
    eventsParticipated: 28,
    totalEvents: 40,
    averageRating: 4.7,
    level: 'Expert',
    experience: 85
  }

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* En-tête de la page */}
          <Box>
            <Heading size="lg" color="gray.800" mb={2}>
              Mon Profil
            </Heading>
            <Text color="gray.600">
              Gérez vos informations personnelles et vos paramètres de compte
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
            {/* Section profil principale */}
            <Box gridColumn={{ lg: '1 / 2' }}>
              <ProfileSection 
                showCredits={true}
                showActions={true}
                showLogout={true}
              />
            </Box>

            {/* Statistiques et informations */}
            <Box gridColumn={{ lg: '2 / 4' }}>
              <VStack spacing={6} align="stretch">
                {/* Statistiques utilisateur */}
                <Card bg={cardBg} borderRadius="xl" boxShadow="sm">
                  <CardBody>
                    <VStack spacing={6} align="stretch">
                      <Heading size="md" color="gray.800">
                        Mes Statistiques
                      </Heading>
                      
                      <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
                        <Stat>
                          <StatLabel color="gray.600">Événements créés</StatLabel>
                          <StatNumber color="teal.500">{userStats.eventsCreated}</StatNumber>
                          <StatHelpText>
                            <StatArrow type="increase" />
                            12% ce mois
                          </StatHelpText>
                        </Stat>
                        
                        <Stat>
                          <StatLabel color="gray.600">Participations</StatLabel>
                          <StatNumber color="blue.500">{userStats.eventsParticipated}</StatNumber>
                          <StatHelpText>
                            <StatArrow type="increase" />
                            8% ce mois
                          </StatHelpText>
                        </Stat>
                        
                        <Stat>
                          <StatLabel color="gray.600">Note moyenne</StatLabel>
                          <StatNumber color="purple.500">{userStats.averageRating}</StatNumber>
                          <StatHelpText>
                            <StatArrow type="increase" />
                            0.2 ce mois
                          </StatHelpText>
                        </Stat>
                      </SimpleGrid>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Niveau et progression */}
                <Card bg={cardBg} borderRadius="xl" boxShadow="sm">
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <HStack justify="space-between">
                        <Heading size="md" color="gray.800">
                          Niveau et Progression
                        </Heading>
                        <Badge colorScheme="teal" fontSize="md" px={3} py={1} borderRadius="full">
                          {userStats.level}
                        </Badge>
                      </HStack>
                      
                      <Box>
                        <HStack justify="space-between" mb={2}>
                          <Text fontSize="sm" color="gray.600">
                            Progression vers le niveau suivant
                          </Text>
                          <Text fontSize="sm" fontWeight="600" color="gray.800">
                            {userStats.experience}%
                          </Text>
                        </HStack>
                        <Box
                          w="full"
                          bg="gray.200"
                          borderRadius="full"
                          h="8px"
                          overflow="hidden"
                        >
                          <Box
                            bgGradient="linear(to-r, teal.400, teal.600)"
                            h="full"
                            w={`${userStats.experience}%`}
                            borderRadius="full"
                            transition="width 0.3s ease"
                          />
                        </Box>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Actions rapides */}
                <Card bg={cardBg} borderRadius="xl" boxShadow="sm">
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <Heading size="md" color="gray.800">
                        Actions Rapides
                      </Heading>
                      
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <LogoutButton
                          variant="outline"
                          colorScheme="red"
                          fullWidth
                          borderRadius="lg"
                          showIcon
                        >
                          Se déconnecter
                        </LogoutButton>
                        
                        <LogoutButton
                          variant="ghost"
                          colorScheme="gray"
                          fullWidth
                          borderRadius="lg"
                          showIcon={false}
                        >
                          Paramètres avancés
                        </LogoutButton>
                      </SimpleGrid>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </Box>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
} 