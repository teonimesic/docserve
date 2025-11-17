#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const packageJson = require('../package.json');
const version = packageJson.version;

// Determine platform and architecture
const platform = process.platform;
const arch = process.arch;

// Map Node platform/arch to release asset names
function getBinaryName() {
  const ext = platform === 'win32' ? '.exe' : '';

  if (platform === 'darwin' && arch === 'x64') {
    return `docserve-darwin-x64${ext}`;
  } else if (platform === 'darwin' && arch === 'arm64') {
    return `docserve-darwin-arm64${ext}`;
  } else if (platform === 'linux' && arch === 'x64') {
    return `docserve-linux-x64${ext}`;
  } else if (platform === 'linux' && arch === 'arm64') {
    return `docserve-linux-arm64${ext}`;
  } else if (platform === 'win32' && arch === 'x64') {
    return `docserve-windows-x64${ext}`;
  } else {
    throw new Error(`Unsupported platform: ${platform}-${arch}`);
  }
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function install() {
  try {
    const binaryName = getBinaryName();
    const ext = platform === 'win32' ? '.zip' : '.tar.gz';
    const archiveName = `${binaryName}${ext}`;
    const url = `https://github.com/teonimesic/docserve/releases/download/v${version}/${archiveName}`;

    console.log(`Downloading docserve v${version} for ${platform}-${arch}...`);
    console.log(`URL: ${url}`);

    const tmpDir = path.join(__dirname, '..', 'tmp');
    const binDir = path.join(__dirname, '..', 'bin');

    // Create directories
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    if (!fs.existsSync(binDir)) {
      fs.mkdirSync(binDir, { recursive: true });
    }

    const archivePath = path.join(tmpDir, archiveName);

    // Download archive
    await download(url, archivePath);
    console.log('Download complete. Extracting...');

    // Extract archive
    if (platform === 'win32') {
      // Windows - unzip
      execSync(`tar -xf "${archivePath}" -C "${binDir}"`, { stdio: 'inherit' });
    } else {
      // Unix - tar
      execSync(`tar -xzf "${archivePath}" -C "${binDir}"`, { stdio: 'inherit' });
    }

    // Make executable (Unix only)
    if (platform !== 'win32') {
      const binaryPath = path.join(binDir, binaryName);
      fs.chmodSync(binaryPath, 0o755);

      // Create symlink without extension
      const symlinkPath = path.join(binDir, 'docserve');
      if (fs.existsSync(symlinkPath)) {
        fs.unlinkSync(symlinkPath);
      }
      fs.symlinkSync(binaryName, symlinkPath);
    }

    // Cleanup
    fs.rmSync(tmpDir, { recursive: true, force: true });

    console.log('docserve installed successfully!');
    console.log('Run `docserve --version` to verify installation.');
  } catch (error) {
    console.error('Installation failed:', error.message);
    console.error('\nYou can manually download the binary from:');
    console.error(`https://github.com/teonimesic/docserve/releases/tag/v${version}`);
    process.exit(1);
  }
}

install();
