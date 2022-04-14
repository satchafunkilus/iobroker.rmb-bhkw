![Logo](admin/neoTower.png)
# ioBroker.rmb-bhkw

[![NPM version](https://img.shields.io/npm/v/iobroker.rmb-bhkw.svg)](https://www.npmjs.com/package/iobroker.rmb-bhkw)
[![Downloads](https://img.shields.io/npm/dm/iobroker.rmb-bhkw.svg)](https://www.npmjs.com/package/iobroker.rmb-bhkw)
![Number of Installations](https://iobroker.live/badges/rmb-bhkw-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/rmb-bhkw-stable.svg)
[![NPM](https://nodei.co/npm/iobroker.rmb-bhkw.png?downloads=true)](https://nodei.co/npm/iobroker.rmb-bhkw/)

**Tests:** ![Test and Release](https://github.com/satchafunkilus/ioBroker.rmb-bhkw/workflows/Test%20and%20Release/badge.svg)

## rmb-bhkw adapter for ioBroker

Liest Daten von RMB BHKWs (z.b. Remeha eLina) über das RMB Energie Kundenportal (rmbenergie.com) aus.









### Best Practices
We've collected some [best practices](https://github.com/ioBroker/ioBroker.repositories#development-and-coding-best-practices) regarding ioBroker development and coding in general. If you're new to ioBroker or Node.js, you should
check them out. If you're already experienced, you should also take a look at them - you might learn something new :)


### Publishing the adapter
Using GitHub Actions, you can enable automatic releases on npm whenever you push a new git tag that matches the form 
`v<major>.<minor>.<patch>`. We **strongly recommend** that you do. The necessary steps are described in `.github/workflows/test-and-release.yml`.

Since you installed the release script, you can create a new
release simply by calling:
```bash
npm run release
```
Additional command line options for the release script are explained in the
[release-script documentation](https://github.com/AlCalzone/release-script#command-line).

To get your adapter released in ioBroker, please refer to the documentation 
of [ioBroker.repositories](https://github.com/ioBroker/ioBroker.repositories#requirements-for-adapter-to-get-added-to-the-latest-repository).

### Test the adapter manually with dev-server
Since you set up `dev-server`, you can use it to run, test and debug your adapter.

You may start `dev-server` by calling from your dev directory:
```bash
dev-server watch
```

The ioBroker.admin interface will then be available at http://localhost:8081/

Please refer to the [`dev-server` documentation](https://github.com/ioBroker/dev-server#command-line) for more details.

## Changelog
<!--
	Placeholder for the next version (at the beginning of the line):
	### **WORK IN PROGRESS**
-->

### **WORK IN PROGRESS**
* (satchafunkilus) initial release

## License
MIT License

Copyright (c) 2022 satchafunkilus <tobi.as@me.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.