import get from 'lodash/get'
import OneStreamSVG from './icons/one-stream.jsx'
import FourStreamSVG from './icons/four-streams.jsx'
import NineStreamSVG from './icons/nine-streams.jsx'
import CustomV1StreamSVG from './icons/custom-v1.jsx'
import SixteenStreamSVG from './icons/sixteen-streams.jsx'
import CustomV2StreamSVG from './icons/custom-v2.jsx'
import CustomV3StreamSVG from './icons/custom-v3.jsx'
import CustomV4StreamSVG from './icons/custom-v4.jsx'
import CustomV5StreamSVG from './icons/custom-v5.jsx'
import CustomV6StreamSVG from './icons/custom-v6.jsx'
import CustomV7StreamSVG from './icons/custom-v7.jsx'
import CustomV8StreamSVG from './icons/custom-v8.jsx'
import CustomV9StreamSVG from './icons/custom-v9.jsx'
import CustomV10StreamSVG from './icons/custom-v10.jsx'
import CustomV11StreamSVG from './icons/custom-v11.jsx'

const map = {
  '1x1': OneStreamSVG,
  '2x2': FourStreamSVG,
  '3x3': NineStreamSVG,
  '4,1x3': CustomV1StreamSVG,
  'Sixteen Streams': SixteenStreamSVG,
  'Custom Wall 2': CustomV2StreamSVG,
  'Custom Wall 3': CustomV3StreamSVG,
  'Custom Wall 4': CustomV4StreamSVG,
  'Custom Wall 5': CustomV5StreamSVG,
  'Custom Wall 6': CustomV6StreamSVG,
  'Custom Wall 7': CustomV7StreamSVG,
  'Custom Wall 8': CustomV8StreamSVG,
  'Custom Wall 9': CustomV9StreamSVG,
  'Custom Wall 10': CustomV10StreamSVG,
  'Custom Wall 11': CustomV11StreamSVG,
}

export default function getTemplateIcon(name) {
  return get(map, name, OneStreamSVG)
}
