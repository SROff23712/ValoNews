interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-all rounded
            ${activeCategory === category 
              ? 'bg-primary text-background shadow-lg shadow-primary/20' 
              : 'bg-card text-muted-foreground border border-primary/20 hover:border-primary/60 hover:text-foreground'
            }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
