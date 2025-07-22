"use client"
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  Icon,
  Text
} from '@chakra-ui/react'
import { FiLogOut } from 'react-icons/fi'
import { useState, useRef } from 'react'
import { useAuth } from '@/lib/api/auth'
import { useRouter } from 'next/navigation'

interface LogoutButtonProps {
  variant?: 'solid' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  colorScheme?: 'red' | 'gray'
  children?: React.ReactNode
  showIcon?: boolean
  fullWidth?: boolean
  borderRadius?: string
}

export default function LogoutButton({
  variant = 'outline',
  size = 'md',
  colorScheme = 'red',
  children = 'Déconnexion',
  showIcon = true,
  fullWidth = false,
  borderRadius = 'full'
}: LogoutButtonProps) {
  const { logout } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const cancelRef = useRef<HTMLButtonElement>(null)

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

  return (
    <>
      <Button
        colorScheme={colorScheme}
        variant={variant}
        size={size}
        onClick={handleLogoutClick}
        leftIcon={showIcon ? <Icon as={FiLogOut} /> : undefined}
        borderRadius={borderRadius}
        w={fullWidth ? 'full' : 'auto'}
        _hover={{
          bg: colorScheme === 'red' ? 'red.50' : 'gray.50',
          borderColor: colorScheme === 'red' ? 'red.300' : 'gray.300'
        }}
        transition="all 0.2s"
      >
        {children}
      </Button>

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
              <Text>
                Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte.
              </Text>
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