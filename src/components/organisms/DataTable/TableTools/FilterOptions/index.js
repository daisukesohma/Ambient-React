import React from 'react'
import { CheckboxList } from 'ambient_ui'

export default function FilterOptions({ options }) {
  return options.map((o, i) => {
    if (o.type === 'CheckboxList') {
      return (
        <div style={{ marginRight: 24 }} key={`filterOption-${i}`}>
          <CheckboxList
            items={o.items}
            onSelect={o.onSelect}
            placeholder={o.placeholder}
            selected={o.selected}
          />
        </div>
      )
    }

    return <div key={`filterOption-${i}`} />
  })
}
