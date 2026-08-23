import { useMemo } from 'react';
import { useAsync } from './useAsync';
import { getSchoolSettings, resolveImagePath } from './queries';

const DEFAULT_HERO = '/images/hero/747790180_1695912488193881_6220268956494401084_n.jpg';

export function useHeroImage() {
  const settings = useAsync(getSchoolSettings, []);
  return useMemo(() => {
    const enabled = settings.data?.hero_enabled ?? true;
    if (!enabled) return { heroEnabled: false, heroImage: '' };
    const path = settings.data?.hero_image_path;
    const heroImage = path ? resolveImagePath(path) : DEFAULT_HERO;
    return { heroEnabled: true, heroImage };
  }, [settings.data]);
}
