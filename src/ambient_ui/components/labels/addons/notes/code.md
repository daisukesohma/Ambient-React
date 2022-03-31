# Alert Level Implementation

| Props | Values|
| ----- | ----- |
|level | one of ['high', 'medium', 'low'] |
|label | _optional_ string, overrides level as the label text |
|children| _optional_ node, will override label and level |

~~~javascript
import { AlertLevelLabel } from 'ambient_ui'
return (
    <AlertLevelLabel level='high'>
    <AlertLevelLabel level='high' label='another label'>
    <AlertLevelLabel
      level='medium'
    >
      <Icon icon={settings} size={14} />
      <span> with icon</span>
    </AlertLevelLabel>
  )
~~~
