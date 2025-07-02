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
    title: 'Découverte Facile',
    description: 'Trouvez rapidement des événements sportifs près de chez vous avec notre système de recherche intelligent.',
    color: 'pastel.blue',
    iconColor: 'accent.info',
  },
  {
    icon: Calendar,
    title: 'Inscription Simple',
    description: 'Inscrivez-vous en quelques clics à vos événements préférés avec un processus simplifié.',
    color: 'pastel.green',
    iconColor: 'accent.success',
  },
  {
    icon: Users,
    title: 'Communauté Active',
    description: 'Rejoignez une communauté de passionnés de sport et partagez vos expériences.',
    color: 'pastel.purple',
    iconColor: 'accent.secondary',
  },
  {
    icon: MessageCircle,
    title: 'Communication Intégrée',
    description: 'Échangez avec les organisateurs et autres participants via notre messagerie intégrée.',
    color: 'pastel.pink',
    iconColor: 'accent.error',
  },
  {
    icon: MapPin,
    title: 'Géolocalisation',
    description: 'Localisez facilement les lieux d\'événements avec des cartes interactives et des itinéraires.',
    color: 'pastel.orange',
    iconColor: 'accent.warning',
  },
  {
    icon: CreditCard,
    title: 'Paiement Sécurisé',
    description: 'Effectuez vos paiements en toute sécurité avec Stripe pour les événements payants.',
    color: 'pastel.teal',
    iconColor: 'accent.primary',
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Restez informé des mises à jour et rappels d\'événements avec nos notifications personnalisées.',
    color: 'pastel.yellow',
    iconColor: 'accent.warning',
  },
  {
    icon: Trophy,
    title: 'Suivi des Performances',
    description: 'Suivez vos participations et performances avec des statistiques détaillées.',
    color: 'pastel.indigo',
    iconColor: 'accent.secondary',
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
              bg="white"
              color="accent.primary"
              px="4"
              py="2"
              borderRadius="full"
              fontSize="sm"
              fontWeight="semibold"
              boxShadow="md"
            >
              ✨ Fonctionnalités
            </Box>

            <Heading
              as="h2"
              size="2xl"
              fontWeight="bold"
              color="gray.800"
            >
              Tout ce dont vous avez besoin pour{' '}
              <Text
                as="span"
                bgGradient="linear(to-r, accent.primary, accent.secondary)"
                bgClip="text"
              >
                organiser et participer
              </Text>
            </Heading>

            <Text
              fontSize="xl"
              color="gray.600"
              lineHeight="1.6"
            >
              Une plateforme complète qui simplifie la découverte, l'organisation 
              et la participation aux événements sportifs locaux.
            </Text>
          </VStack>

          {/* Features Grid */}
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 4 }}
            spacing="8"
            w="full"
          >
            {features.map((feature, index) => (
              <Box
                key={index}
                bg="white"
                p="8"
                borderRadius="2xl"
                boxShadow="lg"
                border="1px solid"
                borderColor="gray.100"
                textAlign="center"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: 'xl',
                  borderColor: feature.iconColor,
                }}
                position="relative"
                overflow="hidden"
              >
                {/* Background Accent */}
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  h="4px"
                  bg={feature.color}
                />

                <VStack spacing="6" align="center">
                  <Box
                    w="16"
                    h="16"
                    bg={feature.color}
                    borderRadius="2xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow="md"
                  >
                    <Icon
                      as={feature.icon}
                      color={feature.iconColor}
                      size={32}
                    />
                  </Box>

                  <VStack spacing="3" align="center">
                    <Heading
                      as="h3"
                      size="lg"
                      fontWeight="semibold"
                      color="gray.800"
                    >
                      {feature.title}
                    </Heading>

                    <Text
                      color="gray.600"
                      lineHeight="1.6"
                      fontSize="md"
                    >
                      {feature.description}
                    </Text>
                  </VStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>

          {/* CTA Section */}
          <Box
            bg="white"
            p="8"
            borderRadius="2xl"
            boxShadow="lg"
            border="1px solid"
            borderColor="gray.100"
            textAlign="center"
            maxW="2xl"
            w="full"
          >
            <VStack spacing="6">
              <Heading
                as="h3"
                size="lg"
                fontWeight="semibold"
                color="gray.800"
              >
                Prêt à rejoindre la communauté ?
              </Heading>

              <Text
                color="gray.600"
                fontSize="lg"
                lineHeight="1.6"
              >
                Créez votre compte gratuitement et commencez à découvrir 
                les événements sportifs de votre région dès aujourd'hui.
              </Text>

              <HStack spacing="4" justify="center">
                <Box
                  bg="accent.primary"
                  color="white"
                  px="6"
                  py="3"
                  borderRadius="xl"
                  fontWeight="semibold"
                  cursor="pointer"
                  transition="all 0.3s"
                  _hover={{
                    bg: 'accent.secondary',
                    transform: 'scale(1.05)',
                  }}
                >
                  Créer un compte
                </Box>

                <Box
                  border="2px solid"
                  borderColor="accent.primary"
                  color="accent.primary"
                  px="6"
                  py="3"
                  borderRadius="xl"
                  fontWeight="semibold"
                  cursor="pointer"
                  transition="all 0.3s"
                  _hover={{
                    bg: 'pastel.indigo',
                    transform: 'scale(1.05)',
                  }}
                >
                  En savoir plus
                </Box>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
} 