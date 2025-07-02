import { Box, Heading, Text, VStack } from '@chakra-ui/react'

export default function CGV() {
  return (
    <Box maxW="3xl" mx="auto" py={8} px={4}>
      <VStack align="start" spacing={6}>
        <Heading as="h1" size="lg">Conditions Générales de Vente (CGV)</Heading>
        <Text>Les présentes CGV s'appliquent à toute transaction réalisée sur KomOn.</Text>
        <Heading as="h2" size="md">1. Objet</Heading>
        <Text>Les CGV définissent les modalités de vente de services ou produits via KomOn.</Text>
        <Heading as="h2" size="md">2. Prix et paiement</Heading>
        <Text>Les prix sont indiqués en euros. Le paiement s'effectue via Stripe de façon sécurisée.</Text>
        <Heading as="h2" size="md">3. Droit de rétractation</Heading>
        <Text>Conformément à la loi, vous disposez d'un droit de rétractation de 14 jours pour tout achat en ligne.</Text>
        <Heading as="h2" size="md">4. Litiges</Heading>
        <Text>En cas de litige, une solution amiable sera recherchée avant toute action judiciaire.</Text>
      </VStack>
    </Box>
  )
} 