![Logo](admin/neoTower.png)
# ioBroker.rmb-bhkw

[![NPM version](https://img.shields.io/npm/v/iobroker.rmb-bhkw.svg)](https://www.npmjs.com/package/iobroker.rmb-bhkw)
[![Downloads](https://img.shields.io/npm/dm/iobroker.rmb-bhkw.svg)](https://www.npmjs.com/package/iobroker.rmb-bhkw)
![Number of Installations](https://iobroker.live/badges/rmb-bhkw-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/rmb-bhkw-stable.svg)
![Test and Release](https://github.com/satchafunkilus/ioBroker.rmb-bhkw/workflows/Test%20and%20Release/badge.svg)


[![NPM](https://nodei.co/npm/iobroker.rmb-bhkw.png?downloads=true)](https://nodei.co/npm/iobroker.rmb-bhkw/)



## RMB BHKW Adapter für ioBroker

Liest Daten von RMB BHKWs (z.b. Remeha eLina) über das RMB Energie Kundenportal [rmbenergie.com](https://www.rmbenergie.com/login-report/) aus und stellt diese als Objekte in ioBroker zur Verfügung. Somit kann auch ohne die optionale ModBus Schnittstelle der Anlage auf die Daten zugegriffen werden.


## Verwendung

Der Adapter läuft als "scheduled" Adapter und zieht sich die Daten im angegebenen Intervall aus dem Kundenportal. Die Anlage selbst pusht die Daten nur ca. alle 15min zum Kundenportal, somit sind die Daten leider keine Echtzeitdaten. Ebenso macht es daher wenig Sinn das Intervall des Adapters auf einen sehr kleinen Zeitraum zu stellen. Der Defaultwert für die Datenabfrage ist 5min.

Der Adapter nutzt eine headless-Version des Chromium Browsers um die Daten aus dem Kundenportal zu parsen. Hierzu kann entweder die vom Adapter mitgelieferte Chromium-Version verwendet werden, oder eine externe. 

### Mitgelieferte Version von Chrome
Wenn die mitgelieferte verwendet werden soll, so müssen auf dem Host-System von ioBroker die Abhängigkeiten von Chromium erfüllt sein. Sollte eine dieser Abhängigkeiten fehlen, so wirft der Adapter einen Fehler im Log, mit der Angabe der fehlenden Library. Diese können beispielsweise bei einem Debian/Ubuntu-System nachinstalliert werden mit:

```
sudo apt install -y ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils
```

Sollte ioBroker auf einem anderen Betriebssystem installiert sein, so heissen die Paketnamen der Abhängigkeiten womöglich anders - eine schnelle Google-Suche hilft hier vermutlich weiter. Diese müssen dann für das jeweilige Betriebssystem nachinstalliert werden. Alternativ kann auch auf die Verwendung eines externen Browsers umgeschwenkt werden (siehe Kapitel: Verwendung mit Docker).

### Verwendung mit Docker
Läuft ioBroker in einem Docker-Container und der mitgelieferte Browser kann aufgrund fehlender Abhängigkeiten nicht genutzt werden, so empfiehlt es sich den Chromium Browser als separaten Container auszuführen. Hierzu empfiehlt sich z.B. das Image [browserless/chrome](https://hub.docker.com/r/browserless/chrome/). Dieses Image kann z.B. mit dem Befehl

```
docker run -p 3000:3000 browserless/chrome
```
ausgeführt werden und ist dann unter `http://[IP-des-docker-hosts]:3000` zu erreichen. Erscheint die Weboberfläche des Containers, so funktioniert er wie erwartet und der entprechende Pfad kann in der Adapterkonfiguration eingegeben werden. 


## Changelog
### **WORK IN PROGRESS**
* Fixed versioning issue in io-package.json

### 1.0.0 (2022-04-15)
* (satchafunkilus) First major release

### 1.0.0-0 (2022-04-15)
* (satchafunkilus) First functional release

### 0.0.2 (2022-04-15)
* (satchafunkilus) initial release

## License
MIT License

Copyright (c) 2022 satchafunkilus

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