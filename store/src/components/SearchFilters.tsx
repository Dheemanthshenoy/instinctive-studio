'use client'
import { Category, Filter } from '@/app/types/product'
import React, { useState } from 'react'
import { ChevronDown, ChevronRight, Filter as FilterIcon } from 'lucide-react'

const sortOptions = [
    { label: 'In Stock', value: 'in-stock' },
    { label: 'Out of Stock', value: 'out-of-stock' },
    { label: 'Low Stock', value: 'low-stock' },
]

const SearchFilters = ({
    setShowFilters,
    handleClick,
    handleAttributeClick,
    stock,
    category,
    filters,
    categories,
    clearFilters,
    selectedFilters
}: {
    setShowFilters: (show: boolean) => void,
    handleClick: (type: 'stock' | 'category', e: React.ChangeEvent<HTMLInputElement>) => void,
    handleAttributeClick: (key: string, e: React.ChangeEvent<HTMLInputElement>) => void,
    stock: string,
    category: string,
    filters: Filter[],
    categories: Category[],
    clearFilters: () => void,
    selectedFilters: Record<string, string>
}) => {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        categories: false,
        stock: false,
        ...filters.reduce((acc, filter) => ({ ...acc, [filter.key]: true }), {})
    });

    const toggleSection = (key: string) => {
        setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className='py-4 h-screen'>
            <div className='p-4 h-full [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-thumb]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-100 overflow-y-scroll rounded-lg bg-gray-100 border border-gray-100'>
                <div className='flex justify-between items-center pb-4 mb-4 border-b border-gray-200'>
                    <div className='text-lg font-medium'>Filters</div>
                    <div className='flex items-center gap-2'>
                        <button type='button' onClick={() => setShowFilters(false)} className='lg:hidden text-sm bg-blue-500 p-2 text-white rounded-md cursor-pointer flex items-center gap-2' >
                            <div>Apply Filters</div>
                            <FilterIcon className='w-4 h-4' />
                        </button>
                        <button type='button' className='text-sm text-red-500 cursor-pointer' onClick={clearFilters}>Clear Filters</button>
                    </div>
                </div>

                <div className='my-4 bg-white p-4 rounded-lg'>
                    <div className={`flex justify-between items-center cursor-pointer ${openSections['categories'] ? 'mb-2 pb-2 border-b border-gray-200' : ''}`} onClick={() => toggleSection('categories')}>
                        <span className='text-lg font-medium'>Categories</span>
                        {openSections['categories'] ? <ChevronDown /> : <ChevronRight />}
                    </div>
                    {
                        openSections['categories'] && (
                            <div>
                                {
                                    categories && categories.length > 0 ? categories.map(option => (
                                        <div className='flex items-center gap-2 my-2' key={option.category}>
                                            <input
                                                type='radio'
                                                className='h-4 w-4'
                                                name='category'
                                                id={option.category}
                                                value={option.category}
                                                checked={category === option.category}
                                                onChange={(e) => handleClick('category', e)}
                                            />
                                            <label htmlFor={option.category}>{option.name} ({option.totalProducts})</label>
                                        </div>
                                    )) : <div className='text-gray-500'>No categories found</div>
                                }
                            </div>
                        )
                    }
                </div>

                {
                    filters.map(filter => (
                        <div className='bg-white p-4 rounded-lg mb-4' key={filter.key}>
                            <div className={`flex justify-between items-center cursor-pointer ${openSections[filter.key] ? 'mb-2 pb-2 border-b border-gray-200' : ''}`} onClick={() => toggleSection(filter.key)}>
                                <span className='text-lg font-medium'>{filter.name}</span>
                                {openSections[filter.key] ? <ChevronDown /> : <ChevronRight />}
                            </div>
                            {openSections[filter.key] && (
                                <div onClick={(e) => e.stopPropagation()}>
                                    {filter.values.map(value => (
                                        <div className='flex items-center gap-2 my-2' key={value.value}>
                                            <input
                                                type='radio'
                                                className='h-4 w-4'
                                                name={filter.key}
                                                id={value.value}
                                                value={value.value}
                                                checked={selectedFilters[filter.key] === value.value}
                                                onChange={(e) => handleAttributeClick(filter.key, e)}
                                            />
                                            <label htmlFor={value.value}>{value.value} ({value.count})</label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                }

                <div className='bg-white p-4 rounded-lg'>
                    <div className={`flex justify-between items-center cursor-pointer ${openSections['stock'] ? 'mb-2 pb-2 border-b border-gray-200' : ''}`} onClick={() => toggleSection('stock')}>
                        <span className='text-lg font-medium'>Stock</span>
                        {openSections['stock'] ? <ChevronDown /> : <ChevronRight />}
                    </div>
                    {openSections['stock'] && (
                        <div onClick={(e) => e.stopPropagation()}>
                            {sortOptions.map(option => (
                                <div className='flex items-center gap-2 my-2' key={option.value}>
                                    <input
                                        type='radio'
                                        name='stock'
                                        className='h-4 w-4'
                                        id={option.value}
                                        value={option.value}
                                        checked={stock === option.value}
                                        onChange={(e) => handleClick('stock', e)}
                                    />
                                    <label htmlFor={option.value}>{option.label}</label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SearchFilters
