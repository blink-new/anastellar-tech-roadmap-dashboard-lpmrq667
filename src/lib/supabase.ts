import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tzmcqhwwwevuzzeffvvs.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6bWNxaHd3d2V2dXp6ZWZmdnZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTkxNzIsImV4cCI6MjA2NzI5NTE3Mn0.mzNycIt-hTbERE9odpJQZ26IaSGiYlzCS_EjkKDHAus'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Add a property to expose the URL for debugging
;(supabase as any).supabaseUrl = supabaseUrl

// TypeScript interfaces for our data
export interface Task {
  id: string
  title: string
  description: string
  value: string
  whoUsesIt: string
  examples?: string[]
  priority: 'high' | 'medium' | 'low'
  status: 'not_started' | 'in_progress' | 'complete'
  estimatedDate: string
  userType: string
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

// Function to organize tasks by month
export function organizeTasksByMonth(dbTasks: any[]): Month[] {
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
  
  dbTasks.forEach(dbTask => {
    // Convert snake_case to camelCase
    const task: Task = {
      id: dbTask.id,
      title: dbTask.title,
      description: dbTask.description,
      value: dbTask.value,
      whoUsesIt: dbTask.who_uses,
      examples: dbTask.examples && typeof dbTask.examples === 'string' 
        ? JSON.parse(dbTask.examples) 
        : dbTask.examples || [],
      priority: dbTask.priority,
      status: dbTask.status,
      estimatedDate: dbTask.estimated_date,
      userType: dbTask.who_uses,
      created_at: dbTask.created_at,
      updated_at: dbTask.updated_at
    }
    
    const date = new Date(task.estimatedDate)
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
    month.tasks.sort((a, b) => new Date(a.estimatedDate).getTime() - new Date(b.estimatedDate).getTime())
  })
  
  // Convert to array and sort by month
  const months = Array.from(monthMap.values())
  months.sort((a, b) => {
    const dateA = new Date(a.tasks[0]?.estimatedDate || '2025-01-01')
    const dateB = new Date(b.tasks[0]?.estimatedDate || '2025-01-01')
    return dateA.getTime() - dateB.getTime()
  })
  
  return months
}