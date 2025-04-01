import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";
import { IEvents } from "../types";

interface IPage {
    catalog: HTMLElement[];
    locked: boolean;
}

export class Page extends Component<IPage> {
    protected el_catalog: HTMLElement;
    protected el_wrapper: HTMLElement;
    protected el_basket: HTMLButtonElement;
    protected el_counter: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.el_catalog = ensureElement<HTMLElement>('.gallery');
        this.el_wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this.el_basket = ensureElement<HTMLButtonElement>('.header__basket');
        this.el_basket.addEventListener('click', () => {
            this.events.emit("basket:open")
        });
        this.el_counter = ensureElement<HTMLElement>('.header__basket-counter');
    }

    set catalog(items: HTMLElement[]) {
        this.el_catalog.replaceChildren(...items);
    }

    set locked(value: boolean) {
        if (value) {
            this.el_wrapper.classList.add('page__wrapper_locked');
        } else {
            this.el_wrapper.classList.remove('page__wrapper_locked');
        }
    }

    set counter(value: number) {
        this.setText(this.el_counter, value);
    }
}