"use client"
import {
  Box, Flex, Text, HStack, Link, Container, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerBody, VStack, useDisclosure
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { useState, useEffect } from 'react'

const NAV_ITEMS = [
  { label: 'Accueil', href: '/' },
  { label: 'Fonctionnalités!', href: '#features' },
  { label: 'Événements!', href: '#events' },
  { label: 'Télécharger!', href: '#download' },
  { label: 'À propos!', href: '#about' },
  { label: 'Contact!', href: '#contact' }
]

export default function MarketingHeader() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <Box as="header" position="fixed" top={0} left={0} right={0} zIndex={100} bg="white"
      boxShadow={isScrolled ? '0 2px 16px rgba(0,0,0,0.06)' : '0 1px 0 #e2e8f0'} transition="box-shadow 0.2s">
      <Container maxW="container.xl" py={2}>
        <Flex align="center" justify="space-between">
          {/* Logo */}
          <Link href="/" _hover={{ textDecoration: 'none' }}>
            <Flex align="center" gap={2}>
              <Box w="10" h="10" bgGradient="linear(to-br, orange.500, orange.400)" borderRadius="xl" display="flex" alignItems="center" justifyContent="center" boxShadow="lg">
                <Text fontWeight="bold" color="white" fontSize="2xl">K</Text>
              </Box>
              <VStack spacing={0} align="flex-start">
                <Text fontWeight="bold" fontSize="2xl" bgGradient="linear(to-br, orange.500, blue.600)" bgClip="text">KomOn</Text>
                <Text fontWeight="bold" fontSize="lg" color="orange.500" lineHeight={0.8}>!</Text>
              </VStack>
            </Flex>
          </Link>
          {/* Navigation desktop */}
          <HStack as="nav" spacing={6} display={{ base: 'none', md: 'flex' }}>
            {NAV_ITEMS.map((item) => (
              <Link key={item.label} href={item.href} fontWeight="600" color="gray.700" fontSize="md" px={3} py={2}
                borderRadius="lg" _hover={{ bg: 'orange.50', color: 'orange.500', transform: 'translateY(-1px)', boxShadow: 'md' }} transition="all 0.2s">
                {item.label}
              </Link>
            ))}
          </HStack>
          {/* CTA Button */}
          <HStack spacing={3} display={{ base: 'none', md: 'flex' }}>
            <Link href="#download" _hover={{ textDecoration: 'none' }}>
              <Box
                bgGradient="linear(to-r, orange.500, orange.400)"
                _hover={{ bgGradient: 'linear(to-r, orange.600, orange.500)', transform: 'translateY(-1px)', boxShadow: 'lg' }}
                px={6}
                py={2}
                borderRadius="full"
                fontWeight="bold"
                color="white"
                transition="all 0.2s"
                cursor="pointer"
              >
                Télécharger!
              </Box>
            </Link>
          </HStack>
          {/* Menu mobile */}
          <IconButton aria-label="Ouvrir le menu" icon={<HamburgerIcon boxSize={6} />} display={{ base: 'flex', md: 'none' }}
            variant="ghost" onClick={onOpen} colorScheme="orange" />
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
                <Link key={item.label} href={item.href} fontWeight="600" color="gray.700" fontSize="lg" px={3} py={3}
                  borderRadius="lg" _hover={{ bg: 'orange.50', color: 'orange.500', textDecoration: 'none' }} transition="all 0.2s" onClick={onClose}>
                  {item.label}
                </Link>
              ))}
              <Link href="#download" _hover={{ textDecoration: 'none' }} onClick={onClose}>
                <Box
                  bgGradient="linear(to-r, orange.500, orange.400)"
                  _hover={{ bgGradient: 'linear(to-r, orange.600, orange.500)' }}
                  py={3}
                  px={6}
                  borderRadius="full"
                  w="full"
                  fontWeight="bold"
                  color="white"
                  textAlign="center"
                  transition="all 0.2s"
                  cursor="pointer"
                >
                  Télécharger!
                </Box>
              </Link>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
} 