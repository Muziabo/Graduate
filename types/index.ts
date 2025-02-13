// Define Frontend Representative Types
interface Gown {
    id: number;
    name: string;
    size: string;
    price: number;
    inStock: boolean;
    type: string;
    category: string;
    images?: string[];
    Institution: {
        name: string;
    };
    availableSizes?: { size: string; stock: number }[]; // Update to include stock for each size
}

export interface Order {
    id: number;
    gown?: Gown; // Optional to handle cases where it's not loaded
    status: string;
    type: string;
}