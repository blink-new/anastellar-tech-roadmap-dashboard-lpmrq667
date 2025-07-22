import { supabase } from '../lib/supabase'
import type { Task, Month } from '../lib/supabase'
import { organizeTasksByMonth } from '../lib/supabase'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export const RoadmapService = {
  // Fetch all tasks organized by month
  async fetchTasksByMonth(): Promise<Month[]> {
    try {
      console.log('Fetching tasks from Supabase...')
      
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .order('estimated_date', { ascending: true })
      
      if (error) {
        console.error('Error fetching tasks:', error)
        throw error
      }
      
      console.log('Tasks fetched:', tasks?.length || 0)
      
      if (!tasks || tasks.length === 0) {
        console.log('No tasks found in database')
        return []
      }
      
      // Organize by month
      const months = organizeTasksByMonth(tasks)
      console.log('Organized into months:', months.length)
      
      return months
    } catch (error) {
      console.error('Failed to fetch roadmap data:', error)
      return []
    }
  },

  // Update task status
  async updateTaskStatus(taskId: string, status: Task['status']): Promise<void> {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
      
      if (error) {
        console.error('Error updating task status:', error)
        throw error
      }
    } catch (error) {
      console.error('Failed to update task status:', error)
      throw error
    }
  },

  // Update task priority
  async updateTaskPriority(taskId: string, priority: Task['priority']): Promise<void> {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          priority,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
      
      if (error) {
        console.error('Error updating task priority:', error)
        throw error
      }
    } catch (error) {
      console.error('Failed to update task priority:', error)
      throw error
    }
  },

  // Update task date
  async updateTaskDate(taskId: string, estimatedDate: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          estimated_date: estimatedDate,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
      
      if (error) {
        console.error('Error updating task date:', error)
        throw error
      }
    } catch (error) {
      console.error('Failed to update task date:', error)
      throw error
    }
  },

  // Subscribe to real-time changes
  subscribeToChanges(callback: (payload: RealtimePostgresChangesPayload<Task>) => void) {
    return supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        callback
      )
      .subscribe()
  }
}