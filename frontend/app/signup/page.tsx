'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Card,
  CardBody,
  CardHeader,
  List,
  ListItem,
  ListIcon,
  Badge,
  useColorModeValue,
  SimpleGrid,
  Icon,
  Flex,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react'
import { CheckIcon, StarIcon } from '@chakra-ui/icons'
import { FaCrown, FaHandshake, FaUsers, FaCoins, FaStar, FaCheck } from 'react-icons/fa'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/api/auth'
import { useRouter } from 'next/navigation'

const MotionCard = motion(Card)

const plans = [
  {
    id: 'free',
    name: 'Gratuit',
    price: '',
    period: '',
    description: 'Parfait pour commencer',
    icon: FaUsers,
    color: 'teal',
    credits: 0,
    creditEarning: '5 participations = 1 crédit',
    features: [
      '0 crédit de création/mois',
      '1 crédit gagné après 5 participations = 1 crédit',
      '1 crédit = 1 événement créé',
      'S\'inscrire aux événements (10/mois)',
      'Profil basique',
      'Accès communautaire',
      'Notifications d\'événements'
    ],
    limitations: [
      'Max 30 participants/événement',
      'Max 10 participations/mois',
      'Pas de statistiques avancées',
      'Support communautaire uniquement'
    ],
    cta: 'Commencer gratuitement',
    popular: false
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '6.99',
    period: '/mois',
    description: 'Pour les organisateurs passionnés',
    icon: FaCrown,
    color: 'purple',
    credits: 5,
    creditEarning: '3 participations = 1 crédit',
    features: [
      '5 crédits de création/mois',
      '1 crédit gagné après 3 participations = 1 crédit',
      '1 crédit = 1 événement créé',
      'S\'inscrire aux événements illimités',
      'Statistiques avancées',
      'Gestion des participants',
      'Support prioritaire',
      'Badge Premium',
      'Accès aux outils avancés'
    ],
    limitations: [
      'Max 30 participants/événement',
      'Crédits non cumulables',
      'Pas d\'accès aux outils partenaires'
    ],
    cta: 'Choisir Premium',
    popular: false
  },
  {
    id: 'unlimited',
    name: 'Illimité',
    price: '12.99',
    period: '/mois',
    description: 'Pour les organisateurs intensifs',
    icon: FaStar,
    color: 'yellow',
    credits: 'Illimités',
    creditEarning: 'Pas de limite',
    features: [
      'Création d\'événements illimitée',
      'Participations illimitées',
      '1 crédit = 1 événement créé',
      'Statistiques avancées',
      'Gestion des participants',
      'Support prioritaire',
      'Badge Illimité',
      'Accès aux outils avancés',
      'Pas de limite de participants'
    ],
    limitations: [],
    cta: 'Choisir Illimité',
    popular: true
  }
]

const partnershipPlan = {
  id: 'partnership',
  name: 'Partenariat',
  price: 'Sur mesure',
  description: 'Pour associations, clubs, collectivités ou entreprises souhaitant des fonctionnalités avancées, une gestion multi-comptes, des outils professionnels, un accompagnement dédié et une API.',
  icon: FaHandshake,
  color: 'orange',
  features: [
    'Crédits illimités',
    'Tout du plan Illimité',
    'Outils professionnels',
    'Statistiques détaillées',
    'Support dédié',
    'Badge Partenaire officiel',
    'API d\'intégration',
    'Formation et accompagnement'
  ],
  limitations: [
    'Validation requise',
    'Contrat de partenariat',
    'Limites selon accord'
  ],
  cta: 'Contactez-nous'
}

const creditPackages = [
  { credits: 1, price: 4.99, savings: 0 },
  { credits: 5, price: 14.99, savings: 10 },
  { credits: 10, price: 24.99, savings: 25 },
  { credits: 25, price: 49.99, savings: 75 },
  { credits: 100, price: 149.99, savings: 350 }
]

// Prix annuels avec économies
const annualPricing = {
  premium: { monthly: 6.99, annual: 69.90, savings: 2, freeMonths: 2 },
  unlimited: { monthly: 12.99, annual: 129.90, savings: 2, freeMonths: 2 }
}

