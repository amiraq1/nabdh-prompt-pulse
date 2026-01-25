// Simple fuzzy search implementation
export const fuzzyMatch = (text: string, query: string): { match: boolean; score: number } => {
  if (!query) return { match: true, score: 1 };
  
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  // Exact match gets highest score
  if (textLower.includes(queryLower)) {
    return { match: true, score: 1 };
  }
  
  // Check if all characters appear in order (fuzzy)
  let queryIndex = 0;
  let score = 0;
  let consecutiveMatches = 0;
  
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++;
      consecutiveMatches++;
      score += consecutiveMatches; // Bonus for consecutive matches
    } else {
      consecutiveMatches = 0;
    }
  }
  
  const isMatch = queryIndex === queryLower.length;
  const normalizedScore = isMatch ? score / (queryLower.length * queryLower.length) : 0;
  
  return { match: isMatch, score: normalizedScore };
};

export const fuzzySearch = <T>(
  items: T[],
  query: string,
  getSearchableText: (item: T) => string[]
): T[] => {
  if (!query.trim()) return items;
  
  const results = items
    .map((item) => {
      const searchableTexts = getSearchableText(item);
      let bestScore = 0;
      let hasMatch = false;
      
      for (const text of searchableTexts) {
        const { match, score } = fuzzyMatch(text, query);
        if (match && score > bestScore) {
          bestScore = score;
          hasMatch = true;
        }
      }
      
      return { item, score: bestScore, hasMatch };
    })
    .filter((result) => result.hasMatch)
    .sort((a, b) => b.score - a.score);
  
  return results.map((r) => r.item);
};

// Generate search suggestions from existing data
export const generateSuggestions = (
  prompts: { title: string; tags: string[] | null; category: string }[],
  query: string,
  limit: number = 5
): string[] => {
  if (!query.trim() || query.length < 2) return [];
  
  const queryLower = query.toLowerCase();
  const suggestions = new Set<string>();
  
  // Add matching titles
  for (const prompt of prompts) {
    if (prompt.title.toLowerCase().includes(queryLower)) {
      suggestions.add(prompt.title);
    }
    
    // Add matching tags
    for (const tag of prompt.tags ?? []) {
      if (tag.toLowerCase().includes(queryLower)) {
        suggestions.add(tag);
      }
    }
  }
  
  // Convert to array and limit
  return Array.from(suggestions).slice(0, limit);
};
