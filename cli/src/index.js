import inquirer from "inquirer";
import dotenv from "dotenv";
import { printTitle } from "./helpers.js";
import { doesEnvFileExist, generateEnv, testEnvFile } from "./envGenerator.js";
import { newEnvQuestions } from "./questions/newEnvQuestions.js";
import { existingEnvQuestions } from "./questions/existingEnvQuestions.js";
import { spawn } from "child_process";
import chalk from "chalk";

const handleExistingEnv = () => {
  console.log(chalk.yellow("Existing ./next/env file found. Validating..."));

  try {
    testEnvFile();
  } catch (e) {
    console.log(e.message);
    return;
  }

  inquirer.prompt(existingEnvQuestions).then((answers) => {
    handleRunOption(answers.runOption);
  });
};

const handleNewEnv = () => {
  inquirer.prompt(newEnvQuestions).then((answers) => {
    dotenv.config({ path: "./.env" });
    generateEnv(answers);
    console.log("\nEnv files successfully created!");
    handleRunOption(answers.runOption);
  });
};

const handleRunOption = (runOption) => {
  if (runOption === "docker-compose") {
    console.log(chalk.cyan("\n正在启动 Docker Compose..."));
    console.log(chalk.yellow("⚠️  构建过程可能需要较长时间，请耐心等待..."));
    console.log(chalk.yellow("⚠️  如果遇到错误，请检查："));
    console.log(chalk.yellow("   1. Docker Desktop 是否正常运行"));
    console.log(chalk.yellow("   2. 端口 3000、8000、3308 是否被占用"));
    console.log(chalk.yellow("   3. 网络连接是否正常（需要下载 Docker 镜像）"));
    console.log(chalk.yellow("   4. Docker Desktop 内存是否充足（建议至少 4GB）"));
    console.log(chalk.cyan("\n💡 提示：如果下载镜像时闪退，可以尝试："));
    console.log(chalk.cyan("   1. 预先下载镜像：docker pull python:3.11-slim"));
    console.log(chalk.cyan("   2. 预先下载镜像：docker pull node:18-alpine"));
    console.log(chalk.cyan("   3. 预先下载镜像：docker pull mysql:8.0"));
    console.log("\n");

    const isWindows = process.platform === "win32";
    const dockerComposeUp = spawn(
      "docker-compose",
      ["up", "--build"],
      {
        stdio: "inherit",
        shell: isWindows,
        cwd: process.cwd().replace(/\\cli$/, ""), // 回到项目根目录
      }
    );

    // 捕获标准输出和错误，防止闪退
    let outputBuffer = "";

    dockerComposeUp.stdout?.on("data", (data) => {
      outputBuffer += data.toString();
    });

    dockerComposeUp.stderr?.on("data", (data) => {
      outputBuffer += data.toString();
    });

    dockerComposeUp.on("error", (error) => {
      console.error(chalk.red("\n❌ Docker Compose 启动失败："));
      console.error(chalk.red(error.message));
      console.log(chalk.yellow("\n请确保："));
      console.log(chalk.yellow("1. Docker Desktop 已安装并正在运行"));
      console.log(chalk.yellow("2. docker-compose 命令可用"));
      console.log(chalk.yellow("3. 网络连接正常（可能需要科学上网）"));
      console.log(chalk.yellow("\n💡 解决方案："));
      console.log(chalk.yellow("   如果下载镜像失败，请手动运行以下命令预先下载："));
      console.log(chalk.cyan("   docker pull python:3.11-slim"));
      console.log(chalk.cyan("   docker pull node:18-alpine"));
      console.log(chalk.cyan("   docker pull mysql:8.0"));
      console.log(chalk.yellow("   然后重新运行此脚本"));
      console.log("\n按任意键退出...");
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.on("data", () => process.exit(1));
    });

    dockerComposeUp.on("exit", (code, signal) => {
      if (code !== 0) {
        console.error(chalk.red(`\n❌ Docker Compose 退出，错误代码: ${code}`));
        if (signal) {
          console.error(chalk.red(`   信号: ${signal}`));
        }
        console.log(chalk.yellow("\n可能的原因："));
        console.log(chalk.yellow("1. 网络连接中断（下载镜像时失败）"));
        console.log(chalk.yellow("2. Docker Desktop 内存不足"));
        console.log(chalk.yellow("3. 防火墙/代理阻止了连接"));
        console.log(chalk.yellow("\n💡 解决方案："));
        console.log(chalk.yellow("   方案 1：预先下载镜像（推荐）"));
        console.log(chalk.cyan("   docker pull python:3.11-slim"));
        console.log(chalk.cyan("   docker pull node:18-alpine"));
        console.log(chalk.cyan("   docker pull mysql:8.0"));
        console.log(chalk.yellow("\n   方案 2：检查 Docker Desktop 设置"));
        console.log(chalk.yellow("   - 增加内存分配（Settings > Resources > Memory）"));
        console.log(chalk.yellow("   - 配置代理（如果需要）"));
        console.log(chalk.yellow("\n   方案 3：手动运行构建"));
        console.log(chalk.cyan("   cd .."));
        console.log(chalk.cyan("   docker-compose up --build"));
        console.log("\n按任意键退出...");
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on("data", () => process.exit(code || 1));
      }
    });

    // 处理进程被终止的情况
    process.on("SIGINT", () => {
      console.log(chalk.yellow("\n\n⚠️  检测到中断信号，正在清理..."));
      dockerComposeUp.kill("SIGTERM");
      setTimeout(() => {
        dockerComposeUp.kill("SIGKILL");
        process.exit(0);
      }, 5000);
    });
  }

  if (runOption === "manual") {
    console.log(
      "Please go into the ./next folder and run `npm install && npm run dev`."
    );
    console.log(
      "Please also go into the ./platform folder and run `poetry install && poetry run python -m reworkd_platform`."
    );
    console.log(
      "Please use or update the MySQL database configuration in the env file(s)."
    );
  }
};

printTitle();

if (doesEnvFileExist()) {
  handleExistingEnv();
} else {
  handleNewEnv();
}
