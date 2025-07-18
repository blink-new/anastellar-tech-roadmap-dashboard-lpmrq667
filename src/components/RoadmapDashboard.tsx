import { useState, useMemo } from 'react';
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
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { roadmapData, Task, Month } from '../data/roadmapData';

type FilterType = 'All' | 'Promoters' | 'Sales Reps' | 'Admin';

export default function RoadmapDashboard() {
  const [months, setMonths] = useState<Month[]>(roadmapData);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Calculate overall progress
  const totalTasks = months.reduce((acc, month) => acc + month.tasks.length, 0);
  const completedTasks = months.reduce((acc, month) => 
    acc + month.tasks.filter(task => task.status === 'completed').length, 0
  );
  const inProgressTasks = months.reduce((acc, month) => 
    acc + month.tasks.filter(task => task.status === 'in-progress').length, 0
  );
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

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

  const toggleTaskBookmark = (taskId: string) => {
    setMonths(prev => prev.map(month => ({
      ...month,
      tasks: month.tasks.map(task => 
        task.id === taskId 
          ? { ...task, isBookmarked: !task.isBookmarked }
          : task
      )
    })));
  };

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setMonths(prev => prev.map(month => ({
      ...month,
      tasks: month.tasks.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus }
          : task
      )
    })));
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
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'not-started': return <AlertCircle className="w-4 h-4 text-gray-400" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-6">
              <img 
                src="/anastellar-logo-pink.png" 
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
                          {month.tasks.filter(t => t.status === 'completed').length} complete
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
                          onBookmarkToggle={toggleTaskBookmark}
                          onStatusUpdate={updateTaskStatus}
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
  onBookmarkToggle: (taskId: string) => void;
  onStatusUpdate: (taskId: string, status: Task['status']) => void;
  getUserTypeIcon: (userType: string) => JSX.Element;
  getPriorityColor: (priority: string) => string;
  getStatusIcon: (status: string) => JSX.Element;
}

function TaskCard({ 
  task, 
  onBookmarkToggle, 
  onStatusUpdate, 
  getUserTypeIcon, 
  getPriorityColor, 
  getStatusIcon 
}: TaskCardProps) {
  const [showExamples, setShowExamples] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {getStatusIcon(task.status)}
            <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBookmarkToggle(task.id)}
              className="p-1 h-auto"
            >
              {task.isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-primary" />
              ) : (
                <Bookmark className="w-4 h-4 text-gray-400" />
              )}
            </Button>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {task.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{task.estimatedDate}</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center space-x-1">
              {getUserTypeIcon(task.whoUsesIt)}
              <span>{task.whoUsesIt}</span>
            </Badge>
          </div>
        </div>
        
        <select
          value={task.status}
          onChange={(e) => onStatusUpdate(task.id, e.target.value as Task['status'])}
          className="ml-4 text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
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

        <Collapsible open={showExamples} onOpenChange={setShowExamples}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 h-auto text-primary hover:text-primary/80">
              <div className="flex items-center space-x-1">
                {showExamples ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <span>Examples ({task.examples?.length || 0})</span>
              </div>
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-2">
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-4">
              {task.examples?.map((example, index) => (
                <li key={index}>{example}</li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}