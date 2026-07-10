import sharp from "sharp";
import { readdirSync, statSync } from "fs";
import { join, extname } from "path";

const DIRS = ["src/assets", "public"];

async function optimizeFile(filePath) {
  const ext = extname(filePath).toLowerCase();
  const originalSize = statSync(filePath).size;
  
  try {
    if (ext === ".png") {
      await sharp(filePath)
        .png({ compressionLevel: 9, palette: true })
        .toFile(filePath + ".opt");
    } else if (ext === ".jpg" || ext === ".jpeg") {
      await sharp(filePath)
        .jpeg({ quality: 85, mozjpeg: true })
        .toFile(filePath + ".opt");
    } else {
      return; // skip other files
    }

    // Replace original with optimized
    const { copyFileSync, unlinkSync, renameSync } = await import("fs");
    unlinkSync(filePath);
    renameSync(filePath + ".opt", filePath);

    const newSize = statSync(filePath).size;
    const saved = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    console.log(`✅ ${filePath}: ${(originalSize / 1024).toFixed(1)}K → ${(newSize / 1024).toFixed(1)}K (${saved}% saved)`);
  } catch (err) {
    console.error(`❌ ${filePath}: ${err.message}`);
    // Clean up temp file if it exists
    try {
      const { unlinkSync } = await import("fs");
      unlinkSync(filePath + ".opt");
    } catch {}
  }
}

async function main() {
  const files = [];
  for (const dir of DIRS) {
    for (const file of readdirSync(dir)) {
      const ext = extname(file).toLowerCase();
      if ([".png", ".jpg", ".jpeg"].includes(ext)) {
        files.push(join(dir, file));
      }
    }
  }

  console.log(`Found ${files.length} images to optimize...\n`);
  
  for (const file of files) {
    await optimizeFile(file);
  }

  console.log("\n✨ All images optimized!");
}

main().catch(console.error);
