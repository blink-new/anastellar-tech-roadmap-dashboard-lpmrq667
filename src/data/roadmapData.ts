import { processTaskDates } from '../utils/dateUtils';

export interface Task {
  id: string;
  title: string;
  description: string;
  value: string;
  whoUsesIt: string;
  examples?: string[];
  priority: 'High' | 'Medium' | 'Low';
  status: 'not-started' | 'in-progress' | 'completed';
  estimatedDate: string;
  userTypes: ('Promoters' | 'Sales Reps' | 'Admin')[];
  isBookmarked?: boolean;
  comments?: string[];
}

export interface Month {
  id: string;
  title: string;
  theme: string;
  tasks: Task[];
  isExpanded?: boolean;
}

// Helper function to sort tasks by date
const sortTasksByDate = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    const dateA = new Date(a.estimatedDate);
    const dateB = new Date(b.estimatedDate);
    return dateA.getTime() - dateB.getTime();
  });
};

const rawRoadmapData: Month[] = [
  {
    id: 'july-2025',
    title: 'JULY 2025',
    theme: 'System Reliability & Foundation - Making sure everything works perfectly',
    isExpanded: false,
    tasks: [
      // REVIEW TASKS - Priority items to be completed first (Due dates: July 24-31, 2025)
      {
        id: 'july-10',
        title: 'Review Clock In and Out Flow and Tick Off',
        description: 'Test time tracking system thoroughly - Due: July 24, 2025',
        value: 'Accurate time tracking, reliable attendance records',
        whoUsesIt: 'All field staff',
        priority: 'High',
        status: 'in-progress',
        estimatedDate: 'July 24, 2025',
        userTypes: ['Promoters', 'Sales Reps']
      },
      {
        id: 'july-11',
        title: 'Review Add/Delete Shift Flow and Tick Off',
        description: 'Test shift management system - Due: July 25, 2025',
        value: 'Flexible scheduling, no scheduling conflicts',
        whoUsesIt: 'Admin staff and promoters',
        priority: 'High',
        status: 'in-progress',
        estimatedDate: 'July 25, 2025',
        userTypes: ['Promoters', 'Admin']
      },
      {
        id: 'july-12',
        title: 'Review Scheduling and Tick Off',
        description: 'Comprehensive scheduling system review - Due: July 26, 2025',
        value: 'Optimal shift planning, efficient resource allocation',
        whoUsesIt: 'Admin staff and managers',
        priority: 'High',
        status: 'in-progress',
        estimatedDate: 'July 26, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'july-13',
        title: 'Review Promoter Annual Statement Accuracy and Tick Off',
        description: 'Verify annual statement calculations and accuracy - Due: July 27, 2025',
        value: 'Accurate financial records, trust in compensation system',
        whoUsesIt: 'Promoters and payroll staff',
        priority: 'High',
        status: 'in-progress',
        estimatedDate: 'July 27, 2025',
        userTypes: ['Promoters', 'Admin']
      },
      {
        id: 'july-14',
        title: 'Review Sign Up Flow and Tick Off',
        description: 'Test user registration and onboarding process - Due: July 28, 2025',
        value: 'Smooth onboarding experience for new users',
        whoUsesIt: 'All new users',
        priority: 'High',
        status: 'in-progress',
        estimatedDate: 'July 28, 2025',
        userTypes: ['Promoters', 'Sales Reps', 'Admin']
      },
      {
        id: 'july-15',
        title: 'Review Invite to the Team and Tick Off',
        description: 'Test team invitation and joining process - Due: July 29, 2025',
        value: 'Efficient team building and collaboration setup',
        whoUsesIt: 'Admin staff and team members',
        priority: 'High',
        status: 'in-progress',
        estimatedDate: 'July 29, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'july-16',
        title: 'Review Invite to Training and Tick Off',
        description: 'Test training invitation and enrollment process - Due: July 30, 2025',
        value: 'Streamlined training coordination',
        whoUsesIt: 'HR and training participants',
        priority: 'High',
        status: 'in-progress',
        estimatedDate: 'July 30, 2025',
        userTypes: ['Promoters', 'Sales Reps', 'Admin']
      },
      {
        id: 'july-17',
        title: 'Review Add Job Shadow and Tick Off',
        description: 'Test job shadowing assignment process - Due: July 31, 2025',
        value: 'Effective mentorship and training coordination',
        whoUsesIt: 'HR and training participants',
        priority: 'High',
        status: 'in-progress',
        estimatedDate: 'July 31, 2025',
        userTypes: ['Promoters', 'Admin']
      }
    ]
  },
  {
    id: 'august-2025',
    title: 'AUGUST 2025',
    theme: 'Reports & Sales Rep Tools - Better information and tools for decision-making',
    isExpanded: false,
    tasks: [
      // TASKS MOVED FROM JULY (August 1-14)
      {
        id: 'july-18',
        title: 'Review Job Shadow Flow end-to-end and Tick Off',
        description: 'Comprehensive testing of job shadowing process - Due: August 1, 2025',
        value: 'Complete mentorship experience validation',
        whoUsesIt: 'HR and training participants',
        priority: 'High',
        status: 'in-progress',
        estimatedDate: 'August 1, 2025',
        userTypes: ['Promoters', 'Admin']
      },
      {
        id: 'july-19',
        title: 'Review Change shift date/store/promoter and Tick Off',
        description: 'Test shift modification functionality - Due: August 2, 2025',
        value: 'Flexible scheduling adjustments',
        whoUsesIt: 'Admin staff and promoters',
        priority: 'High',
        status: 'in-progress',
        estimatedDate: 'August 2, 2025',
        userTypes: ['Promoters', 'Admin']
      },
      {
        id: 'july-4',
        title: 'Show Better Shift Options to Promoters',
        description: 'Display higher-paying stores available each day',
        value: 'Promoters can earn more money, company gets better coverage',
        whoUsesIt: 'Promoters',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'August 4, 2025',
        userTypes: ['Promoters']
      },
      {
        id: 'july-5',
        title: 'Build Target Upload System',
        description: 'Easy way to upload sales targets for each promoter',
        value: 'Faster target setting, clear expectations for everyone',
        whoUsesIt: 'Admin staff',
        priority: 'Medium',
        status: 'in-progress',
        estimatedDate: 'August 5, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'july-6',
        title: 'Start Mobile App for Promoters',
        description: 'Begin building smartphone app for promoters',
        value: 'Easier access to schedules and information on-the-go',
        whoUsesIt: 'Promoters',
        priority: 'High',
        status: 'in-progress',
        estimatedDate: 'August 6, 2025',
        userTypes: ['Promoters']
      },
      {
        id: 'july-1',
        title: 'Split Admin Dashboard Main Groups into Separate Pages',
        description: 'Split large dashboard into smaller, faster pages for performance optimization',
        value: 'Admins can make decisions faster, no more waiting for pages to load',
        whoUsesIt: 'Admin staff at head office',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'August 7, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'july-2',
        title: 'Sales Upload from Bubble with no reliance on Xano',
        description: 'Refactor sales data processing to be faster and more reliable',
        value: 'Sales data is available immediately, no delays in tracking performance',
        whoUsesIt: 'Admin staff, indirectly benefits all users',
        priority: 'High',
        status: 'in-progress',
        estimatedDate: 'August 8, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'july-7',
        title: 'Smart Shift Recommendations',
        description: 'System suggests best shifts for each promoter based on their past performance',
        value: 'Promoters work where they\'re most successful, company gets better results',
        whoUsesIt: 'Promoters and Admin staff',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'August 9, 2025',
        userTypes: ['Promoters', 'Admin']
      },
      {
        id: 'july-9',
        title: 'Refactor Promoter Sales and Statements Flow',
        description: 'Make promoter sales and statements processing faster and less consuming',
        value: 'Promoters get accurate statements faster, reduced system load',
        whoUsesIt: 'Promoters and Admin staff',
        priority: 'High',
        status: 'in-progress',
        estimatedDate: 'August 10, 2025',
        userTypes: ['Promoters', 'Admin']
      },
      {
        id: 'july-3',
        title: 'Automate HR Dashboard Reports Recalculation Daily',
        description: 'HR reports update automatically every day instead of manually',
        value: 'Saves 2-3 hours daily of manual work, always up-to-date information',
        whoUsesIt: 'HR and Admin staff',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'August 11, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'july-8',
        title: 'Automated Problem Alerts',
        description: 'System automatically notifies managers when issues occur (missed shifts, low performance)',
        value: 'Faster response to problems, prevents small issues becoming big ones',
        whoUsesIt: 'Admin staff and managers',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'August 12, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'july-20',
        title: 'Shifts by Store Report',
        description: 'Generate comprehensive shift allocation reports by store',
        value: 'Better visibility into store coverage and resource allocation',
        whoUsesIt: 'Admin staff and managers',
        priority: 'Low',
        status: 'in-progress',
        estimatedDate: 'August 13, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'july-21',
        title: 'Plan Merge & Move App System Architecture',
        description: 'Determine the optimal technology stack and platform for the Merge & Move app - evaluate building on existing APM, creating new Bubble app, using third-party no-code tools, or custom development',
        value: 'Strategic foundation for new revenue stream, ensures scalable and maintainable solution',
        whoUsesIt: 'Admin staff and development team',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'August 14, 2025',
        userTypes: ['Admin'],
        examples: [
          'Evaluate existing APM platform capabilities and limitations',
          'Research Bubble.io feasibility for external client management',
          'Assess third-party no-code solutions (Airtable, Notion, etc.)',
          'Consider custom development with modern tech stack (React, Node.js, etc.)',
          'Analyze integration requirements with current systems',
          'Define scalability requirements for external client base'
        ]
      },
      // ORIGINAL AUGUST TASKS (August 15-20)
      {
        id: 'august-1',
        title: 'Backlog from July',
        description: 'Finish any remaining items from July',
        value: 'Ensures solid foundation before adding new features',
        whoUsesIt: 'All users',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'August 15, 2025',
        userTypes: ['Promoters', 'Sales Reps', 'Admin']
      },
      {
        id: 'august-2',
        title: 'Review Promoter Reports and Tick Off',
        description: 'Test all promoter reports for accuracy and functionality',
        value: 'Accurate promoter performance information for decision-making',
        whoUsesIt: 'Admin staff, HR, Sales managers',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'August 15, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'august-3',
        title: 'Complete In-App Messaging',
        description: 'Finish chat system for internal communication',
        value: 'Faster communication, less reliance on external messaging apps',
        whoUsesIt: 'All users',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'August 16, 2025',
        userTypes: ['Promoters', 'Sales Reps', 'Admin']
      },
      {
        id: 'august-4',
        title: 'Finish Sales Rep Dashboard',
        description: 'Complete dashboard showing rep performance and targets',
        value: 'Reps can track their progress, managers can monitor performance',
        whoUsesIt: 'Sales reps and their managers',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'August 17, 2025',
        userTypes: ['Sales Reps', 'Admin']
      },
      {
        id: 'august-5',
        title: 'Continue Promoter Mobile App',
        description: 'Keep building the smartphone app',
        value: 'Promoters have better access to work tools',
        whoUsesIt: 'Promoters',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'August 18, 2025',
        userTypes: ['Promoters']
      },
      {
        id: 'august-6',
        title: 'Start Merch & Move Platform',
        description: 'Begin building system for our separate merchandising business where we provide promoters to other companies who need retail presence',
        value: 'New revenue stream, leverages our existing promoter network and management system',
        whoUsesIt: 'Admin staff managing external clients',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'August 18, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'august-7',
        title: 'Test Large Data Handling',
        description: 'See if system can handle years of historical data',
        value: 'Access to long-term trends and better analysis',
        whoUsesIt: 'Admin staff',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'August 19, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'august-8',
        title: 'Implement Algolia for Faster Search',
        description: 'Integrate Algolia (advanced search technology) to find promoters, stores, products, and reports instantly across the entire system',
        value: 'Find any information in seconds instead of minutes, works like Google search',
        whoUsesIt: 'All users',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'August 19, 2025',
        userTypes: ['Promoters', 'Sales Reps', 'Admin']
      },
      {
        id: 'august-16',
        title: 'Review HR Reports and Tick Off',
        description: 'Test all HR reports for accuracy and functionality',
        value: 'Accurate HR information for workforce management',
        whoUsesIt: 'HR and Admin staff',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'August 19, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'august-17',
        title: 'Review Rep Reports and Tick Off',
        description: 'Test all sales rep reports for accuracy and functionality',
        value: 'Accurate sales performance information for decision-making',
        whoUsesIt: 'Sales managers and Admin staff',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'August 20, 2025',
        userTypes: ['Sales Reps', 'Admin']
      },
      {
        id: 'august-19',
        title: 'Complete In-App Chat/Messaging and make it public',
        description: 'Finalize and deploy internal messaging system',
        value: 'Enhanced internal communication capabilities',
        whoUsesIt: 'All users',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'August 20, 2025',
        userTypes: ['Promoters', 'Sales Reps', 'Admin']
      },
      {
        id: 'august-20',
        title: 'Continue work on Promoter Mobile App',
        description: 'Continue development of promoter mobile application',
        value: 'Mobile access to work tools for promoters',
        whoUsesIt: 'Promoters',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'August 20, 2025',
        userTypes: ['Promoters']
      }
    ]
  },
  {
    id: 'september-2025',
    title: 'SEPTEMBER 2025',
    theme: 'Mobile Apps & Motivation - Completing mobile tools and boosting engagement',
    isExpanded: false,
    tasks: [
      {
        id: 'september-1',
        title: 'Backlog from August',
        description: 'Finish any remaining items from August',
        value: 'Ensures solid foundation before adding new features',
        whoUsesIt: 'All users',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'September 1, 2025',
        userTypes: ['Promoters', 'Sales Reps', 'Admin']
      },
      {
        id: 'september-2',
        title: 'Continue Merch & Move Platform',
        description: 'Keep building our external merchandising business platform',
        value: 'Expand revenue streams, better manage external clients',
        whoUsesIt: 'Admin staff managing external clients',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'September 3, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'september-3',
        title: 'Prepare for 2026 System',
        description: 'Start planning for next year\'s system changes',
        value: 'Smooth transition to new year, no disruption to operations',
        whoUsesIt: 'All users',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'September 5, 2025',
        userTypes: ['Promoters', 'Sales Reps', 'Admin']
      },
      {
        id: 'september-4',
        title: 'Promoter "Year in Review" (Like Spotify Wrapped)',
        description: 'Create personalized summary showing each promoter\'s achievements',
        value: 'Recognition, motivation, shareable achievements that boost morale',
        whoUsesIt: 'Promoters',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'September 8, 2025',
        userTypes: ['Promoters'],
        examples: [
          'You worked 247 shifts this year',
          'Your best month was June with R15,000 earned',
          'You were top performer in 3 stores',
          'You helped 2,847 customers',
          'Your favorite product to sell was Product X'
        ]
      },
      {
        id: 'september-5',
        title: 'Build Incentive Systems with Automations',
        description: 'Create automated tools to set up bonuses and rewards that trigger automatically when targets are met',
        value: 'Fair, consistent rewards that motivate without manual calculation',
        whoUsesIt: 'Admin staff, benefits promoters and reps',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'September 10, 2025',
        userTypes: ['Promoters', 'Sales Reps', 'Admin']
      },
      {
        id: 'september-6',
        title: 'Build Training Module',
        description: 'Create comprehensive training system with role-playing scenarios, product knowledge quizzes, and interactive modules',
        value: 'Consistent training quality, tracks progress, identifies knowledge gaps',
        whoUsesIt: 'New hires during onboarding, existing staff for upskilling, managers for tracking progress',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'September 12, 2025',
        userTypes: ['Promoters', 'Sales Reps', 'Admin']
      },
      {
        id: 'september-7',
        title: 'Build Recruitment Analytics',
        description: 'Track recruitment effectiveness by group (10-50 people recruited together), by territory/region, and individual journey tracking from joining to current performance',
        value: 'Identify which recruitment methods work best, optimize training programs, predict success rates',
        whoUsesIt: 'HR and Admin staff',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'September 15, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'september-8',
        title: 'AI Assistant for Promoters',
        description: 'Chatbot that answers common questions about policies, products, and procedures',
        value: 'Instant answers 24/7, reduces calls to head office, consistent information',
        whoUsesIt: 'Promoters',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'September 17, 2025',
        userTypes: ['Promoters']
      },
      {
        id: 'september-9',
        title: 'Personalized Training Recommendations',
        description: 'System analyzes quiz results, sales performance, and feedback to recommend specific training modules for each person',
        value: 'Targeted skill development, efficient use of training time',
        whoUsesIt: 'All users, managed by HR and Admin',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'September 19, 2025',
        userTypes: ['Promoters', 'Sales Reps', 'Admin'],
        examples: [
          'If someone struggles with Product A sales, system suggests Product A training',
          'If quiz scores are low on compliance, suggests compliance training',
          'Tracks completion and improvement'
        ]
      },
      {
        id: 'september-10',
        title: 'Gamification Platform',
        description: 'Add leaderboards (daily/weekly/monthly top performers), achievement badges, team challenges, and point systems',
        value: 'Makes work more engaging, friendly competition boosts performance',
        whoUsesIt: 'Promoters and reps',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'September 22, 2025',
        userTypes: ['Promoters', 'Sales Reps'],
        examples: [
          '"Sales Champion" badge for top monthly performer',
          '"Streak Master" for 30 consecutive days',
          'Team competitions between stores'
        ]
      },
      {
        id: 'september-11',
        title: 'Complete Promoter Mobile App',
        description: 'Finish development of promoter mobile application',
        value: 'Complete mobile access to work tools for promoters',
        whoUsesIt: 'Promoters',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'September 10, 2025',
        userTypes: ['Promoters']
      },
      {
        id: 'september-12',
        title: 'Complete Rep Mobile App',
        description: 'Finish development of sales rep mobile application',
        value: 'Complete mobile tools for field sales representatives',
        whoUsesIt: 'Sales reps',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'September 12, 2025',
        userTypes: ['Sales Reps']
      },
      {
        id: 'september-13',
        title: 'Work on Promoter "Wrapped" like Spotify',
        description: 'Create personalized year-end summary for promoters',
        value: 'Recognition and motivation through personalized achievements',
        whoUsesIt: 'Promoters',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'September 15, 2025',
        userTypes: ['Promoters'],
        examples: [
          'Top earning days and achievements',
          'Most visited stores and performance stats',
          'Sales achievements and team collaboration stats'
        ]
      },
      {
        id: 'september-14',
        title: 'Continue Work on Merch & Move Platform',
        description: 'Continue development of external merchandising platform',
        value: 'Progress on new revenue stream capabilities',
        whoUsesIt: 'Admin staff managing external clients',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'September 17, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'september-15',
        title: 'Start Preparing for 2026 Rollover',
        description: 'Begin preparation for next year system transition',
        value: 'Smooth transition to 2026 operations',
        whoUsesIt: 'All users',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'September 19, 2025',
        userTypes: ['Promoters', 'Sales Reps', 'Admin']
      },
      {
        id: 'september-16',
        title: 'Improve Promoter and Rep Leaderboards',
        description: 'Enhance leaderboard functionality with better categorization',
        value: 'Better performance tracking and motivation',
        whoUsesIt: 'Promoters and sales reps',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'September 22, 2025',
        userTypes: ['Promoters', 'Sales Reps'],
        examples: [
          'Weekly/monthly rankings',
          'Category-specific leaderboards',
          'Achievement badges'
        ]
      },
      {
        id: 'september-17',
        title: 'Start Work on AI Assistant for Promoters',
        description: 'Begin development of AI-powered assistant for promoters',
        value: 'Automated support and guidance for promoters',
        whoUsesIt: 'Promoters',
        priority: 'Low',
        status: 'not-started',
        estimatedDate: 'September 24, 2025',
        userTypes: ['Promoters']
      },
      // TASKS MOVED FROM AUGUST
      {
        id: 'august-9',
        title: 'Start Rep Mobile App',
        description: 'Begin building smartphone app for sales reps',
        value: 'Reps can work more efficiently in the field',
        whoUsesIt: 'Sales reps',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'September 26, 2025',
        userTypes: ['Sales Reps']
      },
      {
        id: 'august-10',
        title: 'Add Internal Notes Feature',
        description: 'Allow admins to add private notes about promoters or clients',
        value: 'Better record-keeping and knowledge sharing between managers',
        whoUsesIt: 'Admin staff',
        priority: 'Low',
        status: 'not-started',
        estimatedDate: 'September 29, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'august-11',
        title: 'Doctor-Pharmacy Mapping System',
        description: 'Create visual maps showing all doctors and pharmacies within 2km of each other',
        value: 'Understand patient flow - if doctor prescribes our product, we know which nearby pharmacies need stock',
        whoUsesIt: 'Sales reps and admin staff',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'September 24, 2025',
        userTypes: ['Sales Reps', 'Admin'],
        examples: [
          'Visual maps showing doctor-pharmacy proximity',
          'Patient flow analysis between doctors and pharmacies',
          'Stock optimization based on prescription patterns',
          'Territory planning for sales reps'
        ]
      },
      {
        id: 'august-12',
        title: 'Reverse Pharmacy Analysis',
        description: 'For each pharmacy, show which doctors are within 2km and their prescribing patterns',
        value: 'Help reps prioritize which doctors to visit based on nearby pharmacy potential',
        whoUsesIt: 'Sales reps and their managers',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'September 26, 2025',
        userTypes: ['Sales Reps', 'Admin']
      },
      {
        id: 'august-14',
        title: 'Stock Alerts System',
        description: 'Comprehensive automated alert system that monitors stock levels across all stores and sends real-time notifications when inventory falls below predefined thresholds. Includes customizable alert levels (critical, low, medium) with different notification methods (email, SMS, in-app notifications) based on urgency.',
        value: 'Prevents stock-outs, ensures products are always available for customers, reduces lost sales opportunities, enables proactive inventory management',
        whoUsesIt: 'Admin staff and sales reps',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'September 29, 2025',
        userTypes: ['Sales Reps', 'Admin'],
        examples: [
          'Critical Alert: Store X has 0 units of Product A - immediate restocking required',
          'Low Stock Alert: Store Y has 5 units of Product B remaining (below 10-unit threshold)',
          'Weekly Summary: 15 stores require restocking across 8 different products',
          'Predictive Alert: Based on sales velocity, Store Z will run out of Product C in 3 days',
          'Regional Alert: Northern region showing low stock patterns across multiple high-demand products'
        ]
      },
      {
        id: 'august-15',
        title: 'Stock Reports Dashboard',
        description: 'Daily, weekly, and monthly reports showing stock levels across all stores',
        value: 'Better inventory management, identify slow-moving products',
        whoUsesIt: 'Admin staff and management',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'September 30, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'august-21',
        title: 'Start work on Merch & Move Platform',
        description: 'Begin development of external merchandising platform',
        value: 'New revenue stream through external client management',
        whoUsesIt: 'Admin staff managing external clients',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'September 24, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'august-22',
        title: 'Upload Previous Year Data and Explore if Bubble can handle hundreds of thousands of rows',
        description: 'Test system capacity with large historical datasets',
        value: 'Validate system scalability and historical data access',
        whoUsesIt: 'Admin staff',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'September 26, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'august-24',
        title: 'Start Work on Rep Mobile',
        description: 'Begin development of sales rep mobile application',
        value: 'Mobile tools for field sales representatives',
        whoUsesIt: 'Sales reps',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'September 29, 2025',
        userTypes: ['Sales Reps']
      },
      {
        id: 'august-25',
        title: 'Start Research and Exploration on How AI can be used in our Processes',
        description: 'Research AI applications for business process optimization',
        value: 'Foundation for AI-powered automation and insights',
        whoUsesIt: 'Admin staff and management',
        priority: 'Low',
        status: 'not-started',
        estimatedDate: 'September 26, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'august-26',
        title: 'Enable Admins to add Notes to a Promoter or Client',
        description: 'Add note-taking functionality for admin users',
        value: 'Better record-keeping and client relationship management',
        whoUsesIt: 'Admin staff',
        priority: 'Low',
        status: 'not-started',
        estimatedDate: 'September 30, 2025',
        userTypes: ['Admin']
      }
    ]
  },
  {
    id: 'october-2025',
    title: 'OCTOBER 2025',
    theme: 'AI Integration & Analytics - Smart automation and data-driven insights',
    isExpanded: false,
    tasks: [
      {
        id: 'october-1',
        title: 'Backlog from September',
        description: 'Finish any remaining items from September',
        value: 'Ensures solid foundation before adding new features',
        whoUsesIt: 'All users',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'October 5, 2025',
        userTypes: ['Promoters', 'Sales Reps', 'Admin']
      },
      {
        id: 'october-2',
        title: 'Complete Recruitment Module',
        description: 'Finish recruitment tracking and analytics system',
        value: 'Better hiring decisions, optimize recruitment strategies',
        whoUsesIt: 'HR and Admin staff',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'October 5, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'october-3',
        title: 'Enhanced Client View',
        description: 'Comprehensive dashboard showing complete client (doctor/pharmacy) performance and interaction history',
        value: 'Complete client relationship picture, better service, identify opportunities',
        whoUsesIt: 'Sales reps and managers',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'October 8, 2025',
        userTypes: ['Sales Reps', 'Admin'],
        examples: [
          'Doctor X has been visited 12 times this year, prescribed our products 45 times, generated R50,000 in sales',
          'Pharmacy Y ordered 500 units, sold 480, has 20 remaining, last order was 2 weeks ago'
        ]
      },
      {
        id: 'october-4',
        title: 'Company-Wide Analytics Dashboard',
        description: 'Executive dashboard showing overall business performance',
        value: 'High-level business insights for strategic decisions',
        whoUsesIt: 'Senior management',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'October 10, 2025',
        userTypes: ['Admin'],
        examples: [
          'Total sales vs targets',
          'Promoter productivity trends',
          'Regional performance comparison',
          'Product performance ranking',
          'Cost per sale analysis'
        ]
      },
      {
        id: 'october-5',
        title: 'Comparison Tools',
        description: 'Side-by-side comparison of promoters, clients, stores, or regions',
        value: 'Identify best practices, spot improvement opportunities, fair performance evaluation',
        whoUsesIt: 'Admin staff and managers',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'October 12, 2025',
        userTypes: ['Admin'],
        examples: [
          'Compare Promoter A vs Promoter B on sales, attendance, customer feedback',
          'Compare Store X vs Store Y on foot traffic, conversion rates, product mix'
        ]
      },
      {
        id: 'october-6',
        title: 'Present AI Strategy',
        description: 'Comprehensive plan for using AI to improve business operations',
        value: 'Roadmap for competitive advantage through technology',
        whoUsesIt: 'Senior management',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'October 15, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'october-7',
        title: 'Complete Merch & Move V1',
        description: 'Finish first version of external merchandising business platform',
        value: 'Launch new revenue stream',
        whoUsesIt: 'Admin staff managing external clients',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'October 18, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'october-8',
        title: 'Sales Forecasting & Intervention System',
        description: 'Predict future sales by client and promoter based on current trajectory, identify where intervention is needed',
        value: 'Proactive management, prevent problems before they impact results',
        whoUsesIt: 'Admin staff and managers',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'October 22, 2025',
        userTypes: ['Admin'],
        examples: [
          'Promoter X is trending 20% below target, needs coaching',
          'Client Y orders decreasing, requires rep visit',
          'Store Z sales declining, investigate competition'
        ]
      },
      {
        id: 'october-9',
        title: 'Product Performance Analytics',
        description: 'Comprehensive analysis of product sales performance by promoter, store, and overall trends',
        value: 'Optimize inventory, identify training needs, strategic product decisions',
        whoUsesIt: 'Admin staff and management',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'October 30, 2025',
        userTypes: ['Admin'],
        examples: [
          'Product A: 15,000 units sold, top performer is Promoter X with 500 units',
          'Store Y sells most of Product B',
          'Product C declining 10% this quarter'
        ]
      },
      {
        id: 'october-10',
        title: 'Complete AI Assistant for Promoters',
        description: 'Finish development of AI-powered assistant for promoters',
        value: 'Automated support and guidance available 24/7',
        whoUsesIt: 'Promoters',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'October 10, 2025',
        userTypes: ['Promoters'],
        examples: [
          'Schedule inquiries and assistance',
          'Commission calculations and explanations',
          'Policy questions and guidance'
        ]
      },
      {
        id: 'october-11',
        title: 'Start AI-powered Scheduling Optimization',
        description: 'Begin development of AI-driven scheduling system',
        value: 'Optimal shift allocation based on performance and availability',
        whoUsesIt: 'Admin staff and promoters',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'October 12, 2025',
        userTypes: ['Promoters', 'Admin']
      },
      {
        id: 'october-12',
        title: 'Build Advanced Analytics Dashboard for Management',
        description: 'Create comprehensive executive dashboard with predictive insights',
        value: 'Strategic decision-making through advanced data analysis',
        whoUsesIt: 'Senior management',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'October 18, 2025',
        userTypes: ['Admin'],
        examples: [
          'Revenue forecasting and trend analysis',
          'Performance trends across regions',
          'Market opportunity analysis'
        ]
      },
      {
        id: 'october-13',
        title: 'Complete Merch & Move Platform',
        description: 'Finalize external merchandising platform development',
        value: 'Launch new revenue stream capabilities',
        whoUsesIt: 'Admin staff managing external clients',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'October 15, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'october-14',
        title: 'Implement AI-powered Performance Coaching',
        description: 'Deploy AI system for personalized performance improvement',
        value: 'Automated coaching and development recommendations',
        whoUsesIt: 'All users',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'October 20, 2025',
        userTypes: ['Promoters', 'Sales Reps', 'Admin']
      },
      {
        id: 'october-15',
        title: 'Start Work on Predictive Analytics',
        description: 'Begin development of predictive analytics capabilities',
        value: 'Proactive insights for business optimization',
        whoUsesIt: 'Admin staff and management',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'October 22, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'october-16',
        title: 'Implement Smart Notifications and Alerts',
        description: 'Deploy intelligent notification system',
        value: 'Timely, relevant alerts for all users',
        whoUsesIt: 'All users',
        priority: 'Low',
        status: 'not-started',
        estimatedDate: 'October 28, 2025',
        userTypes: ['Promoters', 'Sales Reps', 'Admin']
      }
    ]
  },
  {
    id: 'november-2025',
    title: 'NOVEMBER 2025',
    theme: 'Advanced Features & Expansion',
    isExpanded: false,
    tasks: [
      {
        id: 'november-1',
        title: 'Backlog from October',
        description: 'Finish any remaining items from October',
        value: 'Ensures solid foundation before adding new features',
        whoUsesIt: 'All users',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'November 5, 2025',
        userTypes: ['Promoters', 'Sales Reps', 'Admin']
      },
      {
        id: 'november-2',
        title: 'Prepare for 2026 Rollover',
        description: 'Set up targets and statements for next year',
        value: 'Smooth transition to new year operations',
        whoUsesIt: 'All users',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'November 5, 2025',
        userTypes: ['Promoters', 'Sales Reps', 'Admin']
      },
      {
        id: 'november-3',
        title: 'AI Store Data Enhancement',
        description: 'Use AI to automatically gather and update information about shopping center sizes, square footage, and store ratings based on shopping center size',
        value: 'Better store classification, understand correlation between store size and sales performance',
        whoUsesIt: 'Admin staff and management',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'November 8, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'november-4',
        title: 'AI Store Hours Management',
        description: 'Automatically collect and maintain opening and closing times for all stores',
        value: 'Accurate scheduling, better shift planning, ensure promoters work during store hours',
        whoUsesIt: 'Admin staff and promoters',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'November 10, 2025',
        userTypes: ['Promoters', 'Admin']
      },
      {
        id: 'november-5',
        title: 'AI Roster Scheduling',
        description: 'AI automatically creates optimal shift schedules based on promoter availability, store needs, and performance history',
        value: 'Optimal coverage, reduced manual scheduling time, fair shift distribution',
        whoUsesIt: 'Admin staff, benefits all promoters',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'November 12, 2025',
        userTypes: ['Promoters', 'Admin']
      },
      {
        id: 'november-6',
        title: 'AI Job Shadow Pairing',
        description: 'AI automatically pairs new promoters with experienced ones for training, ensuring same region and one pairing per promoter per day',
        value: 'Efficient training, optimal mentor-mentee matching, consistent onboarding experience',
        whoUsesIt: 'HR and Admin staff, benefits new promoters',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'November 15, 2025',
        userTypes: ['Promoters', 'Admin']
      },
      {
        id: 'november-7',
        title: 'Intelligent Workforce Planning - Shift Optimization',
        description: 'AI suggests optimal shift schedules based on store traffic patterns, promoter performance, and historical data',
        value: 'Right people in right places at right times, maximize sales potential',
        whoUsesIt: 'Admin staff and managers',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'November 20, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'november-8',
        title: 'Intelligent Workforce Planning - Promoter Allocation',
        description: 'System recommends which promoters to assign to which stores based on their success history and store characteristics',
        value: 'Optimize promoter-store matching, improve sales performance',
        whoUsesIt: 'Admin staff and managers',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'November 30, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'november-9',
        title: 'Complete Advanced Sales Forecasting with AI',
        description: 'Finalize AI-powered sales forecasting system',
        value: 'Accurate sales predictions for strategic planning',
        whoUsesIt: 'Admin staff and management',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'November 8, 2025',
        userTypes: ['Admin']
      },
      {
        id: 'november-10',
        title: 'Build Comprehensive Training Platform',
        description: 'Create complete training system with interactive content',
        value: 'Standardized, effective training for all staff',
        whoUsesIt: 'All users',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'November 12, 2025',
        userTypes: ['Promoters', 'Sales Reps', 'Admin'],
        examples: [
          'Interactive video courses',
          'Knowledge assessments and quizzes',
          'Skill certifications and tracking'
        ]
      },
      {
        id: 'november-11',
        title: 'Implement Advanced Security and Compliance Features',
        description: 'Deploy enhanced security measures and compliance tools',
        value: 'Secure operations and regulatory compliance',
        whoUsesIt: 'All users',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'November 22, 2025',
        userTypes: ['Promoters', 'Sales Reps', 'Admin']
      }
    ]
  },
  {
    id: 'december-2025',
    title: 'DECEMBER 2025',
    theme: 'Platform Optimization & 2026 Preparation - Final optimizations and preparation for the new year',
    isExpanded: false,
    tasks: [
      {
        id: 'december-1',
        title: 'Backlog from November',
        description: 'Finish any remaining items from November',
        value: 'Solid foundation for next year',
        whoUsesIt: 'All users',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'December 5, 2025',
        userTypes: ['Promoters', 'Sales Reps', 'Admin']
      },
      {
        id: 'december-2',
        title: '2025 Wrapped for Promoters',
        description: 'Personalized year-end summary like Spotify Wrapped',
        value: 'Recognition, motivation, shareable achievements',
        whoUsesIt: 'Promoters',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'December 5, 2025',
        userTypes: ['Promoters']
      },
      {
        id: 'december-3',
        title: 'Advanced Analytics Suite - Predictive Insights',
        description: 'Combine all data sources to predict business trends, identify risks, and recommend actions',
        value: 'Data-driven strategic planning, competitive advantage',
        whoUsesIt: 'Senior management',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'December 10, 2025',
        userTypes: ['Admin'],
        examples: [
          'Based on current trends, Q1 2026 sales will be 12% above target',
          'Competitor activity suggests focus on Product X'
        ]
      },
      {
        id: 'december-4',
        title: 'Advanced Analytics Suite - Performance Modeling',
        description: 'Create models that show impact of different business decisions',
        value: 'Test scenarios before implementation, optimize resource allocation',
        whoUsesIt: 'Senior management',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'December 15, 2025',
        userTypes: ['Admin'],
        examples: [
          'Adding 10 promoters to this region will increase sales by 15%',
          'Reducing Product B price by 5% will boost volume by 25%'
        ]
      },
      {
        id: 'december-5',
        title: 'Automated Performance Coaching - Skill Gap Analysis',
        description: 'AI identifies specific skills each person needs to improve',
        value: 'Targeted development, efficient training investment',
        whoUsesIt: 'All users, managed by HR',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'December 20, 2025',
        userTypes: ['Promoters', 'Sales Reps', 'Admin'],
        examples: [
          'Promoter X needs product knowledge training',
          'Rep Y needs closing techniques coaching'
        ]
      },
      {
        id: 'december-6',
        title: 'Automated Performance Coaching - Personalized Action Plans',
        description: 'AI creates custom improvement plans for each person',
        value: 'Clear path to improvement, personalized development',
        whoUsesIt: 'All users, managed by supervisors',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'December 30, 2025',
        userTypes: ['Promoters', 'Sales Reps', 'Admin'],
        examples: [
          'To reach target, focus on Product A, work weekends in Store X, complete Module Y training'
        ]
      },
      {
        id: 'december-7',
        title: 'Complete 2026 System Preparation and Migration',
        description: 'Finalize all preparations for 2026 system transition',
        value: 'Seamless transition to new year operations',
        whoUsesIt: 'All users',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'December 10, 2025',
        userTypes: ['Promoters', 'Sales Reps', 'Admin']
      },
      {
        id: 'december-8',
        title: 'Comprehensive System Performance Optimization',
        description: 'Optimize all system components for peak performance',
        value: 'Faster, more reliable system operations',
        whoUsesIt: 'All users',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'December 12, 2025',
        userTypes: ['Promoters', 'Sales Reps', 'Admin']
      },
      {
        id: 'december-9',
        title: 'Complete Training Platform with Full Course Library',
        description: 'Finalize comprehensive training platform with all courses',
        value: 'Complete training solution for all roles',
        whoUsesIt: 'All users',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'December 15, 2025',
        userTypes: ['Promoters', 'Sales Reps', 'Admin']
      },
      {
        id: 'december-10',
        title: 'Conduct Comprehensive Security Audit',
        description: 'Complete security review and vulnerability assessment',
        value: 'Secure, compliant system operations',
        whoUsesIt: 'All users',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'December 22, 2025',
        userTypes: ['Promoters', 'Sales Reps', 'Admin']
      },
      {
        id: 'december-11',
        title: 'System Backup and Disaster Recovery Testing',
        description: 'Test and validate all backup and recovery procedures',
        value: 'Business continuity and data protection',
        whoUsesIt: 'All users',
        priority: 'High',
        status: 'not-started',
        estimatedDate: 'December 30, 2025',
        userTypes: ['Promoters', 'Sales Reps', 'Admin']
      },
      {
        id: 'december-12',
        title: 'Create Comprehensive 2025 Year-End Reports',
        description: 'Generate complete year-end performance and analytics reports',
        value: 'Complete year performance analysis and insights',
        whoUsesIt: 'Admin staff and management',
        priority: 'Medium',
        status: 'not-started',
        estimatedDate: 'December 24, 2025',
        userTypes: ['Admin']
      }
    ]
  }
];

// Export the processed data with sorted tasks and weekend dates moved to Monday
export const roadmapData: Month[] = rawRoadmapData.map(month => ({
  ...month,
  tasks: sortTasksByDate(processTaskDates(month.tasks))
}));