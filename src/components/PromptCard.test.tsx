import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageProvider';
import { TooltipProvider } from '@/components/ui/tooltip';

vi.mock('@/contexts/useAuth', () => ({
  useAuth: () => ({
    user: null,
    session: null,
    signOut: vi.fn(),
    loading: false,
  }),
}));
vi.mock('@/hooks/useLike', () => ({
  useLike: () => ({
    isLiked: false,
    likesCount: 10,
    toggleLike: vi.fn(),
    isLoading: false,
  }),
}));

vi.mock('@/hooks/useBookmark', () => ({
  useBookmark: () => ({
    isBookmarked: false,
    toggleBookmark: vi.fn(),
    isLoading: false,
  }),
}));

vi.mock('@/components/AddToCollectionDialog', () => ({
  default: () => null,
}));


let PromptCard: typeof import('./PromptCard').default;

beforeAll(async () => {
  ({ default: PromptCard } = await import('./PromptCard'));
});

// Mock data
const mockPrompt = {
  id: '123',
  title: 'Test Prompt Title',
  title_ar: 'عنوان تجريبي',
  content: 'This is the prompt content for testing.',
  category: 'coding',
  ai_model: 'gpt-4',
  tags: ['react', 'test'],
  likes: 10,
  image_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    <LanguageProvider>
      <TooltipProvider>
        <MemoryRouter>
          {children}
        </MemoryRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

describe('PromptCard Component', () => {
  it('renders the prompt title correctly', () => {
    render(
      <TestWrapper>
        <PromptCard prompt={mockPrompt} />
      </TestWrapper>
    );

// default title should be visible
    expect(screen.getByText('Test Prompt Title')).toBeInTheDocument();
  });

  it('renders the model badge and tags', () => {
    render(
      <TestWrapper>
        <PromptCard prompt={mockPrompt} />
      </TestWrapper>
    );

    expect(screen.getByText('GPT-4')).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});

