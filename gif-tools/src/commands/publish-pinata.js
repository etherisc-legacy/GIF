require('dotenv').config()
const {Command} = require('@oclif/command')
const fs = require('fs-jetpack')
const path = require('path')
const pinataSDK = require('@pinata/sdk')
const cf = require('cloudflare')({
  token: process.env.CLOUDFLARE_API_TOKEN,
})

const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET)

const ipfsPath = './ipfs'
const GIFPath = '/GIF'
const metaPath = '/meta'
const srcPath = '/src'
console.log(process.cwd())
const {settings: {release}} = require(`${process.cwd()}/package.json`)

class PublishPinataCommand extends Command {
  async run() {
    const artifactPaths = fs.find('./build', {matching: '*.json'})
    const releasePath = `${ipfsPath}${GIFPath}/releases/${release}`
    if (fs.exists(releasePath)) {
      throw new Error('Release already published - bump release first!')
    }

    this.log('Writing sources & metadata...')
    this.log('========================================================')

    for (const _path of artifactPaths) {
      const artifact = require(path.join(process.cwd(), _path))
      const metaFN = `${releasePath}${metaPath}/${artifact.contractName}.meta.json`
      const srcFN = `${releasePath}${srcPath}/${artifact.contractName}.sol`
      fs.write(metaFN, artifact.metadata)
      fs.write(srcFN, artifact.source)
    }

    this.log('Uploading to Pinata')
    this.log('========================================================')

    const options = {
      pinataMetadata: {
        name: `${GIFPath}/releases/${release}`,
        keyvalues: {release},
      },
      pinataOptions: {
        cidVersion: 0,
        wrapWithDirectory: true,
      },
    }

    let ipfsHash
    try {
      const result = await pinata.pinFromFS(ipfsPath, options)
      this.log(result)
      ipfsHash = result.IpfsHash
    } catch ({message, stack}) {
      this.log(message, stack)
    }

    this.log('Updating DNSLink')
    this.log('========================================================')

    const cfRecords = await cf.dnsRecords.browse(process.env.CLOUDFLARE_ZONE_ID, {
      page: 1,
      // eslint-disable-next-line camelcase
      per_page: 100,
    })

    const cfId = cfRecords.result.find(item => item.name === '_dnslink.ipfs.etherisc.com')
    cfId.content = `dnslink=/ipfs/${ipfsHash}`
    const result = await cf.dnsRecords.edit(process.env.CLOUDFLARE_ZONE_ID, cfId.id, cfId)
    this.log(result)

    this.log()
    this.log('Finished.')
    this.log()
  }
}

PublishPinataCommand.description = `This publishes all contract sources and metadata on Pinata.
...
You'll need an API Key of Pinata which you need to put in you .env file.
`

module.exports = PublishPinataCommand
