interface IObjectKeys {
  [key: string]:
    | string
    | number
    | null
    | undefined
    | boolean
    | { key: string; label: string }[]
}

export interface RowData extends IObjectKeys {
  id: number
  tsEndActive: number | null
  tsStartActive: number | null
  tsEndRequested: number | null
  tsStartRequested: number | null
  reason: string
  status: string
  account?: string
  name?: string
  img?: string
  actions: {
    key: string
    label: string
  }[]
  isActive: boolean
  isExpired: boolean
}

export interface Data {
  id: number
  actions: {
    key: string
    label: string
  }[]
  account?: string
  reason: string
  tsEndActive: number
  tsEndRequested: number
  tsStartActive: number
  tsStartRequested: number
  name?: string
  img?: string
  status: string
  isActive: boolean
  isExpired: boolean
}

export interface RequestTableContainerProps {
  data: Data[]
  darkMode: boolean
  showAddNowButton: boolean
  emptyComment: string
  isLoading: boolean
  setPage(page: number): void
  setLimit(newLimit: number): void
  pages: number
  limit: number
  totalCount: number
  currentPage: number
  onSort(sortBy: string, sortOrder: number): void
  onSearch(value: string): void
  columns: {
    title: string
    field: string
    render?(rowData: RowData): JSX.Element
    sorting: boolean
    sortBy?: string
  }[]
  additionalTools?: JSX.Element
}
