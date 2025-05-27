export interface Product {
    _id: string;
    name: string;
    category: string;
    slug: string;
    stock: number;
    location: string;
    attributes: {
        [key: string]: string;
    };
    isActive: boolean;
    isDeleted: boolean;
    description: string;
    price: number;
}

export interface Filter {
    key: string;
    name: string;
    type: string;
    values: [{
        value: string;
        count: number;
    }];
}

export interface Category {
    category: string;
    totalProducts: number;
    name: string;
}