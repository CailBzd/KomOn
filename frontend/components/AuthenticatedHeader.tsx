"use client"
import {
  Box, Flex, Text, Button, HStack, Link, Container, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerBody, VStack, useDisclosure, Avatar, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Badge, useToast, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay
} from '@chakra-ui/react'
import { HamburgerIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { FiLogOut } from 'react-icons/fi'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/api/auth'
import { useRouter } from 'next/navigation'

export default function AuthenticatedHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true)
  }

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      setIsLogoutDialogOpen(false)
      router.push('/')
      toast({ 
        title: 'Déconnexion réussie', 
        description: 'Vous avez été déconnecté avec succès.',
        status: 'success', 
        duration: 3000,
        position: 'top-right'
      })
    } catch (error) {
      toast({ 
        title: 'Erreur lors de la déconnexion', 
        description: 'Une erreur est survenue. Veuillez réessayer.',
        status: 'error', 
        duration: 3000,
        position: 'top-right'
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleProfileEdit = () => router.push('/profile')
  const handleDashboard = () => router.push('/dashboard')

  return (
    <>
      <Box as="header" position="fixed" top={0} left={0} right={0} zIndex={100} bg="white"
        boxShadow={isScrolled ? '0 2px 16px rgba(0,0,0,0.06)' : '0 1px 0 #e2e8f0'} transition="box-shadow 0.2s">
        <Container maxW="container.xl" py={2}>
          <Flex align="center" justify="space-between">
            {/* Logo */}
            <Link href="/" _hover={{ textDecoration: 'none' }}>
              <Flex align="center" gap={2}>
                <Box w="8" h="8" bgGradient="linear(to-br, teal.400, teal.200)" borderRadius="lg" display="flex" alignItems="center" justifyContent="center">
                  <Text fontWeight="bold" color="white" fontSize="xl">K</Text>
                </Box>
                <Text fontWeight="bold" fontSize="xl" bgGradient="linear(to-br, teal.400, teal.200)" bgClip="text">KomOn</Text>
              </Flex>
            </Link>
            {/* Actions */}
            <HStack spacing={3} display={{ base: 'none', md: 'flex' }}>
              <Badge colorScheme="teal" fontSize="sm" px={2} py={1} borderRadius="full">
                5 crédits
              </Badge>
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost" borderRadius="full" px={3} py={2} _hover={{ bg: 'teal.50' }}>
                  <HStack spacing={2}>
                    <Avatar size="sm" name={`${user?.firstName} ${user?.lastName}`} src={user?.profilePictureUrl} />
                    <Text fontWeight="500" color="gray.700">{user?.firstName}</Text>
                  </HStack>
                </MenuButton>
                <MenuList boxShadow="lg" borderRadius="lg" border="1px solid" borderColor="gray.200">
                  <MenuItem onClick={handleDashboard} _hover={{ bg: 'teal.50' }}>
                    <Text>Tableau de bord</Text>
                  </MenuItem>
                  <MenuItem onClick={handleProfileEdit} _hover={{ bg: 'teal.50' }}>
                    <Text>Modifier mon profil</Text>
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem 
                    onClick={handleLogoutClick} 
                    color="red.500" 
                    _hover={{ bg: 'red.50' }}
                    icon={<FiLogOut />}
                  >
                    <Text fontWeight="500">Déconnexion</Text>
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
            
            <IconButton aria-label="Ouvrir le menu" icon={<HamburgerIcon boxSize={6} />} display={{ base: 'flex', md: 'none' }} variant="ghost" onClick={onOpen} />
          </Flex>
        </Container>
        {/* Drawer mobile */}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody>
              <VStack spacing={6} mt={10} align="stretch">
                <VStack spacing={3} align="stretch">
                  <HStack spacing={3} justify="center">
                    <Avatar size="md" name={`${user?.firstName} ${user?.lastName}`} src={user?.profilePictureUrl} />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="bold">{user?.firstName} {user?.lastName}</Text>
                      <Badge colorScheme="teal" fontSize="xs" borderRadius="full">5 crédits</Badge>
                    </VStack>
                  </HStack>
                </VStack>
                <Button onClick={handleDashboard} colorScheme="teal" borderRadius="full" w="full">
                  Tableau de bord
                </Button>
                <Button onClick={handleProfileEdit} variant="outline" colorScheme="teal" borderRadius="full" w="full">
                  Modifier mon profil
                </Button>
                <MenuDivider />
                <Button 
                  onClick={handleLogoutClick} 
                  colorScheme="red" 
                  variant="outline" 
                  borderRadius="full" 
                  w="full"
                  leftIcon={<FiLogOut />}
                >
                  Déconnexion
                </Button>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>

      {/* Dialog de confirmation de déconnexion */}
      <AlertDialog
        isOpen={isLogoutDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsLogoutDialogOpen(false)}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="xl" boxShadow="2xl">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmer la déconnexion
            </AlertDialogHeader>

            <AlertDialogBody>
              Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsLogoutDialogOpen(false)} variant="ghost">
                Annuler
              </Button>
              <Button 
                colorScheme="red" 
                onClick={handleLogoutConfirm} 
                ml={3}
                isLoading={isLoggingOut}
                loadingText="Déconnexion..."
              >
                Se déconnecter
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
} 