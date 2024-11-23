export interface PaginationToSend {

  page: number
  size: number
  sortDir: 'desc' | 'asc'

}

export interface PaginationData {

  page: PaginationDataResponse
  _embedded: any

}

export interface PaginationDataResponse {

  number: number
  size: number
  totalElements: number
  totalPages: number

}