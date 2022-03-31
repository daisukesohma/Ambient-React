export interface ITheme {
  primary: string
  hover: string
  border: string
  gray: string
  background: string
  borderRadius: string
  height: string
}

export interface Option {
  value: any
  label: string
  key?: string
  disabled?: boolean
}

interface ArrowProps {
  expanded: boolean
}

export interface ISelectProps {
  options: Option[]
  value: Option[]
  focusSearchOnOpen?: boolean
  onChange?: (e: any) => void
  valueRenderer?: (selected: Option[], options: Option[]) => string
  ItemRenderer?: () => any
  ArrowRenderer?: ({ expanded }: ArrowProps) => void
  selectAllLabel?: string
  isLoading?: boolean | undefined
  disabled?: boolean | undefined
  disableSearch?: boolean
  shouldToggleOnHover?: boolean
  hasSelectAll?: boolean
  filterOptions?: (options: Option[], filter: string) => Option[]
  overrideStrings?: { [key: string]: string }
  labelledBy: string
  className?: string
  onMenuToggle?: () => void
  ClearIcon?: string | (() => any)
  debounceDuration?: number
  ClearSelectedIcon?: string | (() => any)
  darkMode?: boolean
}
