import { 
  Heart, 
  Dumbbell, 
  Book, 
  Briefcase, 
  Users, 
  Leaf, 
  Brain, 
  Coffee,
  Moon,
  Droplets,
  Apple,
  Music,
  Camera,
  Palette,
  Code,
  Target
} from 'lucide-react';

export const HABIT_CATEGORIES = {
  health: {
    name: 'Health & Fitness',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700'
  },
  fitness: {
    name: 'Exercise',
    icon: Dumbbell,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700'
  },
  learning: {
    name: 'Learning',
    icon: Book,
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700'
  },
  work: {
    name: 'Work & Career',
    icon: Briefcase,
    color: 'from-gray-500 to-gray-700',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700'
  },
  social: {
    name: 'Social',
    icon: Users,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700'
  },
  mindfulness: {
    name: 'Mindfulness',
    icon: Leaf,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700'
  },
  mental: {
    name: 'Mental Health',
    icon: Brain,
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700'
  },
  nutrition: {
    name: 'Nutrition',
    icon: Apple,
    color: 'from-green-400 to-green-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700'
  },
  hydration: {
    name: 'Hydration',
    icon: Droplets,
    color: 'from-blue-400 to-cyan-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700'
  },
  sleep: {
    name: 'Sleep',
    icon: Moon,
    color: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700'
  },
  creativity: {
    name: 'Creativity',
    icon: Palette,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-700'
  },
  hobbies: {
    name: 'Hobbies',
    icon: Music,
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700'
  },
  other: {
    name: 'Other',
    icon: Target,
    color: 'from-gray-400 to-gray-600',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700'
  }
};

export const HABIT_TEMPLATES = [
  {
    name: 'Drink 8 glasses of water',
    description: 'Stay hydrated throughout the day',
    category: 'hydration',
    frequency: 'daily',
    goal: 8,
    unit: 'glasses'
  },
  {
    name: 'Exercise for 30 minutes',
    description: 'Daily physical activity to stay fit',
    category: 'fitness',
    frequency: 'daily',
    goal: 30,
    unit: 'minutes'
  },
  {
    name: 'Read for 20 minutes',
    description: 'Daily reading to expand knowledge',
    category: 'learning',
    frequency: 'daily',
    goal: 20,
    unit: 'minutes'
  },
  {
    name: 'Meditate',
    description: 'Daily meditation for mental clarity',
    category: 'mindfulness',
    frequency: 'daily',
    goal: 10,
    unit: 'minutes'
  },
  {
    name: 'Get 8 hours of sleep',
    description: 'Maintain healthy sleep schedule',
    category: 'sleep',
    frequency: 'daily',
    goal: 8,
    unit: 'hours'
  },
  {
    name: 'Write in journal',
    description: 'Daily reflection and gratitude',
    category: 'mental',
    frequency: 'daily',
    goal: 1,
    unit: 'entry'
  },
  {
    name: 'Learn a new language',
    description: 'Practice language skills daily',
    category: 'learning',
    frequency: 'daily',
    goal: 15,
    unit: 'minutes'
  },
  {
    name: 'Take vitamins',
    description: 'Daily vitamin supplementation',
    category: 'health',
    frequency: 'daily',
    goal: 1,
    unit: 'dose'
  }
];