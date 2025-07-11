import shell from "shelljs";
import chalk from "chalk";

console.log("🚀 Setting up SojuStack development environment...\n");

// Install dependencies
console.log("📦 Installing dependencies...");
if (shell.exec("pnpm -w install").code !== 0) {
  console.error("❌ Failed to install dependencies");
  shell.exit(1);
}

// Copy environment files
console.log("📝 Setting up environment files...");
shell.cp("-f", "./apps/api/.env.example", "./apps/api/.env");
shell.cp("-f", "./apps/web/.env.example", "./apps/web/.env");

// Check if docker is running
console.log("🐳 Checking Docker...");
if (!shell.which("docker")) {
  console.error("❌ Docker is not installed. Please install Docker first.");
  shell.exit(1);
}

if (shell.exec("docker info", { silent: true }).code !== 0) {
  console.error("❌ Docker is not running. Please start Docker first.");
  shell.exit(1);
}

// Run docker compose up in the background
console.log("🐳 Starting Docker services...");
shell.cd("./apps/api");
if (shell.exec("docker compose up -d").code !== 0) {
  console.error("❌ Failed to start Docker services");
  shell.exit(1);
}

// Wait for docker services to be ready
console.log("⏳ Waiting for services to be ready...");

function waitForService(
  service: string,
  port: number,
  maxAttempts = 30
): boolean {
  console.log(`   Checking ${service} on port ${port}...`);

  for (let i = 0; i < maxAttempts; i++) {
    if (shell.exec(`nc -z localhost ${port}`, { silent: true }).code === 0) {
      console.log(`   ✅ ${service} is ready`);
      return true;
    }
    shell.exec("sleep 2", { silent: true });
    process.stdout.write(".");
  }

  console.log(
    `\n   ❌ ${service} failed to start after ${maxAttempts * 2} seconds`
  );
  return false;
}

// Check if netcat is available, if not use a fallback method
if (!shell.which("nc")) {
  console.log("   📝 netcat not found, using fallback health checks...");

  // Fallback: check docker container health
  function waitForContainer(containerName: string): boolean {
    for (let i = 0; i < 30; i++) {
      const result = shell.exec(
        `docker compose ps --format json | grep ${containerName}`,
        { silent: true }
      );
      if (
        (result.code === 0 && result.stdout.includes('"Health":"healthy"')) ||
        result.stdout.includes('"State":"running"')
      ) {
        console.log(`   ✅ ${containerName} is ready`);
        return true;
      }
      shell.exec("sleep 2", { silent: true });
      process.stdout.write(".");
    }
    return false;
  }

  if (!waitForContainer("postgres") || !waitForContainer("redis")) {
    console.error("\n❌ Services failed to start properly");
    shell.exit(1);
  }
} else {
  // Use netcat to check ports
  if (!waitForService("PostgreSQL", 5432) || !waitForService("Redis", 6379)) {
    console.error("❌ Services failed to start properly");
    shell.exit(1);
  }
}

console.log("\n✅ All services are ready!");

// Go back to root directory
shell.cd("../..");

// Run db migrations
console.log("🗄️  Running database migrations...");
if (shell.exec("pnpm -C ./apps/api db:push").code !== 0) {
  console.error("❌ Failed to run database migrations");
  shell.exit(1);
}

console.log("✅ Setup completed successfully!");
console.log("\n🚀 Services are running on:");
console.log("   - Postgres: http://localhost:5432");
console.log("   - Redis: http://localhost:6379");
console.log("   - Mailpit: http://localhost:8025");
console.log("   - MinIO: http://localhost:9001\n");

// Run turbo dev
shell.exec("pnpm dev");
console.log(chalk.bgGreen("✅ Setup completed successfully!"));
console.log(
  chalk.bgGreen("❗ Run `pnpm dev` to start the development servers!")
);
