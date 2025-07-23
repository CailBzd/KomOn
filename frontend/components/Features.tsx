'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react'
import {
  Search,
  Calendar,
  Users,
  MessageCircle,
  MapPin,
  CreditCard,
  Bell,
  Trophy,
} from 'lucide-react'

const features = [
  {
    icon: Search,
    title: 'Découverte Facile!',
    description: 'Trouve rapidement des événements sportifs près de chez toi avec notre système de recherche intelligent!',
    color: 'orange.100',
    iconColor: 'orange.500',
  },
  {
    icon: Calendar,
    title: 'Participation Simple!',
    description: 'Rejoins tes événements préférés en quelques clics avec un processus simplifié!',
    color: 'blue.100',
    iconColor: 'blue.500',
  },
  {
    icon: Users,
    title: 'Communauté Active!',
    description: 'Rejoins une communauté de passionnés de sport et partage tes expériences!',
    color: 'green.100',
    iconColor: 'green.500',
  },
  {
    icon: MessageCircle,
    title: 'Communication Intégrée!',
    description: 'Échange avec les organisateurs et autres participants via notre messagerie intégrée!',
    color: 'purple.100',
    iconColor: 'purple.500',
  },
  {
    icon: MapPin,
    title: 'Géolocalisation!',
    description: 'Localise facilement les lieux d\'événements avec des cartes interactives et des itinéraires!',
    color: 'red.100',
    iconColor: 'red.500',
  },
  {
    icon: CreditCard,
    title: 'Paiement Sécurisé!',
    description: 'Effectue tes paiements en toute sécurité avec Stripe pour les événements payants!',
    color: 'teal.100',
    iconColor: 'teal.500',
  },
  {
    icon: Bell,
    title: 'Notifications!',
    description: 'Reste informé des mises à jour et rappels d\'événements avec nos notifications personnalisées!',
    color: 'yellow.100',
    iconColor: 'yellow.500',
  },
  {
    icon: Trophy,
    title: 'Suivi des Performances!',
    description: 'Suis tes participations et performances avec des statistiques détaillées!',
    color: 'indigo.100',
    iconColor: 'indigo.500',
  },
]

export function Features() {
  const bgColor = useColorModeValue('gray.50', 'gray.900')

  return (
    <Box bg={bgColor} py="20">
      <Container maxW="container.xl">
        <VStack spacing="16" textAlign="center">
          {/* Header */}
          <VStack spacing="6" maxW="3xl">
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
              🚀 Fonctionnalités KomOn!
            </Box>

            <Heading
              as="h2"
              size="2xl"
              fontWeight="bold"
              color="gray.800"
            >
              Tout ce dont tu as besoin pour{' '}
              <Text
                as="span"
                bgGradient="linear(to-r, orange.500, blue.600)"
                bgClip="text"
              >
                bouger et te connecter!
              </Text>
            </Heading>

            <Text
              fontSize="xl"
              color="gray.600"
              maxW="2xl"
              lineHeight="1.6"
            >
              KomOn! te donne tous les outils pour découvrir, participer et organiser 
              des événements sportifs incroyables dans ta région!
            </Text>
          </VStack>

          {/* Features Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing="8" w="full">
            {features.map((feature, index) => (
              <Box
                key={index}
                bg="white"
                p="8"
                borderRadius="2xl"
                boxShadow="lg"
                textAlign="center"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-8px)',
                  boxShadow: 'xl',
                }}
                border="1px solid"
                borderColor="gray.100"
              >
                <VStack spacing="6">
                  <Box
                    w="16"
                    h="16"
                    bg={feature.color}
                    borderRadius="2xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow="lg"
                  >
                    <Icon as={feature.icon} color={feature.iconColor} boxSize="8" />
                  </Box>
                  
                  <VStack spacing="3">
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      color="gray.800"
                    >
                      {feature.title}
                    </Text>
                    <Text
                      fontSize="sm"
                      color="gray.600"
                      lineHeight="1.6"
                    >
                      {feature.description}
                    </Text>
                  </VStack>
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
              Prêt à rejoindre la communauté KomOn!?
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
                  Rejoins-nous maintenant!
                </Text>
                <Text
                  color="orange.100"
                  fontSize="lg"
                  lineHeight="1.6"
                >
                  Télécharge l'application mobile et commence à bouger avec KomOn!
                </Text>
              </VStack>
            </Box>
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
} 