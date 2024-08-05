import { Timestamp } from "firebase/firestore";

export type ProductImage = {
    id: number,
    image: string
}

export type Option = {
    name: string;
    options: string[];
    id?: string;
};

export type GridProduct = {
    name: string;
    images: string[];
    product_type: string;
    price: number;
    compare_at: number;
    currency: string;
    like_count: number;
    store_id: string;
    created_at: Timestamp;
    id: string;
    revenue?: number;
    view_count?: number;

}