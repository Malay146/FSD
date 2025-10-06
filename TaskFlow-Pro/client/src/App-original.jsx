import React from 'react';
import TestComponent from './TestComponent';

function App() {
  return <TestComponent />;
}

export default App;
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete MERN Stack Project', status: 'in-progress', priority: 'high', dueDate: '2025-09-25' },
    { id: 2, title: 'Deploy to Firebase', status: 'pending', priority: 'medium', dueDate: '2025-09-26' },
    { id: 3, title: 'Push to GitHub', status: 'pending', priority: 'high', dueDate: '2025-09-26' },
    { id: 4, title: 'Write Documentation', status: 'completed', priority: 'low', dueDate: '2025-09-24' },
  ]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    const pending = tasks.filter(task => task.status === 'pending').length;
    
    return { total, completed, inProgress, pending };
  };

  const stats = getTaskStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-dark-900 dark:to-dark-800 transition-all duration-500">
      {/* Navigation Header */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass dark:glass-dark p-4 m-4 rounded-2xl"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center"
            >
              <Target className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                TaskFlow Pro
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Productivity Hub</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/20 dark:bg-dark-700/50 border border-white/30 dark:border-white/20"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <div className="flex gap-4 mx-4">
        {/* Sidebar */}
        <motion.aside 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-64 glass dark:glass-dark rounded-2xl p-6 h-fit"
        >
          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'tasks', label: 'Tasks', icon: CheckCircle },
              { id: 'calendar', label: 'Calendar', icon: Calendar },
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: 5 }}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-white/10'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* Quick Stats */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 p-4 bg-gradient-to-r from-primary-500/10 to-primary-600/10 rounded-xl border border-primary-200 dark:border-primary-800"
          >
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Total Tasks</span>
                <span className="font-bold text-gray-800 dark:text-white">{stats.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Completed</span>
                <span className="font-bold text-green-600">{stats.completed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-600">In Progress</span>
                <span className="font-bold text-blue-600">{stats.inProgress}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-orange-600">Pending</span>
                <span className="font-bold text-orange-600">{stats.pending}</span>
              </div>
            </div>
          </motion.div>
        </motion.aside>

        {/* Main Content */}
        <motion.main 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex-1 space-y-6"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Tasks', value: stats.total, icon: Target, color: 'blue', change: '+2' },
              { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'green', change: '+1' },
              { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'orange', change: '+1' },
              { label: 'Productivity', value: '87%', icon: TrendingUp, color: 'purple', change: '+5%' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="card group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-green-500 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change} from last week
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 group-hover:scale-110 transition-transform duration-200`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tasks Section */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Recent Tasks</h2>
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Task</span>
                </motion.button>
              </div>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-4 bg-white/50 dark:bg-dark-700/50 rounded-xl border border-white/30 dark:border-white/20 hover:bg-white/70 dark:hover:bg-dark-700/70 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-4 h-4 rounded-full border-2 cursor-pointer ${
                          task.status === 'completed'
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
                        }`}
                      />
                      <div>
                        <h3 className={`font-medium ${
                          task.status === 'completed' 
                            ? 'line-through text-gray-500 dark:text-gray-400' 
                            : 'text-gray-800 dark:text-white'
                        }`}>
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Due: {task.dueDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {task.priority}
                      </span>
                      
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}>
                        {task.status.replace('-', ' ')}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Welcome Message */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="card bg-gradient-to-r from-primary-500/10 to-primary-600/10 border-primary-200 dark:border-primary-800"
          >
            <div className="text-center py-8">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <Target className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Welcome to TaskFlow Pro!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                A modern MERN stack application designed to boost your productivity. 
                Manage tasks, track progress, and achieve your goals with style.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary mt-6"
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
}

export default App;
