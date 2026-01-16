import { execSync } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  const commitId = execSync('git rev-parse --short HEAD').toString().trim();
  const content = JSON.stringify({ commitId }, null, 2);
  const targetDir = join(__dirname, '..', 'lib');
  const targetFile = join(targetDir, 'version.json');

  mkdirSync(targetDir, { recursive: true });
  writeFileSync(targetFile, content);
  console.log(`Successfully generated version.json with commitId: ${commitId}`);
} catch (error) {
  console.error('Failed to generate version.json:', error.message);
  process.exit(1);
}
