'use client'

import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  Link,
  Container,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  VStack,
  useDisclosure,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Badge,
  useToast
} from '@chakra-ui/react'
import { HamburgerIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/api/auth'
import { useRouter } from 'next/navigation'
import MinimalConnectedHeader from './MinimalConnectedHeader'
import UnAuthenticatedHeader from './UnAuthenticatedHeader'

const NAV_ITEMS = [
  { label: 'Accueil', href: '/' },
  { label: 'Événements', href: '/events' },
  { label: 'Sports', href: '/sports' },
  { label: 'Crédits', href: '/credits' },
  { label: 'À propos', href: '/about' },
  { label: 'Contact', href: '/contact' }
]

export default function Header() {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  return isAuthenticated ? <MinimalConnectedHeader /> : <UnAuthenticatedHeader />
} 