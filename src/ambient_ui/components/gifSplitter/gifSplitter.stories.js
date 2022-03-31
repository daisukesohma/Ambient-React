import React from 'react'
import { storiesOf, addDecorator } from '@storybook/react' // eslint-disable-line

import { withKnobs, text, boolean, number } from '@storybook/addon-knobs' // eslint-disable-line

import { code } from './addons/notes'
import GifSplitter from './index'

addDecorator(withKnobs)

storiesOf('GifSplitter', module).add(
  'GifSplitter',
  () => {
    const frameCountKnob = number('frameCount', 5)
    // other example urls:
    //  http://remote.ambient.ai/static/gifs/251_1575787525071.gif
    //  https://media.giphy.com/media/YnAZU2bxbsQw0/giphy.gif
    //
    //  Current cloudfront urls do not work yet (3/16/20) because 87a and 89a gif headers are not on them.
    //  https://d2p3hivrp28ln2.cloudfront.net//shared/static/gifs/3791402_1584386050488.gif?... ...
    //
    const urlKnob = text(
      'url',
      'https://media1.tenor.com/images/b9b0253a0d1a42baf064e643aaad20cb/tenor.gif?itemid=10903124',
    )
    const orientationKnob = text('orientation', 'horizontal')
    const widthKnob = number('width (px)', 200)
    const includeLastFrameKnob = boolean('includeLastFrame', true)
    const wrapKnob = boolean('wrap', true)
    return (
      <div>
        <GifSplitter
          frameCount={frameCountKnob}
          url={urlKnob}
          includeLastFrame={includeLastFrameKnob}
          orientation={orientationKnob}
          width={widthKnob}
          wrap={wrapKnob}
        />
      </div>
    )
  },
  {
    notes: { Code: code },
  },
)
