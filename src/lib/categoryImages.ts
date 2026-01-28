export const CATEGORY_IMAGES = {
    coding: [
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop", // Code editor dark
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop", // Laptop code
        "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=600&auto=format&fit=crop", // Developer setup
    ],
    art: [
        "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=600&auto=format&fit=crop", // Abstract paint
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop", // Colorful art
        "https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=600&auto=format&fit=crop", // Art supplies
    ],
    writing: [
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600&auto=format&fit=crop", // Writing desk
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop", // Typewriter
        "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?q=80&w=600&auto=format&fit=crop", // Notebook
    ],
    marketing: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop", // Business graph
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop", // Analytics
        "https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=600&auto=format&fit=crop", // Marketing strategy
    ],
    default: [
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop", // AI abstract
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop", // AI chip
    ]
};

export const getCategoryImage = (category: string, id: string | number) => {
    // Use the ID to consistently select the same image for the same prompt
    // simple hash function
    const hash = String(id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const images = CATEGORY_IMAGES[category as keyof typeof CATEGORY_IMAGES] || CATEGORY_IMAGES.default;
    const index = hash % images.length;

    return images[index];
};
