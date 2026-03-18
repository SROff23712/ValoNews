import { useState, useEffect } from 'react';
import { NewsCard } from '../components/NewsCard';
import { CategoryDropdown } from '../components/CategoryDropdown';
import { getNews, type NewsItem } from '../../services/valorantApi';

export function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tout");

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await getNews();
      setNews(data);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const categories = ["Tout", ...Array.from(new Set(news.map(n => n.category))).filter(Boolean)];

  const filteredNews = activeCategory === "Tout" 
    ? news 
    : news.filter((n: NewsItem) => n.category === activeCategory);

  const featuredNews = filteredNews.find((n: NewsItem) => n.featured);
  const regularNews = filteredNews.filter((n: NewsItem) => !n.featured);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
        <p className="text-muted-foreground text-lg">Chargement des dernières actualités...</p>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section avec actualité principale */}
      {featuredNews && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <a href={featuredNews.url} target="_blank" rel="noopener noreferrer">
            <NewsCard 
              title={featuredNews.title}
              category={featuredNews.category}
              date={featuredNews.date}
              image={featuredNews.image}
              excerpt={featuredNews.excerpt}
              featured={true}
            />
          </a>
        </section>
      )}

      {/* Filtre de catégories avec dropdown */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Filtrer par catégorie :
          </span>
          <CategoryDropdown 
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </section>

      {/* Grille d'actualités */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularNews.map((n: NewsItem) => (
            <a key={n.id} href={n.url} target="_blank" rel="noopener noreferrer">
              <NewsCard 
                title={n.title}
                category={n.category}
                date={n.date}
                image={n.image}
                excerpt={n.excerpt}
                featured={false}
              />
            </a>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-20 bg-card/30 rounded-lg border border-dashed border-primary/20">
            <p className="text-muted-foreground text-lg mb-6">
              Aucune actualité disponible pour le moment.
            </p>
            <button 
              onClick={fetchNews}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background font-bold uppercase tracking-wider rounded hover:bg-primary/90 transition-colors"
            >
              Actualiser les news
            </button>
          </div>
        )}
      </section>
    </>
  );
}
