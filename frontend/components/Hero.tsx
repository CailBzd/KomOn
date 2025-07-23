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
    'linear(to-br, orange.400, blue.600)',
    'linear(to-br, orange.500, blue.700)'
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
                color="orange.500"
                px="4"
                py="2"
                borderRadius="full"
                fontSize="sm"
                fontWeight="bold"
                boxShadow="lg"
                border="2px solid"
                borderColor="orange.300"
              >
                🚀 Prêt à bouger? KomOn!
              </Box>

              <Heading
                as="h1"
                size="2xl"
                fontWeight="bold"
                lineHeight="1.2"
                color="white"
              >
                Come On,{' '}
                <Text
                  as="span"
                  bgGradient="linear(to-r, white, orange.200)"
                  bgClip="text"
                  fontSize="3xl"
                  fontWeight="extrabold"
                >
                  Let's Move Together!
                </Text>
              </Heading>

              <Text
                fontSize="xl"
                color="white"
                maxW="500px"
                lineHeight="1.6"
                fontWeight="medium"
              >
                Rejoins la communauté énergique de sportifs et d'événements qui te poussent à bouger! 
                Découvre et participe aux événements sportifs de ta région!
              </Text>
            </VStack>

            <HStack spacing="4" flexWrap="wrap" justify={{ base: 'center', lg: 'flex-start' }}>
              <Button
                size="lg"
                colorScheme="orange"
                bg="orange.500"
                _hover={{ bg: 'orange.600', transform: 'translateY(-2px)' }}
                _active={{ bg: 'orange.700' }}
                px="8"
                py="4"
                fontSize="lg"
                fontWeight="bold"
                borderRadius="xl"
                boxShadow="xl"
                transition="all 0.3s"
                rightIcon={<ArrowRight />}
              >
                Rejoins-nous!
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                color="white"
                borderColor="white"
                _hover={{ bg: 'whiteAlpha.200', transform: 'translateY(-2px)' }}
                px="8"
                py="4"
                fontSize="lg"
                fontWeight="bold"
                borderRadius="xl"
                transition="all 0.3s"
                leftIcon={<Play />}
              >
                Voir la démo!
              </Button>
            </HStack>

            {/* Stats */}
            <HStack spacing="8" pt="8" flexWrap="wrap" justify={{ base: 'center', lg: 'flex-start' }}>
              <VStack spacing="2">
                <HStack>
                  <Icon as={Users} color="orange.200" boxSize="6" />
                  <Text color="white" fontSize="2xl" fontWeight="bold">
                    1,000+
                  </Text>
                </HStack>
                <Text color="orange.100" fontSize="sm" fontWeight="medium">
                  Sportifs actifs!
                </Text>
              </VStack>

              <VStack spacing="2">
                <HStack>
                  <Icon as={Calendar} color="orange.200" boxSize="6" />
                  <Text color="white" fontSize="2xl" fontWeight="bold">
                    500+
                  </Text>
                </HStack>
                <Text color="orange.100" fontSize="sm" fontWeight="medium">
                  Événements créés!
                </Text>
              </VStack>

              <VStack spacing="2">
                <HStack>
                  <Icon as={MapPin} color="orange.200" boxSize="6" />
                  <Text color="white" fontSize="2xl" fontWeight="bold">
                    50+
                  </Text>
                </HStack>
                <Text color="orange.100" fontSize="sm" fontWeight="medium">
                  Villes couvertes!
                </Text>
              </VStack>
            </HStack>
          </VStack>

          {/* Mobile App Preview */}
          <Box
            position="relative"
            display={{ base: 'none', lg: 'block' }}
            animation="float 6s ease-in-out infinite"
          >
            <Box
              position="relative"
              w="300px"
              h="600px"
              bg="white"
              borderRadius="3xl"
              boxShadow="2xl"
              p="4"
              border="8px solid"
              borderColor="gray.800"
            >
              {/* App Screen Content */}
              <Box
                bg="orange.500"
                h="60px"
                borderRadius="xl"
                mb="4"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="white" fontSize="xl" fontWeight="bold">
                  KomOn!
                </Text>
              </Box>
              
              <VStack spacing="3" align="stretch">
                <Box bg="gray.100" h="80px" borderRadius="lg" p="3">
                  <Text fontSize="sm" fontWeight="bold" color="gray.800">
                    🏃‍♂️ Course du dimanche!
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    Rejoins-nous pour 10km!
                  </Text>
                </Box>
                
                <Box bg="gray.100" h="80px" borderRadius="lg" p="3">
                  <Text fontSize="sm" fontWeight="bold" color="gray.800">
                    ⚽ Match de foot!
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    Équipe locale vs visiteurs!
                  </Text>
                </Box>
                
                <Box bg="gray.100" h="80px" borderRadius="lg" p="3">
                  <Text fontSize="sm" fontWeight="bold" color="gray.800">
                    🏋️‍♂️ Gym en groupe!
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    Séance intensive!
                  </Text>
                </Box>
              </VStack>
            </Box>
          </Box>
        </Stack>
      </Container>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </Box>
  )
} 