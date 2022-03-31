# New Icon Implementation

All icons take in **icon** prop which is the icon name.
They optionally take in  **stroke** (string), **width**, and **height** props. Some take **fill** prop.

|Props| Description|
|---|---|
|animate| _bool_ *false* |
|color||
|fill||
|height||
|icon||
|fillOnlyIcon||
|pathProps||
|size||
|stroke||
|strokeWidth||
|width||
|all other props| are spread on the <SvgWrapper {...props} |

~~~javascript
import { Colors, Icon } from 'ambient_ui'

<Icon icon={'alertCircle'}  />

~~~

Supported Icons
-  activity
-  alertCircle
-  arrowUp
-  arrowDown
-  back
-  bell
-  bookmark
-  box
-  camera
-  checkCircle
-  close
-  grid
-  help
-  forward
-  list
-  moon
-  play
-  phone
-  sites
-  trash
-  maximize
