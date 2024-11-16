#!/usr/bin/env node
import { execSync } from "child_process";
import { simpleGit } from "simple-git";
import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs";

const git = simpleGit();

async function run() {
  console.log(chalk.blue("Welcome to Create Essential! 🚀"));

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter your project name:",
      default: "my-essential-project",
    },
  ]);

  const { projectName } = answers;

  console.log(chalk.green("Cloning the repository..."));
  await git.clone(
    "https://github.com/your-username/my-monorepo.git",
    projectName,
  );

  console.log(chalk.green("Installing frontend dependencies..."));
  execSync("yarn install", {
    cwd: `${projectName}/frontend`,
    stdio: "inherit",
  });

  console.log(chalk.green("Installing backend dependencies..."));
  execSync("rustup update", {
    cwd: `${projectName}/backend`,
    stdio: "inherit",
  });

  console.log(chalk.yellow("Setting up scripts..."));
  const pmConfig = `
    {
        "scripts": {
            "start-next": "cd frontend && yarn dev",
            "start-rust": "cd backend && cargo run",
            "start-all": "concurrently \\"yarn start-next\\" \\"yarn start-rust\\""
        }
    }`;
  fs.writeFileSync(`${projectName}/package.json`, pmConfig);

  console.log(chalk.green("All done! 🎉"));
  console.log(chalk.blue(`Your project is ready at ${projectName}.`));
}

run().catch((err) => console.error(chalk.red(err)));
