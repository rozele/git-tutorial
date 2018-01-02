const output = require('./output')

const Version = "3.0"

output(`Thank you for using Hello ${Version}\n`)

/**
 * An object to greet the user.
 */
class Hello {
  greet() {
    output(`Hello at ${new Date().toLocaleTimeString().substring(0, 5)}`, 1)
  }
}

new Hello().greet()
