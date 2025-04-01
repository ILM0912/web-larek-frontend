import { Api } from './base/api';
import { ApiListResponse, OrderResult, OrderInfo, Product, ProductsList } from '../types';

export interface ILarekAPI {
    getProductsList: () => Promise<ProductsList>;
    getProductItem: (id: string) => Promise<Product>;
    postOrder: (order: OrderInfo) => Promise<OrderResult>;
}

export class LarekAPI extends Api implements ILarekAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProductsList(): Promise<ProductsList> {
        return this.get('/product').then((data: ProductsList) => ({
            ...data,
            items: data.items.map((product) => ({
                ...product,
                image: this.cdn + product.image
            }))
        }));
    }

    getProductItem(id: string): Promise<Product> {
        return this.get(`/product/${id}`).then(
            (item: Product) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    postOrder(order: OrderInfo): Promise<OrderResult> {
        return this.post('/order', {
            ...order,
            items: order.items.map((product) => product.id),
            payment: this.translatePayment(order.payment)
        }).then((data: OrderResult) => data);
    }

    private translatePayment(payment: string): string {
        const translations: Record<string, string> = {
            "Онлайн": "online",
            "При получении": "offline"
        };
        return translations[payment];
    }
}