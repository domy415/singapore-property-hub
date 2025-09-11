import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comprehensive Condo Reviews | Singapore Property Hub',
  description: 'Professional analysis of Singapore\'s condominium developments with our 5-star rating system. Expert reviews and detailed property assessments.',
  alternates: {
    canonical: 'https://singaporepropertyhub.sg/condos',
  },
}

export default function CondosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}