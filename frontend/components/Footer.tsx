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
              <Box w="10" h="10" bgGradient="linear(to-br, orange.500, orange.400)" borderRadius="xl" display="flex" alignItems="center" justifyContent="center" boxShadow="lg">
                <Text fontWeight="bold" color="white" fontSize="2xl">K</Text>
              </Box>
              <VStack spacing={0} align="flex-start">
                <Text fontWeight="bold" fontSize="2xl" bgGradient="linear(to-br, orange.500, blue.600)" bgClip="text">KomOn</Text>
                <Text fontWeight="bold" fontSize="lg" color="orange.500" lineHeight={0.8}>!</Text>
              </VStack>
            </Flex>
            <Text fontSize="sm" color="gray.400">Come On, Let's Move Together! Rejoins la communauté énergique de sportifs et d'événements qui te poussent à bouger!</Text>
          </VStack>

          {/* Navigation */}
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold" mb={1}>Navigation</Text>
            <Link href="/" color="gray.300" _hover={{ color: 'orange.300' }}>Accueil</Link>
            <Link href="/events" color="gray.300" _hover={{ color: 'orange.300' }}>Événements!</Link>
            <Link href="/sports" color="gray.300" _hover={{ color: 'orange.300' }}>Sports!</Link>
            <Link href="/about" color="gray.300" _hover={{ color: 'orange.300' }}>À propos!</Link>
            <Link href="/contact" color="gray.300" _hover={{ color: 'orange.300' }}>Contact!</Link>
          </VStack>

          {/* Légal */}
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold" mb={1}>Légal</Text>
            <Link href="/legal/politique-confidentialite" color="gray.300" _hover={{ color: 'orange.300' }}>Politique de confidentialité</Link>
            <Link href="/legal/cookies" color="gray.300" _hover={{ color: 'orange.300' }}>Cookies</Link>
            <Link href="/legal/cgu" color="gray.300" _hover={{ color: 'orange.300' }}>CGU</Link>
            <Link href="/legal/cgv" color="gray.300" _hover={{ color: 'orange.300' }}>CGV</Link>
            <Link href="/legal/mentions-legales" color="gray.300" _hover={{ color: 'orange.300' }}>Mentions légales</Link>
          </VStack>
        </SimpleGrid>
        <Flex justify="center" align="center" borderTop="1px solid" borderColor="gray.700" pt={6}>
          <Text fontSize="sm" color="gray.500">© {currentYear} KomOn! — Pitou software. Tous droits réservés.</Text>
        </Flex>
      </Container>
    </Box>
  )
} 