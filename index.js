#!/usr/bin/env node
import { execSync } from "child_process";
import { simpleGit } from "simple-git";
import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs";

const git = simpleGit();

async function run() {
  console.log(chalk.blue("Welcome to Scaffold Essential! 🚀"));

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
    "https://github.com/ScaffoldEssential/scaffold-essential.git",
    projectName,
  );

  console.log(chalk.green("Installing frontend dependencies..."));
  execSync("npm install", {
    cwd: `${projectName}/frontend`,
    stdio: "inherit",
  });

  console.log(chalk.green("Installing backend dependencies..."));
  execSync("rustup update", { stdio: "inherit" });
  execSync(
    "curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install",
  );
  execSync("nix develop github:essential-contributions/essential-integration");
  execSync("cargo install pint-cli", { stdio: "inherit" });

  console.log(chalk.green("Setting up project scripts..."));
  const pmConfig = {
    name: "pint-nextjs",
    version: "1.0.0",
    description: "",
    main: "index.js",
    scripts: {
      dev: "cd frontend && npm run dev",
      build: "cd frontend && npm run build",
      compile: "cd backend && pint build",
      chain:
        "cd backend && RUST_LOG=trace essential-builder --node-api-bind-address '0.0.0.0:3553' --builder-api-bind-address '0.0.0.0:3554'",
      shell:
        "cd backend && nix shell github:essential-contributions/essential-integration#essential",
      generate: "cd frontend && npm run scripts",
    },
    author: "Bhavya Gor & Kenil Shah",
    license: "ISC",
  };

  fs.writeFileSync(
    `${projectName}/package.json`,
    JSON.stringify(pmConfig, null, 2),
  );

  console.log(chalk.green("All done! 🎉"));
  console.log(chalk.blue(`Your project is ready at ${projectName}.`));
  console.log(chalk.green("To get started:"));
  console.log(chalk.yellow(`  cd ${projectName}`));
  console.log(chalk.yellow("  npm run dev (to start the frontend)"));
  console.log(chalk.yellow("  npm run compile (to compile the backend)"));
  console.log(chalk.yellow("  npm run chain (to start the chain)"));
}

run().catch((err) => console.error(chalk.red(err)));
