const { join, isAbsolute } = require('path')
const lowdb = require('lowdb')
const lodashId = require('lodash-id')
const FileSync = require('lowdb/adapters/FileSync')

const DB_DIR = process.env.DB_DIR || './db/'
const dbFile = isAbsolute(DB_DIR) ? join(DB_DIR, 'db.json') : join(__dirname, '../', DB_DIR, 'db.json')

const defaultResource = {
  data: [],
  metadata: {},
}

/**
 * lowdb wrapper class.
 * @private
 */

class DB {
  constructor() {
    this.D = lowdb(new FileSync(dbFile))
    this.D._.mixin(lodashId)
    console.log('db init', dbFile)
  }

  show(key, id) {
    return this.D.get(`${key}.data`)
      .getById(id)
      .value()
  }

  index(key, filter = {}) {
    return this.D.get(`${key}.data`, [])
      .filter(filter)
      .value()
  }

  store(key, data) {
    // Ensure a resource entry exist for the given key.
    this.D.defaults({ [key]: defaultResource }).write()
    this.D.get(`${key}.data`)
      .insert(this.lastId(key, data))
      .write()
    return data
  }

  update(key, id, partial) {
    this.D.defaults({ [key]: defaultResource }).write()
    const data = { id, ...partial }
    this.D.get(`${key}.data`)
      // .updateById(id, partial)
      .upsert(data)
      .write()
    // return get(db, key, id)
    return data
  }

  destroy(key, id) {
    return this.D.get(`${key}.data`)
      .removeById(id)
      .write()
  }

  lastId(key, data) {
    // Generate the next id.
    if (typeof data.id === 'undefined') {
      const lastId = this.D.get(`${key}.metadata.lastId`, 0).value()
      data.id = lastId + 1
      this.D.set(`${key}.metadata.lastId`, data.id).write()
    }
    return data
  }
  count(key) {
    // Get the last id.
    return this.D.get(`${key}.data`).value().length
  }
}

module.exports = DB
