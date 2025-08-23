import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'card'
  width?: string | number
  height?: string | number
  count?: number
}

export default function LoadingSkeleton({
  className = '',
  variant = 'text',
  width,
  height,
  count = 1
}: SkeletonProps) {
  const baseStyles = cn(
    'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200',
    'bg-[length:200%_100%]',
    'rounded-md'
  )

  const variantStyles = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-xl'
  }

  const elements = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={cn(
        baseStyles,
        variantStyles[variant],
        className
      )}
      style={{
        width: width || (variant === 'circular' ? '40px' : '100%'),
        height: height || (variant === 'circular' ? '40px' : variant === 'text' ? '16px' : '100px'),
        animationDelay: `${i * 0.1}s`
      }}
    />
  ))

  return count > 1 ? (
    <div className="space-y-3">{elements}</div>
  ) : (
    elements[0]
  )
}

// Card Skeleton Component
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]" />
      <div className="p-6 space-y-4">
        <LoadingSkeleton variant="text" height="24px" width="70%" />
        <LoadingSkeleton variant="text" count={3} />
        <div className="flex justify-between items-center mt-4">
          <LoadingSkeleton variant="text" width="100px" />
          <LoadingSkeleton variant="circular" width="32px" height="32px" />
        </div>
      </div>
    </div>
  )
}

// Table Skeleton Component
export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gray-50 p-4 border-b">
        <div className="flex justify-between items-center">
          <LoadingSkeleton variant="text" width="200px" height="24px" />
          <LoadingSkeleton variant="rectangular" width="100px" height="36px" />
        </div>
      </div>
      
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            {Array.from({ length: columns }, (_, i) => (
              <th key={i} className="px-6 py-3">
                <LoadingSkeleton variant="text" height="16px" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, rowIndex) => (
            <tr key={rowIndex} className="border-b">
              {Array.from({ length: columns }, (_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <LoadingSkeleton 
                    variant="text" 
                    width={colIndex === 0 ? '150px' : '100px'}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Form Skeleton Component
export function FormSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
      <LoadingSkeleton variant="text" height="32px" width="60%" />
      
      <div className="space-y-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i}>
            <LoadingSkeleton variant="text" width="100px" height="14px" className="mb-2" />
            <LoadingSkeleton variant="rectangular" height="48px" />
          </div>
        ))}
      </div>
      
      <LoadingSkeleton variant="rectangular" height="48px" className="rounded-lg" />
    </div>
  )
}

// Article Skeleton Component
export function ArticleSkeleton() {
  return (
    <article className="max-w-4xl mx-auto">
      <LoadingSkeleton variant="text" height="48px" className="mb-4" />
      <div className="flex items-center gap-4 mb-8">
        <LoadingSkeleton variant="circular" width="40px" height="40px" />
        <LoadingSkeleton variant="text" width="150px" />
        <LoadingSkeleton variant="text" width="100px" />
      </div>
      
      <LoadingSkeleton variant="rectangular" height="400px" className="rounded-xl mb-8" />
      
      <div className="space-y-4">
        <LoadingSkeleton variant="text" count={3} />
        <LoadingSkeleton variant="text" width="80%" />
        
        <div className="my-8">
          <LoadingSkeleton variant="text" height="32px" width="50%" className="mb-4" />
          <LoadingSkeleton variant="text" count={4} />
        </div>
        
        <LoadingSkeleton variant="text" count={5} />
      </div>
    </article>
  )
}

// Grid Skeleton Component
interface GridSkeletonProps {
  items?: number
  columns?: number
}

export function GridSkeleton({ items = 6, columns = 3 }: GridSkeletonProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
      {Array.from({ length: items }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}