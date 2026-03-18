import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getWeaponSkins, getContentTiers, type WeaponSkin, type ContentTier } from '../../services/valorantApi';
import { Star, ArrowLeft, Play, Pause, Volume2, VolumeX, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function SkinDetailPage() {
  const { skinUuid } = useParams();
  const navigate = useNavigate();
  const [skin, setSkin] = useState<WeaponSkin | null>(null);
  const [contentTiers, setContentTiers] = useState<ContentTier[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedChroma, setSelectedChroma] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [isPreviewVideo, setIsPreviewVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem('valorant-skin-volume');
    return savedVolume !== null ? parseFloat(savedVolume) : 0.5;
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [skinsData, tiersData] = await Promise.all([
          getWeaponSkins(),
          getContentTiers()
        ]);

        const selectedSkin = skinsData.find(s => s.uuid === skinUuid);
        if (selectedSkin) {
          setSkin(selectedSkin);
          // Set initial preview to video if level 1 has it
          if (selectedSkin.levels[0]?.streamedVideo) {
            setIsPreviewVideo(true);
          }
        }
        setContentTiers(tiersData);
      } catch (error) {
        console.error('Error loading skin details:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [skinUuid]);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
        <p className="text-muted-foreground text-lg">Chargement du skin...</p>
      </section>
    );
  }

  if (!skin) {
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-foreground text-xl mb-4">Skin non trouvé.</p>
        <button onClick={() => navigate('/skins')} className="text-primary hover:underline">Retour à l'arsenal</button>
      </section>
    );
  }

  const tier = contentTiers.find((t: ContentTier) => t.uuid === skin.contentTierUuid);
  const activeChroma = skin.chromas[selectedChroma];
  const activeLevel = skin.levels[selectedLevel];
  
  // Only allow video from level if base chroma is selected. 
  // Otherwise, only show if chroma has its own video.
  const videoSrc = (selectedChroma === 0)
    ? activeLevel.streamedVideo
    : activeChroma.streamedVideo;
    
  const hasVideo = !!videoSrc;

  const handleLevelClick = (index: number) => {
    setSelectedLevel(index);
    // Auto-switch to video only if it actually exists for current selection
    const potentialVideo = (selectedChroma === 0)
      ? skin.levels[index].streamedVideo
      : activeChroma.streamedVideo;
      
    if (potentialVideo) {
      setIsPreviewVideo(true);
    }
  };

  const handleChromaClick = (index: number) => {
    setSelectedChroma(index);
    // If the new chroma doesn't have a video and it's not the base chroma, 
    // we should hide the video preview
    const newChroma = skin.chromas[index];
    const potentialVideo = (index === 0)
      ? activeLevel.streamedVideo
      : newChroma.streamedVideo;
      
    if (!potentialVideo) {
      setIsPreviewVideo(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
      >
        <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
        <span className="font-bold uppercase tracking-wider text-sm">Retour</span>
      </button>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Left: Preview Section */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-card border border-primary/20 group">
            <AnimatePresence mode="wait">
              {isPreviewVideo && videoSrc ? (
                <motion.div
                  key={`video-${selectedLevel}-${selectedChroma}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <video
                    ref={videoRef}
                    src={videoSrc || ''}
                    autoPlay
                    loop
                    className="w-full h-full object-cover"
                    onTimeUpdate={() => {
                      if (videoRef.current) {
                        setCurrentTime(videoRef.current.currentTime);
                      }
                    }}
                    onLoadedMetadata={() => {
                      if (videoRef.current) {
                        setDuration(videoRef.current.duration);
                        videoRef.current.volume = volume;
                      }
                    }}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                  
                  {/* Video Controls Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex flex-col gap-3">
                      {/* Seek Bar */}
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        step="0.1"
                        value={currentTime}
                        onChange={(e) => {
                          const time = parseFloat(e.target.value);
                          if (videoRef.current) {
                            videoRef.current.currentTime = time;
                            setCurrentTime(time);
                          }
                        }}
                        className="w-full h-1 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary hover:h-2 transition-all"
                      />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Play/Pause */}
                          <button
                            onClick={() => {
                              if (videoRef.current) {
                                if (isPlaying) videoRef.current.pause();
                                else videoRef.current.play();
                              }
                            }}
                            className="text-foreground hover:text-primary transition-colors"
                          >
                            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                          </button>

                          {/* Volume */}
                          <div className="flex items-center gap-2 group/volume">
                            <button
                              onClick={() => {
                                const newVolume = volume === 0 ? 0.5 : 0;
                                setVolume(newVolume);
                                localStorage.setItem('valorant-skin-volume', newVolume.toString());
                                if (videoRef.current) videoRef.current.volume = newVolume;
                              }}
                              className="text-foreground hover:text-primary transition-colors"
                            >
                              {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </button>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.05"
                              value={volume}
                              onChange={(e) => {
                                const v = parseFloat(e.target.value);
                                setVolume(v);
                                localStorage.setItem('valorant-skin-volume', v.toString());
                                if (videoRef.current) videoRef.current.volume = v;
                              }}
                              className="w-0 group-hover/volume:w-20 overflow-hidden h-1 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary transition-all duration-300"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-foreground bg-background/60 backdrop-blur-md px-3 py-1 rounded-full border border-primary/20 flex items-center gap-2">
                            <Play size={10} className="text-primary fill-primary" />
                            <span>Aperçu Vidéo</span>
                          </div>
                          <button
                            onClick={() => setIsPreviewVideo(false)}
                            className="bg-background/60 backdrop-blur-md p-1.5 rounded-full border border-primary/20 hover:bg-primary/20 transition-colors"
                            title="Voir l'image"
                          >
                            <Info size={14} className="text-foreground" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={`img-${selectedChroma}`}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex items-center justify-center p-12"
                >
                  <img
                    src={activeChroma.fullRender || activeChroma.displayIcon || skin.displayIcon}
                    alt={skin.displayName}
                    className="max-w-full max-h-full object-contain"
                  />
                  {hasVideo && (
                    <button
                      onClick={() => setIsPreviewVideo(true)}
                      className="absolute bottom-4 right-4 bg-primary/80 backdrop-blur-md px-3 py-1 rounded-full border border-primary/20 flex items-center gap-2 hover:bg-primary transition-colors"
                    >
                      <Play size={14} className="text-background fill-background" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-background">Voir la vidéo</span>
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none"></div>
          </div>

          {/* Chromas Selector */}
          <div className="bg-card border border-primary/10 rounded-lg p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
              <div className="w-1 h-1 bg-primary rounded-full"></div>
              Variantes de couleur
            </h3>
            <div className="flex flex-wrap gap-4">
              {skin.chromas.map((chroma, index) => (
                <button
                  key={chroma.uuid}
                  onClick={() => handleChromaClick(index)}
                  className={`relative w-16 h-16 rounded border-2 transition-all p-1 bg-muted/50 ${selectedChroma === index ? 'border-primary shadow-lg shadow-primary/20 bg-primary/5' : 'border-transparent hover:border-primary/40'
                    }`}
                >
                  <img
                    src={chroma.swatch || chroma.displayIcon || skin.displayIcon}
                    alt={chroma.displayName}
                    className="w-full h-full object-contain"
                  />
                  {selectedChroma === index && (
                    <motion.div layoutId="activeChroma" className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs font-bold uppercase text-foreground tracking-wide">
              {skin.chromas[selectedChroma].displayName.replace(skin.displayName, '').trim() || 'Défaut'}
            </p>
          </div>
        </div>

        {/* Right: Info Section */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-card border border-primary/10 rounded-lg p-8 h-full">
            <div className="mb-8">
              {tier && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted border border-primary/20">
                    <img src={tier.displayIcon} alt="" className="w-5 h-5 object-contain" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: `#${tier.highlightColor.substring(0, 6)}` }}>
                    {tier.displayName} EDITION
                  </span>
                </div>
              )}
              <h1 className="text-5xl font-bold uppercase tracking-tight text-foreground leading-[0.9]" style={{ fontFamily: 'Tungsten, sans-serif', fontWeight: 700 }}>
                {skin.displayName}
              </h1>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  Niveaux d'amélioration
                </h3>
                <div className="space-y-3">
                  {skin.levels.map((level, index) => (
                    <button
                      key={level.uuid}
                      onClick={() => handleLevelClick(index)}
                      className={`w-full flex items-center justify-between p-4 rounded border transition-all ${selectedLevel === index
                          ? 'bg-primary border-primary text-background'
                          : 'bg-muted/30 border-primary/10 text-foreground hover:border-primary/40'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black tracking-tighter w-6">0{index + 1}</span>
                        <span className="text-xs font-bold uppercase tracking-wider text-left">
                          {level.displayName === skin.displayName ? 'Niveau de base' : level.displayName.split('Level')[1] || level.displayName}
                        </span>
                      </div>
                      {level.streamedVideo && (
                        <div className={`p-1 rounded-full ${selectedLevel === index ? 'bg-background/20' : 'bg-primary/10'}`}>
                          <Play size={10} fill="currentColor" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-primary/10">
                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded border border-primary/10">
                  <Info size={16} className="text-primary mt-0.5 shrink-0" />
                  <p className="text-[11px] leading-relaxed text-muted-foreground uppercase font-medium tracking-wide">
                    Les visuels affichés dépendent de la disponibilité dans l'API. Certains niveaux peuvent inclure des animations, des sons personnalisés et des finishers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}