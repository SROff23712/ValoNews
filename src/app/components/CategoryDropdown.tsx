import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface CategoryDropdownProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryDropdown({ categories, activeCategory, onCategoryChange }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-3 px-6 py-3 bg-card border border-primary/20 rounded text-foreground hover:border-primary/60 transition-all min-w-[200px]"
      >
        <span className="font-bold uppercase tracking-wider text-sm">{activeCategory}</span>
        <ChevronDown 
          size={20} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-primary/20 rounded shadow-lg shadow-primary/10 overflow-hidden z-50">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                onCategoryChange(category);
                setIsOpen(false);
              }}
              className={`w-full px-6 py-3 text-left text-sm font-bold uppercase tracking-wider transition-colors
                ${activeCategory === category 
                  ? 'bg-primary text-background' 
                  : 'text-muted-foreground hover:bg-primary/10 hover:text-foreground'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
