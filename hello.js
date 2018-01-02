const Version = "2.0"

console.log(`Thank you for using Hello ${Version}\n`)

class Hello {
  greet() {
    console.log('Hello')
  }
}

new Hello().greet()