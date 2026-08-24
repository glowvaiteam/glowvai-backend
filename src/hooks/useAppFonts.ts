/**
 * Custom Font Loader Hook for GlowVAI V2
 * Strictly loads the actual Syne font family from @expo-google-fonts/syne
 * 
 * Rules:
 * 1. Never falls back silently to another font (System, Inter, Poppins).
 * 2. If font loading fails, reports the exact error.
 * 3. Applies the loaded family name ONLY when confirmed loaded.
 */

import {
  useFonts,
  Syne_400Regular,
  Syne_500Medium,
  Syne_600SemiBold,
  Syne_700Bold,
  Syne_800ExtraBold,
} from '@expo-google-fonts/syne';

export interface AppFontsState {
  isLoaded: boolean;
  fontError: Error | null;
  fontFamily: {
    syneRegular: string;
    syneMedium: string;
    syneSemiBold: string;
    syneBold: string;
    syneExtraBold: string;
  } | null;
}

export const useAppFonts = (): AppFontsState => {
  const [fontsLoaded, fontError] = useFonts({
    Syne_400Regular,
    Syne_500Medium,
    Syne_600SemiBold,
    Syne_700Bold,
    Syne_800ExtraBold,
  });

  if (fontError) {
    console.error('[useAppFonts] Critical: Failed to load Syne Google Font:', fontError.message);
  }

  if (!fontsLoaded) {
    return {
      isLoaded: false,
      fontError: fontError || null,
      fontFamily: null,
    };
  }

  return {
    isLoaded: true,
    fontError: null,
    fontFamily: {
      syneRegular: 'Syne_400Regular',
      syneMedium: 'Syne_500Medium',
      syneSemiBold: 'Syne_600SemiBold',
      syneBold: 'Syne_700Bold',
      syneExtraBold: 'Syne_800ExtraBold',
    },
  };
};
