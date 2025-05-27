'use client'

import { Product } from '@/app/types/product'
import { ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type Props = {
    product: Product
}

const ProductCard = ({ product }: Props) => {
    const [imgUrl, setImgUrl] = useState<string>('/placeholder.png')

    useEffect(() => {
        setImgUrl(`/${product.category}.jpg`)
    }, [product])

    const formatCurrency = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
    }

    const addToCart = () => {

    }

    const stockMessage = () => {
        if (product.stock > 10) {
            return <div className='bg-green-100 text-green-500 p-1 w-max rounded-md'>In Stock</div>
        } else if (product.stock > 0 && product.stock <= 10) {
            return <div className='bg-yellow-100 text-yellow-500 p-1 w-max rounded-md'>Limited Stock</div>
        } else {
            return <div className='bg-red-100 text-red-500 p-1 w-max rounded-md'>Out of Stock</div>
        }
    }

    return (
        <div className='border border-gray-200 rounded-md p-3'>
            <Link href={`/product/${product.slug}`} className='w-full aspect-square relative'>
                <Image
                    src={imgUrl}
                    alt={product.name}
                    width={100}
                    height={100}
                    className='h-full w-full object-cover'
                />
                <div className='text-sm absolute bottom-2 right-2'>{stockMessage()}</div>
            </Link>
            <div className='pt-2 border-t border-gray-200'>
                <div className='line-clamp-1 font-medium text-lg overflow-hidden'>{product.name}</div>
                <div className='text-gray-500 text-lg font-medium'>{formatCurrency(product.price)}</div>
                <button type='button' disabled={product.stock === 0} className='w-full flex items-center justify-center gap-2 disabled:opacity-50 bg-blue-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-600 cursor-pointer' onClick={addToCart}>
                    <div>Add to Cart</div>
                    <ShoppingBag className='h-4 w-4'/>
                </button>
            </div>
        </div>
    )
}

export default ProductCard