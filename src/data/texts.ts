import { Difficulty } from '../types';

export const TEXT_COLLECTIONS: Record<Difficulty, string[]> = {
  beginner: [
    "The quick brown fox jumps over the lazy dog near the quiet river bank in the warm sun.",
    "A sunny morning brings fresh energy and a clear mind to start the day with positive hope.",
    "Small steps taken every single day lead to big changes and wonderful growth over time.",
    "Reading books every day opens new worlds and helps you learn new things with joy and peace.",
    "Learning to type fast and clean requires patience and daily practice on your keyboard.",
    "The blue sky was full of soft white clouds moving slowly in the gentle evening wind.",
    "Good friends always listen, share honest words, and bring warmth and light to our lives.",
    "Music has the power to bring people together from all corners of the world in harmony.",
    "Keep your eyes on the screen and let your fingers find every key naturally without looking.",
    "A cup of warm tea on a rainy afternoon makes everything feel peaceful, quiet, and calm.",
    "Practice makes progress when you focus on accuracy and clear rhythm before high speed.",
    "Every journey begins with a single step toward what you truly want to achieve in life.",
    "The morning sun warms the green grass as birds sing happily in the tall garden trees.",
    "Work hard, stay kind to everyone, and remember to rest when your body and mind need it.",
    "Clear water flowed down the mountain stream into the deep blue quiet forest lake.",
    "Typing with rhythm allows your fingers to glide effortlessly and smoothly across the keys.",
    "A walk in nature refreshes the spirit and gives you a fresh perspective on daily challenges.",
    "Setting clear daily intentions helps you stay organized, focused, and calm under pressure.",
    "Patience is a quiet power that helps us navigate both small and large tasks every day.",
    "Consistent practice turns complex skills into natural, effortless, and lasting habits.",
    "The ocean waves roll softly onto the sandy beach under the bright golden sunset light.",
    "Drinking water and getting good sleep each night gives you high energy for the day ahead.",
    "Simple words of encouragement can brighten someone day more than you might ever realize.",
    "A quiet workspace helps you think clearly and complete your tasks with great comfort.",
    "Taking deep breaths when you feel rushed restores balance and brings peace to your mind.",
    "Curiosity opens doors to unexpected discoveries and leads to lifelong learning and joy.",
    "Writing your thoughts down in a notebook helps clear mental clutter and sparks creativity.",
    "A smile is a universal welcome that connects people regardless of where they come from.",
    "Enjoy the small moments of beauty that happen around you every single day.",
    "Focus on one thing at a time to accomplish your goals with excellence and calm focus."
  ],
  intermediate: [
    "Mastering the keyboard is less about moving your fingers as fast as possible and more about maintaining a smooth, rhythmic cadence. Accuracy naturally builds velocity.",
    "Technology has transformed how we communicate across borders, enabling instant collaboration between teams located thousands of miles apart without any noticeable delay.",
    "The art of writing requires both discipline and imagination. When you sit down to craft thoughts into words, clarity of thought always translates into clear sentences.",
    "Sustainable progress is built upon consistent daily habits rather than occasional bursts of intense effort. Set realistic goals and measure your growth weekly.",
    "Curiosity is the engine of intellectual growth. When we ask deeper questions about how things work, we uncover fascinating solutions to everyday problems.",
    "Designing intuitive user experiences demands empathy, attention to detail, and a deep appreciation for the subtle ways people interact with digital software.",
    "The quiet hours of early morning provide an exceptional window for deep work, free from the continuous notifications and interruptions of the digital world.",
    "Effective communication is not merely about expressing your own ideas clearly, but actively listening to others with genuine interest and an open mind.",
    "Developing muscle memory takes time; your brain forms neural pathways each time you strike a key accurately without glancing down at your hands.",
    "Simplicity in design is not the absence of clutter, but the deliberate presence of only what is necessary to create harmony and intuitive function.",
    "Problem solving becomes substantially more rewarding when approached with curiosity, open experimentation, and willingness to embrace early mistakes.",
    "Resilience in the face of unforeseen obstacles often differentiates lasting achievement from fleeting enthusiasm across long-term creative projects.",
    "Balancing analytical precision with creative intuition yields breakthrough solutions that purely logical frameworks might otherwise overlook.",
    "Architecture is the learned game, correct and magnificent, of forms assembled in the light. Great buildings breathe life into urban spaces.",
    "The scientific method teaches us to hold hypotheses lightly and test them relentlessly against empirical evidence before reaching firm conclusions.",
    "Creativity thrives within well-chosen constraints. Limiting available tools forces inventive problem solving and uncovers novel perspectives.",
    "Understanding the underlying mechanics of a system allows engineers to anticipate failure modes before they manifest in production environments.",
    "Continuous learning is no longer a luxury but an absolute necessity in an era characterized by rapid technological advancement and paradigm shifts.",
    "Digital minimalism is not about rejecting technology, but about intentionally choosing tools that align with your deepest personal and professional values.",
    "The speed of thought often outpaces the speed of execution; bridging that gap requires refined workflows and deliberate, focused practice."
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
    "Thermodynamic entropy dictates that isolated physical systems spontaneously evolve toward thermodynamic equilibrium, representing maximum microscopic statistical disorder.",
    "Epistemological frameworks investigate the nature, origin, and limits of human knowledge, interrogating the boundary between empirical observation and rationalist deduction.",
    "Compilers translate high-level semantic representations into optimized machine instructions through lexical analysis, abstract syntax tree transformations, and register allocation.",
    "The microarchitectural pipeline of modern superscalar processors relies heavily on out-of-order execution, branch prediction, and speculative caching to maximize instruction throughput.",
    "Non-Euclidean geometries challenged millennia of mathematical dogma by demonstrating that parallel postulates depend strictly on the intrinsic curvature of Riemannian manifolds.",
    "Concurrent memory models must navigate subtle cache coherency protocols and memory barriers to ensure sequential consistency across multi-core processor topologies.",
    "Stochastic gradient descent navigates high-dimensional non-convex loss landscapes, searching for generalizable local minima through noisy empirical risk estimates."
  ]
};

