import { Box, Heading, Text, VStack } from '@chakra-ui/react'

export default function MentionsLegales() {
  return (
    <Box maxW="3xl" mx="auto" py={8} px={4}>
      <VStack align="start" spacing={6}>
        <Heading as="h1" size="lg">Mentions légales</Heading>
        <Text>Éditeur : Pitou software<br/>Responsable de publication : Pitou software<br/>Contact : contact@komon.app</Text>
        <Heading as="h2" size="md">Hébergement</Heading>
        <Text>Scaleway, 8 rue de la Ville l'Évêque, 75008 Paris, France</Text>
        <Heading as="h2" size="md">Propriété intellectuelle</Heading>
        <Text>Tous les contenus présents sur KomOn sont protégés par le droit d'auteur.</Text>
      </VStack>
    </Box>
  )
} 