export default function SignUpPage() {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const router = useRouter()

  const getPlanPrice = (planId: string) => {
    if (planId === 'free' || planId === 'partnership') {
      return plans.find(p => p.id === planId)?.price || '0€'
    }
    
    if (billingCycle === 'annual' && annualPricing[planId as keyof typeof annualPricing]) {
      const pricing = annualPricing[planId as keyof typeof annualPricing]
      return `${pricing.annual}€`
    }
    
    return plans.find(p => p.id === planId)?.price || '0€'
  }

  const getPlanPeriod = (planId: string) => {
    if (planId === 'free' || planId === 'partnership') {
      return plans.find(p => p.id === planId)?.period || ''
    }
    
    return billingCycle === 'annual' ? '/an' : '/mois'
  }

  const getPlanSavings = (planId: string) => {
    if (billingCycle === 'annual' && annualPricing[planId as keyof typeof annualPricing]) {
      return annualPricing[planId as keyof typeof annualPricing].freeMonths
    }
    return 0
  }

  const handleSignUp = async (planId: string) => {
    // Implement the signup logic here
    // This is a placeholder and should be replaced with the actual implementation
    console.log(`Signing up for plan: ${planId}`)
    router.push('/dashboard')
  }

  return (
    <Box bg={bgColor} minH="100vh" py={20}>
      <Container maxW="container.xl">
        <VStack spacing={12}>
          {/* Header */}
          <VStack spacing={6} textAlign="center" w="full" position="relative">
            <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <rect width="64" height="64" rx="16" fill="#E6F4F1"/>
                <path d="M20 48V16H28V29L38 16H47L34 32L47 48H38L28 34V48H20Z" fill="#319795"/>
                <circle cx="44" cy="20" r="3" fill="#319795"/>
              </svg>
            </Box>
            <Heading
              size="2xl"
              bgGradient="linear(to-r, teal.400, purple.400)"
              bgClip="text"
              fontWeight="extrabold"
              letterSpacing="tight"
            >
              Choisissez votre plan
            </Heading>
            <Box
              bg={useColorModeValue('white', 'gray.800')}
              borderRadius="xl"
              boxShadow="md"
              px={{ base: 4, md: 8 }}
              py={{ base: 4, md: 6 }}
              maxW="2xl"
              mx="auto"
            >
              <Text color="gray.700" fontSize={{ base: 'md', md: 'lg' }}>
                Rejoignez la communauté KomOn avec notre système de crédits innovant.
              </Text>
              <HStack justify="center" spacing={4} mt={2} flexWrap="wrap">
                <HStack spacing={1}>
                  <Icon as={FaCoins} color="teal.400" boxSize={5} />
                  <Text as="span" fontWeight="bold">1 crédit</Text>
                  <Text as="span" fontWeight="bold">=</Text>
                  <Text as="span" fontWeight="bold">1 événement créé</Text>
                </HStack>
                <Text color="gray.400" fontWeight="bold">•</Text>
                <HStack spacing={1}>
                  <Icon as={FaCheck} color="purple.400" boxSize={5} />
                  <Text as="span" fontWeight="bold">Participer</Text>
                  <Text as="span" fontWeight="bold">Gagner des crédits</Text>
                </HStack>
              </HStack>
            </Box>
          </VStack>

          {/* Billing Cycle Selector */}
          <VStack spacing={4}>
            <Text fontWeight="semibold" color="gray.700">
              Cycle de facturation
            </Text>
            <HStack spacing={4} bg={cardBg} p={2} borderRadius="full" boxShadow="sm">
              <Button
                size="sm"
                variant={billingCycle === 'monthly' ? 'solid' : 'ghost'}
                colorScheme="teal"
                borderRadius="full"
                onClick={() => setBillingCycle('monthly')}
              >
                Mensuel
              </Button>
              <Button
                size="sm"
                variant={billingCycle === 'annual' ? 'solid' : 'ghost'}
                colorScheme="teal"
                borderRadius="full"
                onClick={() => setBillingCycle('annual')}
              >
                Annuel
                {billingCycle === 'annual' && (
                  <Badge ml={2} colorScheme="green" variant="solid" fontSize="xs">
                    2 mois gratuits
                  </Badge>
                )}
              </Button>
            </HStack>
          </VStack>

          {/* Plans */}
          <Box w="full" display="flex" justifyContent="center">
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="fit-content" alignItems="stretch">
              {plans.map((plan, index) => (
                <MotionCard
                  key={plan.id}
                  bg={cardBg}
                  borderRadius="xl"
                  boxShadow="xl"
                  border={plan.popular ? '2px solid' : '1px solid'}
                  borderColor={plan.popular ? `${plan.color}.400` : 'gray.200'}
                  position="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  _hover={{ transform: 'translateY(-4px)', boxShadow: '2xl' }}
                  display="flex"
                  flexDirection="column"
                  h="100%"
                >
                  {plan.popular && (
                    <Badge
                      position="absolute"
                      top={-3}
                      left="50%"
                      transform="translateX(-50%)"
                      colorScheme={plan.color}
                      variant="solid"
                      px={4}
                      py={1}
                      borderRadius="full"
                      fontSize="sm"
                      fontWeight="bold"
                    >
                      <Icon as={StarIcon} mr={1} />
                      Le plus populaire
                    </Badge>
                  )}

                  <CardHeader textAlign="center" pt={plan.popular ? 8 : 6}>
                    <VStack spacing={4}>
                      <Icon
                        as={plan.icon}
                        boxSize={12}
                        color={`${plan.color}.400`}
                      />
                      <VStack spacing={2}>
                        <Heading size="lg" color={`${plan.color}.600`}>
                          {plan.name}
                        </Heading>
                        <Text color="gray.500" fontSize="sm">
                          {plan.description}
                        </Text>
                      </VStack>
                      <VStack spacing={1}>
                        <HStack>
                          {plan.id !== "free" && (
                            <Text fontSize="4xl" fontWeight="bold" color={`${plan.color}.600`}>
                              {billingCycle === 'annual'
                                ? `${(parseFloat(plan.price) * 10).toFixed(2)}€`
                                : `${parseFloat(plan.price).toFixed(2)}€`}
                            </Text>
                          )}
                          <Text fontSize="lg" color="gray.500">
                            {getPlanPeriod(plan.id)}
                          </Text>
                        </HStack>
                        {getPlanSavings(plan.id) > 0 && (
                          <Badge colorScheme="green" variant="solid" fontSize="xs">
                            {getPlanSavings(plan.id)} mois gratuits
                          </Badge>
                        )}
                        <HStack spacing={2} mt={2}>
                          <Icon as={FaCoins} color={`${plan.color}.400`} />
                          <Text fontSize="lg" fontWeight="semibold" color={`${plan.color}.600`}>
                            {plan.credits === 0 ? 'Aucun crédit' : `${plan.credits} crédit${Number(plan.credits) > 1 ? 's' : ''}`}
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.500">
                          {plan.creditEarning}
                        </Text>
                      </VStack>
                    </VStack>
                  </CardHeader>

                  <Divider />

                  <CardBody flex="1 1 0">
                    <VStack spacing={6} align="stretch" h="100%">
                      {/* Features */}
                      <VStack spacing={3} align="stretch">
                        <Text fontWeight="semibold" color="gray.700">
                          Inclus :
                        </Text>
                        <List spacing={2}>
                          {plan.features.map((feature, idx) => (
                            <ListItem key={idx} display="flex" alignItems="center">
                              <ListIcon as={CheckIcon} color="green.400" />
                              <Text fontSize="sm">{feature}</Text>
                            </ListItem>
                          ))}
                        </List>
                      </VStack>

                      {/* Limitations */}
                      {plan.limitations.length > 0 && (
                        <VStack spacing={3} align="stretch">
                          <Text fontWeight="semibold" color="gray.700">
                            Limitations :
                          </Text>
                          <List spacing={2}>
                            {plan.limitations.map((limitation, idx) => (
                              <ListItem key={idx} display="flex" alignItems="center">
                                <ListIcon as={CheckIcon} color="red.400" />
                                <Text fontSize="sm" color="gray.500">{limitation}</Text>
                              </ListItem>
                            ))}
                          </List>
                        </VStack>
                      )}

                      {/* CTA Button aligné bas */}
                      <Box mt="auto" w="full">
                        <Button
                          as={Link}
                          href={`/signup/${plan.id}`}
                          colorScheme={plan.color}
                          size="lg"
                          borderRadius="full"
                          fontWeight="semibold"
                          _hover={{ transform: 'translateY(-2px)' }}
                          transition="all 0.2s"
                          w="full"
                        >
                          {plan.cta}
                        </Button>
                      </Box>
                    </VStack>
                  </CardBody>
                </MotionCard>
              ))}
            </SimpleGrid>
          </Box>

          {/* Encart Partenariat */}
          <Flex w="full" mt={6} align="center" justify="center" bg="orange.50" borderRadius="lg" border="1px solid" borderColor="orange.200" px={4} py={3} boxShadow="sm">
            <Box flexShrink={0} mr={4}>
              <Icon as={FaHandshake} color="orange.400" boxSize={14} />
            </Box>
            <Box flex="1">
              <Text fontWeight="bold" color="orange.700" fontSize="lg" mb={1}>Offre Partenariat</Text>
              <Text color="gray.700" fontSize="sm" mb={2}>
                Associations, clubs, collectivités ou entreprises : bénéficiez d'outils avancés, d'une gestion multi-comptes et d'un accompagnement dédié.
              </Text>
              <Button colorScheme="orange" size="sm" borderRadius="full" fontWeight="semibold">
                Nous contacter
              </Button>
            </Box>
          </Flex>

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
                    • Gratuit : 1 crédit après 5 participations = 1 crédit<br/>
                    • Premium : 1 crédit après 3 participations = 1 crédit<br/>
                    • Illimité : Pas de limite de participations
                  </Text>
                </VStack>
              </SimpleGrid>
            </VStack>
          </VStack>

          {/* Legal Information for Unlimited Plan */}
          <VStack spacing={6} w="full" bg="yellow.50" p={8} borderRadius="xl" border="2px solid" borderColor="yellow.200">
            <VStack spacing={4} textAlign="center">
              <HStack spacing={3}>
                <Icon as={FaStar} color="yellow.600" boxSize={8} />
                <Heading size="lg" color="yellow.800">
                  ⚠️ Information importante - Plan Illimité
                </Heading>
              </HStack>
              <Text fontSize="md" color="yellow.800" maxW="4xl">
                <strong>Événements avec un grand nombre de participants</strong>
              </Text>
              <VStack spacing={4} align="stretch" maxW="4xl">
                <Text fontSize="sm" color="yellow.800">
                  En tant qu'organisateur d'événements avec le plan Illimité, vous êtes <strong>entièrement responsable</strong> de la conformité avec :
                </Text>
                <VStack spacing={2} align="stretch" pl={4}>
                  <HStack spacing={2}>
                    <Icon as={FaCheck} color="yellow.600" boxSize={4} />
                    <Text fontSize="sm" color="yellow.800">
                      <strong>Règles de sécurité</strong> : Mise en place de mesures de sécurité appropriées
                    </Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Icon as={FaCheck} color="yellow.600" boxSize={4} />
                    <Text fontSize="sm" color="yellow.800">
                      <strong>Autorisations légales</strong> : Consultation des autorités locales (mairie, préfecture)
                    </Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Icon as={FaCheck} color="yellow.600" boxSize={4} />
                    <Text fontSize="sm" color="yellow.800">
                      <strong>Lois en vigueur</strong> : Respect du Code de la sécurité intérieure et autres réglementations
                    </Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Icon as={FaCheck} color="yellow.600" boxSize={4} />
                    <Text fontSize="sm" color="yellow.800">
                      <strong>Assurances</strong> : Couverture d'assurance appropriée pour l'événement
                    </Text>
                  </HStack>
                </VStack>
                <Alert status="warning" borderRadius="lg" mt={4}>
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Obligation légale</AlertTitle>
                    <AlertDescription>
                      Pour tout événement de plus de 50 personnes, une déclaration préalable est obligatoire. 
                      Au-delà de 1500 personnes, une autorisation préfectorale est requise.
                    </AlertDescription>
                  </Box>
                </Alert>
              </VStack>
            </VStack>
          </VStack>

          {/* Credit Packages */}
          <VStack spacing={8} w="full">
            <VStack spacing={4} textAlign="center">
              <Heading size="lg" color="gray.700">
                Acheter des crédits supplémentaires
              </Heading>
              <Text color="gray.600" maxW="2xl">
                Besoin de plus de crédits ? Achetez des packs de crédits supplémentaires 
                à tout moment. Plus vous achetez, plus vous économisez !
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4} w="full">
              {creditPackages.map((pkg, index) => (
                <MotionCard
                  key={pkg.credits}
                  bg={cardBg}
                  borderRadius="lg"
                  boxShadow="md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                >
                  <CardBody textAlign="center">
                    <VStack spacing={3}>
                      <HStack spacing={2}>
                        <Icon as={FaCoins} color="yellow.500" />
                        <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                          {pkg.credits}
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.500">
                        crédit{pkg.credits > 1 ? 's' : ''}
                      </Text>
                      <Text fontSize="xl" fontWeight="bold" color="teal.600">
                        {pkg.price}€
                      </Text>
                      {pkg.savings > 0 && (
                        <Badge colorScheme="green" variant="subtle" fontSize="xs">
                          Économise {pkg.savings}€
                        </Badge>
                      )}
                      <Button
                        as={Link}
                        href="/credits"
                        size="sm"
                        colorScheme="teal"
                        variant="outline"
                        w="full"
                        borderRadius="full"
                      >
                        Acheter
                      </Button>
                    </VStack>
                  </CardBody>
                </MotionCard>
              ))}
            </SimpleGrid>
          </VStack>

          {/* Footer */}
          <VStack spacing={4} textAlign="center">
            <Text color="gray.500" fontSize="sm">
              Tous les plans incluent la confirmation par SMS/email et le support client.
            </Text>
            <Text color="gray.500" fontSize="sm">
              Déjà inscrit ?{' '}
              <Link href="/login" style={{ color: '#38B2AC', textDecoration: 'underline' }}>
                Se connecter
              </Link>
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
} 