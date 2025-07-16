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
  Link as ChakraLink,
  useToast,
  Card,
  CardBody,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Icon
} from '@chakra-ui/react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa'
import { authService } from '@/lib/api/auth'

const MotionBox = motion(Box)

interface ForgotPasswordData {
  email: string
}

export default function ForgotPasswordPage() {
  const toast = useToast()
  const [formData, setFormData] = useState<ForgotPasswordData>({
    email: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleInputChange = (field: keyof ForgotPasswordData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email) {
      toast({
        title: 'Email manquant',
        description: 'Veuillez saisir votre adresse email.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)
    
    try {
      const response = await authService.forgotPassword(formData.email)
      
      if (response.isSuccess) {
        setEmailSent(true)
        toast({
          title: 'Email envoyé !',
          description: 'Vérifiez votre boîte mail pour réinitialiser votre mot de passe.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'Erreur',
          description: response.error || 'Une erreur est survenue lors de l\'envoi de l\'email.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    } catch (error) {
      let errorMessage = 'Une erreur est survenue lors de l\'envoi de l\'email.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Erreur',
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
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="md">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <VStack spacing={6} mb={8}>
            <ChakraLink
              href="/login"
              display="flex"
              alignItems="center"
              color="teal.500"
              fontSize="sm"
              _hover={{ textDecoration: 'underline' }}
            >
              <Icon as={FaArrowLeft} mr={2} />
              Retour à la connexion
            </ChakraLink>
            
            <VStack spacing={2}>
              <Heading size="lg" color="gray.800">
                Mot de passe oublié
              </Heading>
              <Text color="gray.600" textAlign="center">
                Entrez votre adresse email pour recevoir un lien de réinitialisation
              </Text>
            </VStack>
          </VStack>

          {!emailSent ? (
            <Card shadow="lg" borderRadius="xl">
              <CardBody p={8}>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={6}>
                    <FormControl isRequired>
                      <FormLabel color="gray.700">Adresse email</FormLabel>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="votre@email.com"
                        size="lg"
                        borderRadius="lg"
                        _focus={{
                          borderColor: 'teal.500',
                          boxShadow: '0 0 0 1px var(--chakra-colors-teal-500)'
                        }}
                      />
                    </FormControl>
                    
                    <Button
                      type="submit"
                      colorScheme="teal"
                      size="lg"
                      w="full"
                      isLoading={isLoading}
                      loadingText="Envoi en cours..."
                      leftIcon={<FaEnvelope />}
                    >
                      Envoyer le lien de réinitialisation
                    </Button>
                  </VStack>
                </form>
              </CardBody>
            </Card>
          ) : (
            <Card shadow="lg" borderRadius="xl">
              <CardBody p={8}>
                <VStack spacing={6}>
                  <Alert status="success" borderRadius="lg">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>Email envoyé !</AlertTitle>
                      <AlertDescription>
                        Nous avons envoyé un lien de réinitialisation à <strong>{formData.email}</strong>.
                        Veuillez vérifier votre boîte mail et cliquer sur le lien pour réinitialiser votre mot de passe.
                      </AlertDescription>
                    </Box>
                  </Alert>
                  
                  <VStack spacing={4} w="full">
                    <Text color="gray.600" textAlign="center" fontSize="sm">
                      Vous n'avez pas reçu l'email ? Vérifiez vos spams ou
                    </Text>
                    
                    <Button
                      variant="outline"
                      colorScheme="teal"
                      size="md"
                      onClick={() => setEmailSent(false)}
                    >
                      Réessayer
                    </Button>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          )}

          {/* Footer */}
          <VStack spacing={4} mt={8}>
            <Text color="gray.500" fontSize="sm" textAlign="center">
              Vous vous souvenez de votre mot de passe ?{' '}
              <ChakraLink href="/login" color="teal.500" _hover={{ textDecoration: 'underline' }}>
                Se connecter
              </ChakraLink>
            </Text>
            
            <Text color="gray.500" fontSize="sm" textAlign="center">
              Pas encore de compte ?{' '}
              <ChakraLink href="/signup" color="teal.500" _hover={{ textDecoration: 'underline' }}>
                S'inscrire
              </ChakraLink>
            </Text>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  )
} 