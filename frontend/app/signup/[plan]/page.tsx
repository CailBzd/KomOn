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
import { useAuth } from '@/lib/api/auth'
import { useRouter } from 'next/navigation'

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
  dateOfBirth: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
  acceptNewsletter: boolean
  selectedSports: SelectedSport[]
  emailCode: string
  smsCode: string
  emailVerified: boolean
  smsVerified: boolean
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
  const { register, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const authService = require('@/lib/api/auth').authService
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptNewsletter: false,
    selectedSports: [],
    emailCode: '',
    smsCode: '',
    emailVerified: false,
    smsVerified: false
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  // Redirection si déjà connecté
  if (isAuthenticated && !loading) {
    router.replace('/dashboard')
    return null
  }

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

  const sendEmailCode = async () => {
    try {
      await authService.sendEmailVerification(formData.email)
      toast({
        title: 'Code envoyé !',
        description: 'Vérifiez votre boîte email.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer le code email.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const sendSmsCode = async () => {
    try {
      await authService.sendSmsVerification(formData.phone)
      toast({
        title: 'Code envoyé !',
        description: 'Vérifiez votre téléphone.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer le code SMS.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const verifyEmailCode = async () => {
    try {
      await authService.verifyEmailCode(formData.email, formData.emailCode)
      handleInputChange('emailVerified', true)
      toast({
        title: 'Email vérifié !',
        description: 'Votre email a été vérifié avec succès.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Code invalide',
        description: 'Le code de vérification est incorrect.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const verifySmsCode = async () => {
    try {
      await authService.verifySmsCode(formData.phone, formData.smsCode)
      handleInputChange('smsVerified', true)
      toast({
        title: 'SMS vérifié !',
        description: 'Votre téléphone a été vérifié avec succès.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Code invalide',
        description: 'Le code de vérification est incorrect.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const validateStep1 = () => {
    const { firstName, lastName, email, phone, dateOfBirth } = formData
    return firstName.trim() && lastName.trim() && email.trim() && phone.trim() && dateOfBirth.trim()
  }

  const validateStep2 = () => {
    const { password, confirmPassword } = formData
    
    // Validation du mot de passe selon les règles backend
    const hasMinLength = password.length >= 8
    const hasLowercase = /[a-z]/.test(password)
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecialChar = /[@$!%*?&]/.test(password)
    const passwordsMatch = password === confirmPassword
    
    return hasMinLength && hasLowercase && hasUppercase && hasNumber && hasSpecialChar && passwordsMatch
  }

  const getPasswordValidationStatus = () => {
    const { password } = formData
    if (!password) return { isValid: false, errors: [] }
    
    const errors = []
    if (password.length < 8) errors.push('Au moins 8 caractères')
    if (!/[a-z]/.test(password)) errors.push('Au moins une minuscule')
    if (!/[A-Z]/.test(password)) errors.push('Au moins une majuscule')
    if (!/\d/.test(password)) errors.push('Au moins un chiffre')
    if (!/[@$!%*?&]/.test(password)) errors.push('Au moins un caractère spécial (@$!%*?&)')
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  const validateStep3 = () => {
    const { acceptTerms, selectedSports } = formData
    return acceptTerms && selectedSports.length > 0
  }

  const validateStep4 = () => {
    const { emailVerified, smsVerified } = formData
    return emailVerified && smsVerified
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return validateStep1()
      case 2: return validateStep2()
      case 3: return validateStep3()
      case 4: return validateStep4()
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
      // Préparer les données pour l'API
      const registerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        dateOfBirth: new Date(formData.dateOfBirth),
        phoneNumber: formData.phone,
        bio: `Sports préférés: ${formData.selectedSports.map(s => s.name).join(', ')}`
      }

      console.log('📝 Données d\'inscription:', registerData)
      
      await register(registerData)
      
      toast({
        title: 'Inscription réussie !',
        description: 'Votre compte a été créé avec succès.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      
      // Redirection vers le dashboard
      router.push('/dashboard')
      
    } catch (error) {
      let errorMessage = 'Une erreur est survenue lors de l\'inscription.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Erreur lors de l\'inscription',
        description: errorMessage,
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
                      
                      <FormControl isRequired>
                        <FormLabel>Date de naissance</FormLabel>
                        <Input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          max={new Date().toISOString().split('T')[0]}
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
                          isInvalid={formData.password ? !getPasswordValidationStatus().isValid : false}
                        />
                        {formData.password && (
                          <VStack align="start" spacing={1} mt={2}>
                            <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                              Le mot de passe doit contenir :
                            </Text>
                            {getPasswordValidationStatus().errors.map((error, index) => (
                              <HStack key={index} spacing={2}>
                                <Box
                                  w={2}
                                  h={2}
                                  borderRadius="full"
                                  bg="red.400"
                                />
                                <Text fontSize="xs" color="red.500">
                                  {error}
                                </Text>
                              </HStack>
                            ))}
                            {getPasswordValidationStatus().isValid && (
                              <HStack spacing={2}>
                                <Box
                                  w={2}
                                  h={2}
                                  borderRadius="full"
                                  bg="green.400"
                                />
                                <Text fontSize="xs" color="green.500" fontWeight="semibold">
                                  Mot de passe valide
                                </Text>
                              </HStack>
                            )}
                          </VStack>
                        )}
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

                {/* Step 4: Vérification */}
                {currentStep === 4 && (
                  <MotionBox
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    w="full"
                  >
                    <VStack spacing={6}>
                      <Heading size="md" color="gray.700">
                        Vérification de votre compte
                      </Heading>
                      
                      <Text color="gray.600" textAlign="center">
                        Pour finaliser votre inscription, nous devons vérifier votre email et votre numéro de téléphone.
                      </Text>
                      
                      {/* Vérification Email */}
                      <VStack spacing={4} w="full" p={4} border="1px solid" borderColor="gray.200" borderRadius="lg">
                        <HStack justify="space-between" w="full">
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="semibold" color="gray.700">
                              Vérification Email
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              {formData.email}
                            </Text>
                          </VStack>
                          {formData.emailVerified ? (
                            <Badge colorScheme="green" variant="solid">
                              Vérifié
                            </Badge>
                          ) : (
                            <Badge colorScheme="orange" variant="solid">
                              En attente
                            </Badge>
                          )}
                        </HStack>
                        
                        {!formData.emailVerified && (
                          <VStack spacing={3} w="full">
                            <HStack spacing={2} w="full">
                              <Input
                                placeholder="Code de vérification"
                                value={formData.emailCode}
                                onChange={(e) => handleInputChange('emailCode', e.target.value)}
                                maxLength={6}
                              />
                              <Button
                                colorScheme="teal"
                                onClick={verifyEmailCode}
                                isDisabled={formData.emailCode.length !== 6}
                              >
                                Vérifier
                              </Button>
                            </HStack>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={sendEmailCode}
                              w="full"
                            >
                              Renvoyer le code
                            </Button>
                          </VStack>
                        )}
                      </VStack>
                      
                      {/* Vérification SMS */}
                      <VStack spacing={4} w="full" p={4} border="1px solid" borderColor="gray.200" borderRadius="lg">
                        <HStack justify="space-between" w="full">
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="semibold" color="gray.700">
                              Vérification SMS
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              {formData.phone}
                            </Text>
                          </VStack>
                          {formData.smsVerified ? (
                            <Badge colorScheme="green" variant="solid">
                              Vérifié
                            </Badge>
                          ) : (
                            <Badge colorScheme="orange" variant="solid">
                              En attente
                            </Badge>
                          )}
                        </HStack>
                        
                        {!formData.smsVerified && (
                          <VStack spacing={3} w="full">
                            <HStack spacing={2} w="full">
                              <Input
                                placeholder="Code de vérification"
                                value={formData.smsCode}
                                onChange={(e) => handleInputChange('smsCode', e.target.value)}
                                maxLength={6}
                              />
                              <Button
                                colorScheme="teal"
                                onClick={verifySmsCode}
                                isDisabled={formData.smsCode.length !== 6}
                              >
                                Vérifier
                              </Button>
                            </HStack>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={sendSmsCode}
                              w="full"
                            >
                              Renvoyer le code
                            </Button>
                          </VStack>
                        )}
                      </VStack>
                      
                      <Alert status="info" borderRadius="lg">
                        <AlertIcon />
                        <Box>
                          <AlertTitle>Codes de test</AlertTitle>
                          <AlertDescription>
                            Pour les tests, utilisez n'importe quel code de 6 chiffres (ex: 123456)
                          </AlertDescription>
                        </Box>
                      </Alert>
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