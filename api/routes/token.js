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

const totalSupply = 123

module.exports = tokenApi

function tokenApi(db) {
  const router = Router()
  router.get('/token/:id', async (req, res, next) => {
    const tokenId = parseInt(req.params.id.replace(/\D/g, ''))
    let item = db.show('nfts', tokenId)
    // let properties = []
    if (item) {
      if (item.meta) {
        // считаем что токен нормально записан в бд
        if (item && item.meta && item.meta.definitions) {
          return res.status(200).send({ ...item.meta, totalCount: db.count('nfts') })
        } else {
          item.meta.definitions = {}
        }
        if (item && item.meta && !item.meta.properties) {
          item.meta.properties = []
        }
      } else {
        item.meta = {
          tokenId,
          properties: [],
          definitions: {},
        }
      }
    } else {
      item = {
        // id: tokenId,
        meta: {
          tokenId,
          properties: [],
          definitions: {},
        },
      }
    }
    // console.log(req.params)

    const base = BASES[tokenId % BASES.length]
    const eyes = EYES[tokenId % EYES.length]
    const mouth = MOUTH[tokenId % MOUTH.length]

    if (!propHasTrait(item.meta, 'name')) {
      const name =
        FIRST_NAMES[tokenId % FIRST_NAMES.length] +
        ' ' +
        LAST_NAMES[tokenId % LAST_NAMES.length] +
        ' ' +
        FIRST_NAMES[(tokenId + 11) % FIRST_NAMES.length] +
        ' ' +
        LAST_NAMES[(tokenId + 7) % LAST_NAMES.length]
      addMetaProp(item.meta, { trait: 'name', value: name, display: 'title' })
    }
    if (!propHasTrait(item.meta, 'image')) {
      await composeImage([`images/bases/base-${base}.png`, `images/eyes/eyes-${eyes}.png`, `images/mouths/mouth-${mouth}.png`], tokenId)
      addMetaProp(item.meta, {
        trait: 'image',
        value: `${req.protocol}://${req.get('host')}/images/output/${tokenId}.png`,
        display: 'image',
      })
    }
    if (!propHasTrait(item.meta, 'description')) {
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
      addMetaProp(item.meta, { trait: 'description', value: lorem.generateParagraphs(1), display: 'description' })
    }

    addMetaProp(
      item.meta,
      {
        trait: 'external_url',
        value: `${req.protocol}://${req.get('host')}/api/token/${tokenId}`,
        display: 'link',
      },
      true
    )
    addMetaProp(item.meta, { trait: 'collection', value: `AwesomeCuties`, display: 'collection' }, true)

    addMetaDef(item.meta, { trait: 'base', options: BASES, mock: true, id: tokenId }, true)
    addMetaDef(item.meta, { trait: 'eyes', options: EYES, mock: true, id: tokenId }, true)
    addMetaDef(item.meta, { trait: 'mouth', options: MOUTH, mock: true, id: tokenId }, true)
    addMetaDef(item.meta, { trait: 'level', options: INT_ATTRIBUTES, mm: true, mock: true, id: tokenId, display: 'stat' }, true)
    addMetaDef(item.meta, { trait: 'stamina', options: FLOAT_ATTRIBUTES, mm: true, mock: true, id: tokenId, display: 'rank' }, true)
    addMetaDef(item.meta, { trait: 'personality', options: STR_ATTRIBUTES, mock: true, id: tokenId }, true)
    addMetaDef(item.meta, { trait: 'aqua_power', options: BOOST_ATTRIBUTES, mm: true, mock: true, id: tokenId, display: 'rank' }, true)
    addMetaDef(
      item.meta,
      {
        trait: 'stamina_increase',
        options: PERCENT_BOOST_ATTRIBUTES,
        mm: true,
        mock: true,
        id: tokenId,
        display: 'rank',
      },
      true
    )
    addMetaDef(item.meta, { trait: 'generation', options: NUMBER_ATTRIBUTES, mm: true, mock: true, id: tokenId, display: 'stat' }, true)

    // const metadata = {
    //   name,
    //   description: 'Friendly OpenSea Creature that enjoys long swims in the ocean.',
    //   image: `${req.protocol}://${req.get('host')}/images/output/${tokenId}.png`,
    //   external_url: `${req.protocol}://${req.get('host')}/api/token/${tokenId}`,
    //   attributes,
    // }
    if (item.id) {
      db.update('nfts', tokenId, item)
    } else {
      item.id = tokenId
      db.store('nfts', item)
    }
    return res.status(200).send({ ...item.meta, totalCount: db.count('nfts') })
    // } else {
    //   return notFound(res)
    // }
  })
  return router
}

function propHasTrait(meta, trait) {
  return meta.properties.findIndex(p => p.trait === trait) !== -1
}

function getMimMax(numbers) {
  return {
    min: Math.min(...numbers),
    max: Math.max(...numbers),
  }
}

function getMockVal(options, id) {
  return options[id % options.length]
}

function addMetaProp(metadata, { trait, value, count = 1, order = null, display = null }, overwrite = false) {
  const idx = metadata.properties.findIndex(p => p.trait === trait)
  if (idx !== -1) {
    if (overwrite) {
      metadata.properties.splice(idx, 1, {
        trait,
        value,
        display,
        count,
        order,
      })
    }
  } else {
    metadata.properties.push({
      trait,
      value,
      display,
      count,
      order,
    })
  }
}

function addMetaDef(
  metadata,
  { trait, options = [], value = null, display = null, mock = false, id = null, mm = false },
  overwrite = false
) {
  metadata.definitions[trait] = mm ? getMimMax(options) : options
  addMetaProp(metadata, { trait, value: mock ? getMockVal(options, id) : value, display }, overwrite)
}

async function composeImage(images, tokenId) {
  const img = join(imgDir, 'images/output/', `${tokenId}.png`)
  if (!fs.existsSync(img)) {
    const composite = await sharp(join(imgDir, images.shift()))
      .composite(images.map(i => ({ input: join(imgDir, i) })))
      .toFile(img)
    // console.log(composite)
  }
  return `/images/output/${tokenId}.png`
}

function notFound(res) {
  res.status(404).send({
    error: {
      code: 'ERROR_NOT_FOUND',
      message: 'Not found',
    },
  })
}
