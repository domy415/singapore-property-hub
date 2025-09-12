// MINIMAL DYNAMIC ROUTE - TESTING ONLY
export const runtime = 'nodejs'

interface Props {
  params: { slug: string }
}

export default async function ArticlePage({ params }: Props) {
  // THE MOST MINIMAL POSSIBLE DYNAMIC ROUTE HANDLER
  return (
    <div>
      <h1>DYNAMIC ROUTE TEST</h1>
      <p>Slug: {params.slug}</p>
      <p>If this works, the issue was in the complex processing</p>
    </div>
  )
}