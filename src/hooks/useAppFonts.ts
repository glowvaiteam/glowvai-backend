/**
 * Custom Font Loader Hook for GlowVAI V2
 * 
 * Loads:
 * 1. The official Bunch font family from local assets/fonts (Bunch-Heavy, Bunch-Bold, Bunch-ExtraBold, etc.)
 * 2. The official Syne Google Font family from @expo-google-fonts/syne
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
    // Bunch Font Family
    bunchHeavy: string;
    bunchBold: string;
    bunchExtraBold: string;
    bunchSemiBold: string;
    bunchMedium: string;
    bunchRegular: string;

    // Syne Font Family
    syneRegular: string;
    syneMedium: string;
    syneSemiBold: string;
    syneBold: string;
    syneExtraBold: string;
  } | null;
}

export const useAppFonts = (): AppFontsState => {
  const [fontsLoaded, fontError] = useFonts({
    // Local Bunch Fonts
    'Bunch-Heavy': require('../../assets/fonts/Bunch-Heavy.ttf'),
    'Bunch-Bold': require('../../assets/fonts/Bunch-Bold.ttf'),
    'Bunch-ExtraBold': require('../../assets/fonts/Bunch-ExtraBold.ttf'),
    'Bunch-SemiBold': require('../../assets/fonts/Bunch-SemiBold.ttf'),
    'Bunch-Medium': require('../../assets/fonts/Bunch-Medium.ttf'),
    'Bunch-Regular': require('../../assets/fonts/Bunch-Regular.ttf'),

    // Google Syne Fonts
    Syne_400Regular,
    Syne_500Medium,
    Syne_600SemiBold,
    Syne_700Bold,
    Syne_800ExtraBold,
  });

  if (fontError) {
    console.error('[useAppFonts] Font Loading Error:', fontError.message);
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
      bunchHeavy: 'Bunch-Heavy',
      bunchBold: 'Bunch-Bold',
      bunchExtraBold: 'Bunch-ExtraBold',
      bunchSemiBold: 'Bunch-SemiBold',
      bunchMedium: 'Bunch-Medium',
      bunchRegular: 'Bunch-Regular',

      syneRegular: 'Syne_400Regular',
      syneMedium: 'Syne_500Medium',
      syneSemiBold: 'Syne_600SemiBold',
      syneBold: 'Syne_700Bold',
      syneExtraBold: 'Syne_800ExtraBold',
    },
  };
};
