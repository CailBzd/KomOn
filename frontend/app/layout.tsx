import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Box } from '@chakra-ui/react'
import { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KomOn! - Come On, Let\'s Move Together!',
  description: 'Rejoins la communauté énergique de sportifs et d\'événements qui te poussent à bouger! Découvre et participe aux événements sportifs de ta région!',
  keywords: 'sport, événements, local, communauté, fitness, activités, motivation, bouger, KomOn',
  authors: [{ name: 'KomOn! Team' }],
  openGraph: {
    title: 'KomOn! - Come On, Let\'s Move Together!',
    description: 'Rejoins la communauté énergique de sportifs et d\'événements qui te poussent à bouger!',
    url: 'https://komon.fr',
    siteName: 'KomOn!',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'KomOn! - Come On, Let\'s Move Together!',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KomOn! - Come On, Let\'s Move Together!',
    description: 'Rejoins la communauté énergique de sportifs et d\'événements qui te poussent à bouger!',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          <Header />
          <Box as="main" pt="70px" minH="100vh" bg="gray.50">
            {children}
          </Box>
          <Footer />
        </Providers>
      </body>
    </html>
  )
} 