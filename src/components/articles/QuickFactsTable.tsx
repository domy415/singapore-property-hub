interface QuickFact {
  label: string
  value: string
  icon?: React.ReactNode
}

interface QuickFactsTableProps {
  facts: QuickFact[]
  className?: string
}

export default function QuickFactsTable({ facts, className = "" }: QuickFactsTableProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-primary flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Quick Facts
        </h3>
      </div>
      
      <div className="divide-y divide-gray-100">
        {facts.map((fact, index) => (
          <div key={index} className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {fact.icon && (
                <div className="text-blue-600">
                  {fact.icon}
                </div>
              )}
              <span className="font-medium text-secondary">{fact.label}</span>
            </div>
            <span className="font-bold text-primary">{fact.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}