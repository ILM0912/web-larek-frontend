import { LarekAPI } from './components/LarekApi';
import './scss/styles.scss';
import { PaymentType, Product, ProductsList } from './types';
import { API_URL, CDN_URL } from './utils/constants';

const api = new LarekAPI(CDN_URL, API_URL);

