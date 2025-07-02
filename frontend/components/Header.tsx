'use client'

import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  Link,
  Container,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  VStack,
  useDisclosure
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { useState } from 'react'

const NAV_ITEMS = [
  { label: 'Accueil', href: '/' },
  { label: 'Événements', href: '/events' },
  { label: 'Sports', href: '/sports' },
  { label: 'À propos', href: '/about' },
  { label: 'Contact', href: '/contact' }
]

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isScrolled, setIsScrolled] = useState(false)

  // Effet d'ombre au scroll
  if (typeof window !== 'undefined') {
    window.onscroll = () => setIsScrolled(window.scrollY > 10)
  }

  return (
    <Box
      as="header"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={100}
      bg="white"
      boxShadow={isScrolled ? '0 2px 16px rgba(0,0,0,0.06)' : '0 1px 0 #e2e8f0'}
      transition="box-shadow 0.2s"
    >
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

          {/* Navigation desktop */}
          <HStack as="nav" spacing={6} display={{ base: 'none', md: 'flex' }}>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                fontWeight="500"
                color="gray.700"
                fontSize="md"
                px={2}
                py={1}
                borderRadius="md"
                _hover={{ bg: 'teal.50', color: 'teal.500', textDecoration: 'none' }}
                transition="all 0.2s"
              >
                {item.label}
              </Link>
            ))}
          </HStack>

          {/* Actions */}
          <HStack spacing={3} display={{ base: 'none', md: 'flex' }}>
            <Button variant="ghost" colorScheme="teal" borderRadius="full" px={4} fontWeight="500">Connexion</Button>
            <Button colorScheme="teal" borderRadius="full" px={5} fontWeight="600">S'inscrire</Button>
          </HStack>

          {/* Menu mobile */}
          <IconButton
            aria-label="Ouvrir le menu"
            icon={<HamburgerIcon boxSize={6} />}
            display={{ base: 'flex', md: 'none' }}
            variant="ghost"
            onClick={onOpen}
          />
        </Flex>
      </Container>
      {/* Drawer mobile */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            <VStack spacing={6} mt={10} align="stretch">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  fontWeight="500"
                  color="gray.700"
                  fontSize="lg"
                  px={2}
                  py={2}
                  borderRadius="md"
                  _hover={{ bg: 'teal.50', color: 'teal.500', textDecoration: 'none' }}
                  transition="all 0.2s"
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              ))}
              <Button colorScheme="teal" borderRadius="full" w="full">Connexion</Button>
              <Button variant="outline" colorScheme="teal" borderRadius="full" w="full">S'inscrire</Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
} 