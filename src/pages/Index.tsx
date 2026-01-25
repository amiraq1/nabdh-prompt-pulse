import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FilterBar from '@/components/FilterBar';
import PromptGrid from '@/components/PromptGrid';
import { usePromptStore } from '@/stores/promptStore';

const Index = () => {
  const { prompts: allPrompts } = usePromptStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedModel, setSelectedModel] = useState('all');

  const filteredPrompts = useMemo(() => {
    return allPrompts.filter((prompt) => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;

      // Model filter
      const matchesModel = selectedModel === 'all' || prompt.model === selectedModel;

      return matchesSearch && matchesCategory && matchesModel;
    });
  }, [searchQuery, selectedCategory, selectedModel]);

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <main>
        <HeroSection />
        
        <FilterBar
          selectedCategory={selectedCategory}
          selectedModel={selectedModel}
          onCategoryChange={setSelectedCategory}
          onModelChange={setSelectedModel}
        />

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                {selectedCategory === 'all' ? 'All Prompts' : 
                  selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) + ' Prompts'}
              </h2>
              <span className="text-sm text-muted-foreground">
                {filteredPrompts.length} {filteredPrompts.length === 1 ? 'prompt' : 'prompts'}
              </span>
            </div>

            <PromptGrid prompts={filteredPrompts} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Nabdh. Built with passion for the AI community.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
