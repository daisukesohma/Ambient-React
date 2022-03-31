export interface AlertTypes {
  id: number
  severity: string
  verificationType: string
  status: string
}

export interface SecurityProfileType {
  id: number
  name: string
  alerts: {
    id: number
    severity: string
    verificationType: string
    status: string
    defaultAlert: {
      id: number
      name: string
      severity: string
      regions: {
        id: number
        name: string
      }[]
    }
  }[]
}
