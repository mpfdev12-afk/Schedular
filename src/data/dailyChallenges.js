export const dailyChallenges = [
  { id: 1, emoji: "🚶", title: "Take a 10-minute walk", description: "Leave your phone behind. Notice 5 things you can see, 4 you can hear, 3 you can touch.", category: "Physical" },
  { id: 2, emoji: "💧", title: "Drink 8 glasses of water", description: "Track your water intake today. Your body will thank you.", category: "Physical" },
  { id: 3, emoji: "📵", title: "No phone for 1 hour", description: "Put your phone in another room. Read, draw, or just sit with your thoughts.", category: "Digital Detox" },
  { id: 4, emoji: "🙏", title: "Write 3 things you're grateful for", description: "Big or small — what made today worth living?", category: "Mindfulness" },
  { id: 5, emoji: "🧘", title: "5-minute breathing exercise", description: "Close your eyes. Breathe in for 4, hold for 4, out for 4. Repeat.", category: "Mindfulness" },
  { id: 6, emoji: "📖", title: "Read 10 pages of a book", description: "Physical book preferred. Let yourself get lost in someone else's world.", category: "Learning" },
  { id: 7, emoji: "🎨", title: "Create something", description: "Draw, write, cook, build — anything that didn't exist before you made it.", category: "Creative" },
  { id: 8, emoji: "💬", title: "Have a real conversation", description: "Call or meet someone you care about. No texting — real voice, real connection.", category: "Social" },
  { id: 9, emoji: "🌅", title: "Watch the sunrise or sunset", description: "No photos. Just be present and watch the sky change colors.", category: "Mindfulness" },
  { id: 10, emoji: "🧹", title: "Clean one space", description: "Your desk, your room corner, your bag. A clean space = a clear mind.", category: "Productivity" },
  { id: 11, emoji: "🏃", title: "Do 20 pushups or squats", description: "Right now. Yes, right now. Your future self is cheering you on.", category: "Physical" },
  { id: 12, emoji: "✍️", title: "Journal for 5 minutes", description: "Write whatever comes to mind. No rules, no judgment.", category: "Mindfulness" },
  { id: 13, emoji: "🎵", title: "Listen to a full album", description: "Pick an album. Listen start to finish. No skipping.", category: "Creative" },
  { id: 14, emoji: "🌿", title: "Spend 15 minutes in nature", description: "A park, your garden, a balcony with plants — just be with green things.", category: "Mindfulness" },
  { id: 15, emoji: "😴", title: "Sleep 15 minutes earlier tonight", description: "Set an alarm to START your bedtime routine. Your mornings will transform.", category: "Physical" },
  { id: 16, emoji: "🍳", title: "Cook a meal from scratch", description: "No ordering. The process of cooking is itself meditative.", category: "Creative" },
  { id: 17, emoji: "💰", title: "Track every rupee you spend today", description: "Write it down. Awareness is the first step to financial peace.", category: "Financial" },
  { id: 18, emoji: "🤝", title: "Compliment 3 people genuinely", description: "Notice something real about them and say it. Watch their face light up.", category: "Social" },
  { id: 19, emoji: "📴", title: "Delete one social media app for today", description: "Just for 24 hours. Notice what you do with the extra time.", category: "Digital Detox" },
  { id: 20, emoji: "🧠", title: "Learn one new thing", description: "A word, a fact, a skill. Google something you've always been curious about.", category: "Learning" },
  { id: 21, emoji: "🫁", title: "Practice box breathing for 3 minutes", description: "Inhale 4s → Hold 4s → Exhale 4s → Hold 4s. Feel the calm wash over you.", category: "Mindfulness" },
  { id: 22, emoji: "🌸", title: "Do something kind for a stranger", description: "Hold a door, pay for someone's chai, smile at a passerby.", category: "Social" },
  { id: 23, emoji: "📝", title: "Write a letter to your future self", description: "What do you want to tell yourself 1 year from now?", category: "Mindfulness" },
  { id: 24, emoji: "🧊", title: "Take a cold shower", description: "Even 30 seconds of cold water. It resets your nervous system.", category: "Physical" },
  { id: 25, emoji: "🎯", title: "Set 3 intentions for tomorrow", description: "Not tasks — intentions. How do you want to FEEL tomorrow?", category: "Productivity" },
  { id: 26, emoji: "👀", title: "People-watch for 10 minutes", description: "Sit in a park or cafe. Observe. Wonder about their stories.", category: "Mindfulness" },
  { id: 27, emoji: "🫶", title: "Forgive someone (even yourself)", description: "Holding onto resentment is drinking poison. Let one thing go today.", category: "Mindfulness" },
  { id: 28, emoji: "📱", title: "Use your phone in grayscale", description: "Settings → Accessibility → Grayscale. Watch how much less addictive it becomes.", category: "Digital Detox" },
  { id: 29, emoji: "🌊", title: "Listen to nature sounds for 10 min", description: "Rain, ocean waves, forest birds. Close your eyes and just listen.", category: "Mindfulness" },
  { id: 30, emoji: "⭐", title: "Do your hardest task first today", description: "Eat the frog. The rest of the day will feel like a breeze.", category: "Productivity" },
];

// Get today's challenge based on the day of the year
export const getTodaysChallenge = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return dailyChallenges[dayOfYear % dailyChallenges.length];
};

