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
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Icon
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaSignInAlt, FaArrowLeft } from 'react-icons/fa'
import Link from 'next/link'
import { useAuth } from '@/lib/api/auth'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/api/auth'

const MotionBox = motion(Box)

interface LoginData {
  email: string
  password: string
  rememberMe: boolean
}

export default function LoginPage() {
  const toast = useToast()
  const { login, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
    rememberMe: false
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [waitingEmailValidation, setWaitingEmailValidation] = useState(false)
  const [showResendValidation, setShowResendValidation] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  // Redirection si déjà connecté ou après connexion réussie
  useEffect(() => {
    if (isAuthenticated && !loading) {
      console.log('🔄 Redirection vers le dashboard...');
      router.replace('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  // Redirection après connexion réussie
  useEffect(() => {
    if (loginSuccess && !loading) {
      console.log('✅ Connexion réussie, redirection...');
      setLoginSuccess(false);
      router.replace('/dashboard');
    }
  }, [loginSuccess, loading, router]);

  const handleInputChange = (field: keyof LoginData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast({
        title: 'Champs manquants',
        description: 'Veuillez remplir tous les champs obligatoires.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)
    
    try {
      await login({ email: formData.email, password: formData.password, rememberMe: formData.rememberMe })
      
      toast({
        title: 'Connexion réussie !',
        description: 'Redirection vers votre tableau de bord...',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      
      // Marquer la connexion comme réussie pour déclencher la redirection
      setLoginSuccess(true)
      
    } catch (error) {
      let errorMessage = 'Email ou mot de passe incorrect.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Vérifier si c'est une erreur d'email non validé (nouveau message backend)
      if (errorMessage.includes('n’a pas encore été validée')) {
        setWaitingEmailValidation(true)
        setShowResendValidation(true)
        return
      }
      
      toast({
        title: 'Erreur de connexion',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendValidation = async () => {
    setResendLoading(true)
    setResendSuccess(false)
    try {
      await authService.sendEmailVerification(formData.email)
      setResendSuccess(true)
    } catch (err) {
      toast({
        title: 'Erreur',
        description: 'Impossible de renvoyer l’email de validation.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      setResendLoading(false)
    }
  }

  if (loading) {
    return (
      <Box bg="gray.50" minH="100vh" py={20}>
        <Container maxW="container.sm">
          <Text>Chargement...</Text>
        </Container>
      </Box>
    )
  }

  if (isAuthenticated) {
    return (
      <Box bg="gray.50" minH="100vh" py={20}>
        <Container maxW="container.sm">
          <Text>Redirection en cours...</Text>
        </Container>
      </Box>
    )
  }

  if (waitingEmailValidation) {
    return (
      <Box bg="gray.50" minH="100vh" py={20}>
        <Container maxW="container.sm">
          <VStack spacing={8}>
            <Alert status="warning" borderRadius="md" boxShadow="md">
              <AlertIcon />
              <Box>
                <AlertTitle color="orange.600">Votre adresse email n’est pas validée</AlertTitle>
                <AlertDescription color="gray.700">
                  Merci de vérifier votre boîte mail et de cliquer sur le lien de validation pour activer votre compte.
                </AlertDescription>
                {showResendValidation && (
                  <VStack align="start" mt={4} spacing={2}>
                    <Button
                      colorScheme="teal"
                      variant="outline"
                      size="sm"
                      onClick={handleResendValidation}
                      isLoading={resendLoading}
                      loadingText="Envoi..."
                      leftIcon={<FaSignInAlt />}
                    >
                      Renvoyer l’email de validation
                    </Button>
                    {resendSuccess && (
                      <Text color="green.600" fontSize="sm">Email de validation renvoyé !</Text>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setWaitingEmailValidation(false)}
                    >
                      Réessayer la connexion
                    </Button>
                  </VStack>
                )}
              </Box>
            </Alert>
            <Divider />
            <Text color="gray.500" fontSize="sm">
              Pas encore de compte ?{' '}
              <ChakraLink 
                href="/signup" 
                color="teal.500" 
                fontWeight="semibold"
                _hover={{ textDecoration: 'underline' }}
              >
                S'inscrire gratuitement
              </ChakraLink>
            </Text>
            <Link href="/" passHref>
              <Button
                leftIcon={<FaArrowLeft />}
                variant="ghost"
                colorScheme="teal"
                size="sm"
              >
                Retour à l'accueil
              </Button>
            </Link>
          </VStack>
        </Container>
      </Box>
    )
  }

  return (
    <Box bg="gray.50" minH="100vh" py={20}>
      <Container maxW="container.sm">
        <VStack spacing={8}>
          {/* Header */}
          <VStack spacing={6} textAlign="center">
            <HStack spacing={3}>
              <Icon as={FaSignInAlt} boxSize={8} color="teal.500" />
              <Heading size="xl" color="teal.600">
                Connexion
              </Heading>
            </HStack>
            <Text fontSize="lg" color="gray.600" maxW="md">
              Connectez-vous à votre compte KomOn pour accéder à tous les événements sportifs locaux.
            </Text>
          </VStack>

          {/* Form */}
          <Card w="full" boxShadow="xl">
            <CardBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="votre@email.com"
                      size="lg"
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Mot de passe</FormLabel>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Votre mot de passe"
                      size="lg"
                    />
                  </FormControl>
                  
                  <HStack justify="space-between" w="full">
                    <Checkbox
                      isChecked={formData.rememberMe}
                      onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                    >
                      Se souvenir de moi
                    </Checkbox>
                    
                    <ChakraLink 
                      href="/forgot-password" 
                      color="teal.500" 
                      fontSize="sm"
                      _hover={{ textDecoration: 'underline' }}
                    >
                      Mot de passe oublié ?
                    </ChakraLink>
                  </HStack>
                  
                  <Button
                    type="submit"
                    colorScheme="teal"
                    size="lg"
                    w="full"
                    isLoading={isLoading}
                    loadingText="Connexion..."
                  >
                    Se connecter
                  </Button>
                </VStack>
              </form>
            </CardBody>
          </Card>

          {/* Demo Alert */}
          <Alert status="info" borderRadius="lg">
            <AlertIcon />
            <Box>
              <AlertTitle>Comptes de test disponibles</AlertTitle>
              <AlertDescription>
                <VStack align="start" spacing={2}>
                  <Text><strong>Super Admin:</strong> admin@komon.com / Admin123!</Text>
                  <Text><strong>Utilisateur Test:</strong> test@komon.com / Test123!</Text>
                </VStack>
              </AlertDescription>
            </Box>
          </Alert>

          {/* Footer */}
          <VStack spacing={4} textAlign="center">
            <Divider />
            <Text color="gray.500" fontSize="sm">
              Pas encore de compte ?{' '}
              <ChakraLink 
                href="/signup" 
                color="teal.500" 
                fontWeight="semibold"
                _hover={{ textDecoration: 'underline' }}
              >
                S'inscrire gratuitement
              </ChakraLink>
            </Text>
            
            <Link href="/" passHref>
              <Button
                leftIcon={<FaArrowLeft />}
                variant="ghost"
                colorScheme="teal"
                size="sm"
              >
                Retour à l'accueil
              </Button>
            </Link>
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
} 