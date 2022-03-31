import React from 'react'

function Cross(): JSX.Element {
  return (
    <svg
      width='24'
      height='24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      className='dropdown-search-clear-icon gray'
    >
      <line x1='18' y1='6' x2='6' y2='18' />
      <line x1='6' y1='6' x2='18' y2='18' />
    </svg>
  )
}

export default Cross
