import './scss/styles.scss';

import { AppData, Basket } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { LarekAPI } from './components/LarekApi';
import { Modal } from './components/Modal';
import { BuyButtonState, FormError, OrderResult, PaymentType, Product, ProductsList, UserInfo } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { BasketItem, CatalogElement, PreviewElement } from './components/Card';
import { BasketView } from './components/BasketView';
import { Order, Success } from './components/Order';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);
const appData = new AppData({}, events);
const page = new Page(document.body, events);


//шаблоны
const CardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const CardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const BasketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const BasketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const OrderTemplate = ensureElement<HTMLTemplateElement>('#order');
const ContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const SuccessTemplate = ensureElement<HTMLTemplateElement>('#success');

const modalContainer = ensureElement<HTMLElement>('#modal-container');
const basketContainer = new BasketView(cloneTemplate(BasketTemplate), events);

const modal = new Modal(modalContainer, events);
let form: Order;


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
        const buttonState: BuyButtonState = (!product.price) ? "disabled" : ((isInBasket) ? "already" : "able");
        const card = new PreviewElement("card", cloneTemplate(CardPreviewTemplate), buttonState, {
            changeBasket: () => {
                if (buttonState === 'able') {
                    appData.addToBasket(product);
                } else if (buttonState === 'already') {
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

    basketContainer.items = appData.getBasket().list.items.map(product => {
        const card = new BasketItem('card', cloneTemplate(BasketItemTemplate), {
            onRemove: () => {
                appData.removeFromBasket(product);
            }
        })
        return card.render({data: product});
    });

    basketContainer.total = appData.getBasket().calculateSum();
});

events.on('basket:open', () => {
    modal.render({
        content: createElement<HTMLElement>('div', {}, [basketContainer.render()])
    });
});

events.on('order:open', () => {
    form = new Order('order', cloneTemplate(OrderTemplate), events);
    modal.render({
        content: form.render({
            valid: false,
            errors: ""
        })
    });
});

events.on('contacts:open', () => {
    form = new Order('contacts', cloneTemplate(ContactsTemplate), events);
    modal.render({
        content: form.render({
            valid: false,
            errors: ""
        })
    });
});

events.on(/^(order|contacts)\..*:change/, (data: { field: keyof UserInfo, value: string }) => {
    const valid = appData.setOrderField(data.field, data.value);
    form.valid = valid;
    if (valid) {
        form.setFormErrors("");
    }
});

events.on('form:error', ( errors: FormError[] ) => {
    if (errors.length === 0) {
        form.setFormErrors("");
    } else if (errors.includes("empty")) {
        form.setFormErrors("Поля какие-то пустые...");
    } else if (errors.includes("address")) {
        form.setFormErrors("Адрес какой-то не такой...");
    } else if (errors.includes("email")) {
        form.setFormErrors("email какой-то не такой...");
    } else if (errors.includes("phone")) {
        form.setFormErrors("телефон какой-то не такой...");
    }
});

events.on('order:submit', () => {
    events.emit('contacts:open');
});

events.on('contacts:submit', () => {
    appData.setBasketToOrder();
    console.log(appData.getOrder());
    api.postOrder(appData.getOrder())
        .then(result => {
            appData.clearBasket();
            events.emit('auction:changed');
            events.emit('order:success', result)
        })
        .catch(err => {
            console.error(err);
        })
});

events.on('order:success', (order: OrderResult) => {
    const success = new Success(cloneTemplate(SuccessTemplate), {
        exit: () => {
            modal.onClose();
        }
    });
    modal.render({
        content: success.render({
            total: order.total
        })
    });
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});