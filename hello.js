const Version = "3.0"

console.log(`Thank you for using Hello ${Version}\n`)

class Hello {
  greet() {
    console.log(`Hello at ${new Date().toLocaleTimeString().substring(0, 5)}`)
  }
}

new Hello().greet()