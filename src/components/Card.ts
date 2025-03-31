import { Category, ICard, Product } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

export class CatalogElement extends Component<ICard> {
    protected el_category: HTMLElement;
    protected el_title: HTMLElement;
    protected el_price: HTMLElement;
    protected el_image: HTMLImageElement;
    protected colors = <Record<string, string>>{
        "дополнительное": "additional",
        "софт-скил": "soft",
        "кнопка": "button",
        "хард-скил": "hard",
        "другое": "other",
    }

    constructor(protected blockName: string, container: HTMLElement) {
        super(container);

        this.el_category = ensureElement(`.${blockName}__category`, this.container);
        this.el_image = ensureElement<HTMLImageElement>(`.${blockName}__image`, this.container);
        this.el_title = ensureElement(`.${blockName}__title`, this.container);
        this.el_price = ensureElement(`.${blockName}__price`, this.container);
    }

    set data(product: Product) {
        this.setText(this.el_title, product.title);
        this.setText(this.el_price, this.getPrice(product.price));
        this.setText(this.el_category, product.category);
        this.setImage(this.el_image, product.image, product.title);

        this.el_category.classList.add(this.getCategoryClass(product.category));

    }

    getPrice(price: number | null): String {
        return (price === null) ? 'Бесценно' : price + ' синапсов'
    }

    getCategoryClass(category: Category) {
        return `${this.blockName}__category_${this.colors[category]}`
    }
}