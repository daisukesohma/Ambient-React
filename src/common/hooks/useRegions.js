import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import get from 'lodash/get'

// Default list of Regions before retrieval from DB
const DEFAULT_REGIONS = [
  {
    id: 1,
    name: 'Non-Secure Entrance',
  },
  {
    id: 2,
    name: 'Secure Building Entrance',
  },
  {
    id: 3,
    name: 'Exit only door',
  },
]

export const ALL_REGIONS = gql`
  query AllRegions {
    allRegions {
      id
      name
    }
  }
`

// Returns Regions from DB or provides default array of region objects.
//

const useRegions = () => {
  const [regions, setRegions] = useState(DEFAULT_REGIONS)
  const { data } = useQuery(ALL_REGIONS)

  useEffect(() => {
    if (get(data, 'allRegions')) {
      setRegions(data.allRegions)
    }
  }, [data])

  return regions
}

export default useRegions
