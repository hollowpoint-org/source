var readline = require("readline");
var execSync = require("child_process").execSync;
// Set theme
var green = "\x1b[32m";
var white = "\x1b[0m";
var red = "\x1b[31m";
var blue = "\x1b[34m";
// create empty user input
var args = [];
// Available commands
var commands = {
    "describe": {
        description: "Describe task at a specific revision.",
        command: function (args) {
            var family = args[1] || "service";
            var revision = args[2] || "";
            var string = "aws ecs describe-task-definition --task-definition ".concat(family);
            if (revision)
                string = string + ':' + revision;
            var input = "describe ".concat(family, " ").concat(revision);
            return [
                input,
                string
            ];
        }
    },
    "list": {
        description: "List all files in the specified S3 bucket.",
        command: function (args) {
            var bucket = args[1] || "source-dev-fuse";
            var input = "list ".concat(bucket);
            return [
                input,
                "aws s3 ls s3://".concat(bucket, " --recursive --human-readable --summarize")
            ];
        }
    }
};
// Welcome screen
console.log(white, "\n\nWelcome to the Source!");
// Present options
console.log(blue, '\nCOMMANDS:');
for (var opt in commands) {
    console.log("\x1b[0m", "".concat(opt, ": ").concat(commands[opt].description));
}
// Execute a command
var execTask = function (input) {
    console.log(green, "INTENT: ".concat(input[0]));
    console.log(red, "COMMAND: ".concat(input[1]));
    var output = execSync(input[1], function (error, stdout, stderr) {
        if (error) {
            console.log(red, "ERROR:\n}");
            console.log(white, "".concat(error));
            return error;
        }
        if (stderr) {
            console.log(red, "ERROR:\n}");
            console.log(white, "".concat(stderr));
            return stderr;
        }
        return stdout;
    }).toString();
    console.log(blue, "OUTPUT:\n");
    console.log(white, output);
    // Because this fails testing.
    try {
        console.log(blue, "ACTION: ".concat(commands[args[0]].description));
    }
    catch (error) { }
    console.log(white, 'INFO: Return to Source.');
    console.log(red, "\nINPUT:");
    console.log(white, "");
    return output;
};
// Create interface
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var terminal = function () {
    rl.question(white, "", function (string) {
        try {
            if (string && string.trim()) {
                var regex = /"[^"]+"|[^\s]+/g;
                var stripQuotes = /[“”]/g;
                string = string.replace(stripQuotes, '"');
                args = string.match(regex).map(function (e) { return e.replace(/"(.+)"/, "$1"); }).filter(function (val, i) {
                    return val;
                });
            }
            execTask(commands[args[0]].command(args));
        }
        catch (error) {
            console.error(red, 'ERROR: Something failed.');
            console.error(red, error);
            console.log(red, "\nINPUT:");
            console.log(white, "");
        }
        terminal();
    });
};
console.log(red, "\nINPUT:\n");
terminal();
exports.execTask = execTask;
