# source
An opinionated workflow.

## Tested on
- Arch Linux
- Terraform v1.3.1
- AWS-CLI v1.25.81
- Node.js v18.10.0

## To deploy the Terraform stack

1. `terraform init --upgrade`
2. `terraform apply`
3. Your service's DNS address will be output to the terminal.
4. `terraform destroy`

## To use the CLI application

- `npm start`
- `npm run test`
- `Ctrl + C` to exit the terminal.

### List the contents of an S3 bucket

- To query the default bucket: `list`
- To query a specific bucket: `list <bucket>`

### Describe an ECS service at a specific revision

- To query the latest revision of the default service: `describe`
- To query a specific service, at a specific revision: `describe <family> <revision>`

## Improvements
- Unit testing is hard, and I'm bad at it.
- Make better use of TypeScript features.
- Configure CLI queries/tests/etc to import resources directly from TF state.
- Search for libraries that may expedite the development of a CLI framework.
- Be more descriptive; hand-hold junior developers through every process. Teach "lessons."
- Connect to [a web interface](https://thesource.fm), with a local CLI utility/API, and decentralized authentication, such as GunDB.
- Integration tests.
- IAM role is poorly-implemented.
- Integrate with an offline-first documentation utility, such as Logseq. Generate pages from commands.
- More parameters, more modularity, less hardcoded values.
- Launch CLI as an interactive, long-lived service.
- Race conditions, messages out of order.
- Write output to log files.
- Terminal format is inconsistent (spaces, indent, newlines, etc.)