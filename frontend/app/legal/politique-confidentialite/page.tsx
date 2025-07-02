import { Box, Heading, Text, VStack } from '@chakra-ui/react'

export default function PolitiqueConfidentialite() {
  return (
    <Box maxW="3xl" mx="auto" py={8} px={4}>
      <VStack align="start" spacing={6}>
        <Heading as="h1" size="lg">Politique de confidentialité</Heading>
        <Text>Votre vie privée est importante pour nous. Cette politique explique comment KomOn collecte, utilise et protège vos données personnelles conformément au RGPD.</Text>
        <Heading as="h2" size="md">1. Données collectées</Heading>
        <Text>Nous collectons uniquement les données nécessaires à la gestion de votre compte, à l'organisation d'événements et à l'amélioration de nos services.</Text>
        <Heading as="h2" size="md">2. Utilisation des données</Heading>
        <Text>Vos données sont utilisées pour :<br/>- Créer et gérer votre compte<br/>- Organiser et promouvoir des événements<br/>- Améliorer l'expérience utilisateur<br/>- Respecter nos obligations légales</Text>
        <Heading as="h2" size="md">3. Partage des données</Heading>
        <Text>Nous ne partageons jamais vos données avec des tiers sans votre consentement, sauf obligation légale.</Text>
        <Heading as="h2" size="md">4. Sécurité</Heading>
        <Text>Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données.</Text>
        <Heading as="h2" size="md">5. Vos droits</Heading>
        <Text>Vous pouvez accéder, rectifier ou supprimer vos données à tout moment en nous contactant à privacy@komon.app.</Text>
      </VStack>
    </Box>
  )
} 