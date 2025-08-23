// Singapore Property Hub Design System Components
// Export all design system components for easy importing

// Typography Components
export {
  HeroText,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  BodyText,
  BodyLarge,
  BodySmall,
  Caption,
  Text
} from './Typography'

// Layout Components
export {
  Container,
  Section,
  Card,
  Stack,
  Flex,
  Grid,
  Spacer,
  Divider
} from './Layout'

// Design System Utilities
export { designSystem, getFontSize, getSpacing, getColor, getLineHeight, responsiveText } from '@/lib/design-system'

// Usage Examples:
/*
import { H1, H2, BodyText, Section, Card, Grid } from '@/components/design-system'

function MyComponent() {
  return (
    <Section padding="lg">
      <H1>Page Title</H1>
      <BodyText>Page description</BodyText>
      
      <Grid cols={3} responsive={{ sm: 1, md: 2 }}>
        <Card padding="md">
          <H2>Card Title</H2>
          <BodyText>Card content</BodyText>
        </Card>
      </Grid>
    </Section>
  )
}
*/