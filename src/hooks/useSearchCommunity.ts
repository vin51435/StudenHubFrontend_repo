import { searchModel } from "@src/api/searchModel"
import { IPaginationRequestQueries } from "@src/types"


export function useSearchCommunity() {

  async function searchCommunity(searchVale: string, searchTerm: IPaginationRequestQueries={}) {
    if(!searchVale.trim()) return
    const defaultSearchTerm: IPaginationRequestQueries = {
      ...searchTerm,
      searchValue: searchVale
    }

    return await searchModel('center', 'COMMUNITY', searchTerm)
  }

  return {
    searchCommunity 
  }
}