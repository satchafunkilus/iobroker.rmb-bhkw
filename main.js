'use strict';

const utils = require('@iobroker/adapter-core');
const puppeteer = require('puppeteer');
const sleep = require('util').promisify(setTimeout);

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
		// this.on('objectChange', this.onObjectChange.bind(this));
		// this.on('message', this.onMessage.bind(this));
		this.on('unload', this.onUnload.bind(this));
	}


	async onReady() {

		const bhkwID = this.config.bhkwID;
		const re = /^.*:\/\//;
		const browserPath = 'ws://' + this.config.browserPath.replace(re, '');
		const externalBrowser = this.config.externalBrowser;
		const delay = Math.floor(Math.random() * 1000 *60);
		let browser;
		const results = [];
		await this.setObjectNotExistsAsync('_DataAge', {
			type: 'state',
			common: {
				name: '_DataAge',
				type: 'state',
				role: 'state',
				// @ts-ignore
				read: true,
				write: true,
				unit: 'min'
			},
			native: {},
		});

		this.log.info('Warte für ' + delay/1000 + ' Sekunden.');
		//await new Promise(() => setTimeout(() => this.log.info('Starte mit Verzögerung'), delay));
		await sleep(delay);
		this.log.info('Starte mit Verzögerung');

		try {

			if (bhkwID < 800 || bhkwID > 99999 || bhkwID == undefined) {
				throw new Error('Ungültige BHKW ID. Stoppe Adapter.');
			}


			this.log.info('Lese Daten für BHKW mit der ID: ' + bhkwID);
			if (externalBrowser) {
				this.log.info('Verwende Browser unter folgendem Pfad: ' + browserPath);
				try {
					browser = await puppeteer.connect({ browserWSEndpoint: browserPath });
				} catch (error) {
					throw new Error('Konnte keine Verbindung zum externen Browser herstellen. Ist die URL korrekt?');
				}
			} else {
				this.log.info('Verwende den integrierten Browser');
				browser = await puppeteer.launch();
			}


			// @ts-ignore
			const page = await browser.newPage();
			await page.goto('https://rmbenergie.de/rmbreport_br/messwerte.php?ident=' + bhkwID);
			await page.waitForSelector('.auto-style3');
			const data = await page.$$eval('.auto-style3, .auto-style4', (items) => {
				console.log(items);
				return items.map(x => x.innerHTML);
			});


			// Iterate through node-list and store results as object properties
			for (let i = 0; i < 54; i++ ) {

				const unit = data[i+1].split(' ')[1];
				let dataType = 'mixed';
				if (unit === '°C' || unit === 'kW' || unit === '%' || unit === 'bar') {
					dataType = 'number';
				}

				results.push({
					name: data[i].split(':')[0].replace(/\s\(.+\)/, ''),
					value: data[i+1].split(' ')[0],
					unit: unit,
					type: dataType
				});
				i++;
			}


			//Get timestamp of last data refresh from website
			// @ts-ignore
			const timeString = await page.$eval('.auto-style5', (e) => e.innerText.split(' '));


			await page.goto('https://rmbenergie.de/rmbreport_br/display.php?ident=' + bhkwID);
			await page.waitForSelector('div#ladungszahl');
			// @ts-ignore
			const stateOfCharge = await page.$eval('div#ladungszahl', (e) => e.innerText.split(' ')[0]);
			results.push({
				name: 'Ladestand Warmwasserspeicher',
				value: stateOfCharge,
				type: 'number',
				unit: '%'
			});

			// @ts-ignore
			await browser.close();



			//Extract dates from string
			const time = timeString[3];
			const date = timeString[2].split(',')[0];
			const now = new Date();
			const dateSplit = date.split('.');
			const timeSplit = time.split(':');

			//If Server is offline, update _DataAge state and quit adapter.
			if (date === '01.01.1970' || date == undefined) {
				//Get current states from objects
				const oldDateString = await this.getStateAsync('_DateLastRefresh');
				const oldTimeString = await this.getStateAsync('_TimeLastRefresh');
				//If objects do not exist (first time starting adapter), exit immediately
				if(!oldDateString || !oldTimeString) {
					throw new Error('Der Server scheint aktuell keine Daten zu liefern. Dienst vermutlich offline.');
				}
				// @ts-ignore
				const oldDateSplit = oldDateString.val.toString().split('.');
				// @ts-ignore
				const oldTimeSplit = oldTimeString.val.toString().split(':');
				// @ts-ignore
				const oldTimeStamp = new Date(oldDateSplit[2], oldDateSplit[1]-1, oldDateSplit[0], oldTimeSplit[0], oldTimeSplit[1], oldTimeSplit[2]);
				const oldDataAge = Math.floor((now.valueOf() - oldTimeStamp.valueOf())/1000/60);

				await this.setStateAsync('_DataAge', {val: oldDataAge, ack: true});
				throw new Error('Der Server scheint aktuell keine Daten zu liefern. Dienst vermutlich offline.');
			}

			//Calculate time passed since last data refresh
			const timeStamp = new Date(dateSplit[2], dateSplit[1]-1, dateSplit[0], timeSplit[0], timeSplit[1], timeSplit[2]);
			const dataAge = Math.floor((now.valueOf() - timeStamp.valueOf())/1000/60);
			results.push({
				name: '_DateLastRefresh',
				value: date,
				type: 'string',
				unit: ''
			},
			{
				name: '_TimeLastRefresh',
				value: time,
				type: 'string',
				unit: ''
			},
			{
				name: '_DataAge',
				value: dataAge,
				type: 'number',
				unit: 'min'
			});

			this.log.info('Holen der Daten erfolgreich.');
			await this.createAndUpdateStates(results);

			//Debug
			// this.log.info(results[10].name);
			// this.log.info(results[10].value);
			// this.log.info(results[10].unit);
			// this.log.info(results[10].type);
			// this.log.info('Ladestand Speicher: ' + stateOfCharge);
			// this.log.info('Alter der Daten:' + dataAge);

		} catch (error) {
			this.log.error(`Fehler beim Datenabruf: ${error}`);
		} finally {
		//Terminate Adapter until next Schedule
			// @ts-ignore
			this.stop();
		}


	}


	async createAndUpdateStates(results){
		try {
			this.log.info('Aktualisiere States in ioBroker.');
			for (const dataPoint of results) {
				//Konvertiere Nummern zum Datentyp number
				if (dataPoint.type === 'number') {dataPoint.value = parseFloat(dataPoint.value);}
				if (dataPoint.value === 'AUF' || dataPoint.value == 'EIN') {dataPoint.value = true;}
				if (dataPoint.value === 'ZU' || dataPoint.value == 'AUS') {dataPoint.value = false;}


				await this.setObjectNotExistsAsync(dataPoint.name, {
					type: 'state',
					common: {
						name: dataPoint.name,
						type: dataPoint.type,
						role: 'state',
						read: true,
						write: true,
						unit: dataPoint.unit
					},
					native: {},
				});
				await this.setStateAsync(dataPoint.name, {val: dataPoint.value, ack: true});
			}

		} catch (error) {
			this.log.error(`Fehler beim Speichern der Daten: ${error}`);
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