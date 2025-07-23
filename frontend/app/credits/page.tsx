'use client'

import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Badge,
  useColorModeValue,
  SimpleGrid,
  Icon,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useToast
} from '@chakra-ui/react'
import { FaCoins, FaArrowLeft, FaCheck, FaStar, FaUsers } from 'react-icons/fa'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

const MotionCard = motion(Card)

const creditPackages = [
  {
    id: 'single',
    credits: 1,
    price: 4.99,
    savings: 0,
    savingsPercent: 0,
    popular: false,
    description: 'Pour tester ou créer un événement unique'
  },
  {
    id: 'starter',
    credits: 5,
    price: 14.99,
    savings: 10,
    savingsPercent: 20,
    popular: false,
    description: 'Pack de démarrage parfait'
  },
  {
    id: 'popular',
    credits: 10,
    price: 24.99,
    savings: 25,
    savingsPercent: 50,
    popular: true,
    description: 'Le plus populaire - excellent rapport qualité/prix'
  },
  {
    id: 'pro',
    credits: 25,
    price: 49.99,
    savings: 75,
    savingsPercent: 60,
    popular: false,
    description: 'Pour les organisateurs réguliers'
  },
  {
    id: 'enterprise',
    credits: 100,
    price: 149.99,
    savings: 350,
    savingsPercent: 70,
    popular: false,
    description: 'Pour les gros organisateurs et associations'
  }
]

const benefits = [
  '1 crédit = 1 événement créé',
  'Participer = Gagner des crédits',
  'Crédits valables à vie',
  'Max 30 participants par événement',
  'Support prioritaire inclus',
  'Statistiques avancées',
  'Accès aux outils premium'
]

