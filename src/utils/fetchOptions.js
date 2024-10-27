import { getData } from '@src/config/apiConfig';
import React from 'react';

const fetchOptions = async (optionEndpoint, inputValue, { page = 1, LIMIT = 10 }) => {
  const res = await getData(optionEndpoint,
    {
      baseURL: 'userFormats',
      queries: [
        { query: inputValue },
        { page },
        { limit: LIMIT },
      ]
    });
  return {
    options: res.data.map(item => ({
      value: item,
      label: item
    })),
    hasMore: { ...res, totalPages: Math.ceil(res.totalResults / res.limit) }  // `hasMore` can be part of your API response to indicate more pages
  };
};


export default fetchOptions;