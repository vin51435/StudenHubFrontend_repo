import { getData } from '@src/config/apiConfig';
import React from 'react';

const fetchOptions = async (inputValue, { page = 1, LIMIT = 10 }) => {
  try {
    const res = await getData(`GET_CITY_STATES`,
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
  } catch (error) {
    console.error('Error fetching options:', error);
    return error;
  }
};


export default fetchOptions;