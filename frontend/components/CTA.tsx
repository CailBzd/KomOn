'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  useColorModeValue,
} from '@chakra-ui/react'
import { ArrowRight, Download, Smartphone } from 'lucide-react'

export function CTA() {
  const bgGradient = useColorModeValue(
    'linear(to-br, orange.400, blue.600)',
    'linear(to-br, orange.500, blue.700)'
  )

  return (
    <Box
      bgGradient={bgGradient}
      py="20"
      position="relative"
      overflow="hidden"
    >
      {/* Background Pattern - Triangles dynamiques */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity="0.1"
        backgroundImage="url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpolygon points='30,5 55,45 5,45'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
      />

      <Container maxW="container.xl" position="relative" zIndex="1">
        <VStack spacing="12" textAlign="center">
          {/* Main Content */}
          <VStack spacing="8" maxW="4xl">
            <Heading
              as="h2"
              size="2xl"
              fontWeight="bold"
              color="white"
            >
              Prêt à bouger?{' '}
              <Text
                as="span"
                bgGradient="linear(to-r, white, orange.200)"
                bgClip="text"
                fontSize="3xl"
                fontWeight="extrabold"
              >
                KomOn!
              </Text>
            </Heading>

            <Text
              fontSize="xl"
              color="white"
              maxW="2xl"
              lineHeight="1.6"
              fontWeight="medium"
            >
              Rejoins la communauté énergique de sportifs et d'événements qui te poussent à bouger! 
              Télécharge l'application mobile KomOn! maintenant!
            </Text>

            <HStack
              spacing="6"
              flexWrap="wrap"
              justify="center"
            >
              <Button
                size="lg"
                bg="orange.500"
                color="white"
                _hover={{ bg: 'orange.600', transform: 'translateY(-2px)', boxShadow: 'xl' }}
                _active={{ bg: 'orange.700' }}
                rightIcon={<ArrowRight />}
                px="8"
                py="6"
                fontSize="lg"
                fontWeight="bold"
                borderRadius="xl"
                boxShadow="xl"
                transition="all 0.3s"
                onClick={() => window.open('https://play.google.com/store/apps/details?id=com.komon.mobile', '_blank')}
              >
                Télécharger sur Android!
              </Button>

              <Button
                size="lg"
                variant="outline"
                leftIcon={<Download />}
                px="8"
                py="6"
                fontSize="lg"
                fontWeight="bold"
                borderRadius="xl"
                borderColor="white"
                color="white"
                _hover={{ bg: 'whiteAlpha.200', transform: 'translateY(-2px)', boxShadow: 'lg' }}
                transition="all 0.3s"
                onClick={() => window.open('https://apps.apple.com/app/komon-mobile/id123456789', '_blank')}
              >
                Télécharger sur iOS!
              </Button>
            </HStack>
          </VStack>

          {/* Features */}
          <VStack spacing="8" maxW="4xl">
            <Text
              fontSize="lg"
              color="orange.100"
              fontWeight="semibold"
            >
              Pourquoi choisir KomOn!?
            </Text>

            <HStack
              spacing="8"
              flexWrap="wrap"
              justify="center"
            >
              <VStack spacing="3" minW="200px">
                <Box
                  w="16"
                  h="16"
                  bg="whiteAlpha.200"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  backdropFilter="blur(10px)"
                >
                  <Smartphone size={32} color="white" />
                </Box>
                <Text color="white" fontWeight="bold" fontSize="lg">
                  Application mobile!
                </Text>
                <Text color="orange.100" fontSize="sm" textAlign="center">
                  Accès facile depuis ton téléphone!
                </Text>
              </VStack>

              <VStack spacing="3" minW="200px">
                <Box
                  w="16"
                  h="16"
                  bg="whiteAlpha.200"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  backdropFilter="blur(10px)"
                >
                  <ArrowRight size={32} color="white" />
                </Box>
                <Text color="white" fontWeight="bold" fontSize="lg">
                  Événements locaux!
                </Text>
                <Text color="orange.100" fontSize="sm" textAlign="center">
                  Découvre les événements près de chez toi!
                </Text>
              </VStack>

              <VStack spacing="3" minW="200px">
                <Box
                  w="16"
                  h="16"
                  bg="whiteAlpha.200"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  backdropFilter="blur(10px)"
                >
                  <Download size={32} color="white" />
                </Box>
                <Text color="white" fontWeight="bold" fontSize="lg">
                  Communauté active!
                </Text>
                <Text color="orange.100" fontSize="sm" textAlign="center">
                  Rejoins des sportifs motivés!
                </Text>
              </VStack>
            </HStack>
          </VStack>

          {/* Final CTA */}
          <VStack spacing="6">
            <Text
              fontSize="2xl"
              color="white"
              fontWeight="bold"
            >
              Alors, prêt à bouger? KomOn!
            </Text>
            
            <Button
              size="lg"
              bg="white"
              color="orange.500"
              _hover={{ bg: 'orange.50', transform: 'translateY(-2px)', boxShadow: 'xl' }}
              _active={{ bg: 'orange.100' }}
              px="10"
              py="6"
              fontSize="xl"
              fontWeight="bold"
              borderRadius="xl"
              boxShadow="xl"
              transition="all 0.3s"
              onClick={() => window.open('https://play.google.com/store/apps/details?id=com.komon.mobile', '_blank')}
            >
              Rejoins-nous maintenant!
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
} 