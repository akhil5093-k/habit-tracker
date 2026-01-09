import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useHabits } from '../hooks/useHabits.js';
import HabitCard from './HabitCard.jsx';
import HabitModal from './HabitModal.jsx';
import Statistics from './Statistics.jsx';
import Settings from './Settings.jsx';
import { Plus, LogOut, Target, TrendingUp, Calendar, BarChart3, Grid3X3, Filter, Settings as SettingsIcon } from 'lucide-react';
import { getTodayString } from '../utils/dateUtils.js';
import { HABIT_CATEGORIES } from '../utils/habitCategories.js';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { habits, loading, addHabit, updateHabit, deleteHabit, toggleHabitCompletion, importHabits } = useHabits(user?.uid);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(undefined);
  const [activeTab, setActiveTab] = useState('habits'); // 'habits', 'statistics', or 'settings'
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('created'); // 'created', 'streak', 'completion'

  const today = getTodayString();
  const todayCompletions = habits.filter(habit => 
    habit.completions.find(c => c.date === today)?.completed
  ).length;

  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((todayCompletions / totalHabits) * 100) : 0;

  // Filter and sort habits
  const filteredHabits = habits
    .filter(habit => filterCategory === 'all' || habit.category === filterCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'streak':
          return calculateStreak(b.completions) - calculateStreak(a.completions);
        case 'completion':
          const aCompleted = a.completions.find(c => c.date === today)?.completed || false;
          const bCompleted = b.completions.find(c => c.date === today)?.completed || false;
          return (bCompleted ? 1 : 0) - (aCompleted ? 1 : 0);
        default: // 'created'
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const calculateStreak = (completions) => {
    const sortedCompletions = completions
      .filter(c => c.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (sortedCompletions.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < sortedCompletions.length; i++) {
      const completionDate = new Date(sortedCompletions[i].date);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (completionDate.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const handleAddHabit = () => {
    setEditingHabit(undefined);
    setIsModalOpen(true);
  };

  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleSaveHabit = async (habitData) => {
    if (editingHabit) {
      await updateHabit(editingHabit.id, habitData);
    } else {
      await addHabit(habitData);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      await deleteHabit(habitId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.email?.split('@')[0]}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Let's build better habits together</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Habits</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalHabits}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayCompletions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{completionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('habits')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'habits'
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
              Habits
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'statistics'
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Statistics
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              <SettingsIcon className="h-4 w-4" />
              Settings
            </button>
          </div>

          {activeTab === 'habits' && (
            <button
              onClick={handleAddHabit}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-colors font-medium shadow-lg hover:shadow-xl ml-auto"
            >
              <Plus className="h-5 w-5" />
              Add Habit
            </button>
          )}
        </div>

        {/* Content */}
        {activeTab === 'habits' ? (
          <>
            {/* Filters and Sort */}
            {habits.length > 0 && (
              <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Categories</option>
                    {Object.entries(HABIT_CATEGORIES).map(([key, category]) => (
                      <option key={key} value={key}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="created">Recently Added</option>
                    <option value="streak">Longest Streak</option>
                    <option value="completion">Completed Today</option>
                  </select>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400 ml-auto">
                  Showing {filteredHabits.length} of {totalHabits} habits
                </div>
              </div>
            )}

            {/* Habits Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
            ) : filteredHabits.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-12 w-12 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {filterCategory === 'all' ? 'No habits yet' : 'No habits in this category'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {filterCategory === 'all' 
                    ? 'Start building better habits by adding your first one!' 
                    : 'Try a different category or add a new habit.'}
                </p>
                <button
                  onClick={handleAddHabit}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-colors font-medium"
                >
                  <Plus className="h-5 w-5" />
                  Add Your First Habit
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredHabits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onToggleCompletion={toggleHabitCompletion}
                    onEdit={handleEditHabit}
                    onDelete={handleDeleteHabit}
                  />
                ))}
              </div>
            )}
          </>
        ) : activeTab === 'statistics' ? (
          <Statistics habits={habits} />
        ) : (
          <Settings user={user} habits={habits} onImportHabits={importHabits} />
        )}

        {/* Habit Modal */}
        <HabitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveHabit}
          habit={editingHabit}
        />
      </div>
    </div>
  );
};

export default Dashboard;