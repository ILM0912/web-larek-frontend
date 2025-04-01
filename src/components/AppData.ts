import { IBasket, ICatalog, IEvents, Product, ProductsList } from "../types";
import { Model } from "./base/Model";

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
}