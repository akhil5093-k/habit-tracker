import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  enableNetwork,
  disableNetwork,
} from 'firebase/firestore';
import { db } from '../lib/firebase.js';
import toast from 'react-hot-toast';

export const useHabits = (userId) => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      // Firebase not configured
      setHabits([]);
      setLoading(false);
      return;
    }

    if (!userId) {
      setHabits([]);
      setLoading(false);
      return;
    }

    // Enable network to ensure real-time sync
    enableNetwork(db).catch(console.error);

    const q = query(
      collection(db, 'habits'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(
      q,
      {
        includeMetadataChanges: true,
      },
      (snapshot) => {
        // Only process changes from server, not local cache
        if (!snapshot.metadata.fromCache) {
          const habitsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
          }));

          // Sort habits by createdAt on the client side
          habitsData.sort((a, b) => {
            if (!a.createdAt || !b.createdAt) return 0;
            return b.createdAt.getTime() - a.createdAt.getTime();
          });

          setHabits(habitsData);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching habits:', error);
        setLoading(false);
        toast.error('Failed to load habits. Please refresh the page.');
      }
    );

    return unsubscribe;
  }, [userId]);

  const addHabit = async (habitData) => {
    if (!db || !userId) return;

    try {
      await addDoc(collection(db, 'habits'), {
        ...habitData,
        userId,
        createdAt: new Date(),
        completions: [],
      });
      toast.success('Habit added successfully!');
    } catch (error) {
      console.error('Error adding habit:', error);
      toast.error('Failed to add habit');
    }
  };

  const updateHabit = async (habitId, updates) => {
    if (!db) return;

    try {
      const habitRef = doc(db, 'habits', habitId);
      await updateDoc(habitRef, updates);
      toast.success('Habit updated successfully!');
    } catch (error) {
      console.error('Error updating habit:', error);
      toast.error('Failed to update habit');
    }
  };

  const deleteHabit = async (habitId) => {
    if (!db) return;

    try {
      await deleteDoc(doc(db, 'habits', habitId));
      toast.success('Habit deleted successfully!');
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete habit');
    }
  };

  const toggleHabitCompletion = async (habitId, date) => {
    if (!db) return;

    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const existingCompletion = habit.completions.find((c) => c.date === date);
    const newCompletions = existingCompletion
      ? habit.completions.map((c) =>
          c.date === date ? { ...c, completed: !c.completed } : c
        )
      : [...habit.completions, { date, completed: true }];

    await updateHabit(habitId, { completions: newCompletions });
    
    const isCompleted = existingCompletion ? !existingCompletion.completed : true;
    toast.success(isCompleted ? '🎉 Habit completed!' : 'Habit unmarked');
  };

  const importHabits = async (habitsToImport) => {
    if (!db || !userId) return;

    try {
      const importPromises = habitsToImport.map(habitData => 
        addDoc(collection(db, 'habits'), {
          ...habitData,
          userId,
          createdAt: habitData.createdAt || new Date(),
          id: undefined // Remove any existing ID to let Firestore generate new ones
        })
      );

      await Promise.all(importPromises);
      toast.success(`Successfully imported ${habitsToImport.length} habits!`);
    } catch (error) {
      console.error('Error importing habits:', error);
      toast.error('Failed to import habits');
      throw error;
    }
  };

  return {
    habits,
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    importHabits,
  };
};