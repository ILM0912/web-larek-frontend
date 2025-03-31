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

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.el_catalog = ensureElement<HTMLElement>('.gallery');
        this.el_wrapper = ensureElement<HTMLElement>('.page__wrapper');
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
}