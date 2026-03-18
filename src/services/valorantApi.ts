const BASE_URL = 'https://valorant-api.com/v1';

export interface Agent {
  uuid: string;
  displayName: string;
  description: string;
  displayIcon: string;
  fullPortrait: string;
  role: {
    displayName: string;
    displayIcon: string;
  };
  abilities: Array<{
    slot: string;
    displayName: string;
    description: string;
    displayIcon: string;
  }>;
}

export interface WeaponSkin {
  uuid: string;
  displayName: string;
  themeUuid: string;
  contentTierUuid: string | null;
  displayIcon: string;
  wallpaper: string | null;
  assetPath: string;
  chromas: Array<{
    uuid: string;
    displayName: string;
    displayIcon: string;
    fullRender: string;
    swatch: string | null;
    streamedVideo: string | null;
  }>;
  levels: Array<{
    uuid: string;
    displayName: string;
    levelItem: string | null;
    displayIcon: string;
    streamedVideo: string | null;
  }>;
}

export interface Weapon {
  uuid: string;
  displayName: string;
  category: string;
  displayIcon: string;
  skins: WeaponSkin[];
}

export interface Map {
  uuid: string;
  displayName: string;
  coordinates: string;
  displayIcon: string;
  listViewIcon: string;
  splash: string;
  assetPath: string;
  mapUrl: string;
  xMultiplier: number;
  yMultiplier: number;
  xScalarToAdd: number;
  yScalarToAdd: number;
  callouts: Array<{
    regionName: string;
    superRegionName: string;
    location: {
      x: number;
      y: number;
    };
  }> | null;
}

export interface ContentTier {
  uuid: string;
  displayName: string;
  devName: string;
  rank: number;
  juiceValue: number;
  juiceCost: number;
  highlightColor: string;
  displayIcon: string;
}

// Fetch all agents
export async function getAgents(): Promise<Agent[]> {
  try {
    const response = await fetch(`${BASE_URL}/agents?isPlayableCharacter=true`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching agents:', error);
    return [];
  }
}

// Fetch all weapons
export async function getWeapons(): Promise<Weapon[]> {
  try {
    const response = await fetch(`${BASE_URL}/weapons`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching weapons:', error);
    return [];
  }
}

// Fetch all weapon skins
export async function getWeaponSkins(): Promise<WeaponSkin[]> {
  try {
    const response = await fetch(`${BASE_URL}/weapons/skins`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching weapon skins:', error);
    return [];
  }
}

// Fetch all maps
export async function getMaps(): Promise<Map[]> {
  try {
    const response = await fetch(`${BASE_URL}/maps`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching maps:', error);
    return [];
  }
}

// Fetch content tiers (for skin rarities)
export async function getContentTiers(): Promise<ContentTier[]> {
  try {
    const response = await fetch(`${BASE_URL}/contenttiers`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching content tiers:', error);
    return [];
  }
}

// Fetch a specific agent by UUID
export async function getAgentByUuid(uuid: string): Promise<Agent | null> {
  try {
    const response = await fetch(`${BASE_URL}/agents/${uuid}`);
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error fetching agent:', error);
    return null;
  }
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  url: string;
  featured?: boolean;
}

export async function getNews(): Promise<NewsItem[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

  try {
    // Adding timestamp for cache busting
    const timestamp = Date.now();
    const response = await fetch(`https://api.henrikdev.xyz/valorant/v1/website/fr-fr?t=${timestamp}`, {
      headers: {
        'Authorization': 'HDEV-c2dd176d-44de-4072-97ae-325680870ae7'
      },
      cache: 'no-store',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const result = await response.json();
    
    if (result.status === 200 && result.data) {
      return result.data.slice(0, 12).map((item: any, index: number) => ({
        id: item.url || index.toString(),
        title: item.title,
        category: item.category || "Actualité",
        date: new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }),
        image: item.banner_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop",
        excerpt: item.title,
        url: item.url,
        featured: index === 0
      }));
    }
    
    throw new Error('Failed to fetch news from HenrikDev');
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn('HenrikDev API failed, falling back to local data:', error);
    
    try {
      // Fallback logic using local storage or static data if available
      // For now, we'll try to fetch the local vlr_news.json which we know exists
      const localResponse = await fetch('/vlr_news.json');
      const localResult = await localResponse.json();
      
      if (localResult.status === "success" && localResult.data && localResult.data.segments) {
        return localResult.data.segments.slice(0, 12).map((item: any, index: number) => ({
          id: item.url_path || index.toString(),
          title: item.title,
          category: "Compétition",
          date: item.date,
          image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop",
          excerpt: item.description,
          url: item.url_path,
          featured: index === 0
        }));
      }
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
    }
    
    return [];
  }
}
