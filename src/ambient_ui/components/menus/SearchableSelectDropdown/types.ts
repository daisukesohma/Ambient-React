import { ActionMeta, ValueType, StylesConfig } from 'react-select'

export interface SiteOption {
  label: JSX.Element | string
  value: string | number | null
  filterLabel?: string
}

type MenuPlacement = 'auto' | 'bottom' | 'top'

export interface SiteSelectDropdownProps {
  options: SiteOption[]
  isMulti?: boolean
  isAsync?: boolean
  getAsyncOptions?: () => Promise<SiteOption[]>
  creatable?: boolean
  isSearchable?: boolean
  darkMode: boolean
  onChange: (
    selectedSite: ValueType<SiteOption, boolean> | null,
    e: ActionMeta<SiteOption>,
  ) => void
  styles?: StylesConfig<SiteOption, boolean>
  placeholder: string
  value: SiteOption[] | SiteOption | null
  classOverride?: string
  menuPortalTarget?: HTMLElement | null
  menuPlacement?: MenuPlacement | undefined
  customBackgroundColor?: string | undefined
}
