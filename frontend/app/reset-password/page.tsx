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
  Icon,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa'
import { useRouter, useSearchParams } from 'next/navigation'
import { authService } from '@/lib/api/auth'

const MotionBox = motion(Box)

interface ResetPasswordData {
  newPassword: string
  confirmPassword: string
}

export default function ResetPasswordPage() {
  const toast = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [formData, setFormData] = useState<ResetPasswordData>({
    newPassword: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [passwordReset, setPasswordReset] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [token, setToken] = useState<string>('')

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      setToken(tokenParam)
    } else {
      toast({
        title: 'Token manquant',
        description: 'Le lien de réinitialisation est invalide.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      router.push('/forgot-password')
    }
  }, [searchParams, toast, router])

  const handleInputChange = (field: keyof ResetPasswordData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validatePassword = (password: string): string[] => {
    const errors: string[] = []
    
    if (password.length < 8) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères')
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une minuscule')
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule')
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre')
    }
    
    if (!/(?=.*[@$!%*?&\-])/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&-)')
    }
    
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.newPassword || !formData.confirmPassword) {
      toast({
        title: 'Champs manquants',
        description: 'Veuillez remplir tous les champs.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: 'Mots de passe différents',
        description: 'Les mots de passe ne correspondent pas.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    const passwordErrors = validatePassword(formData.newPassword)
    if (passwordErrors.length > 0) {
      toast({
        title: 'Mot de passe invalide',
        description: passwordErrors.join(', '),
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)
    
    try {
      const response = await authService.resetPassword({
        token,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      })
      
      if (response.isSuccess) {
        setPasswordReset(true)
        toast({
          title: 'Mot de passe réinitialisé !',
          description: 'Votre mot de passe a été modifié avec succès.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'Erreur',
          description: response.error || 'Une erreur est survenue lors de la réinitialisation.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    } catch (error) {
      let errorMessage = 'Une erreur est survenue lors de la réinitialisation.';
      
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

  if (!token) {
    return null
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
                Réinitialiser le mot de passe
              </Heading>
              <Text color="gray.600" textAlign="center">
                Entrez votre nouveau mot de passe
              </Text>
            </VStack>
          </VStack>

          {!passwordReset ? (
            <Card shadow="lg" borderRadius="xl">
              <CardBody p={8}>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={6}>
                    <FormControl isRequired>
                      <FormLabel color="gray.700">Nouveau mot de passe</FormLabel>
                      <InputGroup>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.newPassword}
                          onChange={(e) => handleInputChange('newPassword', e.target.value)}
                          placeholder="Votre nouveau mot de passe"
                          size="lg"
                          borderRadius="lg"
                          _focus={{
                            borderColor: 'teal.500',
                            boxShadow: '0 0 0 1px var(--chakra-colors-teal-500)'
                          }}
                        />
                        <InputRightElement h="full">
                          <Button
                            variant="ghost"
                            onClick={() => setShowPassword(!showPassword)}
                            size="sm"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color="gray.700">Confirmer le mot de passe</FormLabel>
                      <InputGroup>
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          placeholder="Confirmez votre nouveau mot de passe"
                          size="lg"
                          borderRadius="lg"
                          _focus={{
                            borderColor: 'teal.500',
                            boxShadow: '0 0 0 1px var(--chakra-colors-teal-500)'
                          }}
                        />
                        <InputRightElement h="full">
                          <Button
                            variant="ghost"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            size="sm"
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                    
                    <Button
                      type="submit"
                      colorScheme="teal"
                      size="lg"
                      w="full"
                      isLoading={isLoading}
                      loadingText="Réinitialisation..."
                      leftIcon={<FaLock />}
                    >
                      Réinitialiser le mot de passe
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
                      <AlertTitle>Mot de passe réinitialisé !</AlertTitle>
                      <AlertDescription>
                        Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                      </AlertDescription>
                    </Box>
                  </Alert>
                  
                  <Button
                    colorScheme="teal"
                    size="lg"
                    w="full"
                    onClick={() => router.push('/login')}
                  >
                    Aller à la page de connexion
                  </Button>
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
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  )
} 