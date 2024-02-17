import { terminal } from 'terminal-kit'

/**
 * Sets the title of the terminal/icon
 * @param title The title, defaults to 'XYO'
 */
export const setTerminalTitle = (title = 'XYO') => {
  terminal.windowTitle(title)
  terminal(`\u001B]0;${title}\u0007`)
  terminal.iconName(title)
}
