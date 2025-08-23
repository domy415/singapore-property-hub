'use client'

import { HeroText, H1, H2, H3, H4, H5, H6, BodyText, BodyLarge, BodySmall, Caption, Text } from '@/components/design-system/Typography'
import { Container, Section, Card, Stack, Flex, Grid, Spacer, Divider } from '@/components/design-system/Layout'

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-light)]">
      {/* Header */}
      <Section background="navy" padding="lg">
        <HeroText className="text-white text-center">
          Singapore Property Hub Design System
        </HeroText>
        <BodyLarge className="text-white/90 text-center mt-4">
          Consistent typography, spacing, and layout components for our platform
        </BodyLarge>
      </Section>

      {/* Typography Section */}
      <Section padding="lg">
        <H2 className="mb-8">Typography Scale</H2>
        
        <Stack gap="lg">
          <Card padding="lg" shadow="md" border>
            <Stack gap="md">
              <H3>Responsive Typography</H3>
              <BodyText>
                Our typography uses clamp() functions to scale smoothly across all device sizes.
                All text maintains optimal readability with proper line-heights.
              </BodyText>
              
              <Divider />
              
              <div className="space-y-4">
                <div>
                  <Caption className="mb-2">Hero Text - clamp(2.5rem, 5vw, 4rem)</Caption>
                  <HeroText>Transform Your Property Dreams</HeroText>
                </div>
                
                <div>
                  <Caption className="mb-2">H1 - clamp(2rem, 4vw, 3rem)</Caption>
                  <H1>Premium Singapore Properties</H1>
                </div>
                
                <div>
                  <Caption className="mb-2">H2 - clamp(1.5rem, 3vw, 2.25rem)</Caption>
                  <H2>Market Insights & Analysis</H2>
                </div>
                
                <div>
                  <Caption className="mb-2">H3 - clamp(1.25rem, 2.5vw, 1.75rem)</Caption>
                  <H3>Investment Opportunities</H3>
                </div>
                
                <div>
                  <Caption className="mb-2">Body Text - 1.0625rem (17px)</Caption>
                  <BodyText>
                    This is our primary body text size at 17px with 1.5 line height for optimal readability. 
                    It provides comfortable reading experience across all devices while maintaining excellent 
                    accessibility standards.
                  </BodyText>
                </div>
                
                <div>
                  <Caption className="mb-2">Body Large - 1.125rem (18px)</Caption>
                  <BodyLarge>
                    Larger body text for important content that needs more emphasis and better readability.
                  </BodyLarge>
                </div>
                
                <div>
                  <Caption className="mb-2">Body Small - 0.9375rem (15px)</Caption>
                  <BodySmall>
                    Smaller text for secondary information, captions, and metadata.
                  </BodySmall>
                </div>
                
                <div>
                  <Caption className="mb-2">Caption - 0.875rem (14px)</Caption>
                  <Caption>
                    Caption text for image descriptions, form help text, and disclaimers.
                  </Caption>
                </div>
              </div>
            </Stack>
          </Card>
        </Stack>
      </Section>

      {/* Spacing Section */}
      <Section background="light" padding="lg">
        <H2 className="mb-8">Spacing System</H2>
        
        <Grid cols={1} responsive={{ lg: 2 }}>
          <Card padding="lg" shadow="md">
            <Stack gap="md">
              <H3>Section Padding</H3>
              <BodyText>Consistent 96px vertical padding for main sections</BodyText>
              
              <div className="bg-blue-100 p-4 rounded">
                <Caption className="text-blue-800">
                  .section class = 96px top & bottom padding
                </Caption>
              </div>
              
              <div className="bg-blue-50 p-2 rounded">
                <Caption className="text-blue-700">
                  .section-sm class = 48px padding
                </Caption>
              </div>
              
              <div className="bg-blue-200 p-6 rounded">
                <Caption className="text-blue-900">
                  .section-lg class = 144px padding
                </Caption>
              </div>
            </Stack>
          </Card>
          
          <Card padding="lg" shadow="md">
            <Stack gap="md">
              <H3>Card Padding</H3>
              <BodyText>Standard 24px internal padding for cards</BodyText>
              
              <div className="border-2 border-dashed border-gray-300">
                <Card padding="sm" className="bg-green-50">
                  <Caption className="text-green-800">Small card padding (18px)</Caption>
                </Card>
              </div>
              
              <div className="border-2 border-dashed border-gray-300">
                <Card padding="md" className="bg-blue-50">
                  <Caption className="text-blue-800">Default card padding (24px)</Caption>
                </Card>
              </div>
              
              <div className="border-2 border-dashed border-gray-300">
                <Card padding="lg" className="bg-purple-50">
                  <Caption className="text-purple-800">Large card padding (32px)</Caption>
                </Card>
              </div>
            </Stack>
          </Card>
        </Grid>
        
        <Spacer size="lg" />
        
        <Card padding="lg" shadow="md">
          <H3 className="mb-4">Element Spacing</H3>
          <BodyText className="mb-6">
            Consistent 16px gaps between related elements using our Stack component
          </BodyText>
          
          <Flex gap justify="between">
            <div className="flex-1">
              <H4 className="mb-4">Small Gap (8px)</H4>
              <Stack gap="sm">
                <div className="bg-gray-200 p-3 rounded">Item 1</div>
                <div className="bg-gray-200 p-3 rounded">Item 2</div>
                <div className="bg-gray-200 p-3 rounded">Item 3</div>
              </Stack>
            </div>
            
            <Divider orientation="vertical" className="mx-4" />
            
            <div className="flex-1">
              <H4 className="mb-4">Default Gap (16px)</H4>
              <Stack gap="md">
                <div className="bg-blue-200 p-3 rounded">Item 1</div>
                <div className="bg-blue-200 p-3 rounded">Item 2</div>
                <div className="bg-blue-200 p-3 rounded">Item 3</div>
              </Stack>
            </div>
            
            <Divider orientation="vertical" className="mx-4" />
            
            <div className="flex-1">
              <H4 className="mb-4">Large Gap (24px)</H4>
              <Stack gap="lg">
                <div className="bg-green-200 p-3 rounded">Item 1</div>
                <div className="bg-green-200 p-3 rounded">Item 2</div>
                <div className="bg-green-200 p-3 rounded">Item 3</div>
              </Stack>
            </div>
          </Flex>
        </Card>
      </Section>

      {/* Layout Components */}
      <Section padding="lg">
        <H2 className="mb-8">Layout Components</H2>
        
        <Stack gap="lg">
          <Card padding="lg" shadow="md">
            <H3 className="mb-4">Grid System</H3>
            <BodyText className="mb-6">
              Responsive grid with consistent gaps and flexible column counts
            </BodyText>
            
            <Grid cols={1} responsive={{ sm: 2, lg: 3 }}>
              <Card padding="md" className="bg-red-50" border>
                <H4>Column 1</H4>
                <BodySmall>1 col on mobile, 2 on tablet, 3 on desktop</BodySmall>
              </Card>
              <Card padding="md" className="bg-green-50" border>
                <H4>Column 2</H4>
                <BodySmall>Responsive grid system</BodySmall>
              </Card>
              <Card padding="md" className="bg-blue-50" border>
                <H4>Column 3</H4>
                <BodySmall>With consistent spacing</BodySmall>
              </Card>
              <Card padding="md" className="bg-yellow-50" border>
                <H4>Column 4</H4>
                <BodySmall>Flexible and scalable</BodySmall>
              </Card>
              <Card padding="md" className="bg-purple-50" border>
                <H4>Column 5</H4>
                <BodySmall>Perfect for property listings</BodySmall>
              </Card>
              <Card padding="md" className="bg-pink-50" border>
                <H4>Column 6</H4>
                <BodySmall>And content blocks</BodySmall>
              </Card>
            </Grid>
          </Card>
          
          <Card padding="lg" shadow="md">
            <H3 className="mb-4">Flex Layouts</H3>
            <BodyText className="mb-6">
              Flexible layouts with proper alignment and spacing
            </BodyText>
            
            <Stack gap="md">
              <div>
                <H5 className="mb-2">Space Between</H5>
                <Flex justify="between" align="center" className="bg-gray-50 p-4 rounded">
                  <BodyText>Left Content</BodyText>
                  <BodySmall className="bg-blue-100 px-3 py-1 rounded">Center Badge</BodySmall>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded font-medium">
                    Action Button
                  </button>
                </Flex>
              </div>
              
              <div>
                <H5 className="mb-2">Centered Content</H5>
                <Flex justify="center" align="center" className="bg-gray-50 p-8 rounded">
                  <Stack gap="sm">
                    <H4 className="text-center">Centered Card</H4>
                    <BodyText className="text-center">Perfect alignment</BodyText>
                  </Stack>
                </Flex>
              </div>
            </Stack>
          </Card>
        </Stack>
      </Section>

      {/* Color Showcase */}
      <Section background="light" padding="lg">
        <H2 className="mb-8">Color System</H2>
        
        <Stack gap="lg">
          <Card padding="lg" shadow="md">
            <H3 className="mb-4">Primary Colors</H3>
            <Flex gap className="flex-wrap">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(shade => (
                <div key={shade} className="text-center">
                  <div 
                    className="w-16 h-16 rounded mb-2" 
                    style={{ backgroundColor: `var(--color-primary-${shade})` }}
                  />
                  <Caption>{shade}</Caption>
                </div>
              ))}
            </Flex>
          </Card>
          
          <Card padding="lg" shadow="md">
            <H3 className="mb-4">Neutral Colors</H3>
            <Flex gap className="flex-wrap">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(shade => (
                <div key={shade} className="text-center">
                  <div 
                    className="w-16 h-16 rounded mb-2 border" 
                    style={{ backgroundColor: `var(--color-neutral-${shade})` }}
                  />
                  <Caption>{shade}</Caption>
                </div>
              ))}
            </Flex>
          </Card>
        </Stack>
      </Section>

      {/* Usage Examples */}
      <Section padding="lg">
        <H2 className="mb-8">Real-World Examples</H2>
        
        <Grid cols={1} responsive={{ lg: 2 }}>
          {/* Property Card Example */}
          <Card padding="lg" shadow="lg" hover>
            <Stack gap="md">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-48 rounded-lg flex items-center justify-center">
                <Text variant="h3" color="white">Property Image</Text>
              </div>
              
              <Stack gap="sm">
                <H3>Marina Bay Residences</H3>
                <Flex justify="between" align="center">
                  <BodyLarge className="font-semibold text-blue-600">$2.8M - $5.2M</BodyLarge>
                  <Caption>District 1</Caption>
                </Flex>
                <BodyText>
                  Luxury waterfront living with stunning city skyline views. Premium amenities and world-class facilities.
                </BodyText>
                <Flex gap>
                  <Caption className="bg-gray-100 px-2 py-1 rounded">3-4 Bedrooms</Caption>
                  <Caption className="bg-gray-100 px-2 py-1 rounded">2-3 Bathrooms</Caption>
                  <Caption className="bg-gray-100 px-2 py-1 rounded">1,200-1,800 sqft</Caption>
                </Flex>
              </Stack>
            </Stack>
          </Card>
          
          {/* Article Card Example */}
          <Card padding="lg" shadow="lg" hover>
            <Stack gap="md">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 h-32 rounded-lg flex items-center justify-center">
                <Text variant="h4" color="white">Article Cover</Text>
              </div>
              
              <Stack gap="sm">
                <Caption>Market Insights • 5 min read</Caption>
                <H3>Singapore Property Market Trends 2024</H3>
                <BodyText>
                  Comprehensive analysis of the latest market trends, price movements, and investment opportunities 
                  in Singapore's dynamic property landscape.
                </BodyText>
                <Flex justify="between" align="center" className="pt-2">
                  <Caption>December 15, 2024</Caption>
                  <button className="text-blue-600 font-medium hover:text-blue-700">
                    Read More →
                  </button>
                </Flex>
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Section>

      {/* Footer */}
      <Section background="navy" padding="md">
        <Flex justify="center" align="center">
          <BodyText className="text-white/90 text-center">
            Design System v1.0 • Singapore Property Hub • Built with consistency and scale in mind
          </BodyText>
        </Flex>
      </Section>
    </div>
  )
}