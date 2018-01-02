const Version = "2.0"

console.log(`Thank you for using Hello ${Version}\n`)

class Hello {
  greet() {
    console.log(`Hello at ${new Date()}`)
  }
}

new Hello().greet()