const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

const fontFolders = [
  'babalove','baq-rounded','bomkin','crop','do-it-again','ebisu',
  'electro','headlined','headlined-solid','hiroko','hiruko',
  'kono','letro','lippy','miyagi','monino-pro','monolite',
  'nanami','nanami-3d','nanami-extended','nanami-handmade',
  'nanami-rounded-pro','nerolina','odyssea','patisserie',
  'rika','roka','roxic','shine-pro','sobek','soto',
  'squoosh-gothic','vow-neue','yoko','york-handwriting',
  'yuki','yuko','yume','ui'
];

async function main() {
  const fontsDir = path.join(__dirname, 'public/fonts');
  const urls = {};

  for (const folder of fontFolders) {
    const folderPath = path.join(fontsDir, folder);
    if (!fs.existsSync(folderPath)) { console.log(`Skipping ${folder} — not found`); continue; }

    const files = fs.readdirSync(folderPath).filter(f => /\.(otf|ttf|woff2?)$/i.test(f));
    urls[folder] = [];

    for (const file of files) {
      const localPath = path.join(folderPath, file);
      const blobPath = `fonts/${folder}/${file}`;
      try {
        const blob = await put(blobPath, fs.readFileSync(localPath), { access: 'public', token: process.env.BLOB_READ_WRITE_TOKEN });
        urls[folder].push({ file, url: blob.url });
        console.log(`✓ ${blobPath}`);
      } catch (e) {
        console.error(`✗ ${blobPath}: ${e.message}`);
      }
    }
  }

  fs.writeFileSync('blob-urls.json', JSON.stringify(urls, null, 2));
  console.log('\nDone! URLs saved to blob-urls.json');
}

main().catch(console.error);
