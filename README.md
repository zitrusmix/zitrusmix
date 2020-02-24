# :lemon: zitrusmix

![status](https://img.shields.io/static/v1?label=STATUS&message=EXPERIMENTAL&color=red&style=flat-square)
![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/zitrusmix/zitrusmix?label=Version&style=flat-square)
![npm](https://img.shields.io/npm/v/zitrusmix?style=flat-square)
![npm type definitions](https://img.shields.io/npm/types/zitrusmix?style=flat-square)
![NPM](https://img.shields.io/npm/l/zitrusmix?style=flat-square)

Zitrusmix is a modern TypeScript/ES6 library to create your own content processing application.

:boom: __EXPERIMENTAL__ More work is required to release a alpha, beta and release candidate version.

## Table of Contents

- [Installation](#installation)
- [Getting started](#getting-started)

### Installation
![node](https://img.shields.io/node/v/zitrusmix?style=flat-square)
![status](https://img.shields.io/static/v1?label=TypeScript&message=>=3.8.1&color=success&style=flat-square)
```
npm install zitrusmix
```

### Getting started

```typescript
import {Zitrusmix} from 'zitrusmix';

const mix = new Zitrusmix();
mix.add('/city/austria/vie', {name: 'Vienna'});
mix.add('/city/italia/bzo', {name: 'Bolzano'});

mix.forEach(element => console.log(element.uri, element.name));
```

