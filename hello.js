const Version = "2.0"

console.log(`Thank you fer using Hello ${Verson}\n`)

class Hello {
  great() {
    console.log(`Hello at ${new Date().toTimeString()}`)
  }
}

new Hello().greet()