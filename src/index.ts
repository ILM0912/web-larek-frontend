import { AppData } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { LarekAPI } from './components/LarekApi';
import './scss/styles.scss';
import { PaymentType, Product, ProductsList } from './types';
import { API_URL, CDN_URL } from './utils/constants';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

const appData = new AppData({}, events);

api.getProductsList()
    .then(result => {
        appData.setCatalog(result);
    })
    .catch(err => {
        console.error(err);
    });

events.on("catalog:changed", () => {
    console.log(appData.getCatalog());
});