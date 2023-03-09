[![license](https://img.shields.io/github/license/nova-27/prismarine-mcstructure-unofficial?color=b8b8b8)](https://github.com/nova-27/prismarine-mcstructure-unofficial/blob/main/LICENSE)
[![Discord](https://img.shields.io/discord/998165329148661781)](https://discord.gg/cps9Rd72ET)

# prismarine-mcstructure-unofficial

This library converts between [.mcstructure](https://wiki.bedrock.dev/nbt/mcstructure.html) and [prismarine-schematic](https://github.com/PrismarineJS/prismarine-schematic)(which can be exported as [Sponge Schematic Version 2](https://github.com/SpongePowered/Schematic-Specification/blob/master/versions/schematic-2.md))

**Currently supports mcstructure to prismarine-schematic conversion.**

## Install

```bash
npm install prismarine-mcstructure-unofficial
```

## Usage

```js
const fs = require('fs')
const path = require('path')
const { parseMcStructure } = require('prismarine-mcstructure-unofficial')

async function sample() {
  const sampleMcStructure = fs.readFileSync(
    path.join(__dirname, 'sample.mcstructure'),
  )
  const schematic = await parseMcStructure(sampleMcStructure)
  const schemBuffer = await schematic.write()
  fs.writeFileSync(path.join(__dirname, 'sample.schem'), schemBuffer)
}

sample()
```
