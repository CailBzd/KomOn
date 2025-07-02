import { Box, Heading, Text, VStack } from '@chakra-ui/react'

export default function CGU() {
  return (
    <Box maxW="3xl" mx="auto" py={8} px={4}>
      <VStack align="start" spacing={6}>
        <Heading as="h1" size="lg">Conditions Générales d'Utilisation (CGU)</Heading>
        <Text>Les présentes CGU régissent l'utilisation de la plateforme KomOn. En utilisant le site, vous acceptez ces conditions.</Text>
        <Heading as="h2" size="md">1. Objet</Heading>
        <Text>KomOn permet l'organisation et la participation à des événements sportifs locaux.</Text>
        <Heading as="h2" size="md">2. Inscription</Heading>
        <Text>L'inscription est gratuite. Vous devez fournir des informations exactes et à jour.</Text>
        <Heading as="h2" size="md">3. Responsabilités</Heading>
        <Text>Vous êtes responsable de vos actions sur la plateforme. KomOn ne saurait être tenu responsable des litiges entre utilisateurs.</Text>
        <Heading as="h2" size="md">4. Propriété intellectuelle</Heading>
        <Text>Le contenu de KomOn est protégé par le droit d'auteur. Toute reproduction est interdite sans autorisation.</Text>
        <Heading as="h2" size="md">5. Résiliation</Heading>
        <Text>KomOn se réserve le droit de suspendre ou supprimer un compte en cas de non-respect des CGU.</Text>
      </VStack>
    </Box>
  )
} 