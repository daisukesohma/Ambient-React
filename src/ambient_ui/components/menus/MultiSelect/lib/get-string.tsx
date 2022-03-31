/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const strings: any = {
  selectSomeItems: 'Select...',
  allItemsAreSelected: 'All items are selected.',
  selectAll: 'Select All',
  search: 'Search',
  clearSearch: 'Clear Search',
  clearSelected: 'Clear Selected',
}

export default function getString(key: string, overrideStrings?: any): string {
  return overrideStrings[key] || strings[key]
}
