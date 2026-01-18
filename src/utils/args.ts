export function parseArgs(): { vaultPath: string } {
  const args = process.argv.slice(2);
  let vaultPath = "";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--vault" && args[i + 1]) {
      vaultPath = args[i + 1];
      break;
    }
  }

  if (!vaultPath) {
    console.error("错误: 请使用 --vault 参数指定 Obsidian 笔记库路径");
    console.error('用法: node dist/index.js --vault "/path/to/your/vault"');
    process.exit(1);
  }

  return { vaultPath };
}
