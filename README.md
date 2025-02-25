# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

---

## Работа с API

В данном разделе описаны типы данных, используемые при взаимодействии с сервером.

- **ApiListResponse<Type>**  
  Обобщённый тип ответа от сервера, возвращающий список элементов.
  ```typescript
  export type ApiListResponse<Type> = { // список Type GET /product/
      total: number,
      items: Type[]
  };
  ```

- **ErrorResponse**  
  Тип для описания ошибки, возвращаемой сервером.
  ```typescript
  export type ErrorResponse = { // Error при запросе
      error: string
  };
  ```

- **ApiProductResponse**  
  Возможный ответ от сервера по запросу продукта: либо объект `Product`, либо ошибка.
  ```typescript
  export type ApiProductResponse = ErrorResponse | Product;
  ```

- **ApiPostMethods**  
  Тип HTTP-методов для создания, обновления и удаления данных.
  ```typescript
  export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
  ```

- **Product**  
  Тип, описывающий товар.
  ```typescript
  export type Product = {
      id: string,
      title: string,
      description: string,
      image: string,
      category: Category, // где Category = "дополнительное" | "софт-скил" | "другое" | "кнопка" | "хард-скил"
      price: number
  };
  ```

- **UserInfo**  
  Информация о пользователе, необходимая для оформления заказа.
  ```typescript
  export type UserInfo = {
      payment?: PaymentType; // где PaymentType = "Онлайн" | "При получении"
      email?: string;
      phone?: string;
      address?: string;
  };
  ```

- **ProductsList**  
  Список товаров, получаемый от сервера.
  ```typescript
  export type ProductsList = {
      total: number,
      items: Product[]
  };
  ```

- **Order**  
  Тип данных, возвращаемый сервером после оформления заказа.
  ```typescript
  export type Order = { // POST /order
      id: string;
      total: number;
  };
  ```

- **OrderInfo**  
  Полная информация о заказе (данные пользователя + список товаров).
  ```typescript
  export type OrderInfo = UserInfo & ProductsList;
  ```

---

## Model

Модель отвечает за хранение и обработку данных приложения. Основные сущности модели:

- **ICatalog**  
  Контракт для каталога товаров.
  ```typescript
  export interface ICatalog {
      list: ProductsList;
  
      setItems(products: ProductsList): void;
      getItems(): ProductsList;
  }
  ```
  *Назначение:* хранить список товаров, предоставлять методы для установки и получения списка.

- **IBasket**  
  Контракт для работы с корзиной покупок. Расширяет функциональность каталога.
  ```typescript
  export interface IBasket extends ICatalog {
      calculateSum(): number;
      remove(product: Product): void;
      add(product: Product): void;
  }
  ```
  *Назначение:* добавление и удаление товаров, расчёт общей суммы корзины.

- **IUser**  
  Интерфейс для работы с данными пользователя.
  ```typescript
  export interface IUser {
      info: UserInfo;
  
      setPaymentType(payment: PaymentType): void;
      setAddress(address: string): void;
      setEmail(email: string): void;
      setPhone(phone: string): void;
  }
  ```
  *Назначение:* управление информацией о пользователе (тип оплаты, адрес, email, телефон).

---

## View

Представление отвечает за отображение данных пользователю и взаимодействие с ним. Основные компоненты:

- **IView**  
  Базовый интерфейс для всех отображаемых компонентов.
  ```typescript
  export interface IView {
      content: HTMLElement;
  
      constructor(content: HTMLElement): void;
      render(data?: object): HTMLElement;
  }
  ```
  *Назначение:* определяет базовый контракт для работы с DOM-элементом.

- **BuyButtonState**  
  Перечисление состояний кнопки «Добавить в корзину».
  ```typescript
  export type BuyButtonState = 'disabled' | 'already' | 'able';
  ```

- **ICard**  
  Интерфейс карточки товара, реализующий базовый интерфейс IView.
  ```typescript
  export interface ICard extends IView {
      data: Product;
  
      setProduct(data: Product): void;
  }
  ```
  *Назначение:* отображение информации о товаре, возможность установки данных о продукте.

- **IBasketItem**  
  Интерфейс для отображения элемента корзины, расширяет функциональность карточки.
  ```typescript
  export interface IBasketItem extends ICard {
      onRemove(): void;
  }
  ```
  *Назначение:* обеспечивает механизм удаления товара из корзины.

- **IModal**  
  Интерфейс модального окна.
  ```typescript
  export interface IModal {
      isOpen: boolean;
  
      onOpen(): void;
      onClose(): void;
  }
  ```
  *Назначение:* управление состоянием модального окна (открытие/закрытие).

- **IForm**  
  Интерфейс для форм ввода данных.
  ```typescript
  export interface IForm {
      isValid: boolean;
      content: HTMLElement;
      errors: FormError[];
  
      checkValidity(): boolean;
      getErrors(): FormError[];
  }
  ```
  *Назначение:* проверка валидности формы и получение ошибок.

- **FormError**  
  Перечисление ошибок валидации формы.
  ```typescript
  export type FormError = 'address' | 'email' | 'phone';
  ```

- **IModalForm**  
  Интерфейс модального окна с формой.
  ```typescript
  export interface IModalForm extends IModal {
      form: IForm;
  }
  ```
  *Назначение:* объединяет функциональность модального окна и формы для ввода данных.

---

## Presenter

Presenter (или брокер событий) служит связующим звеном между моделью и представлением. Он реализует паттерн событий, позволяющий реагировать на действия пользователя и изменения данных.

- **IEvents**  
  Интерфейс для работы с системой событий.
  ```typescript
  export interface IEvents {
      on<T extends object>(event: EventName, callback: (data: T) => void): void;
      emit<T extends object>(event: string, data?: T): void;
      trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
  }
  ```
  *Назначение:* позволяет подписываться на события, инициировать события и передавать данные между компонентами.

- **EventName**  
  Тип, представляющий имя события (строка или регулярное выражение).
  ```typescript
  export type EventName = string | RegExp;
  ```

- **Subscriber**  
  Тип для функции-слушателя событий.
  ```typescript
  export type Subscriber = Function;
  ```

- **EmitterEvent**  
  Тип для описания события, включающий имя и передаваемые данные.
  ```typescript
  export type EmitterEvent = {
      eventName: string,
      data: unknown
  };
  ```

*Пример работы:*  
При нажатии на кнопку «В корзину» в карточке товара, View инициирует событие, которое через Presenter передаётся в модель для добавления товара в корзину. После обновления данных модель уведомляет View, чтобы отобразить актуальное состояние корзины.