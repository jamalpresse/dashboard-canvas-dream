
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface BreadcrumbNavProps {
  className?: string;
}

// Map de routes pour définir les titres
const routeTitles: Record<string, string> = {
  '': 'Accueil',
  'search': 'Recherche',
  'improve': 'Amélioration Texte',
  'translation': 'Traduction',
  'news': 'Actualités',
  'image-generation': 'Génération d\'Images',
  'analytics': 'Analytique',
  'users': 'Utilisateurs',
  'settings': 'Paramètres'
};

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ className }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  if (pathSegments.length === 0 && location.pathname === '/') {
    return null; // Ne pas afficher le fil d'Ariane sur la page d'accueil
  }

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="flex items-center">
              <Home className="h-4 w-4 mr-1" />
              <span>Accueil</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pathSegments.map((segment, index) => {
          const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;
          const title = routeTitles[segment] || segment;

          return (
            <React.Fragment key={url}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-playfair font-medium text-snrt-red">
                    {title}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={url}>{title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNav;
