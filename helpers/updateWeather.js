import axios from "axios";
import Agent from 'agentkeepalive';
import Promise from 'bluebird';

import { weatherConfig } from "../config/config.js";

import { ref, onValue, update } from "firebase/database";

export const updateWeather = (db) => {
  const keepAliveAgent = new Agent({
    maxSockets: 100, // Maximum number of sockets to allow per host. Defaults to Infinity.
    maxFreeSockets: 10,
    timeout: 60000, // active socket keepalive for 60 seconds
    freeSocketTimeout: 60000, // // Maximum number of sockets to leave open for 60 seconds in a free state. Only relevant if keepAlive is set to true. Defaults to 256.
    socketActiveTTL: 1000 * 60 * 10,
});

const httpClient = axios.create({
    httpAgent: keepAliveAgent
});

// set number of active connections to 1
let concurrency = 1;
const updates = {};

const starCountRef = ref(db, 'cities/');
onValue(starCountRef, async (snapshot) => {
    let data = snapshot.val();
    // use of promise . all and map to make sure mutiplie connections are not made at the same time
    await Promise.all(Promise.map(data, async (city, i) => {
        try {
            const res = await httpClient.get(weatherConfig.url + city.id);
            city.weather = res.data;
            updates[`/cities/${i}/`] = city;
            console.log(i);
        } catch (err) {
            console.log("error " + i)
        }

    }, {
        concurrency
    }));
    // updates database with new weather data.
    update(ref(db), updates);
}, {
    onlyOnce: true
});
}