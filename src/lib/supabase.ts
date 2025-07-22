import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tzmcqhwwwevuzzeffvvs.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6bWNxaHd3d2V2dXp6ZWZmdnZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTkxNzIsImV4cCI6MjA2NzI5NTE3Mn0.mzNycIt-hTbERE9odpJQZ26IaSGiYlzCS_EjkKDHAus'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// TypeScript interfaces for our data
export interface Task {
  id: string
  title: string
  description: string
  value: string
  who_uses_it: string
  examples?: string[]
  priority: 'high' | 'medium' | 'low'
  status: 'not_started' | 'in_progress' | 'complete'
  estimated_date: string
  user_type: string
  created_at?: string
  updated_at?: string
}

export interface Month {
  id: string
  title: string
  theme: string
  tasks: Task[]
  isExpanded?: boolean
}

// Helper function to convert snake_case to camelCase
export function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCase(v))
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
      result[camelKey] = toCamelCase(obj[key])
      return result
    }, {} as any)
  }
  return obj
}

// Helper function to convert camelCase to snake_case
export function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => toSnakeCase(v))
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
      result[snakeKey] = toSnakeCase(obj[key])
      return result
    }, {} as any)
  }
  return obj
}

// Function to organize tasks by month
export function organizeTasksByMonth(tasks: Task[]): Month[] {
  const monthMap = new Map<string, Month>()
  
  // Define month metadata
  const monthMetadata = {
    'July 2025': { id: 'july-2025', theme: 'System Reliability & Foundation - Making sure everything works perfectly' },
    'August 2025': { id: 'august-2025', theme: 'Reports & Sales Rep Tools - Better information and tools for decision-making' },
    'September 2025': { id: 'september-2025', theme: 'Mobile Apps & Motivation - Completing mobile tools and boosting engagement' },
    'October 2025': { id: 'october-2025', theme: 'AI Integration & Analytics - Smart automation and data-driven insights' },
    'November 2025': { id: 'november-2025', theme: 'Advanced Features & Expansion' },
    'December 2025': { id: 'december-2025', theme: 'Platform Optimization & 2026 Preparation - Final optimizations and preparation for the new year' },
  }
  
  tasks.forEach(task => {
    const date = new Date(task.estimated_date)
    const monthYear = `${date.toLocaleString('en-US', { month: 'long' })} ${date.getFullYear()}`
    
    if (!monthMap.has(monthYear)) {
      const metadata = monthMetadata[monthYear as keyof typeof monthMetadata]
      if (metadata) {
        monthMap.set(monthYear, {
          id: metadata.id,
          title: monthYear.toUpperCase(),
          theme: metadata.theme,
          tasks: [],
          isExpanded: false
        })
      }
    }
    
    const month = monthMap.get(monthYear)
    if (month) {
      month.tasks.push(task)
    }
  })
  
  // Sort tasks within each month by date
  monthMap.forEach(month => {
    month.tasks.sort((a, b) => new Date(a.estimated_date).getTime() - new Date(b.estimated_date).getTime())
  })
  
  // Convert to array and sort by month
  const months = Array.from(monthMap.values())
  months.sort((a, b) => {
    const dateA = new Date(a.tasks[0]?.estimated_date || '2025-01-01')
    const dateB = new Date(b.tasks[0]?.estimated_date || '2025-01-01')
    return dateA.getTime() - dateB.getTime()
  })
  
  return months
}