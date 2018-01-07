
module.exports = {

    log: (msg) => {
      if (process.env.NODE_ENV !== 'test') console.log(msg)
    },
    error: (msg) => {
      if (process.env.NODE_ENV !== 'test') console.error(msg)
    }

}
