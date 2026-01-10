import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Award, 
  BarChart3, 
  PieChart,
  Clock,
  Flame
} from 'lucide-react';
import { HABIT_CATEGORIES } from '../utils/habitCategories.js';
import { calculateStreak, getTodayString, getWeekDates } from '../utils/dateUtils.js';

const Statistics = ({ habits }) => {
  const [timeRange, setTimeRange] = useState('week'); // week, month, year

  const today = getTodayString();
  const weekDates = getWeekDates();

  // Calculate various statistics
  const totalHabits = habits.length;
  const todayCompletions = habits.filter(habit => 
    habit.completions.find(c => c.date === today)?.completed
  ).length;
  
  const completionRate = totalHabits > 0 ? Math.round((todayCompletions / totalHabits) * 100) : 0;
  
  // Calculate longest streak across all habits
  const longestStreak = habits.reduce((max, habit) => {
    const streak = calculateStreak(habit.completions);
    return Math.max(max, streak);
  }, 0);

  // Calculate total completions this week
  const weekCompletions = habits.reduce((total, habit) => {
    return total + weekDates.filter(date => 
      habit.completions.find(c => c.date === date)?.completed
    ).length;
  }, 0);

  // Category breakdown
  const categoryStats = Object.keys(HABIT_CATEGORIES).map(categoryKey => {
    const category = HABIT_CATEGORIES[categoryKey];
    const categoryHabits = habits.filter(h => h.category === categoryKey);
    const completedToday = categoryHabits.filter(habit => 
      habit.completions.find(c => c.date === today)?.completed
    ).length;
    
    return {
      ...category,
      key: categoryKey,
      count: categoryHabits.length,
      completedToday,
      percentage: categoryHabits.length > 0 ? Math.round((completedToday / categoryHabits.length) * 100) : 0
    };
  }).filter(cat => cat.count > 0);

  // Weekly progress data
  const weeklyProgress = weekDates.map(date => {
    const completed = habits.filter(habit => 
      habit.completions.find(c => c.date === date)?.completed
    ).length;
    return {
      date,
      completed,
      total: totalHabits,
      percentage: totalHabits > 0 ? Math.round((completed / totalHabits) * 100) : 0
    };
  });

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Habits</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{totalHabits}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Today</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{todayCompletions}/{totalHabits}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Success Rate</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{completionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Best Streak</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{longestStreak}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Progress</h3>
          <BarChart3 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="flex items-end justify-center gap-4 h-48">
          {weeklyProgress.map((day, index) => (
            <div key={day.date} className="flex flex-col items-center gap-2 flex-1">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                {day.completed}/{day.total}
              </div>
              <div className="flex flex-col justify-end h-32 w-8 bg-gray-200 dark:bg-gray-700 rounded-t-lg relative overflow-hidden">
                <div 
                  className="bg-gradient-to-t from-blue-500 to-purple-500 w-full rounded-t-lg transition-all duration-500"
                  style={{ height: `${day.percentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                {day.percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryStats.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h3>
            <PieChart className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryStats.map((category) => {
              const IconComponent = category.icon;
              return (
                <div key={category.key} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className={`w-10 h-10 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{category.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {category.completedToday}/{category.count} habits ({category.percentage}%)
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Achievement Badges */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Achievements</h3>
          <Award className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* First Habit */}
          <div className={`p-4 rounded-lg text-center ${totalHabits >= 1 ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700' : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'} border`}>
            <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${totalHabits >= 1 ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <Target className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">First Habit</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Create your first habit</p>
          </div>

          {/* Week Warrior */}
          <div className={`p-4 rounded-lg text-center ${weekCompletions >= 7 ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'} border`}>
            <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${weekCompletions >= 7 ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Week Warrior</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">7 completions this week</p>
          </div>

          {/* Streak Master */}
          <div className={`p-4 rounded-lg text-center ${longestStreak >= 7 ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700' : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'} border`}>
            <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${longestStreak >= 7 ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <Flame className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Streak Master</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">7-day streak</p>
          </div>

          {/* Perfect Day */}
          <div className={`p-4 rounded-lg text-center ${completionRate === 100 && totalHabits > 0 ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'} border`}>
            <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${completionRate === 100 && totalHabits > 0 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <Award className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Perfect Day</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">100% completion</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;