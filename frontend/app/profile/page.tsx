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
  Textarea,
  Button,
  useToast,
  Card,
  CardBody,
  Avatar,
  IconButton,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Icon,
  InputGroup,
  InputRightElement,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Center
} from '@chakra-ui/react'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FaUser, FaLock, FaCamera, FaSave, FaArrowLeft, FaEye, FaEyeSlash, FaUpload, FaTimes } from 'react-icons/fa'
import { useAuth, authService } from '@/lib/api/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const MotionBox = motion(Box)

interface ProfileData {
  username: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  bio: string
}

interface PasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function ProfilePage() {
  const toast = useToast()
  const { user, logout, updateUser } = useAuth()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    bio: ''
  })
  
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profileUpdated, setProfileUpdated] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  // Charger les données du profil au montage
  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: user.dateOfBirth || '',
        bio: user.bio || ''
      })
    }
  }, [user])

  const handleProfileInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handlePasswordInputChange = (field: keyof PasswordData, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Type de fichier invalide',
          description: 'Veuillez sélectionner une image.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        return
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Fichier trop volumineux',
          description: 'L\'image ne doit pas dépasser 5MB.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        return
      }

      setSelectedImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      onOpen()
    }
  }

  const handleImageUpload = async () => {
    if (!selectedImage) return

    setIsUploading(true)
    
    try {
      // Simuler l'upload vers un service de stockage
      // En production, vous utiliseriez Supabase Storage ou un autre service
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simuler une URL d'image
      const imageUrl = `https://via.placeholder.com/300x300/teal/white?text=${user?.firstName?.charAt(0)}${user?.lastName?.charAt(0)}`
      
      const response = await authService.updateProfilePicture({ imageUrl })
      
      if (response.isSuccess) {
        toast({
          title: 'Photo de profil mise à jour !',
          description: 'Votre photo de profil a été changée avec succès.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        
        // Mettre à jour l'utilisateur dans le contexte
        if (user) {
          updateUser({ ...user, profilePictureUrl: imageUrl })
        }
        
        onClose()
        setSelectedImage(null)
        setPreviewUrl('')
      } else {
        throw new Error(response.error || 'Erreur lors de la mise à jour de la photo')
      }
      
    } catch (error) {
      let errorMessage = 'Une erreur est survenue lors de la mise à jour de la photo.';
      
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
      setIsUploading(false)
    }
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

  const validateUsername = (username: string): string[] => {
    const errors: string[] = []
    
    if (username.length < 3) {
      errors.push('Le pseudo doit contenir au moins 3 caractères')
    }
    
    if (username.length > 50) {
      errors.push('Le pseudo ne peut pas dépasser 50 caractères')
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      errors.push('Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores')
    }
    
    return errors
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!profileData.username || !profileData.firstName || !profileData.lastName) {
      toast({
        title: 'Champs manquants',
        description: 'Le pseudo, le prénom et le nom sont obligatoires.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    const usernameErrors = validateUsername(profileData.username)
    if (usernameErrors.length > 0) {
      toast({
        title: 'Pseudo invalide',
        description: usernameErrors.join(', '),
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)
    
    try {
      const response = await authService.updateProfile({
        username: profileData.username,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phoneNumber: profileData.phoneNumber,
        dateOfBirth: profileData.dateOfBirth || undefined,
        bio: profileData.bio
      })

      if (response.isSuccess && response.user) {
        toast({
          title: 'Profil mis à jour !',
          description: 'Vos informations ont été sauvegardées avec succès.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        
        setProfileUpdated(true)
        
        // Mettre à jour les données utilisateur dans le contexte
        updateUser(response.user)
      } else {
        throw new Error(response.error || 'Erreur lors de la mise à jour du profil')
      }
      
    } catch (error) {
      let errorMessage = 'Une erreur est survenue lors de la mise à jour du profil.';
      
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

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: 'Champs manquants',
        description: 'Veuillez remplir tous les champs.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Mots de passe différents',
        description: 'Les mots de passe ne correspondent pas.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    const passwordErrors = validatePassword(passwordData.newPassword)
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

    setIsPasswordLoading(true)
    
    try {
      const response = await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      })

      if (response.isSuccess) {
        toast({
          title: 'Mot de passe modifié !',
          description: 'Votre mot de passe a été changé avec succès.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        
        // Réinitialiser le formulaire
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        throw new Error(response.error || 'Erreur lors du changement de mot de passe')
      }
      
    } catch (error) {
      let errorMessage = 'Une erreur est survenue lors du changement de mot de passe.';
      
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
      setIsPasswordLoading(false)
    }
  }

  if (!user) {
    return (
      <Box bg="gray.50" minH="100vh" py={20}>
        <Container maxW="container.sm">
          <Text>Chargement...</Text>
        </Container>
      </Box>
    )
  }

  return (
    <Box bg="gray.50" minH="100vh" py={20}>
      <Container maxW="container.lg">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <VStack spacing={6} mb={8}>
            <Link href="/dashboard" passHref>
              <Button
                leftIcon={<FaArrowLeft />}
                variant="ghost"
                colorScheme="teal"
                size="sm"
              >
                Retour au dashboard
              </Button>
            </Link>
            
            <VStack spacing={2}>
              <Heading size="lg" color="gray.800">
                Mon Profil
              </Heading>
              <Text color="gray.600" textAlign="center">
                Gérez vos informations personnelles et votre mot de passe
              </Text>
            </VStack>
          </VStack>

          {/* Profile Info Card */}
          <Card shadow="lg" borderRadius="xl" mb={6}>
            <CardBody p={8}>
              <HStack spacing={6} mb={6}>
                <Box position="relative">
                  <Avatar 
                    size="xl" 
                    name={`${user.firstName} ${user.lastName}`} 
                    src={user.profilePictureUrl}
                    bg="teal.500"
                  />
                  <IconButton
                    aria-label="Changer la photo de profil"
                    icon={<FaCamera />}
                    size="sm"
                    colorScheme="teal"
                    position="absolute"
                    bottom={0}
                    right={0}
                    onClick={() => fileInputRef.current?.click()}
                    _hover={{ transform: 'scale(1.1)' }}
                    transition="all 0.2s"
                  />
                </Box>
                <VStack align="start" spacing={2}>
                  <Heading size="md">{user.firstName} {user.lastName}</Heading>
                  <Text color="gray.600">@{user.username || 'pseudo'}</Text>
                  <Text color="gray.600">{user.email}</Text>
                  <HStack spacing={2}>
                    <Badge colorScheme="teal">{user.role}</Badge>
                    <Badge colorScheme="green">{user.status}</Badge>
                  </HStack>
                </VStack>
              </HStack>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
            </CardBody>
          </Card>

          {/* Tabs */}
          <Tabs variant="enclosed" colorScheme="teal">
            <TabList>
              <Tab>
                <HStack spacing={2}>
                  <Icon as={FaUser} />
                  <Text>Informations</Text>
                </HStack>
              </Tab>
              <Tab>
                <HStack spacing={2}>
                  <Icon as={FaLock} />
                  <Text>Mot de passe</Text>
                </HStack>
              </Tab>
            </TabList>

            <TabPanels>
              {/* Profile Information Tab */}
              <TabPanel>
                <Card shadow="lg" borderRadius="xl">
                  <CardBody p={8}>
                    {profileUpdated && (
                      <Alert status="success" borderRadius="lg" mb={6}>
                        <AlertIcon />
                        <Box>
                          <AlertTitle>Profil mis à jour !</AlertTitle>
                          <AlertDescription>
                            Vos informations ont été sauvegardées avec succès.
                          </AlertDescription>
                        </Box>
                      </Alert>
                    )}

                    <form onSubmit={handleProfileSubmit}>
                      <VStack spacing={6}>
                        <FormControl isRequired>
                          <FormLabel>Pseudo</FormLabel>
                          <Input
                            value={profileData.username}
                            onChange={(e) => handleProfileInputChange('username', e.target.value)}
                            placeholder="votre_pseudo"
                            size="lg"
                            _focus={{
                              borderColor: 'teal.500',
                              boxShadow: '0 0 0 1px var(--chakra-colors-teal-500)'
                            }}
                          />
                          <Text fontSize="sm" color="gray.500" mt={1}>
                            Utilisez des lettres, chiffres, tirets et underscores uniquement
                          </Text>
                        </FormControl>

                        <HStack spacing={4} w="full">
                          <FormControl isRequired>
                            <FormLabel>Prénom</FormLabel>
                            <Input
                              value={profileData.firstName}
                              onChange={(e) => handleProfileInputChange('firstName', e.target.value)}
                              placeholder="Votre prénom"
                              size="lg"
                              _focus={{
                                borderColor: 'teal.500',
                                boxShadow: '0 0 0 1px var(--chakra-colors-teal-500)'
                              }}
                            />
                          </FormControl>

                          <FormControl isRequired>
                            <FormLabel>Nom</FormLabel>
                            <Input
                              value={profileData.lastName}
                              onChange={(e) => handleProfileInputChange('lastName', e.target.value)}
                              placeholder="Votre nom"
                              size="lg"
                              _focus={{
                                borderColor: 'teal.500',
                                boxShadow: '0 0 0 1px var(--chakra-colors-teal-500)'
                              }}
                            />
                          </FormControl>
                        </HStack>

                        <FormControl>
                          <FormLabel>Email</FormLabel>
                          <Input
                            value={profileData.email}
                            isReadOnly
                            bg="gray.100"
                            size="lg"
                            _focus={{
                              borderColor: 'teal.500',
                              boxShadow: '0 0 0 1px var(--chakra-colors-teal-500)'
                            }}
                          />
                          <Text fontSize="sm" color="gray.500" mt={1}>
                            L'email ne peut pas être modifié
                          </Text>
                        </FormControl>

                        <FormControl>
                          <FormLabel>Numéro de téléphone</FormLabel>
                          <Input
                            value={profileData.phoneNumber}
                            onChange={(e) => handleProfileInputChange('phoneNumber', e.target.value)}
                            placeholder="+33 6 12 34 56 78"
                            size="lg"
                            _focus={{
                              borderColor: 'teal.500',
                              boxShadow: '0 0 0 1px var(--chakra-colors-teal-500)'
                            }}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Date de naissance</FormLabel>
                          <Input
                            type="date"
                            value={profileData.dateOfBirth}
                            onChange={(e) => handleProfileInputChange('dateOfBirth', e.target.value)}
                            size="lg"
                            _focus={{
                              borderColor: 'teal.500',
                              boxShadow: '0 0 0 1px var(--chakra-colors-teal-500)'
                            }}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Bio</FormLabel>
                          <Textarea
                            value={profileData.bio}
                            onChange={(e) => handleProfileInputChange('bio', e.target.value)}
                            placeholder="Parlez-nous un peu de vous, vos sports préférés..."
                            size="lg"
                            rows={4}
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
                          loadingText="Sauvegarde..."
                          leftIcon={<FaSave />}
                        >
                          Sauvegarder les modifications
                        </Button>
                      </VStack>
                    </form>
                  </CardBody>
                </Card>
              </TabPanel>

              {/* Password Tab */}
              <TabPanel>
                <Card shadow="lg" borderRadius="xl">
                  <CardBody p={8}>
                    <form onSubmit={handlePasswordSubmit}>
                      <VStack spacing={6}>
                        <FormControl isRequired>
                          <FormLabel>Mot de passe actuel</FormLabel>
                          <InputGroup size="lg">
                            <Input
                              type={showCurrentPassword ? 'text' : 'password'}
                              value={passwordData.currentPassword}
                              onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                              placeholder="Votre mot de passe actuel"
                              _focus={{
                                borderColor: 'teal.500',
                                boxShadow: '0 0 0 1px var(--chakra-colors-teal-500)'
                              }}
                            />
                            <InputRightElement>
                              <IconButton
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                _hover={{ bg: 'transparent' }}
                                aria-label={showCurrentPassword ? 'Masquer' : 'Afficher'}
                                icon={showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                              />
                            </InputRightElement>
                          </InputGroup>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>Nouveau mot de passe</FormLabel>
                          <InputGroup size="lg">
                            <Input
                              type={showNewPassword ? 'text' : 'password'}
                              value={passwordData.newPassword}
                              onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                              placeholder="Votre nouveau mot de passe"
                              _focus={{
                                borderColor: 'teal.500',
                                boxShadow: '0 0 0 1px var(--chakra-colors-teal-500)'
                              }}
                            />
                            <InputRightElement>
                              <IconButton
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                _hover={{ bg: 'transparent' }}
                                aria-label={showNewPassword ? 'Masquer' : 'Afficher'}
                                icon={showNewPassword ? <FaEyeSlash /> : <FaEye />}
                              />
                            </InputRightElement>
                          </InputGroup>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
                          <InputGroup size="lg">
                            <Input
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={passwordData.confirmPassword}
                              onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                              placeholder="Confirmez votre nouveau mot de passe"
                              _focus={{
                                borderColor: 'teal.500',
                                boxShadow: '0 0 0 1px var(--chakra-colors-teal-500)'
                              }}
                            />
                            <InputRightElement>
                              <IconButton
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                _hover={{ bg: 'transparent' }}
                                aria-label={showConfirmPassword ? 'Masquer' : 'Afficher'}
                                icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                              />
                            </InputRightElement>
                          </InputGroup>
                        </FormControl>

                        <Button
                          type="submit"
                          colorScheme="teal"
                          size="lg"
                          w="full"
                          isLoading={isPasswordLoading}
                          loadingText="Modification..."
                          leftIcon={<FaLock />}
                        >
                          Changer le mot de passe
                        </Button>
                      </VStack>
                    </form>
                  </CardBody>
                </Card>
              </TabPanel>
            </TabPanels>
          </Tabs>

          {/* Image Upload Modal */}
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Confirmer la nouvelle photo de profil</ModalHeader>
              <ModalBody>
                <VStack spacing={4}>
                  <Text>Voulez-vous utiliser cette image comme photo de profil ?</Text>
                  {previewUrl && (
                    <Center>
                      <Image
                        src={previewUrl}
                        alt="Aperçu"
                        borderRadius="lg"
                        maxH="200px"
                        objectFit="cover"
                      />
                    </Center>
                  )}
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onClose}>
                  Annuler
                </Button>
                <Button
                  colorScheme="teal"
                  onClick={handleImageUpload}
                  isLoading={isUploading}
                  loadingText="Upload..."
                  leftIcon={<FaUpload />}
                >
                  Confirmer
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </MotionBox>
      </Container>
    </Box>
  )
} 