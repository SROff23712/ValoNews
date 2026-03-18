import { useState, useEffect } from 'react';
import { getMaps, type Map } from '../../services/valorantApi';
import { MapPin, X, Globe, Layers, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function MapsPage() {
  const [maps, setMaps] = useState<Map[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMap, setSelectedMap] = useState<Map | null>(null);

  useEffect(() => {
    async function fetchMaps() {
      setLoading(true);
      try {
        const data = await getMaps();
        // Filter out removed maps or test maps
        const activeMaps = data.filter(map => map.displayName && !map.displayName.includes('The Range'));
        setMaps(activeMaps);
      } catch (error) {
        console.error('Error loading maps:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMaps();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
            <p className="text-muted-foreground text-lg">Chargement des cartes...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-7xl font-bold uppercase tracking-tighter text-foreground mb-4" style={{ fontFamily: 'Tungsten, sans-serif', fontWeight: 700 }}>
          Cartes
        </h1>
        <p className="text-muted-foreground text-xl mb-12 max-w-2xl leading-relaxed">
          Explorez les {maps.length} zones de conflit du protocole VALORANT. Maîtrisez chaque angle pour prendre l'avantage tactique.
        </p>
      </motion.div>
      
      {/* Maps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {maps.map((map, index) => (
          <motion.div
            key={map.uuid}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            onClick={() => setSelectedMap(map)}
            className="group relative overflow-hidden rounded-lg bg-card border border-primary/10 transition-all hover:border-primary/40 cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-primary/5 aspect-video"
          >
            {/* Map Splash */}
            <div className="absolute inset-0 overflow-hidden">
              {map.splash ? (
                <img
                  src={map.splash}
                  alt={map.displayName}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : map.displayIcon ? (
                <img
                  src={map.displayIcon}
                  alt={map.displayName}
                  className="h-full w-full object-cover p-8 transition-transform duration-700 group-hover:scale-110 opacity-40"
                />
              ) : null}
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent group-hover:from-background/90 transition-all duration-300"></div>
            </div>

            {/* Map Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-4xl font-bold uppercase tracking-wide text-foreground leading-none" style={{ fontFamily: 'Tungsten, sans-serif', fontWeight: 700 }}>
                  {map.displayName}
                </h3>
                
                <div className="flex items-center gap-2 text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <MapPin size={14} className="text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{map.coordinates || 'Coordonnées inconnues'}</span>
                </div>
              </div>
            </div>

            {/* Decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </motion.div>
        ))}
      </div>

      {/* Map Detail Immersive Overlay */}
      <AnimatePresence>
        {selectedMap && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/90 backdrop-blur-xl z-[100] overflow-y-auto"
          >
            <div className="min-h-screen flex flex-col">
              {/* Close Button */}
              <button
                onClick={() => setSelectedMap(null)}
                className="fixed top-8 right-8 z-[110] p-4 bg-primary text-background rounded-full hover:scale-110 transition-transform shadow-xl shadow-primary/20"
              >
                <X size={24} />
              </button>

              {/* Background Map Placeholder */}
              <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden flex items-center justify-center">
                <img src={selectedMap.displayIcon} className="w-[150%] max-w-none grayscale invert" alt="" />
              </div>

              <div className="relative flex-1 container mx-auto px-4 py-20 flex flex-col lg:flex-row gap-16 items-start">
                
                {/* Left: Info & Callouts */}
                <div className="w-full lg:w-1/3 space-y-12">
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-0.5 w-12 bg-primary"></div>
                      <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Map Overview</span>
                    </div>
                    <h2 className="text-8xl font-bold uppercase tracking-tighter text-foreground mb-4 leading-none" style={{ fontFamily: 'Tungsten, sans-serif', fontWeight: 700 }}>
                      {selectedMap.displayName}
                    </h2>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Globe size={20} className="text-primary/50" />
                      <span className="text-lg font-medium italic">{selectedMap.coordinates}</span>
                    </div>
                  </motion.div>

                  {selectedMap.callouts && selectedMap.callouts.length > 0 && (
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-6"
                    >
                      <h3 className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-foreground">
                        <Navigation size={18} className="text-primary" />
                        Points tactiques ({selectedMap.callouts.length})
                      </h3>
                      <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-primary/20">
                        {Array.from(new Set(selectedMap.callouts.map(c => c.superRegionName))).filter(Boolean).map((region) => (
                           <div key={region} className="col-span-2 mt-4 first:mt-0">
                             <div className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">{region}</div>
                             <div className="grid grid-cols-2 gap-2">
                               {selectedMap.callouts?.filter(c => c.superRegionName === region).map((callout, idx) => (
                                 <div key={idx} className="p-3 bg-card border border-primary/5 rounded hover:border-primary/30 transition-colors group">
                                   <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                                     {callout.regionName}
                                   </div>
                                 </div>
                               ))}
                             </div>
                           </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Right: Tactical Map Display */}
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex-1 w-full bg-card/30 backdrop-blur-md rounded-2xl border border-primary/10 overflow-hidden relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-8 left-8 flex items-center gap-4 text-xs font-black uppercase tracking-widest opacity-30">
                    <Layers size={14} />
                    <span>Ray-traced Tactical Grid v2.04</span>
                  </div>

                  {selectedMap.displayIcon ? (
                    <div className="p-12 h-full flex items-center justify-center relative">
                      <img
                        src={selectedMap.displayIcon}
                        alt={`${selectedMap.displayName} tactical`}
                        className="max-w-full max-h-[70vh] object-contain drop-shadow-[0_0_50px_rgba(var(--primary),0.2)] invert brightness-200"
                        style={{ filter: 'invert(1) brightness(1.5) drop-shadow(0 0 30px rgba(255, 70, 85, 0.2))' }}
                      />
                      
                      {/* Grid Lines Overlay */}
                      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(var(--background),0.4)_100%)] opacity-30"></div>
                      <div className="absolute inset-0 pointer-events-none [background-image:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:100px_100px] opacity-20"></div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground italic">
                      Données tactiques non disponibles pour cette zone.
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
