const fs = require('fs');
const path = require('path');
const vm = require('vm');

const projectDir = __dirname;
const photosDir = path.join(projectDir, 'photos');

// 1. Read sources
const rawHtml = fs.readFileSync(path.join(projectDir, 'index.html'), 'utf8');
const styles = fs.readFileSync(path.join(projectDir, 'styles.css'), 'utf8');
let audioEngine = fs.readFileSync(path.join(projectDir, 'audio-engine.js'), 'utf8')
  .replace(/export\s+const\s+audioEngine/g, 'const audioEngine');

let carArt = fs.readFileSync(path.join(projectDir, 'car-art.js'), 'utf8')
  .replace(/export\s+function\s+renderCarSvg/g, 'function renderCarSvg');

let carsData = fs.readFileSync(path.join(projectDir, 'cars-data.js'), 'utf8')
  .replace(/export\s+const\s+ERAS/g, 'const ERAS')
  .replace(/export\s+const\s+CARS/g, 'const CARS')
  .replace(/export\s+const\s+AUDIO_PROFILES/g, 'const AUDIO_PROFILES');

let app = fs.readFileSync(path.join(projectDir, 'app.js'), 'utf8')
  .replace(/import\s*\{[^}]*\}\s*from\s*['"][^'"]*['"];?/g, '');

const combinedJs = `
/* ==========================================================================
   1. PROCEDURAL WEB AUDIO ENGINE
   ========================================================================== */
${audioEngine}

/* ==========================================================================
   2. CAR VECTOR BLUEPRINTS & SILHOUETTE RENDERER
   ========================================================================== */
${carArt}

/* ==========================================================================
   3. VEHICLE DATABASE & ERA TIMELINE SPECIFICATIONS
   ========================================================================== */
${carsData}

/* ==========================================================================
   4. CORE SCROLLYTELLING & INTERACTIVE APPLICATION
   ========================================================================== */
${app}
`;

// Verify JS
try {
  new vm.Script(combinedJs);
  console.log('JavaScript bundle validated successfully.');
} catch (e) {
  console.error('JS validation failed:', e);
  process.exit(1);
}

// 2. Prepare base HTML template
// Replace <link rel="stylesheet" href="styles.css"> with <style>...</style>
let bundledHtml = rawHtml.replace(
  '<link rel="stylesheet" href="styles.css">',
  `<style>\n${styles}\n</style>`
);

// Replace <button class="filter-tab active" data-filter="all">All Vehicles (44)</button>
bundledHtml = bundledHtml.replace('All Vehicles (44)', 'All Vehicles (47)');

// Replace <script type="module" src="app.js"></script> with <script>...</script>
bundledHtml = bundledHtml.replace(
  '<script type="module" src="app.js"></script>',
  `<script>\n${combinedJs}\n</script>`
);

// Save updated index.html (uses photos/ relative paths, zero CORS issues, can be double-clicked directly!)
fs.writeFileSync(path.join(projectDir, 'index.html'), bundledHtml, 'utf8');
console.log(`Updated index.html written (${(bundledHtml.length / 1024).toFixed(1)} KB).`);

// 3. Create 100% standalone single-file HTML with Base64 embedded photos
console.log('Generating 100% self-contained standalone HTML file with base64 images...');

let base64CarsData = carsData;
const photoFiles = fs.readdirSync(photosDir);

for (const file of photoFiles) {
  if (!file.endsWith('.jpg')) continue;
  const id = file.replace('.jpg', '');
  const filePath = path.join(photosDir, file);
  const base64Data = fs.readFileSync(filePath).toString('base64');
  const dataUri = `data:image/jpeg;base64,${base64Data}`;
  
  // Replace photos/{id}.jpg with base64 data URI
  const target = `'photos/${id}.jpg'`;
  base64CarsData = base64CarsData.replace(target, `'${dataUri}'`);
}

const standaloneCombinedJs = `
/* ==========================================================================
   1. PROCEDURAL WEB AUDIO ENGINE
   ========================================================================== */
${audioEngine}

/* ==========================================================================
   2. CAR VECTOR BLUEPRINTS & SILHOUETTE RENDERER
   ========================================================================== */
${carArt}

/* ==========================================================================
   3. VEHICLE DATABASE & ERA TIMELINE SPECIFICATIONS (EMBEDDED IMAGES)
   ========================================================================== */
${base64CarsData}

/* ==========================================================================
   4. CORE SCROLLYTELLING & INTERACTIVE APPLICATION
   ========================================================================== */
${app}
`;

let standaloneHtml = rawHtml.replace(
  '<link rel="stylesheet" href="styles.css">',
  `<style>\n${styles}\n</style>`
);
standaloneHtml = standaloneHtml.replace('All Vehicles (44)', 'All Vehicles (47)');
standaloneHtml = standaloneHtml.replace(
  '<script type="module" src="app.js"></script>',
  `<script>\n${standaloneCombinedJs}\n</script>`
);

const standalonePath = path.join(projectDir, 'history-of-cars-standalone.html');
fs.writeFileSync(standalonePath, standaloneHtml, 'utf8');
console.log(`Standalone single-file HTML generated at: ${standalonePath} (${(standaloneHtml.length / 1024 / 1024).toFixed(2)} MB).`);
