'use strict'

/**
 * Module exports.
 * @public
 */

module.exports = dbApi

/**
 * @return {Function}
 * @public
 * @param {Object} db
 * @param {String} prefix
 */

function dbApi(db, prefix = null) {
  // Normalize optional prefix.
  if (prefix) {
    if (typeof prefix !== 'string') {
      throw new TypeError('options.prefix must be a string')
    }
    if (!prefix.endsWith('/')) {
      prefix += '/'
    }
  }

  /**
   * Middleware function.
   */

  return function dbApi(req, res, next) {
    // Remove the optional prefix from the path name.
    let pathname = req.path
    if (prefix && pathname.indexOf(prefix) === 0) {
      pathname = pathname.substr(prefix.length)
    } else {
      return next()
    }

    if (pathname.startsWith('/')) {
      pathname = pathname.substr(1)
    }

    // Parse path into segments and extract common path parts.
    const segments = pathname.split(/\/+/)
    const [collection, id] = segments
    const parsedId = parseId(id)
    // Operate upon request method and segments.
    switch (req.method) {
      case 'GET':
        // Get all resources.
        if (segments.length === 1) {
          const list = db.index(collection, req.query.filter || {})
          return res.status(200).send(list)
        }

        // Get a specific resource.
        if (segments.length === 2) {
          const item = db.show(collection, parsedId)
          if (item) {
            return res.status(200).send(item)
          } else {
            return notFound(res)
          }
        }
        throw new Error(`path not supported: ${pathname}`)
      case 'POST':
        if (segments.length !== 1) {
          throw new Error(`path not supported: ${pathname}`)
        }

        // Create a new resource.
        const inserted = db.store(collection, req.body)
        return res.status(201).send(inserted)

      case 'PUT':
        if (segments.length !== 2) {
          throw new Error(`path not supported: ${pathname}`)
        }

        const updated = db.update(collection, parsedId, req.body)
        return res.status(200).send(updated)

      case 'DELETE':
        if (segments.length !== 2) {
          throw new Error(`path not supported: ${pathname}`)
        }
        const deleted = db.destroy(collection, parsedId)

        if (deleted) {
          return res.status(200).send(deleted)
        } else {
          return notFound(res)
        }
    }
  }
}

/**
 * Utility functions
 * @private
 */

function parseId(str) {
  let parsed = Number(str)
  if (isNaN(parsed)) {
    parsed = str
  }
  return parsed
}

function notFound(res) {
  res.status(404).send({
    error: {
      code: 'ERROR_NOT_FOUND',
      message: 'Not found',
    },
  })
}
