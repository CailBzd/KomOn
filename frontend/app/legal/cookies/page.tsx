import { Box, Heading, Text, VStack } from '@chakra-ui/react'

export default function Cookies() {
  return (
    <Box maxW="3xl" mx="auto" py={8} px={4}>
      <VStack align="start" spacing={6}>
        <Heading as="h1" size="lg">Politique de cookies</Heading>
        <Text>KomOn! utilise des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu. Vous pouvez gérer vos préférences dans les paramètres de votre navigateur.</Text>
        <Heading as="h2" size="md">1. Qu'est-ce qu'un cookie ?</Heading>
        <Text>Un cookie est un petit fichier texte stocké sur votre appareil lors de la visite d'un site web.</Text>
        <Heading as="h2" size="md">2. Utilisation des cookies</Heading>
        <Text>Nous utilisons des cookies pour :<br/>- Mémoriser vos préférences<br/>- Analyser l'audience<br/>- Améliorer la sécurité<br/>- Optimiser les performances</Text>
        <Heading as="h2" size="md">3. Gestion des cookies</Heading>
        <Text>Vous pouvez désactiver les cookies dans les paramètres de votre navigateur, mais certaines fonctionnalités du site pourraient ne plus fonctionner correctement.</Text>
      </VStack>
    </Box>
  )
} 