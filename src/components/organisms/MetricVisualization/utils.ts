import { map, sum } from 'lodash'
import { randomColors } from './constants'

export interface BarDataProps {
  key: string,
  value: number,
}

export interface LineDataProps {
  value: number,
  date: number,
}

export interface OptionsProps {
  name: string,
  action: () => void,
}

export const getKey = (d: BarDataProps) => d.key
export const getValue = (d: BarDataProps) => d.value
export const getX = (d: LineDataProps) => d.date
export const getY = (d: LineDataProps) => d.value
export const getAllData = (series: []) => series.reduce((rec, d) => rec.concat(d), [])
export const getValueWithCommas = (d: BarDataProps) => d.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
export const getRamdomColor = (i: number) => randomColors[i % 10]
export const getTotalValue = (data: BarDataProps[]) => sum(map(data, 'value')).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')