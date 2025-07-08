import React from 'react';
import { Habit } from '../types/habit';
import { getTodayString, calculateStreak, getWeekDates } from '../utils/dateUtils';
import { CheckCircle, Circle, Edit, Trash2, Calendar, Target } from 'lucide-react';

interface HabitCardProps {
  habit: Habit;
  onToggleCompletion: (habitId: string, date: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onToggleCompletion,
  onEdit,
  onDelete,
}) => {
  const today = getTodayString();
  const weekDates = getWeekDates();
  const streak = calculateStreak(habit.completions);
  const todayCompleted = habit.completions.find(c => c.date === today)?.completed || false;

  const isCompletedOnDate = (date: string) => {
    return habit.completions.find(c => c.date === date)?.completed || false;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{habit.name}</h3>
            <p className="text-gray-600 text-sm mb-3">{habit.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className="capitalize">{habit.frequency}</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                <span>{streak} day streak</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(habit)}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(habit.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-700">Today</span>
            <button
              onClick={() => onToggleCompletion(habit.id, today)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                todayCompleted
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">This Week</span>
            <span className="text-xs text-gray-500">
              {weekDates.filter(date => isCompletedOnDate(date)).length}/{weekDates.length}
            </span>
          </div>
          <div className="flex gap-1">
            {weekDates.map((date) => (
              <div
                key={date}
                className={`flex-1 h-8 rounded-md border-2 transition-colors ${
                  isCompletedOnDate(date)
                    ? 'bg-green-100 border-green-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
                title={date}
              >
                {isCompletedOnDate(date) && (
                  <div className="w-full h-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {streak > 0 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">🔥</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {streak} day streak!
                </p>
                <p className="text-xs text-gray-600">Keep it up!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitCard;