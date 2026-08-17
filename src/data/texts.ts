import { Difficulty } from '../types';

export const TEXT_COLLECTIONS: Record<Difficulty, string[]> = {
  beginner: [
    "The quick brown fox jumps over the lazy dog near the quiet river bank.",
    "A sunny morning brings fresh energy and a clear mind to start the day.",
    "Small steps taken every single day lead to big changes over time.",
    "Reading books every day opens new worlds and helps you learn new things.",
    "Learning to type fast and clean requires patience and daily practice.",
    "The blue sky was full of soft white clouds moving slowly in the gentle wind.",
    "Good friends always listen, share honest words, and bring warmth to our lives.",
    "Music has the power to bring people together from all corners of the world.",
    "Keep your eyes on the screen and let your fingers find every key naturally.",
    "A cup of warm tea on a rainy afternoon makes everything feel peaceful and calm.",
    "Practice makes progress when you focus on accuracy before speed.",
    "Every journey begins with a single step toward what you want to achieve.",
    "The morning sun warms the green grass as birds sing in the tall trees.",
    "Work hard, stay kind, and remember to rest when your body needs it.",
    "Clear water flowed down the mountain stream into the deep quiet lake.",
    "Typing with rhythm allows your fingers to glide effortlessly across the keyboard.",
    "A walk in nature refreshes the spirit and gives you fresh perspective on challenges.",
    "Setting clear daily intentions helps you stay organized and calm under pressure.",
    "Patience is a quiet power that helps us navigate both small and large tasks.",
    "Consistent practice turns complex skills into natural, effortless habits."
  ],
  intermediate: [
    "Mastering the keyboard is less about moving your fingers as fast as possible and more about maintaining a smooth, rhythmic cadence. Accuracy naturally builds velocity.",
    "Technology has transformed how we communicate across borders, enabling instant collaboration between teams located thousands of miles apart without delay.",
    "The art of writing requires both discipline and imagination. When you sit down to craft thoughts into words, clarity of thought always translates into clear sentences.",
    "Sustainable progress is built upon consistent daily habits rather than occasional bursts of intense effort. Set realistic goals and measure your growth weekly.",
    "Curiosity is the engine of intellectual growth. When we ask deeper questions about how things work, we uncover fascinating solutions to everyday problems.",
    "Designing intuitive user experiences demands empathy, attention to detail, and a deep appreciation for the subtle ways people interact with software.",
    "The quiet hours of early morning provide an exceptional window for deep work, free from the continuous notifications and interruptions of the digital world.",
    "Effective communication is not merely about expressing your own ideas clearly, but actively listening to others with genuine interest and an open mind.",
    "Developing muscle memory takes time; your brain forms neural pathways each time you strike a key accurately without glancing down at your hands.",
    "Simplicity in design is not the absence of clutter, but the deliberate presence of only what is necessary to create harmony and intuitive function.",
    "Problem solving becomes substantially more rewarding when approached with curiosity, open experimentation, and willingness to embrace early mistakes.",
    "Resilience in the face of unforeseen obstacles often differentiates lasting achievement from fleeting enthusiasm across long-term creative projects.",
    "Balancing analytical precision with creative intuition yields breakthrough solutions that purely logical frameworks might otherwise overlook."
  ],
  advanced: [
    "The quintessential paradox of software engineering lies in balancing rapid architectural iteration against long-term maintainability, where technical debt accumulates silently beneath elegant abstractions.",
    "In 1969, the Apollo guidance computer executed complex trajectory algorithms using less than 74 kilobytes of memory—a remarkable testament to human ingenuity and algorithmic frugality.",
    "Quantum superposition and quantum entanglement challenge our classical intuition, suggesting that at the subatomic level, deterministic predictability dissolves into probabilistic wavefunctions.",
    "The synthesis of artificial neural networks, transformers, and multimodal architectures has accelerated modern machine learning into an unprecedented renaissance of autonomous capability.",
    "Philosophical inquiries into consciousness often grapple with the 'hard problem': how subjective phenomenal experience arises from purely physical biochemical interactions within biological organisms.",
    "Cryptographic primitives, such as elliptic-curve cryptography and zero-knowledge proofs, form the mathematical bedrock that secures global financial systems against adversarial intrusion.",
    "Precision craftsmanship—whether in horology, typography, or distributed systems—manifests when every micro-interaction is executed with rigorous intentionality and zero superfluous ornamentation.",
    "Asynchronous distributed consensus protocols, such as Paxos and Raft, provide fault-tolerant state machine replication across unreliable, high-latency network partitions.",
    "Thermodynamic entropy dictates that isolated physical systems spontaneously evolve toward thermodynamic equilibrium, representing maximum microscopic statistical disorder."
  ]
};

export function getRandomText(difficulty: Difficulty): string {
  const list = TEXT_COLLECTIONS[difficulty];
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

// Generate sufficient sentences for any duration from 15 seconds up to 60 minutes (3600s)
export function getGeneratedTextForDuration(difficulty: Difficulty, durationSeconds: number): string {
  const list = TEXT_COLLECTIONS[difficulty];
  // Calculate approximate words needed based on 100 WPM ceiling + margin
  const approximateWordsNeeded = Math.max(30, Math.ceil((durationSeconds / 60) * 110));
  
  const shuffled = [...list].sort(() => 0.5 - Math.random());
  let combined = shuffled[0];
  let currentWords = combined.split(/\s+/).length;

  let idx = 1;
  while (currentWords < approximateWordsNeeded) {
    const nextItem = shuffled[idx % shuffled.length];
    combined += " " + nextItem;
    currentWords = combined.split(/\s+/).length;
    idx++;
  }

  return combined;
}
