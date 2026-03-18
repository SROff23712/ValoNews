import { useState, useEffect } from 'react';
import { getAgents, type Agent } from '../../services/valorantApi';

export function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  useEffect(() => {
    async function fetchAgents() {
      setLoading(true);
      try {
        const data = await getAgents();
        setAgents(data);
      } catch (error) {
        console.error('Error loading agents:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAgents();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
            <p className="text-muted-foreground text-lg">Chargement des agents...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-6xl font-bold uppercase tracking-wider text-foreground mb-6" style={{ fontFamily: 'Tungsten, sans-serif', fontWeight: 700 }}>
        Agents
      </h1>
      <p className="text-muted-foreground text-lg mb-12">
        Découvrez tous les {agents.length} agents de VALORANT et leurs capacités uniques.
      </p>
      
      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.uuid}
            onClick={() => setSelectedAgent(agent)}
            className="group relative overflow-hidden rounded bg-card border border-primary/20 transition-all hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
          >
            {/* Agent Portrait */}
            <div className="aspect-[3/4] overflow-hidden bg-gradient-to-b from-muted to-background relative">
              {agent.fullPortrait && (
                <img
                  src={agent.fullPortrait}
                  alt={agent.displayName}
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              )}
              
              {/* Role Icon */}
              {agent.role && (
                <div className="absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full p-2 border border-primary/20">
                  <img
                    src={agent.role.displayIcon}
                    alt={agent.role.displayName}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>

            {/* Agent Info */}
            <div className="p-5 bg-gradient-to-t from-card to-transparent">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold uppercase tracking-wide text-foreground" style={{ fontFamily: 'Tungsten, sans-serif', fontWeight: 700 }}>
                  {agent.displayName}
                </h3>
                {agent.displayIcon && (
                  <img
                    src={agent.displayIcon}
                    alt=""
                    className="w-8 h-8 object-contain opacity-60"
                  />
                )}
              </div>
              
              {agent.role && (
                <p className="text-xs text-primary font-bold uppercase tracking-wider">
                  {agent.role.displayName}
                </p>
              )}

              <p className="text-sm text-muted-foreground mt-3 line-clamp-3">
                {agent.description}
              </p>

              {/* Abilities Count */}
              {agent.abilities && (
                <div className="mt-4 pt-4 border-t border-primary/20 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {agent.abilities.filter(a => a.slot !== 'Passive').length} capacités actives
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <div 
          className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-y-auto"
          onClick={() => setSelectedAgent(null)}
        >
          <div className="min-h-screen px-4 py-12">
            <div 
              className="mx-auto max-w-6xl bg-card border border-primary/20 rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left: Portrait */}
                <div className="relative bg-gradient-to-b from-muted to-background">
                  {selectedAgent.fullPortrait && (
                    <img
                      src={selectedAgent.fullPortrait}
                      alt={selectedAgent.displayName}
                      className="w-full h-full object-cover object-top"
                    />
                  )}
                </div>

                {/* Right: Info */}
                <div className="p-8">
                  <button
                    onClick={() => setSelectedAgent(null)}
                    className="mb-6 px-4 py-2 bg-primary text-background font-bold text-xs uppercase tracking-wider rounded hover:bg-primary/80 transition-colors"
                  >
                    Fermer
                  </button>

                  <h2 className="text-5xl font-bold uppercase tracking-wider text-foreground mb-4" style={{ fontFamily: 'Tungsten, sans-serif', fontWeight: 700 }}>
                    {selectedAgent.displayName}
                  </h2>

                  {selectedAgent.role && (
                    <div className="flex items-center gap-3 mb-6">
                      <img
                        src={selectedAgent.role.displayIcon}
                        alt={selectedAgent.role.displayName}
                        className="w-8 h-8 object-contain"
                      />
                      <span className="text-primary font-bold uppercase tracking-wider">
                        {selectedAgent.role.displayName}
                      </span>
                    </div>
                  )}

                  <p className="text-muted-foreground mb-8">
                    {selectedAgent.description}
                  </p>

                  {/* Abilities */}
                  {selectedAgent.abilities && (
                    <div>
                      <h3 className="text-2xl font-bold uppercase tracking-wider text-foreground mb-4" style={{ fontFamily: 'Tungsten, sans-serif', fontWeight: 700 }}>
                        Capacités
                      </h3>
                      
                      <div className="space-y-4">
                        {selectedAgent.abilities
                          .filter(ability => ability.slot !== 'Passive')
                          .map((ability, index) => (
                            <div key={index} className="flex gap-4 p-4 bg-muted/30 rounded border border-primary/10">
                              {ability.displayIcon && (
                                <img
                                  src={ability.displayIcon}
                                  alt={ability.displayName}
                                  className="w-12 h-12 object-contain"
                                />
                              )}
                              <div className="flex-1">
                                <h4 className="text-lg font-bold text-foreground uppercase tracking-wide mb-1">
                                  {ability.displayName}
                                </h4>
                                <p className="text-xs text-primary font-bold uppercase tracking-wider mb-2">
                                  {ability.slot}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {ability.description}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
