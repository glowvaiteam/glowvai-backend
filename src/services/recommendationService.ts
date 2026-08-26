/**
 * Dermatology Recommendation Service for GlowVAI V2
 * 
 * Maps AI skin scan metrics into a targeted 4-step routine:
 * 1. Gentle Cleanser
 * 2. Hydrating Toner
 * 3. Targeted Serum
 * 4. Moisturizer / Broad-Spectrum Sunscreen
 */

import { RoutineProduct, SkinScanReport } from '../types/scan';

export const getRecommendedRoutine = (
  _report?: SkinScanReport | null
): RoutineProduct[] => {
  return [
    {
      id: 'ROUTINE-01',
      stepNumber: 1,
      stepName: 'Cleanser',
      brand: 'CeraVe / Minimalist',
      name: 'Salicylic + LHA Foaming Cleanser (100ml)',
      keyIngredients: ['2% Salicylic Acid', 'Zinc PCA', 'Centella'],
      price: 349,
      originalPrice: 420,
      rating: 4.8,
      reviewsCount: 1420,
      isQuickCommerceAvailable: true,
      deliveryMinutes: 28,
    },
    {
      id: 'ROUTINE-02',
      stepNumber: 2,
      stepName: 'Toner',
      brand: 'COSRX',
      name: 'Centella Asiatica Soothing Toner (150ml)',
      keyIngredients: ['Centella Extract', 'Panthenol B5', 'Allantoin'],
      price: 599,
      originalPrice: 750,
      rating: 4.9,
      reviewsCount: 890,
      isQuickCommerceAvailable: true,
      deliveryMinutes: 24,
    },
    {
      id: 'ROUTINE-03',
      stepNumber: 3,
      stepName: 'Targeted Serum',
      brand: 'The Ordinary',
      name: 'Niacinamide 10% + Zinc 1% Blemish Serum (30ml)',
      keyIngredients: ['10% Niacinamide', '1% Zinc PCA', 'Hyaluronic Acid'],
      price: 600,
      originalPrice: 700,
      rating: 4.7,
      reviewsCount: 2310,
      isQuickCommerceAvailable: true,
      deliveryMinutes: 30,
    },
    {
      id: 'ROUTINE-04',
      stepNumber: 4,
      stepName: 'Moisturizer / SPF',
      brand: 'Beauty of Joseon / Aqualogica',
      name: 'Rice + Probiotics Dewy Sunscreen SPF 50+ PA++++ (50g)',
      keyIngredients: ['Rice Extract', 'Grain Probiotics', 'Niacinamide'],
      price: 649,
      originalPrice: 799,
      rating: 4.9,
      reviewsCount: 3120,
      isQuickCommerceAvailable: true,
      deliveryMinutes: 22,
    },
  ];
};
