import React from 'react';
import { getTodayString, calculateStreak, getWeekDates } from '../utils/dateUtils.js';
import { CheckCircle, Circle, Edit, Trash2, Calendar, Target, TrendingUp } from 'lucide-react';
import { HABIT_CATEGORIES } from '../utils/habitCategories.js';

const HabitCard = ({
  habit,
  onToggleCompletion,
  onEdit,
  onDelete,
}) => {
  const today = getTodayString();
  const weekDates = getWeekDates();
  const streak = calculateStreak(habit.completions);
  const todayCompleted = habit.completions.find(c => c.date === today)?.completed || false;

  const category = HABIT_CATEGORIES[habit.category] || HABIT_CATEGORIES.other;
  const CategoryIcon = category.icon;

  const isCompletedOnDate = (date) => {
    return habit.completions.find(c => c.date === date)?.completed || false;
  };

  // Calculate weekly completion rate
  const weeklyCompletions = weekDates.filter(date => isCompletedOnDate(date)).length;
  const weeklyRate = Math.round((weeklyCompletions / weekDates.length) * 100);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Category Header */}
      <div className={`h-2 bg-gradient-to-r ${category.color}`}></div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center`}>
                <CategoryIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{habit.name}</h3>
                <p className={`text-xs font-medium ${category.textColor}`}>{category.name}</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{habit.description}</p>
            
            {/* Goal Display */}
            {habit.goal && habit.unit && (
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span>Goal: {habit.goal} {habit.unit}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="capitalize">{habit.frequency}</span>
                </div>
              </div>
            )}

            {/* Stats Row */}
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>{streak} day streak</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{weeklyRate}% this week</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(habit)}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(habit.id)}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Today's Progress */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Today</span>
            <button
              onClick={() => onToggleCompletion(habit.id, today)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                todayCompleted
                  ? `${category.bgColor} ${category.textColor} hover:opacity-80`
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {todayCompleted ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
              {todayCompleted ? 'Completed' : 'Mark Complete'}
            </button>
          </div>
        </div>

        {/* Weekly Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">This Week</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {weeklyCompletions}/{weekDates.length} ({weeklyRate}%)
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r ${category.color} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${weeklyRate}%` }}
              ></div>
            </div>
          </div>

          {/* Week Calendar */}
          <div className="flex gap-1">
            {weekDates.map((date, index) => {
              const isCompleted = isCompletedOnDate(date);
              const isToday = date === today;
              return (
                <div
                  key={date}
                  className={`flex-1 h-8 rounded-md border-2 transition-colors relative ${
                    isCompleted
                      ? `bg-gradient-to-r ${category.color} border-transparent`
                      : isToday
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-600'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                  }`}
                  title={`${new Date(date).toLocaleDateString()} ${isCompleted ? '✓' : ''}`}
                >
                  {isCompleted && (
                    <div className="w-full h-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  )}
                  {isToday && !isCompleted && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Streak Badge */}
        {streak > 0 && (
          <div className={`mt-4 p-3 bg-gradient-to-r ${category.color} bg-opacity-10 dark:bg-opacity-20 rounded-lg`}>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center`}>
                <span className="text-white font-bold text-sm">🔥</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {streak} day streak!
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {streak >= 7 ? 'Amazing consistency!' : 'Keep it up!'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitCard;