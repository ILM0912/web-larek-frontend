import './scss/styles.scss';

import { AppData } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { LarekAPI } from './components/LarekApi';
import { Modal } from './components/Modal';
import { PaymentType, Product, ProductsList } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { CatalogElement } from './components/Card';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);
const appData = new AppData({}, events);
const page = new Page(document.body, events);


const modalContainer = ensureElement<HTMLElement>('#modal-container');

const modal = new Modal(modalContainer, events);

//шаблоны
const CardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');


events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})



api.getProductsList()
    .then(result => {
        appData.setCatalog(result);
    })
    .catch(err => {
        console.error(err);
    });

events.on("catalog:changed", () => {
    const products = appData.getCatalog().getItems().items
    page.catalog = products.map(product => {
        const card = new CatalogElement("card", cloneTemplate(CardCatalogTemplate), {
            onClick: () => events.emit('card:select', product)
        });
        return card.render({
            data: product,
        });
    });
});
