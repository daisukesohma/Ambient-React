# GifSplitter Implementation

| Props | Description|
|------ | -------|
| frameCount | _number_ default: 5. The total number of frames to display (sometimes this is nondeterministic)|
|includeLastFrame| _bool_ default: true. Always includes the final frame of the gif, regardless of whether frameCount got the last frame|
|orientation| _'horizontal', 'vertical'_. Present images in row or column form|
|url | _string_ gif url|
|width | _number_ width in pixels of each gif image|
|wrap | _bool_ whether to wrap horizontal row. If true, it wraps, if false, it presents a scrollable list.|

~~~javascript
import { GifSplitter } from 'ambient_ui'

  return (
    <GifSplitter
      frameCount={10}
      includeLastFrame
      orientation={'horizontal'}
      url={'http://remote.ambient.ai/static/gifs/251_1575787525071.gif'}
      width={200}
      wrap={false}
    />
  )

~~~
