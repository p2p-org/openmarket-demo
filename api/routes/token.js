import { Router } from 'express'
const { join } = require('path')
const fs = require('fs')
const sharp = require('sharp')

const FIRST_NAMES = ['Herbie', 'Sprinkles', 'Boris', 'Dave', 'Randy', 'Captain']
const LAST_NAMES = ['Starbelly', 'Fisherton', 'McCoy']

const BASES = ['jellyfish', 'starfish', 'crab', 'narwhal', 'tealfish', 'goldfish']
const EYES = ['big', 'joy', 'wink', 'sleepy', 'content']
const MOUTH = ['happy', 'surprised', 'pleased', 'cute']

const INT_ATTRIBUTES = [5, 2, 3, 4, 8]
const FLOAT_ATTRIBUTES = [1.4, 2.3, 11.7, 90.2, 1.2]
const STR_ATTRIBUTES = ['happy', 'sad', 'sleepy', 'boring']
const BOOST_ATTRIBUTES = [10, 40, 30]
const PERCENT_BOOST_ATTRIBUTES = [5, 10, 15]
const NUMBER_ATTRIBUTES = [1, 2, 1, 1]

const imgDir = join(__dirname, '../../static')

const router = Router()

module.exports = router

router.get('/token/:id', async (req, res, next) => {
  const tokenId = parseInt(req.params.id)
  console.log(req.params)
  const name = FIRST_NAMES[tokenId % FIRST_NAMES.length] + ' ' + LAST_NAMES[tokenId % LAST_NAMES.length]
  const base = BASES[tokenId % BASES.length]
  const eyes = EYES[tokenId % EYES.length]
  const mouth = MOUTH[tokenId % MOUTH.length]
  await composeImage([`images/bases/base-${base}.png`, `images/eyes/eyes-${eyes}.png`, `images/mouths/mouth-${mouth}.png`], tokenId)

  const attributes = []
  addAttribute(attributes, 'base', BASES, tokenId)
  addAttribute(attributes, 'eyes', EYES, tokenId)
  addAttribute(attributes, 'mouth', MOUTH, tokenId)
  addAttribute(attributes, 'level', INT_ATTRIBUTES, tokenId)
  addAttribute(attributes, 'stamina', FLOAT_ATTRIBUTES, tokenId)
  addAttribute(attributes, 'personality', STR_ATTRIBUTES, tokenId)
  addAttribute(attributes, 'aqua_power', BOOST_ATTRIBUTES, tokenId, 'boost_number')
  addAttribute(attributes, 'stamina_increase', PERCENT_BOOST_ATTRIBUTES, tokenId, 'boost_percentage')
  addAttribute(attributes, 'generation', NUMBER_ATTRIBUTES, tokenId, 'number')

  const metadata = {
    name,
    description: 'Friendly Creature that enjoys long swims in the ocean.',
    image: `${req.protocol}://${req.get('host')}/images/output/${tokenId}.png`,
    external_url: `${req.protocol}://${req.get('host')}/api/token/${tokenId}`,
    attributes,
  }

  return res.status(200).send(metadata)
})

// function notFound(res) {
//   res.status(404).send({
//     error: {
//       code: 'ERROR_NOT_FOUND',
//       message: 'Not found',
//     },
//   })
// }

function addAttribute(existing, attributeName, options, tokenId, displayType = null) {
  const trait = {
    trait_type: attributeName,
    value: options[tokenId % options.length],
  }
  if (displayType) {
    trait.display_type = displayType
  }
  existing.push(trait)
}

async function composeImage(images, tokenId) {
  const img = join(imgDir, 'images/output/', `${tokenId}.png`)
  if (!fs.existsSync(img)) {
    const composite = await sharp(join(imgDir, images.shift()))
      .composite(images.map(i => ({ input: join(imgDir, i) })))
      .toFile(img)
    console.log(composite)
  }
  return `/images/output/${tokenId}.png`
}
