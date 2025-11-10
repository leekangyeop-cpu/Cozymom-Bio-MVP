import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Cozymom BIO - 건강기능식품 AI 배합 최적화',
  description: 'AI-Powered Health Functional Food Ingredient & Formulation Compliance Checker for MFDS Standards',
  keywords: ['건강기능식품', 'MFDS', '식약처', '배합 검증', 'AI', '원료 최적화'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
