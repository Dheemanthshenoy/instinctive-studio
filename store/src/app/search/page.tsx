import SearchListing from '@/components/SearchListing';
import React from 'react';

export const generateMetadata = async () => {
  return {
    title: 'Search',
    description: 'Search for products',
    openGraph: {
      title: 'Search | B2B Store',
      description: 'Search for products on B2B Store',
    },
  }
}

const page = () => {
  return (
    <div className="container mx-auto px-4 lg:px-0">
        <SearchListing />
    </div>
  );
};

export default page;