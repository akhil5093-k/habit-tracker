import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  enableNetwork,
  disableNetwork,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Habit } from '../types/habit';
import toast from 'react-hot-toast';

export const useHabits = (userId: string | undefined) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setHabits([]);
      setLoading(false);
      return;
    }

    // Enable network to ensure real-time sync
    enableNetwork(db).catch(console.error);

    const q = query(
      collection(db, 'habits'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
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
          })) as Habit[];

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

  const addHabit = async (habitData: Omit<Habit, 'id' | 'createdAt' | 'userId' | 'completions'>) => {
    if (!userId) return;

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

  const updateHabit = async (habitId: string, updates: Partial<Habit>) => {
    try {
      const habitRef = doc(db, 'habits', habitId);
      await updateDoc(habitRef, updates);
      toast.success('Habit updated successfully!');
    } catch (error) {
      console.error('Error updating habit:', error);
      toast.error('Failed to update habit');
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      await deleteDoc(doc(db, 'habits', habitId));
      toast.success('Habit deleted successfully!');
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete habit');
    }
  };

  const toggleHabitCompletion = async (habitId: string, date: string) => {
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

  return {
    habits,
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
  };
};