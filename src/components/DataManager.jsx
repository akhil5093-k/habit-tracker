import React, { useState } from 'react';
import { Download, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const DataManager = ({ habits, onImportHabits }) => {
  const [importing, setImporting] = useState(false);

  const exportData = () => {
    try {
      const exportData = {
        habits: habits.map(habit => ({
          ...habit,
          createdAt: habit.createdAt?.toISOString() || new Date().toISOString()
        })),
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `habitflow-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        // Validate data structure
        if (!importedData.habits || !Array.isArray(importedData.habits)) {
          throw new Error('Invalid data format');
        }

        // Process and validate habits
        const validHabits = importedData.habits.filter(habit => {
          return habit.name && habit.description && habit.frequency;
        });

        if (validHabits.length === 0) {
          throw new Error('No valid habits found in the file');
        }

        // Convert dates back to Date objects and remove id field
        const processedHabits = validHabits.map(habit => {
          const { id, ...habitWithoutId } = habit;
          return {
            ...habitWithoutId,
            createdAt: habit.createdAt ? new Date(habit.createdAt) : new Date(),
            category: habit.category || 'other',
            goal: habit.goal || 1,
            unit: habit.unit || 'times',
            completions: habit.completions || []
          };
        });

        await onImportHabits(processedHabits);
        toast.success(`Successfully imported ${processedHabits.length} habits!`);
      } catch (error) {
        console.error('Import error:', error);
        toast.error('Failed to import data: ' + error.message);
      } finally {
        setImporting(false);
        event.target.value = ''; // Reset file input
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <FileText className="h-6 w-6 text-purple-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Management</h3>
      </div>

      <div className="space-y-4">
        {/* Export Section */}
        <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Export Data</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Download your habits as a backup file</p>
            </div>
            <button
              onClick={exportData}
              disabled={habits.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <CheckCircle className="h-4 w-4" />
            <span>{habits.length} habits ready to export</span>
          </div>
        </div>

        {/* Import Section */}
        <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Import Data</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Restore habits from a backup file</p>
            </div>
            <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors">
              <Upload className="h-4 w-4" />
              {importing ? 'Importing...' : 'Import'}
              <input
                type="file"
                accept=".json"
                onChange={importData}
                disabled={importing}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
            <AlertCircle className="h-4 w-4" />
            <span>This will add to your existing habits</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">What's included:</h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• All habit details (name, description, category)</li>
            <li>• Completion history and streaks</li>
            <li>• Goals and frequency settings</li>
            <li>• Creation dates and metadata</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DataManager;