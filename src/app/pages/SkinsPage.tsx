import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getWeapons, type Weapon } from '../../services/valorantApi';

export function SkinsPage() {
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getWeapons();
        // Filter weapons that have skins and exclude non-weapon items
        const filteredWeapons = data.filter(w => w.skins && w.skins.length > 0 && !w.displayName.includes('Melee'));
        
        // Add Melee (Couteaux) back but as a special category if needed, 
        // OR just keep all weapons that have a display icon
        setWeapons(data.filter(w => w.displayIcon));
      } catch (error) {
        console.error('Error loading weapons:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
        <p className="text-muted-foreground text-lg">Chargement des armes...</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-6xl font-bold uppercase tracking-wider text-foreground mb-4" style={{ fontFamily: 'Tungsten, sans-serif', fontWeight: 700 }}>
          Arsenal
        </h1>
        <p className="text-muted-foreground text-lg">
          Choisissez une arme pour découvrir ses skins exclusifs.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {weapons.map((weapon) => (
          <div
            key={weapon.uuid}
            onClick={() => navigate(`/skins/${weapon.uuid}`)}
            className="group relative overflow-hidden rounded bg-card border border-primary/20 transition-all hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10 cursor-pointer p-6 flex flex-col items-center justify-center min-h-[200px]"
          >
            <div className="w-full aspect-video mb-4 flex items-center justify-center">
              <img
                src={weapon.displayIcon}
                alt={weapon.displayName}
                className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-wide text-foreground mt-auto" style={{ fontFamily: 'Tungsten, sans-serif', fontWeight: 700 }}>
              {weapon.displayName}
            </h3>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
              {weapon.category.split('::')[1] || weapon.category}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}