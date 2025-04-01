import { ensureElement, createElement, formatNumber } from "../utils/utils";
import { Component } from "./base/Component";
import { EventEmitter } from "./base/events";

interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

export class BasketView extends Component<IBasketView> {
    protected el_list: HTMLElement;
    protected el_total: HTMLElement;
    protected el_action: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this.el_list = ensureElement('.basket__list', this.container);
        this.el_total = ensureElement('.basket__price', this.container);
        this.el_action = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.el_action.addEventListener('click', () => {
            events.emit('order:open');
        });

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this.el_list.replaceChildren(...items);
        } else {
            this.el_list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Тут пока пусто...'
            }));
            this.setText(this.el_total, "");
            this.setDisabled(this.el_action, true);
        }
    }

    set total(total: number) {
        this.setDisabled(this.el_action, total === 0);
        if (total === 0) {
            this.setText(this.el_total, "");
        } else {
            this.setText(this.el_total, formatNumber(total) + " синапсов");
        }
        
    }
}