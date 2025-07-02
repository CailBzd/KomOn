import { Box, Container, Flex, HStack, VStack, Link, Text, SimpleGrid } from '@chakra-ui/react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <Box as="footer" bg="gray.900" color="gray.100" py={10} mt={16}>
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mb={6}>
          {/* Logo + description */}
          <VStack align="start" spacing={3}>
            <Flex align="center" gap={2}>
              <Box w="8" h="8" bgGradient="linear(to-br, teal.400, teal.200)" borderRadius="lg" display="flex" alignItems="center" justifyContent="center">
                <Text fontWeight="bold" color="white" fontSize="xl">K</Text>
              </Box>
              <Text fontWeight="bold" fontSize="xl" bgGradient="linear(to-br, teal.400, teal.200)" bgClip="text">KomOn</Text>
            </Flex>
            <Text fontSize="sm" color="gray.400">Plateforme d'organisation d'événements sportifs locaux.</Text>
          </VStack>

          {/* Navigation */}
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold" mb={1}>Navigation</Text>
            <Link href="/" color="gray.300" _hover={{ color: 'teal.200' }}>Accueil</Link>
            <Link href="/events" color="gray.300" _hover={{ color: 'teal.200' }}>Événements</Link>
            <Link href="/sports" color="gray.300" _hover={{ color: 'teal.200' }}>Sports</Link>
            <Link href="/about" color="gray.300" _hover={{ color: 'teal.200' }}>À propos</Link>
            <Link href="/contact" color="gray.300" _hover={{ color: 'teal.200' }}>Contact</Link>
          </VStack>

          {/* Légal */}
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold" mb={1}>Légal</Text>
            <Link href="/legal/politique-confidentialite" color="gray.300" _hover={{ color: 'teal.200' }}>Politique de confidentialité</Link>
            <Link href="/legal/cookies" color="gray.300" _hover={{ color: 'teal.200' }}>Cookies</Link>
            <Link href="/legal/cgu" color="gray.300" _hover={{ color: 'teal.200' }}>CGU</Link>
            <Link href="/legal/cgv" color="gray.300" _hover={{ color: 'teal.200' }}>CGV</Link>
            <Link href="/legal/mentions-legales" color="gray.300" _hover={{ color: 'teal.200' }}>Mentions légales</Link>
          </VStack>
        </SimpleGrid>
        <Flex justify="center" align="center" borderTop="1px solid" borderColor="gray.700" pt={6}>
          <Text fontSize="sm" color="gray.500">© {currentYear} KomOn — Pitou software. Tous droits réservés.</Text>
        </Flex>
      </Container>
    </Box>
  )
} 