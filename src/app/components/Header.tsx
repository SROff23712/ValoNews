import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import logo from '../../assets/logo.png';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-primary/20 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 flex items-center justify-center">
                <img src={logo} alt="Logo" className="h-full w-full object-contain" />
              </div>
              <span className="text-2xl font-bold tracking-wider text-foreground" style={{ fontFamily: 'Tungsten, sans-serif', fontWeight: 700 }}>
                ValoNews
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-semibold uppercase tracking-wider transition-colors ${isActive('/') && location.pathname === '/' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                }`}
            >
              Actualités
            </Link>
            <Link
              to="/agents"
              className={`text-sm font-semibold uppercase tracking-wider transition-colors ${isActive('/agents') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                }`}
            >
              Agents
            </Link>
            <Link
              to="/cartes"
              className={`text-sm font-semibold uppercase tracking-wider transition-colors ${isActive('/cartes') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                }`}
            >
              Cartes
            </Link>
            <Link
              to="/skins"
              className={`text-sm font-semibold uppercase tracking-wider transition-colors ${isActive('/skins') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                }`}
            >
              Bibliothèque de Skins
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden rounded p-2 text-foreground hover:bg-card transition-colors"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-primary/20 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-semibold uppercase tracking-wider transition-colors ${isActive('/') && location.pathname === '/' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                  }`}
              >
                Actualités
              </Link>
              <Link
                to="/agents"
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-semibold uppercase tracking-wider transition-colors ${isActive('/agents') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                  }`}
              >
                Agents
              </Link>
              <Link
                to="/cartes"
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-semibold uppercase tracking-wider transition-colors ${isActive('/cartes') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                  }`}
              >
                Cartes
              </Link>
              <Link
                to="/skins"
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-semibold uppercase tracking-wider transition-colors ${isActive('/skins') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                  }`}
              >
                Bibliothèque de Skins
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}