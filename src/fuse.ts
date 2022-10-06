const readline = require("readline")
const { execSync } = require("child_process")

// Set theme
const green = "\x1b[32m"
const white = "\x1b[0m"
const red = "\x1b[31m"
const blue = "\x1b[34m"

// create empty user input
let args = []

// Available commands
const commands = {
    "describe": {
        description: "Describe task at a specific revision.",
        command: (args: any) => {
            const family = args[1] || "service"
            const revision = args[2] || ``
            let string = `aws ecs describe-task-definition --task-definition ${family}`
            if (revision) string = string + ':' + revision
            const input = `describe ${family} ${revision}`
            return  [
                input,
                string
            ]
        }
    },
    "list": {
        description: "List all files in the specified S3 bucket.",
        command: (args: any) => {
            const bucket = args[1] || "source-dev-fuse"
            const input = `list ${bucket}`
            return [
                input,
                `aws s3 ls s3://${bucket} --recursive --human-readable --summarize`
            ]
        }
    },
}

// Welcome screen
console.log(white, `\n\nWelcome to the Source!`)

// Present options
console.log(blue, '\nCOMMANDS:')
for (const opt in commands) {
    console.log("\x1b[0m", `${opt}: ${commands[opt].description}`)
}

// Execute a command
const execTask = (input: string) => {
    console.log(green, `INTENT: ${input[0]}`)
    console.log(red, `COMMAND: ${input[1]}`)
    const output = execSync(input[1], (error, stdout, stderr) => {
        if (error) {
            console.log(red, `ERROR:\n}`)
            console.log(white, `${error}`)
            return error
        }
        if (stderr) {
            console.log(red, `ERROR:\n}`)
            console.log(white, `${stderr}`)
            return stderr
        }
        return stdout
    }).toString()
    console.log(blue, `OUTPUT:\n`)
    console.log(white, output)
    // Because this fails testing.
    try {
        console.log(blue, `ACTION: ${commands[args[0]].description}`)
    }
    catch (error) {}
    console.log(white, 'INFO: Return to Source.')
    console.log(red, `\nINPUT:`)
    console.log(white, ``)
    return output
}

// Create interface
const rl =
 readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const terminal = () => {
    rl.question(white, "", (string: any) => {
        try {
            if (string && string.trim()) {
                const regex = /"[^"]+"|[^\s]+/g
                const stripQuotes = /[“”]/g
                string = string.replace(stripQuotes, '"')
                args = string.match(regex).map(e => e.replace(/"(.+)"/, "$1")).filter(function(val, i) {
                    return val
                })
            }
            execTask(commands[args[0]].command(args))
        }
        catch (error) {
            console.error(red, 'ERROR: Something failed.')
            console.error(red, error)
            console.log(red, `\nINPUT:`)
            console.log(white, ``)
        }
        terminal()
    })
}

console.log(red, `\nINPUT:\n`)
terminal()

exports.execTask = execTask