const DEFAULT_COSMIC_ENGINE_URL = 'https://cosmic-cloud-engine.fly.dev';

export const getCosmicEngineBaseUrl = (): string => {
  return import.meta.env.VITE_COSMIC_ENGINE_URL ?? DEFAULT_COSMIC_ENGINE_URL;
};

export const buildCosmicEngineUrl = (path: string): string => {
  const baseUrl = getCosmicEngineBaseUrl();
  return new URL(path, baseUrl).toString();
};
