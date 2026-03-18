import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { getWeapons, getContentTiers, type Weapon, type WeaponSkin, type ContentTier } from '../../services/valorantApi';
import { Star, ArrowLeft } from 'lucide-react';

export function WeaponSkinsPage() {
  const { weaponUuid } = useParams();
  const navigate = useNavigate();
  const [weapon, setWeapon] = useState<Weapon | null>(null);
  const [contentTiers, setContentTiers] = useState<ContentTier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [weaponsData, tiersData] = await Promise.all([
          getWeapons(),
          getContentTiers()
        ]);

        const selectedWeapon = weaponsData.find(w => w.uuid === weaponUuid);
        if (selectedWeapon) {
          setWeapon(selectedWeapon);
        }
        setContentTiers(tiersData);
      } catch (error) {
        console.error('Error loading weapon skins:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [weaponUuid]);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
        <p className="text-muted-foreground text-lg">Chargement des skins...</p>
      </section>
    );
  }

  if (!weapon) {
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-foreground text-xl mb-4">Arme non trouvée.</p>
        <button onClick={() => navigate('/skins')} className="text-primary hover:underline">Retour à l'arsenal</button>
      </section>
    );
  }

  const getContentTier = (uuid: string | null) => {
    return contentTiers.find(t => t.uuid === uuid);
  };

  const filteredSkins = weapon.skins.filter(skin => 
    !skin.displayName.includes('Standard') && !skin.displayName.includes('Random')
  );

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/skins" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group">
        <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
        <span className="font-bold uppercase tracking-wider text-sm">Retour à l'arsenal</span>
      </Link>

      <div className="mb-12 flex items-end gap-6">
        <img src={weapon.displayIcon} alt="" className="h-20 object-contain opacity-20" />
        <div>
          <h1 className="text-6xl font-bold uppercase tracking-wider text-foreground" style={{ fontFamily: 'Tungsten, sans-serif', fontWeight: 700 }}>
            Skins : {weapon.displayName}
          </h1>
          <p className="text-muted-foreground text-lg">
            {filteredSkins.length} skins de collection trouvés pour cette arme.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSkins.map((skin) => {
          const tier = getContentTier(skin.contentTierUuid);
          return (
            <div
              key={skin.uuid}
              onClick={() => navigate(`/skins/details/${skin.uuid}`)}
              className="group relative overflow-hidden rounded bg-card border border-primary/20 transition-all hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
            >
              <div className="aspect-video overflow-hidden bg-muted flex items-center justify-center p-4">
                <img
                  src={skin.displayIcon}
                  alt={skin.displayName}
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-5">
                <div className="mb-2 flex items-center justify-between">
                  {tier && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider" style={{ color: `#${tier.highlightColor.substring(0,6)}` }}>
                      <Star size={12} fill="currentColor" />
                      {tier.displayName}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold uppercase tracking-wide text-foreground line-clamp-1" style={{ fontFamily: 'Tungsten, sans-serif', fontWeight: 700 }}>
                  {skin.displayName}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
