# Icons Implementation

All icons take in **stroke** (string), **width**, and **height** props. Some take **fill** prop.

~~~javascript
import { Colors, Icons } from 'ambient_ui'
const { Play } = Icons  

let PlayButton = () => {
  return (
    <Play
      fill={Colors.WHITE} // only supported on some icons for now!
      stroke={Colors.ERROR}
      width={36}
      height={36}
    >
  )
}

~~~
