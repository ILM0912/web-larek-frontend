import './scss/styles.scss';

import { AppData, Basket } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { LarekAPI } from './components/LarekApi';
import { Modal } from './components/Modal';
import { PaymentType, Product, ProductsList } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { CatalogElement, PreviewElement } from './components/Card';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);
const appData = new AppData({}, events);
const page = new Page(document.body, events);


const modalContainer = ensureElement<HTMLElement>('#modal-container');

const modal = new Modal(modalContainer, events);

//шаблоны
const CardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const CardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');



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
            openPreview: () => events.emit('card:select', product)
        });
        return card.render({
            data: product,
        });
    });
});

events.on("card:select", (product: Product) => {
    const id = product.id;

    if (product) {
        api.getProductItem(id)
            .then(result => product = result)
            .catch(err => {
                console.error(err);
            });
        show(product, appData.isInBasket(product));
    } else {
        modal.onClose();
    }

    function show(product: Product, isInBasket: boolean) {
        const card = new PreviewElement("card", cloneTemplate(CardPreviewTemplate), product, isInBasket, {
            changeBasket: () => {
                if (!isInBasket) {
                    appData.addToBasket(product);
                } else {
                    appData.removeFromBasket(product);
                }
                modal.onClose();
            }
        });
        modal.render({ 
            content: card.render({ 
                data: product 
            }) 
        });
    }
});

events.on('basket:changed', (basket: Basket) => {
    page.counter = basket.list.items.length;
});

events.on('basket:open', () => {
    console.log(appData.getBasket());
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});