'use client'

import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Select,
  IconButton,
  useToast,
  SimpleGrid,
  Card,
  CardBody,
  Heading,
  Icon,
  Tooltip
} from '@chakra-ui/react'
import { CloseIcon, AddIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import { 
  FaFutbol, 
  FaRunning, 
  FaBasketballBall, 
  FaVolleyballBall,
  FaTableTennis,
  FaHiking,
  FaBicycle,
  FaDumbbell
} from 'react-icons/fa'
import { GiTennisRacket, GiSwimfins } from 'react-icons/gi'

// Sports prédéfinis avec icônes
const AVAILABLE_SPORTS = [
  { id: 'football', name: 'Football', icon: FaFutbol, color: 'green' },
  { id: 'tennis', name: 'Tennis', icon: GiTennisRacket, color: 'yellow' },
  { id: 'running', name: 'Running', icon: FaRunning, color: 'blue' },
  { id: 'basketball', name: 'Basketball', icon: FaBasketballBall, color: 'orange' },
  { id: 'swimming', name: 'Natation', icon: GiSwimfins, color: 'cyan' },
  { id: 'volleyball', name: 'Volleyball', icon: FaVolleyballBall, color: 'purple' },
  { id: 'ping-pong', name: 'Ping-pong', icon: FaTableTennis, color: 'red' },
  { id: 'hiking', name: 'Randonnée', icon: FaHiking, color: 'teal' },
  { id: 'cycling', name: 'Cyclisme', icon: FaBicycle, color: 'pink' },
  { id: 'fitness', name: 'Fitness', icon: FaDumbbell, color: 'gray' }
]

const SKILL_LEVELS = [
  { value: 'beginner', label: 'Débutant' },
  { value: 'intermediate', label: 'Intermédiaire' },
  { value: 'advanced', label: 'Avancé' },
  { value: 'expert', label: 'Expert' }
]

interface SelectedSport {
  id: string
  name: string
  icon: any
  color: string
  level?: string
}

interface SportSelectionProps {
  selectedSports: SelectedSport[]
  onSportsChange: (sports: SelectedSport[]) => void
  maxSports?: number
}

export default function SportSelection({ 
  selectedSports, 
  onSportsChange, 
  maxSports = 5 
}: SportSelectionProps) {
  const [showAllSports, setShowAllSports] = useState(false)
  const toast = useToast()

  const availableSports = AVAILABLE_SPORTS.filter(
    sport => !selectedSports.find(selected => selected.id === sport.id)
  )

  const handleAddSport = (sport: typeof AVAILABLE_SPORTS[0]) => {
    if (selectedSports.length >= maxSports) {
      toast({
        title: 'Limite atteinte',
        description: `Vous ne pouvez sélectionner que ${maxSports} sports maximum.`,
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    const newSport: SelectedSport = {
      id: sport.id,
      name: sport.name,
      icon: sport.icon,
      color: sport.color
    }

    onSportsChange([...selectedSports, newSport])
  }

  const handleRemoveSport = (sportId: string) => {
    onSportsChange(selectedSports.filter(sport => sport.id !== sportId))
  }

  const handleLevelChange = (sportId: string, level: string) => {
    onSportsChange(
      selectedSports.map(sport =>
        sport.id === sportId ? { ...sport, level } : sport
      )
    )
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'green'
      case 'intermediate': return 'blue'
      case 'advanced': return 'orange'
      case 'expert': return 'red'
      default: return 'gray'
    }
  }

  return (
    <VStack spacing={6} align="stretch" w="full">
      {/* Header */}
      <VStack spacing={2} align="stretch">
        <Heading size="md" color="gray.700">
          Sports d'intérêt
        </Heading>
        <Text fontSize="sm" color="gray.500">
          Sélectionnez jusqu'à {maxSports} sports qui vous intéressent. 
          Vous pourrez indiquer votre niveau pour chaque sport (optionnel).
        </Text>
        <Text fontSize="sm" color="gray.400">
          {selectedSports.length}/{maxSports} sports sélectionnés
        </Text>
      </VStack>

      {/* Selected Sports */}
      {selectedSports.length > 0 && (
        <VStack spacing={3} align="stretch">
          <Text fontWeight="semibold" color="gray.700">
            Sports sélectionnés :
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
            {selectedSports.map((sport) => (
              <Card key={sport.id} size="sm" variant="outline">
                <CardBody>
                  <HStack justify="space-between" align="center">
                    <HStack spacing={3}>
                      <Icon
                        as={sport.icon}
                        boxSize={6}
                        color={`${sport.color}.500`}
                      />
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold" fontSize="sm">
                          {sport.name}
                        </Text>
                        {sport.level && (
                          <Badge
                            colorScheme={getLevelColor(sport.level)}
                            variant="subtle"
                            size="sm"
                          >
                            {SKILL_LEVELS.find(l => l.value === sport.level)?.label}
                          </Badge>
                        )}
                      </VStack>
                    </HStack>
                    
                    <HStack spacing={2}>
                      <Select
                        size="sm"
                        placeholder="Niveau"
                        value={sport.level || ''}
                        onChange={(e) => handleLevelChange(sport.id, e.target.value)}
                        w="auto"
                        minW="120px"
                      >
                        {SKILL_LEVELS.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </Select>
                      
                      <Tooltip label="Retirer ce sport">
                        <IconButton
                          aria-label="Retirer ce sport"
                          icon={<CloseIcon />}
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleRemoveSport(sport.id)}
                        />
                      </Tooltip>
                    </HStack>
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      )}

      {/* Available Sports */}
      {availableSports.length > 0 && (
        <VStack spacing={3} align="stretch">
          <HStack justify="space-between" align="center">
            <Text fontWeight="semibold" color="gray.700">
              Sports disponibles :
            </Text>
            {availableSports.length > 6 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowAllSports(!showAllSports)}
              >
                {showAllSports ? 'Voir moins' : 'Voir tous'}
              </Button>
            )}
          </HStack>
          
          <SimpleGrid 
            columns={{ base: 2, md: 3, lg: 5 }} 
            spacing={3}
          >
            {(showAllSports ? availableSports : availableSports.slice(0, 6)).map((sport) => (
              <Tooltip key={sport.id} label={`Ajouter ${sport.name}`}>
                <Button
                  variant="outline"
                  size="sm"
                  h="auto"
                  p={3}
                  onClick={() => handleAddSport(sport)}
                  _hover={{ 
                    bg: `${sport.color}.50`, 
                    borderColor: `${sport.color}.300` 
                  }}
                  transition="all 0.2s"
                >
                  <VStack spacing={2}>
                    <Icon
                      as={sport.icon}
                      boxSize={5}
                      color={`${sport.color}.500`}
                    />
                    <Text fontSize="xs" fontWeight="medium">
                      {sport.name}
                    </Text>
                  </VStack>
                </Button>
              </Tooltip>
            ))}
          </SimpleGrid>
          
          {!showAllSports && availableSports.length > 6 && (
            <Text fontSize="sm" color="gray.500" textAlign="center">
              +{availableSports.length - 6} autres sports disponibles
            </Text>
          )}
        </VStack>
      )}

      {/* Empty State */}
      {availableSports.length === 0 && selectedSports.length === 0 && (
        <Box textAlign="center" py={8}>
          <Text color="gray.500">Aucun sport disponible</Text>
        </Box>
      )}
    </VStack>
  )
} 