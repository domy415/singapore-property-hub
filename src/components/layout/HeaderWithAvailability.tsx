import Header from './Header'
import { getArticleAvailability } from '@/utils/article-availability'

export default async function HeaderWithAvailability() {
  const availability = await getArticleAvailability()
  
  return <Header availability={availability} />
}