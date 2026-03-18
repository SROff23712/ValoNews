import { Outlet } from 'react-router';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <Header />
      <main className="pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/20 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-lg font-bold uppercase tracking-wider text-foreground mb-4" style={{ fontFamily: 'Tungsten, sans-serif' }}>
                À propos
              </h3>
              <p className="text-sm text-muted-foreground">
                Votre source d'actualités VALORANT. Restez informé des dernières mises à jour, agents, et événements esports.
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold uppercase tracking-wider text-foreground mb-4" style={{ fontFamily: 'Tungsten, sans-serif' }}>
                Liens rapides
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/agents" className="hover:text-primary transition-colors">Agents</a></li>
                <li><a href="/cartes" className="hover:text-primary transition-colors">Cartes</a></li>
                <li><a href="/skins" className="hover:text-primary transition-colors">Skins</a></li>
                <li><a href="/" className="hover:text-primary transition-colors">News</a></li>
              </ul>
            </div>

            <div className="flex flex-col items-center justify-center">
              <a
                href="https://sroff-page.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 transition-all hover:scale-105"
              >
                <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary/60 transition-colors">
                  <img
                    src="https://cdn.discordapp.com/avatars/1406280211552534684/c7d9c1e8955f4e80237ff6eb43b069e0.png?size=1024"
                    alt="_SR_Off_"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                    developed by
                  </p>
                  <p className="text-xl font-bold uppercase tracking-tighter text-foreground" style={{ fontFamily: 'Tungsten, sans-serif' }}>
                    _SR_Off_
                  </p>
                </div>
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-primary/20 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
            <p>© 2026 VALO NEWS. Application non-officielle créée par _SR_Off_.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
