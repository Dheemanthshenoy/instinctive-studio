'use client';

import { getProducts } from '@/app/actions/products';
import { useRouter, useSearchParams } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useEffect, useRef, useCallback, useState, Suspense } from 'react';
import { Category, Filter, Product } from '@/app/types/product';
import { Filter as FilterIcon, Loader, Search, X } from 'lucide-react';
import ProductCard from './ProductCard';
import { useDebounce } from '@/hooks/debounce';
import SearchFilters from './SearchFilters';
import Image from 'next/image';

interface PaginatedResponse {
    data: {
        products: Product[];
        totalProducts: number
        totalPages: number;
        currentPage: number;
        nextPage: number;
        prevPage: number;
        hasPrevPage: boolean;
        hasNextPage: boolean;
        isLastPage: boolean;
        filters: Filter[];
        categories: Category[];
    };
}

const SearchPageContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const q: string | null = searchParams.get('q');
    const c: string | null = searchParams.get('c');
    const s: string | null = searchParams.get('s');

    // Extract selected filters from URL parameters
    const selectedFilters: Record<string, string> = {};
    searchParams.forEach((value, key) => {
        if (key !== 'q' && key !== 'c' && key !== 's' && key !== 'page' && key !== 'limit') {
            selectedFilters[key] = value;
        }
    });

    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const [query, setQuery] = useState<string>(q || '');
    const debouncedQuery = useDebounce(query, 500);
    const [stock, setStock] = useState<string>(s || '');
    const [category, setCategory] = useState<string>(c || '');
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['products', searchParams.toString()],
        queryFn: ({ pageParam }) => {
            const params = new URLSearchParams(searchParams.toString());

            // remove q, c, s from params
            params.delete('q');
            params.delete('c');
            params.delete('s');

            return getProducts({
                q,
                category,
                stock,
                page: pageParam.toString(),
                limit: '8',
                ...Object.fromEntries(params.entries())
            });
        },
        getNextPageParam: (lastPage: PaginatedResponse) => {
            if (!lastPage?.data?.currentPage || !lastPage?.data?.totalPages) return undefined;
            return lastPage.data.currentPage < lastPage.data.totalPages
                ? lastPage.data.currentPage + 1
                : undefined;
        },
        initialPageParam: 1,
    });

    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const [target] = entries;
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage && !isLoading) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage, isLoading]);

    useEffect(() => {
        const element = loadMoreRef.current;
        if (!element) return;

        observerRef.current = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: '100px',
            threshold: 0.1,
        });

        observerRef.current.observe(element);

        return () => observerRef.current?.disconnect();
    }, [handleObserver]);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (debouncedQuery) {
            params.set('q', debouncedQuery);
        } else {
            params.delete('q');
        }

        if (stock) {
            params.set('s', stock);
        } else {
            params.delete('s');
        }

        if (category) {
            params.set('c', category);
        } else {
            params.delete('c');
        }

        router.push(`/search?${params.toString()}`);
    }, [debouncedQuery, router, searchParams, stock, category]);

    const products: Product[] = data?.pages.flatMap((page) => page.data.products) || [];
    const filters: Filter[] = data?.pages[0]?.data?.filters || [];
    const categories: Category[] = data?.pages[0]?.data?.categories || [];

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }

    const handleClick = (type: 'stock' | 'category', e: React.ChangeEvent<HTMLInputElement>) => {
        if (type === 'stock') setStock(e.target.value);
        if (type === 'category') setCategory(e.target.value);
    }

    const handleAttributeClick = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams.toString());
        const value = e.target.value;
        const existingValues = params.get(key)?.split('&') || [];

        if (e.target.checked) {
            if (!existingValues.includes(value)) {
                existingValues.push(value);
            }
        } else {
            const index = existingValues.indexOf(value);
            if (index > -1) {
                existingValues.splice(index, 1);
            }
        }

        if (existingValues.length > 0) {
            params.set(key, existingValues.join('&'));
        } else {
            params.delete(key);
        }

        router.push(`/search?${params.toString()}`);
    }

    const clearFilters = () => {
        setQuery('');
        setStock('');
        setCategory('');
        router.push('/search');

        if (showFilters) {
            setShowFilters(false);
        }
    }

    return (
        <div>
            <div className="flex items-start gap-x-4 relative">
                <div className='hidden lg:block w-1/4 sticky top-0 left-0'>
                    <SearchFilters
                        setShowFilters={setShowFilters}
                        handleClick={handleClick}
                        handleAttributeClick={handleAttributeClick}
                        stock={stock}
                        category={category}
                        filters={filters}
                        categories={categories}
                        clearFilters={clearFilters}
                        selectedFilters={selectedFilters}
                    />
                </div>

                <div className='lg:hidden'>
                    <div className='fixed bg-white border-t border-gray-200 bottom-0 left-0 w-full z-30 p-4'>
                        <div className='flex justify-between items-center'>
                            <div className='w-1/2 flex items-center justify-center'>
                                <button className='bg-red-100 text-red-500 p-2 rounded-md flex items-center gap-2' onClick={clearFilters}>
                                    <div>Clear Filters</div>
                                    <X className='w-4 h-4' />
                                </button>
                            </div>
                            <div className='w-1/2 flex items-center justify-center'>
                                <button onClick={() => setShowFilters(true)} className='bg-gray-100 text-gray-500 p-2 rounded-md flex items-center gap-2'>
                                    <div>Apply Filters</div>
                                    <FilterIcon className='w-4 h-4' />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={`h-screen z-50 w-full fixed top-0 ${showFilters ? 'right-0' : '-right-full'} ease-in-out duration-300`}>
                        <div className='h-full w-full bg-white border-l border-gray-200'>
                            <SearchFilters
                                setShowFilters={setShowFilters}
                                handleClick={handleClick}
                                handleAttributeClick={handleAttributeClick}
                                stock={stock}
                                category={category}
                                filters={filters}
                                categories={categories}
                                clearFilters={clearFilters}
                                selectedFilters={selectedFilters}
                            />
                        </div>
                    </div>
                </div>

                <div className='w-full lg:w-3/4 pt-4 pb-10 lg:py-4'>
                    <div className='mb-4 flex items-center gap-2 border border-gray-200 rounded-md p-3'>
                        <input
                            type="search"
                            placeholder='Search products'
                            className='flex-1 w-full outline-none'
                            value={query}
                            onChange={handleSearch}
                        />
                        <Search className='w-6 h-6 text-gray-300' />
                    </div>

                    {
                        q && (
                            <h1 className="text-2xl font-bold mb-4">Search Results for {q} [{data?.pages[0]?.data.totalProducts || 0}]</h1>
                        )
                    }

                    {
                        isLoading && (
                            <div className="w-full flex justify-center items-center">
                                <Loader className='animate-spin' />
                            </div>
                        )
                    }

                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                        {
                            products && products.length > 0 ? products.map((product: Product) => (
                                <div key={product._id}>
                                    <ProductCard product={product} />
                                </div>
                            )) : <div className='col-span-full py-8 text-gray-500 w-full flex flex-col items-center justify-center h-full'>
                                <div>
                                    <Image src='/search.png' alt='No results' width={100} height={100} />
                                </div>
                                <div className='text-2xl font-bold'>No results</div>
                            </div>
                        }
                    </div>

                    <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
                        {
                            isFetchingNextPage && (
                                <div className="text-sm text-gray-500">
                                    <Loader className="animate-spin" />
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

const SearchPageFallback = () => {
    return (
        <div className="w-full flex justify-center items-center min-h-[200px]">
            <Loader className='animate-spin' />
        </div>
    );
};

const SearchPage = () => {
    return (
        <Suspense fallback={<SearchPageFallback />}>
            <SearchPageContent />
        </Suspense>
    );
};

export default SearchPage;
