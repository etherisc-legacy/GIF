const pinataSDK = require('@pinata/sdk')

const pinata = pinataSDK('519985cca779549d5b40', '9e52f76fc7dc5c107b81db8f486a8260bda1b800f0ffe49dc28245ae152fa84b')

const wait = ms => new Promise((resolve, reject) => {
  setTimeout(resolve, ms)
})

const main = async () => {
  const {count, rows} = await pinata.pinList({pageLimit: 1000, status: 'pinned'})

  for (let idx = 0; idx < rows.length; idx += 1) {
    try {
      console.log(rows[idx])
      /*
      res = await pinata.unpin(rows[idx].ipfs_pin_hash);
      console.log(`unpinned ${rows[idx].ipfs_pin_hash}`);
      await wait(500);
      */
    } catch (err) {
      console.log(err)
    }
  }
}

main().then(() => process.exit(0))
