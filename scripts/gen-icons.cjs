// Genera los iconos PNG de la app a partir de assets/logo.svg usando sharp.
const sharp = require('sharp')
const path = require('path')

const svgPath = path.join(__dirname, '..', 'assets', 'logo.svg')
const outDir = path.join(__dirname, '..', 'public')

async function gen(size, name) {
  await sharp(svgPath)
    .resize(size, size)
    .png()
    .toFile(path.join(outDir, name))
  console.log('Generado', name)
}

;(async () => {
  await gen(192, 'icon-192.png')
  await gen(512, 'icon-512.png')
  await gen(180, 'apple-touch-icon.png')
  await gen(32, 'favicon-32.png')
  console.log('Listo ✅')
})()
