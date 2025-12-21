import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { rcedit } from 'rcedit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json
const packageJsonPath = path.resolve(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const { version } = packageJson;

const defaultExePath = path.resolve(__dirname, '../bin/cloudsqlctl.exe');
const targetArg = process.argv[2];
const exePath = targetArg ? path.resolve(process.cwd(), targetArg) : defaultExePath;

const iconPath = path.resolve(__dirname, '../assets/logo.ico');

async function main() {
  // Icon is optional, but metadata is mandatory
  const hasIcon = fs.existsSync(iconPath);
  if (!hasIcon) {
    console.log(
      'No icon found at assets/logo.ico. Skipping icon update, but will update metadata.',
    );
  }

  if (!fs.existsSync(exePath)) {
    console.error(`Executable not found at ${exePath}`);
    process.exit(1);
  }

  console.log(`Updating executable metadata (Version: ${version})...`);

  const options = {
    'version-string': {
      CompanyName: 'Kinin Code',
      FileDescription: 'CloudSQLCTL - Google Cloud SQL Proxy Manager',
      FileVersion: version,
      InternalName: 'cloudsqlctl',
      LegalCopyright: 'Copyright (c) 2025 Kinin Code. All rights reserved.',
      OriginalFilename: 'cloudsqlctl.exe',
      ProductName: 'CloudSQLCTL',
      ProductVersion: version,
    },
    'file-version': version,
    'product-version': version,
  };

  if (hasIcon) {
    options.icon = iconPath;
  }

  try {
    await rcedit(exePath, options);
    console.log('Executable metadata updated successfully.');
  } catch (error) {
    console.error('Error updating executable resources:', error);
    process.exit(1);
  }
}

main();
