import { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronRight, 
  Users, 
  UserCheck, 
  Shield, 
  Calendar,
  Bookmark,
  BookmarkCheck,
  MessageSquare,
  Download,
  Moon,
  Sun,
  AlertCircle,
  CheckCircle2,
  Clock,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { toast } from 'sonner';
import { Task, Month } from '../lib/supabase';
import { RoadmapService } from '../services/roadmapService';

type FilterType = 'All' | 'Promoters' | 'Sales Reps' | 'Admin';

export default function RoadmapDashboard() {
  const [months, setMonths] = useState<Month[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState('');

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await RoadmapService.fetchTasksByMonth();
      setMonths(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Load tasks from Supabase
  useEffect(() => {
    loadTasks();
    
    // Subscribe to real-time changes
    const subscription = RoadmapService.subscribeToChanges((payload) => {
      console.log('Change received:', payload);
      loadTasks(); // Reload tasks when changes occur
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Calculate overall progress
  const totalTasks = months.reduce((acc, month) => acc + month.tasks.length, 0);
  const completedTasks = months.reduce((acc, month) => 
    acc + month.tasks.filter(task => task.status === 'complete').length, 0
  );
  const inProgressTasks = months.reduce((acc, month) => 
    acc + month.tasks.filter(task => task.status === 'in_progress').length, 0
  );
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter tasks based on search and filter
  const filteredMonths = useMemo(() => {
    return months.map(month => ({
      ...month,
      tasks: month.tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            task.value.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesFilter = activeFilter === 'All' || task.whoUsesIt.includes(activeFilter.replace('Sales Reps', 'Sales reps'));
        
        return matchesSearch && matchesFilter;
      })
    })).filter(month => month.tasks.length > 0);
  }, [months, searchQuery, activeFilter]);

  const toggleMonthExpansion = (monthId: string) => {
    setMonths(prev => prev.map(month => 
      month.id === monthId 
        ? { ...month, isExpanded: !month.isExpanded }
        : month
    ));
  };

  const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      await RoadmapService.updateTaskStatus(taskId, newStatus);
      toast.success('Task status updated');
      await loadTasks(); // Reload to reflect changes
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  };

  const updateTaskPriority = async (taskId: string, newPriority: Task['priority']) => {
    try {
      await RoadmapService.updateTaskPriority(taskId, newPriority);
      toast.success('Task priority updated');
      await loadTasks(); // Reload to reflect changes
    } catch (error) {
      console.error('Error updating task priority:', error);
      toast.error('Failed to update task priority');
    }
  };

  const startEditingDate = (taskId: string, currentDate: string) => {
    setEditingTaskId(taskId);
    setEditDate(currentDate);
  };

  const cancelEditingDate = () => {
    setEditingTaskId(null);
    setEditDate('');
  };

  const saveTaskDate = async (taskId: string) => {
    try {
      await RoadmapService.updateTaskDate(taskId, editDate);
      toast.success('Task date updated - task will move to appropriate month');
      setEditingTaskId(null);
      setEditDate('');
      await loadTasks(); // Reload to reflect changes
    } catch (error) {
      console.error('Error updating task date:', error);
      toast.error('Failed to update task date');
    }
  };

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'Promoters': return <Users className="w-4 h-4" />;
      case 'Sales Reps': return <UserCheck className="w-4 h-4" />;
      case 'Admin': return <Shield className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'not_started': return <AlertCircle className="w-4 h-4 text-gray-400" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-6">
              <img 
                src="/anastellar-logo.png" 
                alt="AnaStellar Brands" 
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Technology Roadmap
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  July - December 2025
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Overall Progress</span>
              <span className="text-2xl font-bold text-primary">{progressPercentage}%</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercentage} className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>{completedTasks} Completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>{inProgressTasks} In Progress</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-gray-400" />
                <span>{totalTasks - completedTasks - inProgressTasks} Not Started</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tasks, descriptions, or values..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            {(['All', 'Promoters', 'Sales Reps', 'Admin'] as FilterType[]).map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter(filter)}
                className="flex items-center space-x-1"
              >
                <Filter className="w-4 h-4" />
                <span>{filter}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          {filteredMonths.map((month, index) => (
            <Card key={month.id} className="overflow-hidden">
              <Collapsible
                open={month.isExpanded}
                onOpenChange={() => toggleMonthExpansion(month.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {month.isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                          )}
                          <div className="w-3 h-3 bg-primary rounded-full" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{month.title}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {month.theme}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">
                          {month.tasks.length} tasks
                        </Badge>
                        <Badge variant="outline">
                          {month.tasks.filter(t => t.status === 'complete').length} complete
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {month.tasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          editingTaskId={editingTaskId}
                          editDate={editDate}
                          onStatusUpdate={updateTaskStatus}
                          onPriorityUpdate={updateTaskPriority}
                          onStartEditingDate={startEditingDate}
                          onSaveDate={saveTaskDate}
                          onCancelEditingDate={cancelEditingDate}
                          onEditDateChange={setEditDate}
                          getUserTypeIcon={getUserTypeIcon}
                          getPriorityColor={getPriorityColor}
                          getStatusIcon={getStatusIcon}
                        />
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        {filteredMonths.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No tasks found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search query or filters
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  editingTaskId: string | null;
  editDate: string;
  onStatusUpdate: (taskId: string, status: Task['status']) => void;
  onPriorityUpdate: (taskId: string, priority: Task['priority']) => void;
  onStartEditingDate: (taskId: string, currentDate: string) => void;
  onSaveDate: (taskId: string) => void;
  onCancelEditingDate: () => void;
  onEditDateChange: (date: string) => void;
  getUserTypeIcon: (userType: string) => JSX.Element;
  getPriorityColor: (priority: string) => string;
  getStatusIcon: (status: string) => JSX.Element;
}

function TaskCard({ 
  task, 
  editingTaskId,
  editDate,
  onStatusUpdate, 
  onPriorityUpdate,
  onStartEditingDate,
  onSaveDate,
  onCancelEditingDate,
  onEditDateChange,
  getUserTypeIcon, 
  getPriorityColor, 
  getStatusIcon 
}: TaskCardProps) {
  const [showExamples, setShowExamples] = useState(false);
  const isEditingDate = editingTaskId === task.id;

  // Parse userTypes from task.userType string
  const userTypes = task.userType ? task.userType.split(', ') : [];

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {getStatusIcon(task.status)}
            <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {task.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge 
              className={`${getPriorityColor(task.priority)} cursor-pointer`}
              onClick={() => {
                const priorities: Task['priority'][] = ['high', 'medium', 'low'];
                const currentIndex = priorities.indexOf(task.priority);
                const nextPriority = priorities[(currentIndex + 1) % priorities.length];
                onPriorityUpdate(task.id, nextPriority);
              }}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            {isEditingDate ? (
              <div className="flex items-center space-x-1">
                <Input
                  type="date"
                  value={editDate}
                  onChange={(e) => onEditDateChange(e.target.value)}
                  className="h-6 text-sm px-2"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSaveDate(task.id)}
                  className="p-1 h-6 w-6"
                >
                  <Save className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCancelEditingDate}
                  className="p-1 h-6 w-6"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <Badge 
                variant="outline" 
                className="flex items-center space-x-1 cursor-pointer"
                onClick={() => onStartEditingDate(task.id, task.estimatedDate)}
              >
                <Calendar className="w-3 h-3" />
                <span>{new Date(task.estimatedDate).toLocaleDateString()}</span>
                <Edit2 className="w-3 h-3 ml-1" />
              </Badge>
            )}
            {userTypes.map((userType, index) => (
              <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                {getUserTypeIcon(userType.trim())}
                <span>{userType.trim()}</span>
              </Badge>
            ))}
          </div>
        </div>
        
        <select
          value={task.status}
          onChange={(e) => onStatusUpdate(task.id, e.target.value as Task['status'])}
          className="ml-4 text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="complete">Complete</option>
        </select>
      </div>

      <div className="space-y-3">
        <div>
          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Value:</h5>
          <p className="text-sm text-gray-600 dark:text-gray-400">{task.value}</p>
        </div>
        
        <div>
          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Who uses it:</h5>
          <p className="text-sm text-gray-600 dark:text-gray-400">{task.whoUsesIt}</p>
        </div>

        {task.examples && task.examples.length > 0 && (
          <Collapsible open={showExamples} onOpenChange={setShowExamples}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-auto text-primary hover:text-primary/80">
                <div className="flex items-center space-x-1">
                  {showExamples ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span>Examples ({task.examples.length})</span>
                </div>
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-2">
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-4">
                {task.examples.map((example, index) => (
                  <li key={index}>{example}</li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  );
}