import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useHabits } from '../hooks/useHabits';
import HabitCard from './HabitCard';
import HabitModal from './HabitModal';
import { Plus, LogOut, Target, TrendingUp, Calendar } from 'lucide-react';
import { Habit } from '../types/habit';
import { getTodayString } from '../utils/dateUtils';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { habits, loading, addHabit, updateHabit, deleteHabit, toggleHabitCompletion } = useHabits(user?.uid);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();

  const today = getTodayString();
  const todayCompletions = habits.filter(habit => 
    habit.completions.find(c => c.date === today)?.completed
  ).length;

  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((todayCompletions / totalHabits) * 100) : 0;

  const handleAddHabit = () => {
    setEditingHabit(undefined);
    setIsModalOpen(true);
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleSaveHabit = async (habitData: Omit<Habit, 'id' | 'createdAt' | 'userId' | 'completions'>) => {
    if (editingHabit) {
      await updateHabit(editingHabit.id, habitData);
    } else {
      await addHabit(habitData);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      await deleteHabit(habitId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.email?.split('@')[0]}!
            </h1>
            <p className="text-gray-600 mt-1">Let's build better habits together</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Habits</p>
                <p className="text-2xl font-bold text-gray-900">{totalHabits}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">{todayCompletions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Habit Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Habits</h2>
          <button
            onClick={handleAddHabit}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            Add Habit
          </button>
        </div>

        {/* Habits Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        ) : habits.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-12 w-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No habits yet</h3>
            <p className="text-gray-600 mb-6">Start building better habits by adding your first one!</p>
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
            {habits.map((habit) => (
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