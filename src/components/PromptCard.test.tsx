import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PromptCard from './PromptCard';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { TooltipProvider } from '@/components/ui/tooltip';

// ÈíÇäÇÊ æåãíÉ ááÇÎÊÈÇÑ (Mock Data)
const mockPrompt = {
  id: '123',
  title: 'Test Prompt Title',
  title_ar: 'ÚäæÇä ÊÌÑíÈí',
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

// ÛáÇÝ áÊæÝíÑ ÇáßæäÊßÓÊ (Wrapper)
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    <LanguageProvider>
      <TooltipProvider>
        {children}
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

    // ÇáÊÍÞÞ ãä ÙåæÑ ÇáÚäæÇä ÇáÅäÌáíÒí (ÇáÇÝÊÑÇÖí)
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
