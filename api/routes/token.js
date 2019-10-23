import { Router } from 'express'
import { LoremIpsum } from 'lorem-ipsum'
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

const totalSupply = 123

module.exports = router

router.get('/token/:id', async (req, res, next) => {
  const tokenId = parseInt(req.params.id.replace(/\D/g, ''))
  // console.log(req.params)
  const name =
    FIRST_NAMES[tokenId % FIRST_NAMES.length] +
    ' ' +
    LAST_NAMES[tokenId % LAST_NAMES.length] +
    ' ' +
    FIRST_NAMES[(tokenId + 11) % FIRST_NAMES.length] +
    ' ' +
    LAST_NAMES[(tokenId + 7) % LAST_NAMES.length]
  const base = BASES[tokenId % BASES.length]
  const eyes = EYES[tokenId % EYES.length]
  const mouth = MOUTH[tokenId % MOUTH.length]
  await composeImage([`images/bases/base-${base}.png`, `images/eyes/eyes-${eyes}.png`, `images/mouths/mouth-${mouth}.png`], tokenId)

  const metadata = {
    tokenId,
    totalCount: totalSupply,
    properties: [],
    definitions: {},
  }
  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 5,
      min: 3,
    },
    wordsPerSentence: {
      max: 10,
      min: 4,
    },
  })

  addMetaProp(metadata, { trait: 'name', value: name, display: 'title' })
  addMetaProp(metadata, { trait: 'image', value: `${req.protocol}://${req.get('host')}/images/output/${tokenId}.png`, display: 'image' })
  addMetaProp(metadata, { trait: 'description', value: lorem.generateParagraphs(1), display: 'description' })
  addMetaProp(metadata, { trait: 'external_url', value: `${req.protocol}://${req.get('host')}/api/token/${tokenId}`, display: 'link' })
  addMetaProp(metadata, { trait: 'collection', value: `AwesomeCuties`, display: 'collection' })

  addMetaDef(metadata, { trait: 'base', options: BASES, mock: true, id: tokenId })
  addMetaDef(metadata, { trait: 'eyes', options: EYES, mock: true, id: tokenId })
  addMetaDef(metadata, { trait: 'mouth', options: MOUTH, mock: true, id: tokenId })
  addMetaDef(metadata, { trait: 'level', options: INT_ATTRIBUTES, mm: true, mock: true, id: tokenId, display: 'stat' })
  addMetaDef(metadata, { trait: 'stamina', options: FLOAT_ATTRIBUTES, mm: true, mock: true, id: tokenId, display: 'rank' })
  addMetaDef(metadata, { trait: 'personality', options: STR_ATTRIBUTES, mock: true, id: tokenId })
  addMetaDef(metadata, { trait: 'aqua_power', options: BOOST_ATTRIBUTES, mm: true, mock: true, id: tokenId, display: 'rank' })
  addMetaDef(metadata, {
    trait: 'stamina_increase',
    options: PERCENT_BOOST_ATTRIBUTES,
    mm: true,
    mock: true,
    id: tokenId,
    display: 'rank',
  })
  addMetaDef(metadata, { trait: 'generation', options: NUMBER_ATTRIBUTES, mm: true, mock: true, id: tokenId, display: 'stat' })

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
function getMimMax(numbers) {
  return {
    min: Math.min(...numbers),
    max: Math.max(...numbers),
  }
}

function getMockVal(options, id) {
  return options[id % options.length]
}

function addMetaProp(metadata, { trait, value, count = 1, order = null, display = null }) {
  metadata.properties.push({
    trait,
    value,
    display,
    count,
    order,
  })
}
function addMetaDef(metadata, { trait, options = [], value = null, display = null, mock = false, id = null, mm = false }) {
  metadata.definitions[trait] = mm ? getMimMax(options) : options
  addMetaProp(metadata, { trait, value: mock ? getMockVal(options, id) : value, display })
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
