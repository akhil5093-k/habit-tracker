import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Target, Clock } from 'lucide-react';
import { HABIT_CATEGORIES, HABIT_TEMPLATES } from '../utils/habitCategories.js';

const HabitModal = ({ isOpen, onClose, onSave, habit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [category, setCategory] = useState('other');
  const [goal, setGoal] = useState(1);
  const [unit, setUnit] = useState('times');
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setDescription(habit.description);
      setFrequency(habit.frequency);
      setCategory(habit.category || 'other');
      setGoal(habit.goal || 1);
      setUnit(habit.unit || 'times');
    } else {
      setName('');
      setDescription('');
      setFrequency('daily');
      setCategory('other');
      setGoal(1);
      setUnit('times');
    }
  }, [habit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, description, frequency, category, goal, unit });
    onClose();
  };

  const handleTemplateSelect = (template) => {
    setName(template.name);
    setDescription(template.description);
    setCategory(template.category);
    setFrequency(template.frequency);
    setGoal(template.goal);
    setUnit(template.unit);
    setShowTemplates(false);
  };

  if (!isOpen) return null;

  const selectedCategory = HABIT_CATEGORIES[category];
  const CategoryIcon = selectedCategory.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${selectedCategory.color} rounded-full flex items-center justify-center`}>
                {habit ? <Edit className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {habit ? 'Edit Habit' : 'Add New Habit'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Templates Section */}
          {!habit && (
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setShowTemplates(!showTemplates)}
                className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
              >
                {showTemplates ? 'Hide Templates' : 'Choose from Templates'}
              </button>
              
              {showTemplates && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto">
                  {HABIT_TEMPLATES.map((template, index) => {
                    const TemplateCategory = HABIT_CATEGORIES[template.category];
                    const TemplateIcon = TemplateCategory.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleTemplateSelect(template)}
                        className="flex items-center gap-3 p-3 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                      >
                        <div className={`w-8 h-8 bg-gradient-to-r ${TemplateCategory.color} rounded-full flex items-center justify-center`}>
                          <TemplateIcon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">{template.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{template.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Category
              </label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {Object.entries(HABIT_CATEGORIES).map(([key, cat]) => {
                  const IconComponent = cat.icon;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCategory(key)}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        category === key
                          ? `border-purple-500 ${cat.bgColor} dark:bg-opacity-20`
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className={`w-8 h-8 bg-gradient-to-r ${cat.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{cat.name}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Habit Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Habit Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Drink 8 glasses of water"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Why is this habit important to you?"
                required
              />
            </div>

            {/* Frequency and Goal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frequency
                </label>
                <select
                  id="frequency"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div>
                <label htmlFor="goal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Goal & Unit
                </label>
                <div className="flex gap-2">
                  <input
                    id="goal"
                    type="number"
                    min="1"
                    value={goal}
                    onChange={(e) => setGoal(parseInt(e.target.value) || 1)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="times">times</option>
                    <option value="minutes">minutes</option>
                    <option value="hours">hours</option>
                    <option value="pages">pages</option>
                    <option value="glasses">glasses</option>
                    <option value="steps">steps</option>
                    <option value="km">km</option>
                    <option value="reps">reps</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex-1 px-6 py-3 bg-gradient-to-r ${selectedCategory.color} text-white rounded-lg hover:opacity-90 transition-colors font-medium`}
              >
                {habit ? 'Update' : 'Create'} Habit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HabitModal;