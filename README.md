# advent-of-code
My submissions for the [Advent of Code](https://adventofcode.com) competition

# Usage

Does not have a help command, but does have error messages for invalid inputs.

## Installation
- Clone the git repository using `git clone` with the method of your choosing
- Download the dependencies using `yarn install` from inside the project

## Running Solutions

The `yarn dev` command has been set up with parameters to run my Advent of Code solutions.

### Run Solutions for a Specific day

`yarn dev 2023 1`

### Run All Available Solutions in a Specific Year

`yarn dev 2023`

### Run Solutions With Example Input

You can provide an additional argument of `--example` or `-e` was added to have the ability to run against the example input provided in the problem description.
`yarn dev 2023 1 -e`

## Ending the program in case of error

When an error occurs, the program does not exit. I did not implement an exit in case of error yet. `Ctrl+C` to close the program.

## Other

Yes, I realize I don't have to separate loops for model creation and the solution. But this was my desired organization method. I found doing it this way to be more fun and interesting, and not have parsing code distracting you from working on the solution.
