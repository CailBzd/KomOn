'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  HStack,
  VStack,
  Image,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react'
import { ArrowRight, Play, Users, Calendar, MapPin } from 'lucide-react'

export function Hero() {
  const bgGradient = useColorModeValue(
    'linear(to-br, pastel.blue, pastel.indigo)',
    'linear(to-br, gray.900, gray.800)'
  )

  return (
    <Box
      bgGradient={bgGradient}
      minH="100vh"
      display="flex"
      alignItems="center"
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
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          spacing={{ base: '8', lg: '12' }}
          align="center"
          justify="space-between"
        >
          {/* Content */}
          <VStack
            align={{ base: 'center', lg: 'flex-start' }}
            textAlign={{ base: 'center', lg: 'left' }}
            spacing="8"
            maxW={{ base: 'full', lg: '600px' }}
          >
            <VStack spacing="6" align={{ base: 'center', lg: 'flex-start' }}>
              <Box
                bg="white"
                color="accent.primary"
                px="4"
                py="2"
                borderRadius="full"
                fontSize="sm"
                fontWeight="semibold"
                boxShadow="md"
              >
                📱 Application mobile disponible
              </Box>

              <Heading
                as="h1"
                size="2xl"
                fontWeight="bold"
                lineHeight="1.2"
                color="gray.800"
              >
                Téléchargez l'app{' '}
                <Text
                  as="span"
                  bgGradient="linear(to-r, accent.primary, accent.secondary)"
                  bgClip="text"
                >
                  KomOn Mobile
                </Text>{' '}
                et rejoignez la communauté
              </Heading>

              <Text
                fontSize="xl"
                color="gray.600"
                maxW="500px"
                lineHeight="1.6"
              >
                L'application mobile vous permet de découvrir et participer aux événements sportifs 
                de votre région, directement depuis votre téléphone.
              </Text>
            </VStack>

            <HStack spacing="4" flexWrap="wrap" justify={{ base: 'center', lg: 'flex-start' }}>
              <Button
                size="lg"
                colorScheme="purple"
                bg="accent.primary"
                _hover={{ bg: 'accent.secondary' }}
                rightIcon={<ArrowRight size={20} />}
                px="8"
                py="6"
                fontSize="lg"
                fontWeight="semibold"
                borderRadius="xl"
                boxShadow="lg"
                _active={{ transform: 'scale(0.95)' }}
                onClick={() => window.open('https://play.google.com/store/apps/details?id=com.komon.mobile', '_blank')}
              >
                Télécharger sur Android
              </Button>

              <Button
                size="lg"
                variant="outline"
                leftIcon={<Play size={20} />}
                px="8"
                py="6"
                fontSize="lg"
                fontWeight="semibold"
                borderRadius="xl"
                borderColor="accent.primary"
                color="accent.primary"
                _hover={{ bg: 'pastel.indigo' }}
                onClick={() => window.open('https://apps.apple.com/app/komon-mobile/id123456789', '_blank')}
              >
                Télécharger sur iOS
              </Button>
            </HStack>

            {/* Stats */}
            <HStack
              spacing="8"
              pt="8"
              borderTop="1px solid"
              borderColor="gray.200"
              w="full"
              justify={{ base: 'center', lg: 'flex-start' }}
            >
              <VStack spacing="1">
                <HStack>
                  <Icon as={Users} color="accent.success" />
                  <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                    10K+
                  </Text>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  Sportifs actifs
                </Text>
              </VStack>

              <VStack spacing="1">
                <HStack>
                  <Icon as={Calendar} color="accent.warning" />
                  <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                    500+
                  </Text>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  Événements
                </Text>
              </VStack>

              <VStack spacing="1">
                <HStack>
                  <Icon as={MapPin} color="accent.error" />
                  <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                    50+
                  </Text>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  Villes
                </Text>
              </VStack>
            </HStack>
          </VStack>

          {/* Hero Image */}
          <Box
            position="relative"
            w={{ base: 'full', lg: '500px' }}
            h={{ base: '400px', lg: '600px' }}
          >
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bg="white"
              borderRadius="3xl"
              boxShadow="2xl"
              overflow="hidden"
              transform="rotate(3deg)"
            >
              <Image
                src="/hero-image.jpg"
                alt="Application mobile KomOn"
                w="full"
                h="full"
                objectFit="cover"
                fallback={
                  <Box
                    w="full"
                    h="full"
                    bgGradient="linear(to-br, pastel.green, pastel.teal)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <VStack spacing="4" color="gray.600">
                      <Box
                        w="20"
                        h="20"
                        bg="accent.primary"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={Users} color="white" size={32} />
                      </Box>
                      <Text fontSize="lg" fontWeight="semibold">
                        KomOn Mobile
                      </Text>
                      <Text fontSize="sm" textAlign="center">
                        Application mobile
                      </Text>
                    </VStack>
                  </Box>
                }
              />
            </Box>

            {/* Floating Cards */}
            <Box
              position="absolute"
              top="10%"
              right="-20px"
              bg="white"
              p="4"
              borderRadius="xl"
              boxShadow="lg"
              transform="rotate(-5deg)"
            >
              <VStack spacing="2" align="center">
                <Box
                  w="8"
                  h="8"
                  bg="accent.success"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={Calendar} color="white" size={16} />
                </Box>
                <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                  Match de foot
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Dimanche 14h
                </Text>
              </VStack>
            </Box>

            <Box
              position="absolute"
              bottom="20%"
              left="-20px"
              bg="white"
              p="4"
              borderRadius="xl"
              boxShadow="lg"
              transform="rotate(5deg)"
            >
              <VStack spacing="2" align="center">
                <Box
                  w="8"
                  h="8"
                  bg="accent.warning"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={MapPin} color="white" size={16} />
                </Box>
                <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                  Tennis Club
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Centre-ville
                </Text>
              </VStack>
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
} 