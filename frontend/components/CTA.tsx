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
    'linear(to-br, pastel.green, pastel.teal)',
    'linear(to-br, gray.800, gray.900)'
  )

  return (
    <Box
      bgGradient={bgGradient}
      py="20"
      position="relative"
      overflow="hidden"
    >
      {/* Background Pattern */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity="0.1"
        backgroundImage="url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
      />

      <Container maxW="container.xl" position="relative" zIndex="1">
        <VStack spacing="12" textAlign="center">
          {/* Main Content */}
          <VStack spacing="8" maxW="4xl">
            <Heading
              as="h2"
              size="2xl"
              fontWeight="bold"
              color="gray.800"
            >
              Prêt à rejoindre la{' '}
              <Text
                as="span"
                bgGradient="linear(to-r, accent.primary, accent.secondary)"
                bgClip="text"
              >
                communauté sportive
              </Text>{' '}
              de votre région ?
            </Heading>

            <Text
              fontSize="xl"
              color="gray.600"
              maxW="2xl"
              lineHeight="1.6"
            >
              Téléchargez l'application mobile ou créez votre compte web pour 
              commencer à découvrir et participer aux événements sportifs locaux dès aujourd'hui.
            </Text>

            <HStack
              spacing="6"
              flexWrap="wrap"
              justify="center"
            >
              <Button
                size="lg"
                bg="accent.primary"
                color="white"
                _hover={{ bg: 'accent.secondary' }}
                rightIcon={<ArrowRight size={20} />}
                px="8"
                py="6"
                fontSize="lg"
                fontWeight="semibold"
                borderRadius="xl"
                boxShadow="lg"
                _active={{ transform: 'scale(0.95)' }}
              >
                Créer un compte
              </Button>

              <Button
                size="lg"
                variant="outline"
                leftIcon={<Download size={20} />}
                px="8"
                py="6"
                fontSize="lg"
                fontWeight="semibold"
                borderRadius="xl"
                borderColor="accent.primary"
                color="accent.primary"
                bg="white"
                _hover={{ bg: 'pastel.indigo' }}
              >
                Télécharger l'app
              </Button>
            </HStack>
          </VStack>

          {/* Features Preview */}
          <VStack spacing="8" w="full">
            <Text
              fontSize="lg"
              color="gray.600"
              fontWeight="medium"
            >
              Disponible sur toutes les plateformes
            </Text>

            <HStack
              spacing="8"
              justify="center"
              flexWrap="wrap"
            >
              <Box
                bg="white"
                p="6"
                borderRadius="2xl"
                boxShadow="lg"
                textAlign="center"
                minW="200px"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: 'xl',
                }}
              >
                <VStack spacing="4">
                  <Box
                    w="12"
                    h="12"
                    bg="pastel.blue"
                    borderRadius="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Smartphone color="accent.primary" size={24} />
                  </Box>
                  <VStack spacing="2">
                    <Text
                      fontSize="lg"
                      fontWeight="semibold"
                      color="gray.800"
                    >
                      Application Mobile
                    </Text>
                    <Text
                      fontSize="sm"
                      color="gray.600"
                    >
                      iOS et Android
                    </Text>
                  </VStack>
                </VStack>
              </Box>

              <Box
                bg="white"
                p="6"
                borderRadius="2xl"
                boxShadow="lg"
                textAlign="center"
                minW="200px"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: 'xl',
                }}
              >
                <VStack spacing="4">
                  <Box
                    w="12"
                    h="12"
                    bg="pastel.green"
                    borderRadius="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Download color="accent.success" size={24} />
                  </Box>
                  <VStack spacing="2">
                    <Text
                      fontSize="lg"
                      fontWeight="semibold"
                      color="gray.800"
                    >
                      Version Web
                    </Text>
                    <Text
                      fontSize="sm"
                      color="gray.600"
                    >
                      Tous navigateurs
                    </Text>
                  </VStack>
                </VStack>
              </Box>
            </HStack>
          </VStack>

          {/* Final CTA */}
          <Box
            bg="white"
            p="8"
            borderRadius="2xl"
            boxShadow="lg"
            textAlign="center"
            maxW="2xl"
            w="full"
          >
            <VStack spacing="6">
              <Heading
                as="h3"
                size="lg"
                fontWeight="semibold"
                color="gray.800"
              >
                Commencez gratuitement dès aujourd'hui
              </Heading>

              <Text
                color="gray.600"
                fontSize="lg"
                lineHeight="1.6"
              >
                Rejoignez des milliers de sportifs qui utilisent déjà KomOn 
                pour découvrir et participer aux événements de leur région.
              </Text>

              <Button
                size="lg"
                bg="accent.primary"
                color="white"
                _hover={{ bg: 'accent.secondary' }}
                px="8"
                py="6"
                fontSize="lg"
                fontWeight="semibold"
                borderRadius="xl"
                boxShadow="lg"
                _active={{ transform: 'scale(0.95)' }}
              >
                Commencer maintenant
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
} 