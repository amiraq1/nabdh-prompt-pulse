import { create } from 'zustand';
import { Prompt, prompts as initialPrompts } from '@/data/prompts';

interface PromptStore {
  prompts: Prompt[];
  addPrompt: (prompt: Omit<Prompt, 'id' | 'likes'>) => void;
  updatePrompt: (id: string, prompt: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
}

export const usePromptStore = create<PromptStore>((set) => ({
  prompts: initialPrompts,
  
  addPrompt: (promptData) => set((state) => ({
    prompts: [
      {
        ...promptData,
        id: Date.now().toString(),
        likes: 0,
      },
      ...state.prompts,
    ],
  })),
  
  updatePrompt: (id, promptData) => set((state) => ({
    prompts: state.prompts.map((p) =>
      p.id === id ? { ...p, ...promptData } : p
    ),
  })),
  
  deletePrompt: (id) => set((state) => ({
    prompts: state.prompts.filter((p) => p.id !== id),
  })),
}));
