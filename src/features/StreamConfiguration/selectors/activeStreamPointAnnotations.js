import { createSelector } from '@reduxjs/toolkit'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { AnnotationMethodEnum } from 'enums'

export default createSelector(
  [state => state.streamConfiguration.activeStream],
  activeStream => {
    const entities = get(activeStream, 'entities')
    if (isEmpty(entities)) {
      return []
    }

    const allPointAnnotations = entities
      .filter(e => {
        return (
          e.annotationType === AnnotationMethodEnum.POINT_ANNOTATION &&
          !isEmpty(e.pointAnnotations)
        )
      })
      // .map(e =>  e.pointAnnotations[0]) // hard-coded as the first point annotation
      .map(e => e.pointAnnotations)
      .flat()

    return allPointAnnotations
  },
)