export default function CreditsPage() {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const toast = useToast()
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handlePurchase = async (packageId: string) => {
    setIsLoading(true)
    
    try {
      // TODO: Intégration Stripe
      console.log('Achat du pack:', packageId)
      
      toast({
        title: 'Achat en cours...',
        description: 'Redirection vers le système de paiement.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      })
      
      // Simulation d'achat
      setTimeout(() => {
        toast({
          title: 'Achat réussi !',
          description: 'Vos crédits ont été ajoutés à votre compte.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        setIsLoading(false)
      }, 2000)
      
    } catch (error) {
      toast({
        title: 'Erreur lors de l\'achat',
        description: 'Veuillez réessayer.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      setIsLoading(false)
    }
  }

  return (
    <Box bg={bgColor} minH="100vh" py={20}>
      <Container maxW="container.xl">
        <VStack spacing={12}>
          {/* Header */}
          <VStack spacing={6} textAlign="center">
            <HStack spacing={3}>
              <Icon as={FaCoins} boxSize={10} color="yellow.500" />
              <Heading size="2xl" color="gray.700">
                Acheter des crédits
              </Heading>
            </HStack>
            <Text fontSize="xl" color="gray.600" maxW="2xl">
              <strong>1 crédit = 1 événement créé</strong> • Plus vous achetez, plus vous économisez !
            </Text>
            <Alert status="info" borderRadius="lg" maxW="2xl">
              <AlertIcon />
              <Box>
                <AlertTitle>Nouveau !</AlertTitle>
                <AlertDescription>
                  Découvrez nos plans Premium (6,99€/mois) et Illimité (12,99€/mois) avec 
                  2 mois gratuits en abonnement annuel !
                </AlertDescription>
              </Box>
            </Alert>
          </VStack>

          {/* Stats */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
            <Stat textAlign="center">
              <StatLabel color="gray.600">Événements créés</StatLabel>
              <StatNumber color="teal.600">1,247</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                23.36%
              </StatHelpText>
            </Stat>
            <Stat textAlign="center">
              <StatLabel color="gray.600">Participants total</StatLabel>
              <StatNumber color="purple.600">15,892</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                45.12%
              </StatHelpText>
            </Stat>
            <Stat textAlign="center">
              <StatLabel color="gray.600">Crédits utilisés</StatLabel>
              <StatNumber color="orange.600">892</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                12.8%
              </StatHelpText>
            </Stat>
          </SimpleGrid>

          {/* Credit Packages */}
          <VStack spacing={8} w="full">
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
              {creditPackages.map((pkg, index) => (
                <MotionCard
                  key={pkg.id}
                  bg={cardBg}
                  borderRadius="xl"
                  boxShadow="xl"
                  border={pkg.popular ? '2px solid' : '1px solid'}
                  borderColor={pkg.popular ? 'purple.400' : 'gray.200'}
                  position="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  _hover={{ transform: 'translateY(-4px)', boxShadow: '2xl' }}
                >
                  {pkg.popular && (
                    <Badge
                      position="absolute"
                      top={-3}
                      left="50%"
                      transform="translateX(-50%)"
                      colorScheme="purple"
                      variant="solid"
                      px={4}
                      py={1}
                      borderRadius="full"
                      fontSize="sm"
                      fontWeight="bold"
                    >
                      <Icon as={FaStar} mr={1} />
                      Le plus populaire
                    </Badge>
                  )}

                  <CardHeader textAlign="center" pt={pkg.popular ? 8 : 6}>
                    <VStack spacing={4}>
                      <HStack spacing={3}>
                        <Icon as={FaCoins} boxSize={8} color="yellow.500" />
                        <Text fontSize="3xl" fontWeight="bold" color="gray.700">
                          {pkg.credits}
                        </Text>
                      </HStack>
                      <Text fontSize="lg" color="gray.500" fontWeight="medium">
                        crédit{pkg.credits > 1 ? 's' : ''}
                      </Text>
                      <Text fontSize="sm" color="gray.500" textAlign="center">
                        {pkg.description}
                      </Text>
                    </VStack>
                  </CardHeader>

                  <Divider />

                  <CardBody>
                    <VStack spacing={6}>
                      <VStack spacing={2}>
                        <Text fontSize="3xl" fontWeight="bold" color="teal.600">
                          {pkg.price}€
                        </Text>
                        {pkg.savings > 0 && (
                          <VStack spacing={1}>
                            <Badge colorScheme="green" variant="solid" fontSize="sm">
                              Économise {pkg.savings}€ ({pkg.savingsPercent}%)
                            </Badge>
                            <Text fontSize="sm" color="gray.500" textDecoration="line-through">
                              {(pkg.credits * 4.99).toFixed(2)}€
                            </Text>
                          </VStack>
                        )}
                      </VStack>

                      <Button
                        colorScheme={pkg.popular ? 'purple' : 'teal'}
                        size="lg"
                        w="full"
                        borderRadius="full"
                        fontWeight="semibold"
                        onClick={() => handlePurchase(pkg.id)}
                        isLoading={isLoading && selectedPackage === pkg.id}
                        loadingText="Achat..."
                        _hover={{ transform: 'translateY(-2px)' }}
                        transition="all 0.2s"
                      >
                        Acheter maintenant
                      </Button>
                    </VStack>
                  </CardBody>
                </MotionCard>
              ))}
            </SimpleGrid>
          </VStack>

          {/* Credit System Explanation */}
          <VStack spacing={6} w="full" bg={cardBg} p={8} borderRadius="xl" boxShadow="lg">
            <VStack spacing={4} textAlign="center">
              <Heading size="lg" color="gray.700">
                Comment fonctionne le système de crédits ?
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
                <VStack spacing={4} align="stretch">
                  <HStack spacing={3}>
                    <Icon as={FaCoins} color="teal.500" boxSize={6} />
                    <Text fontWeight="semibold" color="gray.700">
                      Création d'événements
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.600" pl={9}>
                    <strong>1 crédit = 1 événement créé</strong><br/>
                    Chaque événement que vous créez consomme 1 crédit de votre compte.
                  </Text>
                </VStack>
                <VStack spacing={4} align="stretch">
                  <HStack spacing={3}>
                    <Icon as={FaUsers} color="purple.500" boxSize={6} />
                    <Text fontWeight="semibold" color="gray.700">
                      Gagner des crédits
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.600" pl={9}>
                    <strong>Participer = Gagner des crédits</strong><br/>
                    • Gratuit : 1 crédit après 5 participations<br/>
                    • Premium : 1 crédit après 3 participations<br/>
                    • Illimité : Pas de limite de participations
                  </Text>
                </VStack>
              </SimpleGrid>
            </VStack>
          </VStack>

          {/* Benefits */}
          <VStack spacing={6} w="full">
            <Heading size="lg" color="gray.700" textAlign="center">
              Avantages des crédits
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} w="full">
              {benefits.map((benefit, index) => (
                <HStack key={index} spacing={3} p={4} bg={cardBg} borderRadius="lg" boxShadow="sm">
                  <Icon as={FaCheck} color="green.400" />
                  <Text fontSize="sm" color="gray.700">
                    {benefit}
                  </Text>
                </HStack>
              ))}
            </SimpleGrid>
          </VStack>

          {/* Info Alert */}
          <Alert status="info" borderRadius="lg" maxW="2xl">
            <AlertIcon />
            <Box>
              <AlertTitle>Comment ça marche ?</AlertTitle>
              <AlertDescription>
                <strong>1 crédit = 1 événement créé</strong> • Les crédits sont valables à vie 
                et peuvent être utilisés à tout moment. Vous pouvez aussi gagner des crédits 
                en participant aux événements d'autres organisateurs !
              </AlertDescription>
            </Box>
          </Alert>

          {/* Legal Notice for Large Events */}
          <Alert status="warning" borderRadius="lg" maxW="2xl">
            <AlertIcon />
            <Box>
              <AlertTitle>⚠️ Information importante</AlertTitle>
              <AlertDescription>
                <strong>Événements avec un grand nombre de participants</strong> : 
                Pour tout événement de plus de 50 personnes, une déclaration préalable est obligatoire. 
                Au-delà de 1500 personnes, une autorisation préfectorale est requise. 
                Consultez les autorités locales et respectez les règles de sécurité en vigueur.
              </AlertDescription>
            </Box>
          </Alert>

          {/* Footer */}
          <VStack spacing={4} textAlign="center">
            <Button
              as={Link}
              href="#download"
              variant="ghost"
              size="lg"
              leftIcon={<FaArrowLeft />}
            >
              Télécharger l'app
            </Button>
            <Text color="gray.500" fontSize="sm">
              Considérez aussi nos plans Premium et Illimité pour des économies à long terme !
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
} 