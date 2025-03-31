import { ICatalog, IEvents, ProductsList } from "../types";
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

interface IAppData {
    catalog: Catalog
}

export class AppData extends Model<IAppData> {
    protected catalog: Catalog;

    constructor(data: Partial<IAppData>, events: IEvents) {
        super(data, events);
        
        this.catalog = new Catalog();
    }

    setCatalog(elements: ProductsList) {
        this.catalog.setItems(elements);
        this.emitChanges('catalog:changed', { catalog: this.catalog });
    }

    getCatalog(): ICatalog {
        return this.catalog;
    }
}