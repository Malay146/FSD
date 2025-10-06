import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	CheckCircle,
	Plus,
	User,
	Calendar,
	BarChart3,
	Settings,
	Moon,
	Sun,
	Target,
	Clock,
	TrendingUp,
	Filter,
	Search,
	Edit3,
	Trash2,
	Star,
} from "lucide-react";

function App() {
	const [darkMode, setDarkMode] = useState(false);
	const [activeTab, setActiveTab] = useState("dashboard");
	const [tasks, setTasks] = useState([
		{
			id: 1,
			title: "Complete MERN Stack Project",
			description:
				"Build a full-stack web application using MongoDB, Express, React, and Node.js",
			status: "in-progress",
			priority: "high",
			category: "Work",
			dueDate: "2025-09-25",
			completed: false,
		},
		{
			id: 2,
			title: "Study React Hooks",
			description: "Learn useState, useEffect, useContext, and custom hooks",
			status: "completed",
			priority: "medium",
			category: "Learning",
			dueDate: "2025-09-20",
			completed: true,
		},
		{
			id: 3,
			title: "Design System Implementation",
			description:
				"Create a comprehensive design system with reusable components",
			status: "pending",
			priority: "low",
			category: "Design",
			dueDate: "2025-09-30",
			completed: false,
		},
	]);

	const [searchTerm, setSearchTerm] = useState("");
	const [filterPriority, setFilterPriority] = useState("all");
	const [filterStatus, setFilterStatus] = useState("all");

	const getTaskStats = () => {
		const total = tasks.length;
		const completed = tasks.filter((task) => task.completed).length;
		const inProgress = tasks.filter(
			(task) => task.status === "in-progress"
		).length;
		const pending = tasks.filter((task) => task.status === "pending").length;
		const completionRate =
			total > 0 ? Math.round((completed / total) * 100) : 0;

		return { total, completed, inProgress, pending, completionRate };
	};

	const filteredTasks = tasks.filter((task) => {
		const matchesSearch =
			task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			task.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesPriority =
			filterPriority === "all" || task.priority === filterPriority;
		const matchesStatus =
			filterStatus === "all" || task.status === filterStatus;

		return matchesSearch && matchesPriority && matchesStatus;
	});

	const toggleTask = (taskId) => {
		setTasks(
			tasks.map((task) =>
				task.id === taskId
					? {
							...task,
							completed: !task.completed,
							status: !task.completed ? "completed" : "pending",
					  }
					: task
			)
		);
	};

	const addTask = () => {
		const newTask = {
			id: Date.now(),
			title: "New Task",
			description: "Task description",
			status: "pending",
			priority: "medium",
			category: "General",
			dueDate: new Date().toISOString().split("T")[0],
			completed: false,
		};
		setTasks([...tasks, newTask]);
	};

	const deleteTask = (taskId) => {
		setTasks(tasks.filter((task) => task.id !== taskId));
	};

	const stats = getTaskStats();

	const getPriorityColor = (priority) => {
		switch (priority) {
			case "high":
				return "text-red-600 bg-red-100";
			case "medium":
				return "text-yellow-600 bg-yellow-100";
			case "low":
				return "text-green-600 bg-green-100";
			default:
				return "text-gray-600 bg-gray-100";
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "completed":
				return "text-green-600 bg-green-100";
			case "in-progress":
				return "text-blue-600 bg-blue-100";
			case "pending":
				return "text-gray-600 bg-gray-100";
			default:
				return "text-gray-600 bg-gray-100";
		}
	};

	return (
		<div
			className={`min-h-screen transition-all duration-500 ${
				darkMode
					? "bg-gray-900 text-white"
					: "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
			}`}
		>
			{/* Navigation Header */}
			<motion.nav
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				className={`${
					darkMode
						? "bg-gray-800 border-gray-700"
						: "bg-white/80 border-white/20"
				} backdrop-blur-lg border-b sticky top-0 z-50`}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center space-x-4">
							<div className="flex items-center space-x-2">
								<Target className="h-8 w-8 text-blue-600" />
								<span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
									TaskFlow Pro
								</span>
							</div>
						</div>

						<div className="flex items-center space-x-4">
							<button
								onClick={() => setDarkMode(!darkMode)}
								className={`p-2 rounded-lg transition-colors ${
									darkMode
										? "bg-gray-700 hover:bg-gray-600"
										: "bg-white/20 hover:bg-white/30"
								}`}
							>
								{darkMode ? (
									<Sun className="h-5 w-5" />
								) : (
									<Moon className="h-5 w-5" />
								)}
							</button>

							<div className="flex items-center space-x-2">
								<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
									<User className="h-4 w-4 text-white" />
								</div>
								<span className="text-sm font-medium">John Doe</span>
							</div>
						</div>
					</div>
				</div>
			</motion.nav>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Tab Navigation */}
				<div className="flex space-x-1 mb-8">
					{[
						{ id: "dashboard", label: "Dashboard", icon: BarChart3 },
						{ id: "tasks", label: "Tasks", icon: CheckCircle },
						{ id: "calendar", label: "Calendar", icon: Calendar },
						{ id: "settings", label: "Settings", icon: Settings },
					].map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
								activeTab === tab.id
									? darkMode
										? "bg-blue-600 text-white"
										: "bg-blue-600 text-white shadow-lg"
									: darkMode
									? "text-gray-300 hover:bg-gray-700"
									: "text-gray-600 hover:bg-white/50"
							}`}
						>
							<tab.icon className="h-4 w-4" />
							<span>{tab.label}</span>
						</button>
					))}
				</div>

				{/* Dashboard Content */}
				{activeTab === "dashboard" && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						{/* Stats Cards */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
							{[
								{
									title: "Total Tasks",
									value: stats.total,
									icon: Target,
									color: "from-blue-500 to-blue-600",
									bgColor: "bg-blue-50",
									textColor: "text-blue-600",
								},
								{
									title: "Completed",
									value: stats.completed,
									icon: CheckCircle,
									color: "from-green-500 to-green-600",
									bgColor: "bg-green-50",
									textColor: "text-green-600",
								},
								{
									title: "In Progress",
									value: stats.inProgress,
									icon: Clock,
									color: "from-yellow-500 to-yellow-600",
									bgColor: "bg-yellow-50",
									textColor: "text-yellow-600",
								},
								{
									title: "Completion Rate",
									value: `${stats.completionRate}%`,
									icon: TrendingUp,
									color: "from-purple-500 to-purple-600",
									bgColor: "bg-purple-50",
									textColor: "text-purple-600",
								},
							].map((stat, index) => (
								<motion.div
									key={stat.title}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									className={`${
										darkMode
											? "bg-gray-800 border-gray-700"
											: `${stat.bgColor} border-white/20 shadow-lg`
									} rounded-xl p-6 border backdrop-blur-sm hover:scale-105 transition-transform`}
								>
									<div className="flex items-center justify-between">
										<div>
											<p
												className={`text-sm font-medium ${
													darkMode ? "text-gray-300" : "text-gray-600"
												}`}
											>
												{stat.title}
											</p>
											<p
												className={`text-2xl font-bold ${
													darkMode ? "text-white" : stat.textColor
												}`}
											>
												{stat.value}
											</p>
										</div>
										<div
											className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}
										>
											<stat.icon className="h-6 w-6 text-white" />
										</div>
									</div>
								</motion.div>
							))}
						</div>

						{/* Recent Tasks */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className={`${
								darkMode
									? "bg-gray-800 border-gray-700"
									: "bg-white/80 border-white/20"
							} rounded-xl p-6 border backdrop-blur-sm shadow-lg`}
						>
							<h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
								<Clock className="h-5 w-5" />
								<span>Recent Tasks</span>
							</h3>
							<div className="space-y-3">
								{tasks.slice(0, 3).map((task) => (
									<div
										key={task.id}
										className={`flex items-center justify-between p-3 rounded-lg ${
											darkMode ? "bg-gray-700" : "bg-gray-50"
										}`}
									>
										<div className="flex items-center space-x-3">
											<button
												onClick={() => toggleTask(task.id)}
												className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
													task.completed
														? "bg-green-500 border-green-500"
														: darkMode
														? "border-gray-400 hover:border-green-400"
														: "border-gray-300 hover:border-green-500"
												}`}
											>
												{task.completed && (
													<CheckCircle className="h-3 w-3 text-white" />
												)}
											</button>
											<div>
												<p
													className={`font-medium ${
														task.completed ? "line-through opacity-50" : ""
													}`}
												>
													{task.title}
												</p>
												<p className="text-sm text-gray-500">{task.category}</p>
											</div>
										</div>
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
												task.priority
											)}`}
										>
											{task.priority}
										</span>
									</div>
								))}
							</div>
						</motion.div>
					</motion.div>
				)}

				{/* Tasks Content */}
				{activeTab === "tasks" && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						{/* Filters and Search */}
						<div
							className={`${
								darkMode
									? "bg-gray-800 border-gray-700"
									: "bg-white/80 border-white/20"
							} rounded-xl p-6 border backdrop-blur-sm shadow-lg mb-6`}
						>
							<div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
								<div className="flex items-center space-x-4">
									<div className="relative">
										<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
										<input
											type="text"
											placeholder="Search tasks..."
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
											className={`pl-10 pr-4 py-2 rounded-lg border ${
												darkMode
													? "bg-gray-700 border-gray-600 text-white"
													: "bg-white border-gray-200"
											} focus:outline-none focus:ring-2 focus:ring-blue-500`}
										/>
									</div>

									<select
										value={filterPriority}
										onChange={(e) => setFilterPriority(e.target.value)}
										className={`px-4 py-2 rounded-lg border ${
											darkMode
												? "bg-gray-700 border-gray-600 text-white"
												: "bg-white border-gray-200"
										} focus:outline-none focus:ring-2 focus:ring-blue-500`}
									>
										<option value="all">All Priorities</option>
										<option value="high">High</option>
										<option value="medium">Medium</option>
										<option value="low">Low</option>
									</select>

									<select
										value={filterStatus}
										onChange={(e) => setFilterStatus(e.target.value)}
										className={`px-4 py-2 rounded-lg border ${
											darkMode
												? "bg-gray-700 border-gray-600 text-white"
												: "bg-white border-gray-200"
										} focus:outline-none focus:ring-2 focus:ring-blue-500`}
									>
										<option value="all">All Status</option>
										<option value="pending">Pending</option>
										<option value="in-progress">In Progress</option>
										<option value="completed">Completed</option>
									</select>
								</div>

								<button
									onClick={addTask}
									className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
								>
									<Plus className="h-4 w-4" />
									<span>Add Task</span>
								</button>
							</div>
						</div>

						{/* Tasks Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<AnimatePresence>
								{filteredTasks.map((task) => (
									<motion.div
										key={task.id}
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.9 }}
										transition={{ duration: 0.3 }}
										className={`${
											darkMode
												? "bg-gray-800 border-gray-700"
												: "bg-white/80 border-white/20"
										} rounded-xl p-6 border backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all`}
									>
										<div className="flex items-start justify-between mb-4">
											<button
												onClick={() => toggleTask(task.id)}
												className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
													task.completed
														? "bg-green-500 border-green-500"
														: darkMode
														? "border-gray-400 hover:border-green-400"
														: "border-gray-300 hover:border-green-500"
												}`}
											>
												{task.completed && (
													<CheckCircle className="h-4 w-4 text-white" />
												)}
											</button>

											<div className="flex items-center space-x-2">
												<button
													className={`p-1 rounded hover:${
														darkMode ? "bg-gray-700" : "bg-gray-100"
													}`}
												>
													<Edit3 className="h-4 w-4" />
												</button>
												<button
													onClick={() => deleteTask(task.id)}
													className={`p-1 rounded hover:${
														darkMode ? "bg-gray-700" : "bg-gray-100"
													} text-red-500`}
												>
													<Trash2 className="h-4 w-4" />
												</button>
											</div>
										</div>

										<h3
											className={`font-semibold mb-2 ${
												task.completed ? "line-through opacity-50" : ""
											}`}
										>
											{task.title}
										</h3>
										<p
											className={`text-sm mb-4 ${
												darkMode ? "text-gray-300" : "text-gray-600"
											} ${task.completed ? "line-through opacity-50" : ""}`}
										>
											{task.description}
										</p>

										<div className="flex items-center justify-between mb-3">
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
													task.priority
												)}`}
											>
												{task.priority}
											</span>
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
													task.status
												)}`}
											>
												{task.status}
											</span>
										</div>

										<div className="flex items-center justify-between text-sm">
											<span
												className={`${
													darkMode ? "text-gray-400" : "text-gray-500"
												}`}
											>
												{task.category}
											</span>
											<span
												className={`${
													darkMode ? "text-gray-400" : "text-gray-500"
												}`}
											>
												Due: {new Date(task.dueDate).toLocaleDateString()}
											</span>
										</div>
									</motion.div>
								))}
							</AnimatePresence>
						</div>
					</motion.div>
				)}

				{/* Calendar and Settings tabs placeholder */}
				{(activeTab === "calendar" || activeTab === "settings") && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className={`${
							darkMode
								? "bg-gray-800 border-gray-700"
								: "bg-white/80 border-white/20"
						} rounded-xl p-12 border backdrop-blur-sm shadow-lg text-center`}
					>
						<div className="max-w-md mx-auto">
							<div className="mb-4">
								{activeTab === "calendar" ? (
									<Calendar className="h-16 w-16 mx-auto text-blue-500" />
								) : (
									<Settings className="h-16 w-16 mx-auto text-blue-500" />
								)}
							</div>
							<h3 className="text-xl font-semibold mb-2">
								{activeTab === "calendar" ? "Calendar View" : "Settings"}
							</h3>
							<p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
								{activeTab === "calendar"
									? "Calendar functionality coming soon! View and manage your tasks by date."
									: "Settings panel coming soon! Customize your TaskFlow Pro experience."}
							</p>
						</div>
					</motion.div>
				)}
			</div>
		</div>
	);
}

export default App;
