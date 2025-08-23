'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

interface CollapsibleFAQProps {
  faqs: FAQItem[]
  className?: string
}

export default function CollapsibleFAQ({ faqs, className = "" }: CollapsibleFAQProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {faqs.map((faq, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleItem(index)}
            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold text-primary pr-4">{faq.question}</h3>
            <div className={`transform transition-transform duration-200 ${openItems.has(index) ? 'rotate-180' : ''}`}>
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          
          {openItems.has(index) && (
            <div className="px-6 pb-4 border-t border-gray-100">
              <div className="pt-4 text-secondary leading-relaxed">
                {faq.answer}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}