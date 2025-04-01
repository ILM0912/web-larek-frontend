// тип ответа от сервера списка элементов Type
export type ApiListResponse<Type> = { // список Type GET /product/
    total: number,
    items: Type[]
};


// тип ошибки
export type ErrorResponse = { // Error при запросе
    error: string
}


// возможный ответ от сервера о продукте
export type ApiProductResponse = ErrorResponse | Product


// тип для HTTP методов
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';


// категории товаров
export type Category = "дополнительное" | "софт-скил" | "другое" | "кнопка" | "хард-скил"


// типы оплаты
export type PaymentType = 'Онлайн' | 'При получении'


// тип продукта
export type Product = {
    id: string,
    title: string,
    description: string,
    image: string,
    category: Category,
    price: number | null
}


// информация о пользователе
export type UserInfo = {
    payment?: PaymentType;
    email?: string;
    phone?: string;
    address?: string;
}

// список продуктов
export type ProductsList = {
    total: number,
    items: Product[]
}

// возвращаемое значения о заказе
export type OrderResult = { // POST /order
    id: string;
    total: number;
}

// информация о заказе (данные о пользователе + корзина)
export type OrderInfo = UserInfo & ProductsList;


// интерфейс для реализации каталога товаров
export interface ICatalog {
    list: ProductsList;

    setItems(products: ProductsList): void
    getItems(): ProductsList;
}


// интерфейс для реализации корзины
export interface IBasket extends ICatalog {
    calculateSum(): number;
    remove(product: Product): void;
    add(product: Product): void;
}


// типы, связанные с брокером событий (Presenter)
export type EventName = string | RegExp;

export type Subscriber = Function;

export type EmitterEvent = {
    eventName: string,
    data: unknown
};

export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}


// типы, связанные с представлением (View)

export interface IView {
    render(data?: object): HTMLElement;
}

export type BuyButtonState = 'disabled' | 'already' | 'able';


// интерфейс карточки товара
export interface ICard {
    data: Product;

    setProduct(data: Product): void;    
}


// модальное окно
export interface IModal {
    onOpen(): void;
    onClose(): void;
}


// ошибки заполнения форм
export type FormError = 'address' | 'email' | 'phone' | 'empty'