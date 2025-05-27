'use server'

const initialResponse = {
    message: "No Products",
    data: {
        products: [],
        totalProducts: 0,
        totalPages: 1,
        limit: 10,
        page: 1,
        nextPage: 1,
        prevPage: 1,
        hasNextPage: false,
        hasPrevPage: false,
        isLastPage: true,
        filters: []
    }
}

export const getProducts = async (
    searchParams: { [key: string]: string | string[] | null | undefined }
) => {
    try {
        const { q, category, page, limit, stock, ...restFilters } = searchParams;

        const queryParams = new URLSearchParams();

        if (q) queryParams.append('q', q as string);
        if (category) queryParams.append('category', category as string);
        if (page) queryParams.append('page', page as string);
        if (limit) queryParams.append('limit', limit as string);
        if (stock) queryParams.append('stock', stock as string);

        // Prepare filters object by removing empty values
        const filters: Record<string, string> = {};
        for (const [key, value] of Object.entries(restFilters)) {
            if (value !== undefined && value !== null && value !== '') {
                filters[key] = value as string;
            }
        }

        if (Object.keys(filters).length > 0) {
            queryParams.append('filters', JSON.stringify(filters));
        }

        const queryString = queryParams.toString();
        const endpoint = queryString ? `/search?${queryString}` : '/search';

        console.log(endpoint, 'endpoint');

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(`Error fetching products: ${error}`);
        return initialResponse;
    }
};
