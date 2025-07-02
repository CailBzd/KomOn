'use client'

import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  Checkbox,
  Link as ChakraLink,
  useToast,
  Card,
  CardBody,
  Progress,
  Badge,
  Icon,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaCrown, FaHandshake, FaUsers, FaArrowLeft } from 'react-icons/fa'
import SportSelection from '@/components/SportSelection'
import Link from 'next/link'

const MotionBox = motion(Box)

interface SelectedSport {
  id: string
  name: string
  icon: any
  color: string
  level?: string
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
  acceptNewsletter: boolean
  selectedSports: SelectedSport[]
}

const plans = {
  free: {
    name: 'Gratuit',
    icon: FaUsers,
    color: 'teal',
    description: 'Commencer gratuitement'
  },
  premium: {
    name: 'Premium',
    icon: FaCrown,
    color: 'purple',
    description: '9,99€/mois - Créer des événements'
  },
  partnership: {
    name: 'Partenariat',
    icon: FaHandshake,
    color: 'orange',
    description: 'Pour associations et communautés'
  }
}

export default function SignUpFormPage({ params }: { params: { plan: string } }) {
  const plan = plans[params.plan as keyof typeof plans]
  const toast = useToast()
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptNewsletter: false,
    selectedSports: []
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  if (!plan) {
    return (
      <Container maxW="container.md" py={20}>
        <VStack spacing={6}>
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Plan invalide</AlertTitle>
            <AlertDescription>
              Le plan sélectionné n'existe pas.
            </AlertDescription>
          </Alert>
          <Button as={Link} href="/signup" leftIcon={<FaArrowLeft />}>
            Retour aux plans
          </Button>
        </VStack>
      </Container>
    )
  }

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSportsChange = (sports: SelectedSport[]) => {
    handleInputChange('selectedSports', sports)
  }

  const validateStep1 = () => {
    const { firstName, lastName, email, phone } = formData
    return firstName.trim() && lastName.trim() && email.trim() && phone.trim()
  }

  const validateStep2 = () => {
    const { password, confirmPassword } = formData
    return password.length >= 8 && password === confirmPassword
  }

  const validateStep3 = () => {
    const { acceptTerms, selectedSports } = formData
    return acceptTerms && selectedSports.length > 0
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return validateStep1()
      case 2: return validateStep2()
      case 3: return validateStep3()
      default: return false
    }
  }

  const handleNext = () => {
    if (canProceed()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!canProceed()) return

    setIsLoading(true)
    
    try {
      // TODO: Intégration avec Supabase Auth
      console.log('Données du formulaire:', formData)
      
      toast({
        title: 'Inscription réussie !',
        description: 'Vérifiez votre email pour confirmer votre compte.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      
      // Redirection vers la page de confirmation
      // router.push('/signup/success')
      
    } catch (error) {
      toast({
        title: 'Erreur lors de l\'inscription',
        description: 'Veuillez réessayer.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box bg="gray.50" minH="100vh" py={10}>
      <Container maxW="container.md">
        <VStack spacing={8}>
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <HStack spacing={3}>
              <Icon as={plan.icon} boxSize={8} color={`${plan.color}.500`} />
              <Heading size="lg" color={`${plan.color}.600`}>
                Inscription - {plan.name}
              </Heading>
            </HStack>
            <Text color="gray.600">{plan.description}</Text>
            
            {/* Progress */}
            <VStack spacing={2} w="full">
              <HStack justify="space-between" w="full">
                <Text fontSize="sm" color="gray.500">
                  Étape {currentStep} sur {totalSteps}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {Math.round((currentStep / totalSteps) * 100)}%
                </Text>
              </HStack>
              <Progress 
                value={(currentStep / totalSteps) * 100} 
                colorScheme={plan.color}
                w="full"
                borderRadius="full"
              />
            </VStack>
          </VStack>

          {/* Form */}
          <Card w="full" boxShadow="xl">
            <CardBody>
              <VStack spacing={6}>
                {/* Step 1: Informations personnelles */}
                {currentStep === 1 && (
                  <MotionBox
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    w="full"
                  >
                    <VStack spacing={4}>
                      <Heading size="md" color="gray.700">
                        Informations personnelles
                      </Heading>
                      
                      <HStack spacing={4} w="full">
                        <FormControl isRequired>
                          <FormLabel>Prénom</FormLabel>
                          <Input
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            placeholder="Votre prénom"
                          />
                        </FormControl>
                        
                        <FormControl isRequired>
                          <FormLabel>Nom</FormLabel>
                          <Input
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            placeholder="Votre nom"
                          />
                        </FormControl>
                      </HStack>
                      
                      <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="votre@email.com"
                        />
                      </FormControl>
                      
                      <FormControl isRequired>
                        <FormLabel>Téléphone</FormLabel>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="06 12 34 56 78"
                        />
                      </FormControl>
                    </VStack>
                  </MotionBox>
                )}

                {/* Step 2: Sécurité */}
                {currentStep === 2 && (
                  <MotionBox
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    w="full"
                  >
                    <VStack spacing={4}>
                      <Heading size="md" color="gray.700">
                        Sécurité du compte
                      </Heading>
                      
                      <FormControl isRequired>
                        <FormLabel>Mot de passe</FormLabel>
                        <Input
                          type="password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          placeholder="Minimum 8 caractères"
                        />
                      </FormControl>
                      
                      <FormControl isRequired>
                        <FormLabel>Confirmer le mot de passe</FormLabel>
                        <Input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          placeholder="Répétez votre mot de passe"
                        />
                      </FormControl>
                      
                      {formData.password && formData.confirmPassword && (
                        <Alert 
                          status={formData.password === formData.confirmPassword ? 'success' : 'error'}
                          borderRadius="md"
                        >
                          <AlertIcon />
                          <Box>
                            <AlertTitle>
                              {formData.password === formData.confirmPassword ? 'Mots de passe identiques' : 'Mots de passe différents'}
                            </AlertTitle>
                            <AlertDescription>
                              {formData.password === formData.confirmPassword 
                                ? 'Vos mots de passe correspondent.' 
                                : 'Les mots de passe ne correspondent pas.'
                              }
                            </AlertDescription>
                          </Box>
                        </Alert>
                      )}
                    </VStack>
                  </MotionBox>
                )}

                {/* Step 3: Sports et conditions */}
                {currentStep === 3 && (
                  <MotionBox
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    w="full"
                  >
                    <VStack spacing={6}>
                      <Heading size="md" color="gray.700">
                        Sports et conditions
                      </Heading>
                      
                      <SportSelection
                        selectedSports={formData.selectedSports}
                        onSportsChange={handleSportsChange}
                        maxSports={5}
                      />
                      
                      <Divider />
                      
                      <VStack spacing={4} align="stretch" w="full">
                        <FormControl isRequired>
                          <Checkbox
                            isChecked={formData.acceptTerms}
                            onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                          >
                            J'accepte les{' '}
                            <ChakraLink href="/legal/cgu" color="teal.500" _hover={{ textDecoration: 'underline' }}>
                              conditions d'utilisation
                            </ChakraLink>
                            {' '}et la{' '}
                            <ChakraLink href="/legal/politique-confidentialite" color="teal.500" _hover={{ textDecoration: 'underline' }}>
                              politique de confidentialité
                            </ChakraLink>
                          </Checkbox>
                        </FormControl>
                        
                        <FormControl>
                          <Checkbox
                            isChecked={formData.acceptNewsletter}
                            onChange={(e) => handleInputChange('acceptNewsletter', e.target.checked)}
                          >
                            Je souhaite recevoir la newsletter KomOn avec les derniers événements
                          </Checkbox>
                        </FormControl>
                      </VStack>
                    </VStack>
                  </MotionBox>
                )}

                {/* Navigation */}
                <HStack spacing={4} w="full" justify="space-between">
                  <Button
                    variant="ghost"
                    onClick={handlePrevious}
                    isDisabled={currentStep === 1}
                    leftIcon={<FaArrowLeft />}
                  >
                    Précédent
                  </Button>
                  
                  {currentStep < totalSteps ? (
                    <Button
                      colorScheme={plan.color}
                      onClick={handleNext}
                      isDisabled={!canProceed()}
                    >
                      Suivant
                    </Button>
                  ) : (
                    <Button
                      colorScheme={plan.color}
                      onClick={handleSubmit}
                      isLoading={isLoading}
                      loadingText="Inscription..."
                      isDisabled={!canProceed()}
                    >
                      Créer mon compte
                    </Button>
                  )}
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Footer */}
          <VStack spacing={2} textAlign="center">
            <Text color="gray.500" fontSize="sm">
              Déjà inscrit ?{' '}
              <ChakraLink href="/login" color="teal.500" _hover={{ textDecoration: 'underline' }}>
                Se connecter
              </ChakraLink>
            </Text>
            <Button
              as={Link}
              href="/signup"
              variant="ghost"
              size="sm"
              leftIcon={<FaArrowLeft />}
            >
              Changer de plan
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
} 