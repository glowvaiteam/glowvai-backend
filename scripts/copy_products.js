const fs = require('fs');
const path = require('path');

const srcDir1 = path.join(__dirname, '..', 'product images', 'beminimalist.co_304d1b72-9f7a-4035-a61f-efa907717211');
const srcDir2 = path.join(__dirname, '..', 'product images', 'thedermaco.com_38c6440f-61d0-4e64-a73e-d0ca12ed9596');
const destDir = path.join(__dirname, '..', 'assets', 'products');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function copyFileSafe(srcFile, destFile) {
  if (fs.existsSync(srcFile)) {
    fs.copyFileSync(srcFile, destFile);
    console.log(`Copied ${path.basename(destFile)}`);
  }
}

// Minimalist products
copyFileSafe(path.join(srcDir1, 'Nia10Image4.png'), path.join(destDir, 'minimalist_niacinamide.png'));
copyFileSafe(path.join(srcDir1, 'SalicylicAcid2_1200-1-min.png'), path.join(destDir, 'minimalist_salicylic.png'));
copyFileSafe(path.join(srcDir1, 'VitB5_ListingImage.png'), path.join(destDir, 'minimalist_b5_moisturizer.png'));
copyFileSafe(path.join(srcDir1, 'L-AscNew.jpg.jpeg'), path.join(destDir, 'minimalist_vit_c.jpg'));
copyFileSafe(path.join(srcDir1, 'SPF50New.jpg.jpeg'), path.join(destDir, 'minimalist_spf50.jpg'));
copyFileSafe(path.join(srcDir1, 'SalicylicCleanserNew.jpg.jpeg'), path.join(destDir, 'minimalist_cleanser.jpg'));

// Derma Co products
copyFileSafe(path.join(srcDir2, 'fop_10_nia_new.jpg.jpeg'), path.join(destDir, 'dermaco_niacinamide.jpg'));
copyFileSafe(path.join(srcDir2, 'fop_2_kojic_serum_new.jpg.jpeg'), path.join(destDir, 'dermaco_kojic_acid.jpg'));
copyFileSafe(path.join(srcDir2, 'fop_2_salicylic_serum_white_bg.jpg.jpeg'), path.join(destDir, 'dermaco_salicylic.jpg'));
copyFileSafe(path.join(srcDir2, 'ceramide_ha_intense_moisturizer_1.jpg.jpeg'), path.join(destDir, 'dermaco_ceramide_moisturizer.jpg'));
copyFileSafe(path.join(srcDir2, 'ultra_matte_sunscreen.jpg.jpeg'), path.join(destDir, 'dermaco_sunscreen.jpg'));
copyFileSafe(path.join(srcDir2, 'fop_vit_c_30_ml_updated.jpg.jpeg'), path.join(destDir, 'dermaco_vit_c.jpg'));
copyFileSafe(path.join(srcDir2, 'snail-peptide-96-under-eye-cream-front.jpg.jpeg'), path.join(destDir, 'dermaco_eye_cream.jpg'));

console.log('Finished copying product assets.');
