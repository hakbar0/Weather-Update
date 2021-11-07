import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

import { updateWeather } from "./helpers/updateWeather.js";
import { fireBaseConfig } from "./config/config.js";

import { scheduleJob } from "node-schedule";

const app = initializeApp(fireBaseConfig);
const db = getDatabase(app);

//Execute a cron job every 1 hour = * 1 * * *
scheduleJob('1 * * * *', function() {
    updateWeather(db);
});
