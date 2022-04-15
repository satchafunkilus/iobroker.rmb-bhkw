'use strict';

const utils = require('@iobroker/adapter-core');
const puppeteer = require('puppeteer');

class RmbBhkw extends utils.Adapter {

	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	constructor(options) {
		super({
			...options,
			name: 'rmb-bhkw',
		});
		this.on('ready', this.onReady.bind(this));
		this.on('stateChange', this.onStateChange.bind(this));
		// this.on('objectChange', this.onObjectChange.bind(this));
		// this.on('message', this.onMessage.bind(this));
		this.on('unload', this.onUnload.bind(this));
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {
		// Initialize your adapter here

		// The adapters config (in the instance object everything under the attribute "native") is accessible via
		// this.config:

		const bhkwID = this.config.bhkwID;
		const browserPath = this.config.bhkwID;

		this.log.info('Lese Daten für BHKW mit der ID: ' + bhkwID);
		this.log.info('Verwende Browser unter folgendem Pfad: ' + browserPath);

		try {

			const browser = await puppeteer.launch();
			const page = await browser.newPage();
			await page.goto('https://rmbenergie.de/rmbreport_br/messwerte.php?ident=' + bhkwID);
			await page.waitForSelector('.auto-style3');
			const data = await page.$$eval('.auto-style3, .auto-style4', (items) => {
				console.log(items);
				return items.map(x => x.innerHTML);
			});

			this.log.info(data);



			await this.setObjectNotExistsAsync('testVariable', {
				type: 'state',
				common: {
					name: 'testVariable',
					type: 'boolean',
					role: 'indicator',
					read: true,
					write: true,
				},
				native: {},
			});



			/* Beispiele für subscribe und setState
			// In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
			//this.subscribeStates('testVariable');
			// You can also add a subscription for multiple states. The following line watches all states starting with "lights."
			// this.subscribeStates('lights.*');
			// Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
			// this.subscribeStates('*');


			//setState examples
			//you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)

			// the variable testVariable is set to true as command (ack=false)
			//await this.setStateAsync('testVariable', true);

			// same thing, but the value is flagged "ack"
			// ack should be always set to true if the value is received from or acknowledged from the target system
			//await this.setStateAsync('testVariable', { val: true, ack: true });

			// same thing, but the state is deleted after 30s (getState will return null afterwards)
			//await this.setStateAsync('testVariable', { val: true, ack: true, expire: 30 });

			// examples for the checkPassword/checkGroup functions
			//let result = await this.checkPasswordAsync('admin', 'iobroker');
			//this.log.info('check user admin pw iobroker: ' + result);

			//result = await this.checkGroupAsync('admin', 'admin');
			//this.log.info('check group user admin group admin: ' + result);
			*/

		} catch (error) {
			this.log.error(`[onReady] error: ${error}`);
		} finally {
		//Terminate Adapter until next Schedule
			// @ts-ignore
			this.stop();
		}


	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try {
			// Here you must clear all timeouts or intervals that may still be active
			// clearTimeout(timeout1);
			// clearInterval(interval1);
			this.log.debug('Cleaning up....');

			callback();
		} catch (e) {
			callback();
		}
	}


	/**
	 * Is called if a subscribed state changes
	 * @param {string} id
	 * @param {ioBroker.State | null | undefined} state
	 */
	onStateChange(id, state) {
		if (state) {
			// The state was changed
			this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
		} else {
			// The state was deleted
			this.log.info(`state ${id} deleted`);
		}
	}
}

if (require.main !== module) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new RmbBhkw(options);
} else {
	// otherwise start the instance directly
	new RmbBhkw();
}