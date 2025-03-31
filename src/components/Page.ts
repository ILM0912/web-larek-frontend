import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";
import { IEvents } from "../types";

interface IPage {
    catalog: HTMLElement[];
}

export class Page extends Component<IPage> {
    protected el_catalog: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.el_catalog = ensureElement<HTMLElement>('.gallery');
    }

    set catalog(items: HTMLElement[]) {
        this.el_catalog.replaceChildren(...items);
    }
}