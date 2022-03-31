# OptionMenu Implementation

| Props | Description|
|------ | -------|
| icon | _node_ |
| menuItems | _array_ [{ label, value, onClick, hoverColor}, {...}] |
| noBackground | _bool_ default: **false**|
| darkMode | _boo_ default: **false** |
| textClass | _string_ default: **am-caption**  - class name for menu item text, ie. 'am-body1', 'am-subtitle1' |
|paperClass | _class object_ ie. classes.paperOverride can be { marginTop: '20px !important'} |

~~~javascript
import { OptionMenu, Icon } from 'ambient_ui'


  const menuItems = [{
    label: 'Escalate',
    value: 'escalate',
    onClick: () => {},
    hoverColor: 'red'
  }]

  return (
    <OptionMenu
      icon={<Icon icon='phone' color={'red'}> }
      alignItems={menuItems}
      noBackground={true}
    >
  )

~~~
