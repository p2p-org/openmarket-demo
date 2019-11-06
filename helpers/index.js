export function txCheck(tx, msg) {
  return new Promise((resolve, reject) => {
    console.log('tx send', tx, msg)
    let log = {}
    if (tx && tx.result && tx.result.raw_log) {
      log = JSON.parse(tx.result.raw_log).pop()
      console.log(log)
      if (log.success) {
        resolve(tx)
        return
      }
    }
    reject(new Error(log && log.message ? log.message : 'unknown tx error'))
  })
}
