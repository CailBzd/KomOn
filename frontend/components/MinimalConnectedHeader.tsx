"use client"
import {
  Box, Flex, Text, Link, Container, Avatar, Menu, MenuButton, MenuList, MenuItem, MenuDivider, useToast, Button
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useAuth } from '@/lib/api/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function MinimalConnectedHeader() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const toast = useToast()

  // Redirige automatiquement si l'utilisateur est déconnecté
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const handleLogout = async () => {
    try {
      await logout()
      toast({ title: 'Déconnexion réussie', status: 'success', duration: 3000 })
    } catch {
      toast({ title: 'Erreur lors de la déconnexion', status: 'error', duration: 3000 })
    }
  }

  const handleProfile = () => router.push('/profile')
  const handleDashboard = () => router.push('/dashboard')

  return (
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
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost" borderRadius="full" px={3} py={2}>
              <Flex align="center" gap={2}>
                <Avatar size="sm" name={`${user?.firstName} ${user?.lastName}`} src={user?.profilePictureUrl} />
                <Text fontWeight="500" color="gray.700">{user?.firstName}</Text>
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={handleDashboard}>Tableau de bord</MenuItem>
              <MenuItem onClick={handleProfile}>Mon profil</MenuItem>
              <MenuDivider />
              <MenuItem onClick={handleLogout} color="red.500">Déconnexion</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Container>
    </Box>
  )
} 