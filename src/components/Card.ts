import { BuyButtonState, Category, ICard, Product } from "../types";
import { ensureElement, formatNumber } from "../utils/utils";
import { Component } from "./base/Component";

interface ICardActions {
    openPreview?: (event: MouseEvent) => void;
    changeBasket?: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
    protected el_title: HTMLElement;
    protected el_price: HTMLElement;

    constructor(protected blockName: string, container: HTMLElement) {
        super(container);
        this.el_title = ensureElement(`.${blockName}__title`, this.container);
        this.el_price = ensureElement(`.${blockName}__price`, this.container);
    }

    set data(product: Product) {
        this.setText(this.el_title, product.title);
        this.setText(this.el_price, this.getPrice(product.price));
    }

    getPrice(price: number | null): String {
        return (price === null) ? 'Бесценно' : formatNumber(price) + ' синапсов'
    }
}

export class CatalogElement extends Card {
    protected el_category: HTMLElement;
    protected el_image: HTMLImageElement;
    protected colors = <Record<string, string>>{
        "дополнительное": "additional",
        "софт-скил": "soft",
        "кнопка": "button",
        "хард-скил": "hard",
        "другое": "other",
    }

    constructor(blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(blockName, container);

        this.el_category = ensureElement(`.${blockName}__category`, this.container);
        this.el_image = ensureElement<HTMLImageElement>(`.${blockName}__image`, this.container);
        this.el_title = ensureElement(`.${blockName}__title`, this.container);
        this.el_price = ensureElement(`.${blockName}__price`, this.container);

        if (actions && actions.openPreview) {
            container.addEventListener('click', actions.openPreview);
        }
    }

    set data(product: Product) {
        super.data = product;
        this.setText(this.el_category, product.category);
        this.setImage(this.el_image, product.image, product.title);

        this.el_category.classList.add(this.getCategoryClass(product.category));
    }

    getCategoryClass(category: Category) {
        return `${this.blockName}__category_${this.colors[category]}`
    }
}

export class PreviewElement extends CatalogElement {
    protected el_text: HTMLElement;
    protected el_button: HTMLButtonElement;

    constructor(blockName: string, container: HTMLElement, buttonState: BuyButtonState,  actions?: ICardActions) {
        super(blockName, container);

        this.el_text = ensureElement(`.${blockName}__text`, this.container);
        this.el_button = ensureElement<HTMLButtonElement>(`.${blockName}__button`, this.container);
        this.el_button.addEventListener('click', actions.changeBasket);

        if (buttonState === "able") {
            this.el_button.classList.remove('button-delete');
            this.setText(this.el_button, "В корзину");
        } else if (buttonState === "already") {
            this.el_button.classList.add('button-delete');
            this.setText(this.el_button, "Удалить");
        }
        this.setDisabled(this.el_button, buttonState === "disabled");
    }

    set data(product: Product) {
        super.data = product;

        this.setText(this.el_text, product.description);
    }
}

interface IBasketActions {
    onRemove(): void;
}

export class BasketItem extends Card {
    protected el_index: HTMLElement;
    protected el_delete: HTMLButtonElement;

    constructor(blockName: string, container: HTMLElement, index: number, actions: IBasketActions) {
        super(blockName, container);
        this.el_index = ensureElement(".basket__item-index", this.container);
        this.setText(this.el_index, index);
        this.el_delete = ensureElement<HTMLButtonElement>(".basket__item-delete", this.container);
        this.el_delete.addEventListener('click', actions.onRemove);
    }
}