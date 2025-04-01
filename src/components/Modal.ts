import {Component} from "./base/Component";
import {ensureElement} from "../utils/utils";
import { IEvents, IModal } from "../types";

interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> implements IModal {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this._closeButton.addEventListener('click', this.onClose.bind(this));
        this.container.addEventListener('click', this.onClose.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
        //я устал закрывать модалки пусть esc еще будет
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.onClose();
            }
        });
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    onOpen() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    onClose() {
        this.container.classList.remove('modal_active');
        this.content = null;
        this.events.emit('modal:close');
    }

    render(data: IModalData): HTMLElement {
        super.render(data);
        this.onOpen();
        return this.container;
    }
}