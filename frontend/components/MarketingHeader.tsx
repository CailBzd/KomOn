'use client'

import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  Container,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { ArrowRight } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Accueil', href: '/' },
  { label: 'Fonctionnalités', href: '#features' },
  { label: 'Télécharger', href: '#download' },
  { label: 'À propos', href: '#about' },
  { label: 'Contact', href: '#contact' }
]

export default function MarketingHeader() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box
      as="header"
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="1000"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      backdropFilter="blur(10px)"
      bg="rgba(255, 255, 255, 0.95)"
    >
      <Container maxW="container.xl">
        <Flex h="16" alignItems="center" justify="space-between">
          {/* Logo */}
          <Flex alignItems="center">
            <Text
              fontSize="2xl"
              fontWeight="bold"
              bgGradient="linear(to-r, accent.primary, accent.secondary)"
              bgClip="text"
            >
              KomOn
            </Text>
          </Flex>

          {/* Desktop Navigation */}
          <HStack spacing="8" display={{ base: 'none', md: 'flex' }}>
            {NAV_ITEMS.map((item) => (
              <Text
                key={item.label}
                as="a"
                href={item.href}
                fontSize="sm"
                fontWeight="medium"
                color="gray.600"
                _hover={{ color: 'accent.primary' }}
                transition="color 0.2s"
              >
                {item.label}
              </Text>
            ))}
          </HStack>

          {/* CTA Button */}
          <HStack spacing="4" display={{ base: 'none', md: 'flex' }}>
            <Button
              size="sm"
              colorScheme="purple"
              bg="accent.primary"
              _hover={{ bg: 'accent.secondary' }}
              rightIcon={<ArrowRight size={16} />}
              onClick={() => window.open('https://play.google.com/store/apps/details?id=com.komon.mobile', '_blank')}
            >
              Télécharger
            </Button>
          </HStack>

          {/* Mobile menu button */}
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
            icon={<HamburgerIcon />}
            variant="ghost"
            aria-label="Open menu"
          />
        </Flex>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody pt="16">
            <VStack spacing="4" align="stretch">
              {NAV_ITEMS.map((item) => (
                <Text
                  key={item.label}
                  as="a"
                  href={item.href}
                  fontSize="lg"
                  fontWeight="medium"
                  color="gray.600"
                  _hover={{ color: 'accent.primary' }}
                  transition="color 0.2s"
                  onClick={onClose}
                >
                  {item.label}
                </Text>
              ))}
              <Button
                mt="4"
                colorScheme="purple"
                bg="accent.primary"
                _hover={{ bg: 'accent.secondary' }}
                rightIcon={<ArrowRight size={16} />}
                onClick={() => {
                  window.open('https://play.google.com/store/apps/details?id=com.komon.mobile', '_blank')
                  onClose()
                }}
              >
                Télécharger l'app
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
} 