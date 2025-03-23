const { PurgeCSS } = require('purgecss');
const fs = require('fs');
const path = require('path');

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'assets', 'css', 'purged');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function purgeCSS() {
  const result = await new PurgeCSS().purge({
    content: [
      './index.html',
      './components/**/*.html',
      './assets/js/**/*.js'
    ],
    css: [
      './assets/css/main.css',
      './assets/css/portada.css',
      './assets/css/restaurante.css'
    ],
    safelist: {
      standard: [
        /^word-/,
        /^section-/,
        /^returning-/,
        /^social-/,
        /^logo-/,
        /^reset-/,
        /^active$/,
        /^fa-/,
        /^icon/
      ],
      deep: [/hover$/, /active$/]
    }
  });

  // Write each result to a file in the output directory
  result.forEach(file => {
    const fileName = path.basename(file.file);
    const outputPath = path.join(outputDir, fileName);
    fs.writeFileSync(outputPath, file.css);
    console.log(`Purged CSS written to: ${outputPath}`);
  });
}

purgeCSS().catch(err => {
  console.error('Error during CSS purging:', err);
  process.exit(1);
});