export const runtime = 'nodejs'

interface Props {
  params: { testslug: string }
}

export default function TestDynamicPage({ params }: Props) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Test Dynamic Route
        </h1>
        
        <p className="text-lg">
          Slug parameter: <strong>{params.testslug}</strong>
        </p>
        
        <p>
          This is a completely new dynamic route to test if the issue is specific to /articles/[slug] or affects all dynamic routes.
        </p>
      </div>
    </div>
  )
}