import { supabase, Task, Month, toCamelCase, toSnakeCase, organizeTasksByMonth } from '../lib/supabase'

export class RoadmapService {
  static async fetchAllTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('roadmap_tasks')
      .select('*')
      .order('estimated_date', { ascending: true })

    if (error) {
      console.error('Error fetching tasks:', error)
      throw error
    }

    // Convert snake_case to camelCase
    const tasks = data.map(task => toCamelCase(task)) as Task[]
    
    // Convert user_type string to userTypes array
    return tasks.map(task => ({
      ...task,
      userTypes: task.user_type ? task.user_type.split(', ') : [],
      // Ensure boolean status values
      isBookmarked: false,
      comments: []
    })) as any
  }

  static async fetchTasksByMonth(): Promise<Month[]> {
    const tasks = await this.fetchAllTasks()
    return organizeTasksByMonth(tasks)
  }

  static async updateTaskDate(taskId: string, newDate: string): Promise<Task> {
    const { data, error } = await supabase
      .from('roadmap_tasks')
      .update({ estimated_date: newDate })
      .eq('id', taskId)
      .select()
      .single()

    if (error) {
      console.error('Error updating task date:', error)
      throw error
    }

    const task = toCamelCase(data) as Task
    return {
      ...task,
      userTypes: task.user_type ? task.user_type.split(', ') : []
    } as any
  }

  static async updateTaskStatus(taskId: string, status: 'not_started' | 'in_progress' | 'complete'): Promise<Task> {
    const { data, error } = await supabase
      .from('roadmap_tasks')
      .update({ status })
      .eq('id', taskId)
      .select()
      .single()

    if (error) {
      console.error('Error updating task status:', error)
      throw error
    }

    const task = toCamelCase(data) as Task
    return {
      ...task,
      userTypes: task.user_type ? task.user_type.split(', ') : []
    } as any
  }

  static async updateTaskPriority(taskId: string, priority: 'high' | 'medium' | 'low'): Promise<Task> {
    const { data, error } = await supabase
      .from('roadmap_tasks')
      .update({ priority })
      .eq('id', taskId)
      .select()
      .single()

    if (error) {
      console.error('Error updating task priority:', error)
      throw error
    }

    const task = toCamelCase(data) as Task
    return {
      ...task,
      userTypes: task.user_type ? task.user_type.split(', ') : []
    } as any
  }

  static async createTask(task: Partial<Task>): Promise<Task> {
    // Convert camelCase to snake_case and prepare data
    const taskData = {
      title: task.title,
      description: task.description,
      value: task.value,
      who_uses_it: task.whoUsesIt,
      examples: task.examples,
      estimated_date: task.estimatedDate,
      status: task.status || 'not_started',
      priority: task.priority || 'medium',
      user_type: task.userTypes?.join(', ') || ''
    }

    const { data, error } = await supabase
      .from('roadmap_tasks')
      .insert(taskData)
      .select()
      .single()

    if (error) {
      console.error('Error creating task:', error)
      throw error
    }

    const newTask = toCamelCase(data) as Task
    return {
      ...newTask,
      userTypes: newTask.user_type ? newTask.user_type.split(', ') : []
    } as any
  }

  static async deleteTask(taskId: string): Promise<void> {
    const { error } = await supabase
      .from('roadmap_tasks')
      .delete()
      .eq('id', taskId)

    if (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  }

  // Subscribe to real-time changes
  static subscribeToChanges(callback: (payload: any) => void) {
    return supabase
      .channel('roadmap_tasks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'roadmap_tasks' }, callback)
      .subscribe()
  }
}