export const affirmations = [
  "I am exactly where I need to be right now.",
  "My mind is calm, my heart is open, my spirit is free.",
  "I choose peace over perfection.",
  "I am worthy of love, success, and happiness.",
  "Every breath I take fills me with calm and clarity.",
  "I release what I cannot control.",
  "I am growing stronger with every challenge I face.",
  "My potential is limitless and my future is bright.",
  "I am grateful for this moment and all it holds.",
  "I trust the timing of my life.",
  "I am enough, just as I am.",
  "Today I choose joy over worry.",
  "I am the architect of my own happiness.",
  "I radiate positive energy and attract good things.",
  "My body is healthy, my mind is sharp, my soul is at peace.",
  "I forgive myself for past mistakes and embrace growth.",
  "I am surrounded by abundance in all forms.",
  "Every day is a fresh start, a new chance to grow.",
  "I have the courage to create the life I want.",
  "I am connected to a purpose greater than myself.",
  "I choose to focus on what I can change.",
  "My presence makes the world a better place.",
  "I deserve rest, renewal, and self-compassion.",
  "Challenges are opportunities dressed in work clothes.",
  "I am a magnet for miracles and positive experiences.",
  "My inner peace is unshakeable.",
  "I celebrate small wins — they lead to big victories.",
  "I am becoming the best version of myself, day by day.",
  "I breathe in confidence, I breathe out doubt.",
  "The universe is conspiring in my favor.",
];

export const journalPrompts = [
  "What made you smile today, even for a second?",
  "If you could tell your younger self one thing, what would it be?",
  "What's one thing you're proud of that no one knows about?",
  "Describe a moment today where you felt truly present.",
  "What would you do today if you had zero fear?",
  "Write about someone who made your life better just by existing.",
  "What's a belief you held last year that you've outgrown?",
  "If today were your last day, what would you want to say?",
  "What's one small thing that brings you disproportionate joy?",
  "Write a thank-you note to your body for everything it does.",
  "What does your ideal morning look like?",
  "What's a mistake that taught you something valuable?",
  "Describe a place where you feel completely safe and at peace.",
  "What are 3 qualities you admire in yourself?",
  "If your emotions were weather, what's the forecast today and why?",
  "What's one boundary you need to set or strengthen?",
  "Write about a time when everything felt right in the world.",
  "What would you attempt if you knew you could not fail?",
  "What's one thing you want to let go of this week?",
  "Describe your life in 5 years if everything goes beautifully.",
  "What's one act of kindness you received that you'll never forget?",
  "What drains your energy? What fills it?",
  "Write about something ordinary that you find extraordinary.",
  "What's a conversation you need to have but keep avoiding?",
  "If you could master one skill overnight, what would it be and why?",
  "What does 'home' mean to you beyond a physical place?",
  "What's something you need to forgive yourself for?",
  "Describe the feeling of your happiest memory.",
  "What would you do differently if nobody was watching?",
  "Write a love letter to your future self.",
];

export const getTodaysAffirmation = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return affirmations[dayOfYear % affirmations.length];
};

export const getTodaysPrompt = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return journalPrompts[dayOfYear % journalPrompts.length];
};

