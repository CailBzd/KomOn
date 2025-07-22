"use client"
import {
  Box, Flex, Text, Link, Container, Avatar, Menu, MenuButton, MenuList, MenuItem, MenuDivider, useToast, Button, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { FiLogOut } from 'react-icons/fi'
import { useAuth } from '@/lib/api/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'

export default function MinimalConnectedHeader() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const cancelRef = useRef<HTMLButtonElement>(null)

  // Redirige automatiquement si l'utilisateur est déconnecté
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true)
  }

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      setIsLogoutDialogOpen(false)
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

  const handleProfile = () => router.push('/profile')
  const handleDashboard = () => router.push('/dashboard')

  return (
    <>
      <Box as="header" position="fixed" top={0} left={0} right={0} zIndex={100} bg="white" boxShadow="0 1px 0 #e2e8f0">
        <Container maxW="container.xl" py={2}>
          <Flex align="center" justify="space-between">
            {/* Logo */}
            <Link href="/dashboard" _hover={{ textDecoration: 'none' }}>
              <Flex align="center" gap={2}>
                <Box w="8" h="8" bgGradient="linear(to-br, teal.400, teal.200)" borderRadius="lg" display="flex" alignItems="center" justifyContent="center">
                  <Text fontWeight="bold" color="white" fontSize="xl">K</Text>
                </Box>
                <Text fontWeight="bold" fontSize="xl" bgGradient="linear(to-br, teal.400, teal.200)" bgClip="text">KomOn</Text>
              </Flex>
            </Link>
            {/* Menu utilisateur */}
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost" borderRadius="full" px={3} py={2} _hover={{ bg: 'teal.50' }}>
                <Flex align="center" gap={2}>
                  <Avatar size="sm" name={`${user?.firstName} ${user?.lastName}`} src={user?.profilePictureUrl} />
                  <Text fontWeight="500" color="gray.700">{user?.firstName}</Text>
                </Flex>
              </MenuButton>
              <MenuList boxShadow="lg" borderRadius="lg" border="1px solid" borderColor="gray.200">
                <MenuItem onClick={handleDashboard} _hover={{ bg: 'teal.50' }}>
                  <Text>Tableau de bord</Text>
                </MenuItem>
                <MenuItem onClick={handleProfile} _hover={{ bg: 'teal.50' }}>
                  <Text>Mon profil</Text>
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
          </Flex>
        </Container>
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