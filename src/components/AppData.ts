import { FormError, IBasket, ICatalog, IEvents, OrderInfo, Product, ProductsList, UserInfo } from "../types";
import { Model } from "./base/Model";
import { FormType } from "./Order"

export class Catalog implements ICatalog {
    list: ProductsList;

    setItems(products: ProductsList): void {
        this.list = products;;
    }
    getItems(): ProductsList {
        return this.list
    }
}

export class Basket implements IBasket {
    list: ProductsList;

    constructor() {
        this.list = {
            items: [],
            total: 0
        }
    }

    calculateSum(): number {
        return this.list.items.reduce((sum, product) => sum + product.price, 0);
    }

    remove(product: Product): void {
        this.list.items = this.list.items.filter(p => p.id !== product.id);
        this.list.total = this.calculateSum();
    }

    add(product: Product): void {
        this.list.items.push(product);
        this.list.total = this.calculateSum();
    }

    setItems(products: ProductsList): void {
        this.list = products;
    }
    getItems(): ProductsList {
        return this.list;
    }

}

interface IAppData {
    catalog: Catalog,
    basket: Basket
}

export class AppData extends Model<IAppData> {
    protected catalog: Catalog;
    protected basket: Basket;
    protected order: OrderInfo = {
        items: [],
        total: 0
    };

    constructor(data: Partial<IAppData>, events: IEvents) {
        super(data, events);
        
        this.catalog = new Catalog();
        this.basket = new Basket();
        this.basket
    }

    setCatalog(elements: ProductsList) {
        this.catalog.setItems(elements);
        this.emitChanges('catalog:changed', { catalog: this.catalog });
    }

    getCatalog(): ICatalog {
        return this.catalog;
    }

    setBasket(elements: ProductsList) {
        this.basket.setItems(elements);
        this.emitChanges('basket:changed', this.basket);
    }

    getBasket(): Basket {
        return this.basket;
    }

    isInBasket(product: Product): boolean {
        return this.basket.list.items.some(item => item.id === product.id);
    }

    addToBasket(product: Product) {
        if (!this.isInBasket(product) && product.price) {
            this.basket.add(product);
            this.emitChanges('basket:changed', this.basket);
        }
    }

    removeFromBasket(product: Product) {
        if (this.isInBasket(product)) {
            this.basket.remove(product);
            this.emitChanges('basket:changed', this.basket);
        }
    }

    setBasketToOrder() {
        this.order.items = this.basket.list.items;
        this.order.total = this.basket.list.total;
    }
    
    setOrderField(field: keyof UserInfo, value: string) {
        if (field === 'payment') {
            if (value === 'Онлайн' || value === 'При получении') {
                this.order[field] = value;
            } else {
                console.warn('Invalid payment type');
            }
        } else {
            this.order[field] = value.trim();
        }
        const type: FormType = (field === 'address' || field === 'payment') ? 'order' : 'contacts';
        const errors: FormError[] = this.validate(type);
        this.events.emit(`form:error`, errors);
        return errors.length === 0;
    }

    validate(type: FormType): FormError[] {
        const errors: FormError[] = [];
        if (type === 'contacts') {
            const phone = this.order.phone;
            const email = this.order.email;

            const phoneRegex = /^(8|\+7)[\s]?\(?\d{3}\)?[\s]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (!email || !phone) {
                errors.push('empty');
            }
            if (!emailRegex.test(email)) {
                errors.push('email');
            }
            if (!phoneRegex.test(phone)) {
                errors.push("phone");
            }
        } else if (type === 'order') {
            const address = this.order.address;
            const payment = this.order.payment;

            if (!address || !payment) {
                errors.push('empty');
            }
            if (address?.length > 300 || address?.length < 5) {
                errors.push('address');
            }
        }
        return errors;
    }

    getOrder(): OrderInfo {
        return this.order;
    }

    
    clearBasket() {
        this.setBasket({
            total: 0,
            items: []
        });
    }
}