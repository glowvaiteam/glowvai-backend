/**
 * AI Skin Diagnostic Service for GlowVAI V2
 * 
 * Computes biometric facial metrics for Acne, Hydration, Texture,
 * Pigmentation, Sebum Balance, and compiles the overall Glow Score.
 * Routes directly to Render-hosted CNN model with high-fidelity local fallback.
 */

import { SkinScanReport } from '../types/scan';
import { runCnnSkinInference } from './aiSkinModelService';

let latestCachedReport: SkinScanReport | null = null;

export const analyzeFaceScan = async (imageUri?: string): Promise<SkinScanReport> => {
  const report = await runCnnSkinInference(imageUri);
  latestCachedReport = report;
  return report;
};

export const getLatestSkinReport = (): SkinScanReport | null => {
  return latestCachedReport;
};

export const setLatestSkinReport = (report: SkinScanReport) => {
  latestCachedReport = report;
};
