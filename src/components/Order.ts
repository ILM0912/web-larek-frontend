import { IEvents, OrderResult, PaymentType, UserInfo } from "../types";
import { ensureElement, formatNumber } from "../utils/utils";
import { Component } from "./base/Component";
import { Form } from "./base/Form";

export type FormType = 'order' | 'contacts';

export class Order extends Form<UserInfo>{
    protected el_formErrors: HTMLElement;

    constructor(protected formType: FormType, container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.el_formErrors = ensureElement<HTMLElement>('.form__errors', this.container);
        console.log(this.container.elements)
        const cardButton = this.container.elements.namedItem('card') as HTMLButtonElement;
        const cashButton = this.container.elements.namedItem('cash') as HTMLButtonElement;

        cardButton?.addEventListener('click', () => {
            this.payment = 'Онлайн';
            this.events.emit('order.payment:change', {field: 'payment', value: "Онлайн"});
        });

        cashButton?.addEventListener('click', () => {
            this.payment = 'При получении';
            this.events.emit('order.payment:change', {field: 'payment', value: "При получении"});
        });
    }

    set phone(phone: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = phone;
    }

    set address(address: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = address;
    }

    set email(email: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = email;
    }

    set payment(payment: PaymentType) {
        (this.container.elements.namedItem('card') as HTMLButtonElement).classList.remove('button_alt-active');
        (this.container.elements.namedItem('cash') as HTMLButtonElement).classList.remove('button_alt-active');

        if (payment === "Онлайн") (this.container.elements.namedItem('card') as HTMLButtonElement).classList.add('button_alt-active')
        else (this.container.elements.namedItem('cash') as HTMLButtonElement).classList.add('button_alt-active');
    }

    setFormErrors(error: string) {
        this.el_formErrors.textContent = error;

        if (error) {
            this.el_formErrors.style.display = 'block';
        } else {
            this.el_formErrors.style.display = 'none';
        }
    }
}

interface ISuccessActions {
    exit: () => void;
}

export class Success extends Component<OrderResult> {
    protected el_close: HTMLButtonElement;
    protected el_description: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);
        
        this.el_description = ensureElement('.order-success__description', this.container);
        this.el_close = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        if (actions?.exit) {
            this.el_close.addEventListener('click', actions.exit);
        }
    }

    set total(price: number) {
        this.setText(this.el_description, `Списано ${formatNumber(price)} синапсов`)
    }
}