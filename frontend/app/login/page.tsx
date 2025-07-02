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
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaSignInAlt, FaArrowLeft } from 'react-icons/fa'
import Link from 'next/link'

const MotionBox = motion(Box)

interface LoginData {
  email: string
  password: string
  rememberMe: boolean
}

export default function LoginPage() {
  const toast = useToast()
  
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
    rememberMe: false
  })
  
  const [isLoading, setIsLoading] = useState(false)

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
      // TODO: Intégration avec Supabase Auth
      console.log('Données de connexion:', formData)
      
      toast({
        title: 'Connexion réussie !',
        description: 'Redirection vers votre tableau de bord...',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      
      // Redirection vers le dashboard
      // router.push('/dashboard')
      
    } catch (error) {
      toast({
        title: 'Erreur de connexion',
        description: 'Email ou mot de passe incorrect.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
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
              <AlertTitle>Mode démo</AlertTitle>
              <AlertDescription>
                Cette page est en mode démo. L'authentification sera intégrée avec Supabase.
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
            
            <Button
              as={Link}
              href="/"
              variant="ghost"
              size="sm"
              leftIcon={<FaArrowLeft />}
            >
              Retour à l'accueil
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
} 