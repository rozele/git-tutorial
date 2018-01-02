const Version = "2.0"

console.log(`Thank you for using Hello ${Version}\n`)

class Hello {
  constructor(name) {
    this._name = name
  }

  greet() {
    console.log(`Hello at ${new Date().toLocaleTimeString()}`)
  }
}

new Hello().greet()