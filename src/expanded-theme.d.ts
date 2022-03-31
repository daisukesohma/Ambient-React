import '@material-ui/core/styles'

declare module '@material-ui/core/styles/createPalette' {
  export interface CommonColors {
    black: string
    white: string
    tertiary: string
    greenPastel: string
    greenBluePastel: string
    magenta: string
    productBlue: string
    lime: string
    emerald: string
    grey: string
    inputGrey: string
    buttonBlue: string
    modalBackground: string
    shadows: {
      hard: string
      soft: string
    }
  }
  export interface TypeBackground {
    layer: {
      1: string
      2: string
    }
  }
}
