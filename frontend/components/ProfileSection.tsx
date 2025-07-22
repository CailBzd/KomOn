"use client"
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Badge,
  Divider,
  Card,
  CardBody,
  Heading,
  Icon,
  useColorModeValue
} from '@chakra-ui/react'
import { FiUser, FiSettings, FiShield, FiCreditCard } from 'react-icons/fi'
import { useAuth } from '@/lib/api/auth'
import LogoutButton from './LogoutButton'

interface ProfileSectionProps {
  showCredits?: boolean
  showActions?: boolean
  showLogout?: boolean
}

export default function ProfileSection({
  showCredits = true,
  showActions = true,
  showLogout = true
}: ProfileSectionProps) {
  const { user } = useAuth()
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const actions = [
    {
      icon: FiUser,
      label: 'Modifier mon profil',
      href: '/profile',
      color: 'blue'
    },
    {
      icon: FiSettings,
      label: 'Paramètres',
      href: '/settings',
      color: 'gray'
    },
    {
      icon: FiShield,
      label: 'Sécurité',
      href: '/security',
      color: 'green'
    },
    {
      icon: FiCreditCard,
      label: 'Mes crédits',
      href: '/credits',
      color: 'purple'
    }
  ]

  return (
    <Card bg={cardBg} border="1px solid" borderColor={borderColor} borderRadius="xl" boxShadow="sm">
      <CardBody>
        <VStack spacing={6} align="stretch">
          {/* En-tête du profil */}
          <HStack spacing={4}>
            <Avatar 
              size="lg" 
              name={`${user?.firstName} ${user?.lastName}`} 
              src={user?.profilePictureUrl}
              border="3px solid"
              borderColor="teal.200"
            />
            <VStack align="start" spacing={1} flex={1}>
              <Heading size="md" color="gray.800">
                {user?.firstName} {user?.lastName}
              </Heading>
              <Text color="gray.600" fontSize="sm">
                {user?.email}
              </Text>
              {showCredits && (
                <Badge colorScheme="teal" borderRadius="full" px={3} py={1}>
                  5 crédits disponibles
                </Badge>
              )}
            </VStack>
          </HStack>

          {/* Actions rapides */}
          {showActions && (
            <>
              <Divider />
              <VStack spacing={3} align="stretch">
                <Text fontWeight="600" color="gray.700" fontSize="sm">
                  Actions rapides
                </Text>
                <VStack spacing={2} align="stretch">
                  {actions.map((action) => (
                    <Box
                      key={action.label}
                      as="a"
                      href={action.href}
                      p={3}
                      borderRadius="lg"
                      border="1px solid"
                      borderColor="gray.200"
                      _hover={{
                        bg: 'gray.50',
                        borderColor: 'gray.300',
                        transform: 'translateY(-1px)',
                        boxShadow: 'sm'
                      }}
                      transition="all 0.2s"
                      cursor="pointer"
                    >
                      <HStack spacing={3}>
                        <Icon as={action.icon} color={`${action.color}.500`} boxSize={4} />
                        <Text fontSize="sm" fontWeight="500">
                          {action.label}
                        </Text>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </VStack>
            </>
          )}

          {/* Section déconnexion */}
          {showLogout && (
            <>
              <Divider />
              <VStack spacing={3} align="stretch">
                <Text fontWeight="600" color="gray.700" fontSize="sm">
                  Compte
                </Text>
                <LogoutButton
                  variant="outline"
                  colorScheme="red"
                  fullWidth
                  borderRadius="lg"
                  showIcon
                >
                  Se déconnecter
                </LogoutButton>
              </VStack>
            </>
          )}
        </VStack>
      </CardBody>
    </Card>
  )
} 