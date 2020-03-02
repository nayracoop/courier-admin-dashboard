# Courier Admin Dashboard (Vue.JS client)

Vue.js Web app Dashboard, client for the [Courier Admin REST API](https://github.com/nayracoop/courier-admin-api.git)

## Features

### CRUD of entities required for courier administration

- Client:
  - Demographics.
  - Multiple addresess (default configurable).
  - Discounts for specific Providers.
- Provider:
  - Demographics.
  - Shipping provider configurable via complex a cost table:
    - Zones.
    - Package types.
    - Prices and discounts per zone and package type.
    - Fuel prices.
- Shipping:
  - For a Client's address and a specific Provider.
- Parse Server's Users administration.

### Massive CSV upload

- Clients and Providers can be uploadaded in bulk via CSV file.

### Integration with Xubio

[Xubio](https://xubio.com/) is an online commercial management tool.

- Clients and Providers are auto-synched with Xubio.
- Shipping module allows the creation of budgets and purchase orders once the shipping is confirmed.

## Development

### Install

- Clone, configure and run the [Courier Admin REST API](https://github.com/nayracoop/courier-admin-api.git)
- Clone and run **`npm install`**

### Use

- Keys are required to access your dev Parse Server instance. Create your **`dev.env.js`**. Use **`dev.env.example.js`** as base.
- Serve with hotreload **`npm run dev`** :zap:
- Go to [http://localhost:8080/](http://localhost:8080/)

## Prod

- Build for production with minification **`npm run build`** :zap:
- Keys are required to access your prod Parse Server instance. Fill them in on **`prod.env.js`**.
- After the **`dist`** folder is created you may use PM2 **`ecosystem.config.js`** file located in the root to run it. [Learn more about PM2 (process manager for Node.js)](https://pm2.keymetrics.io/docs/usage/application-declaration/).

## License

<img src="https://img.shields.io/badge/license-GPL--3-brightgreen" alt="license GNU General Public License v3.0"> GNU General Public License v3.0