let lastPickedIndex: Record<Difficulty, number> = {
  beginner: -1,
  intermediate: -1,
  advanced: -1
};

export function getRandomText(difficulty: Difficulty): string {
  const list = TEXT_COLLECTIONS[difficulty];
  let newIndex = Math.floor(Math.random() * list.length);
  // Ensure we don't repeat the exact same text consecutive times
  if (newIndex === lastPickedIndex[difficulty] && list.length > 1) {
    newIndex = (newIndex + 1 + Math.floor(Math.random() * (list.length - 1))) % list.length;
  }
  lastPickedIndex[difficulty] = newIndex;
  return list[newIndex];
}

// Generate sufficient sentences for any duration from 15 seconds up to 60 minutes
export function getGeneratedTextForDuration(difficulty: Difficulty, durationSeconds: number): string {
  const list = TEXT_COLLECTIONS[difficulty];
  const approximateWordsNeeded = Math.max(30, Math.ceil((durationSeconds / 60) * 110));
  
  // Shuffle list with strong randomization
  const shuffled = [...list].sort(() => 0.5 - Math.random());
  
  // Avoid starting with the last picked text if possible
  let startIndex = 0;
  if (shuffled[0] === list[lastPickedIndex[difficulty]] && shuffled.length > 1) {
    startIndex = 1;
  }

  let combined = shuffled[startIndex];
  let currentWords = combined.split(/\s+/).length;

  let idx = (startIndex + 1) % shuffled.length;
  while (currentWords < approximateWordsNeeded) {
    const nextItem = shuffled[idx];
    combined += " " + nextItem;
    currentWords = combined.split(/\s+/).length;
    idx = (idx + 1) % shuffled.length;
  }

  // Update last picked index to ensure next generation is always fresh
  const firstChosenIndex = list.indexOf(shuffled[startIndex]);
  if (firstChosenIndex !== -1) {
    lastPickedIndex[difficulty] = firstChosenIndex;
  }

  return combined;
}
