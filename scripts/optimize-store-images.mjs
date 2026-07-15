import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outputDirectory = path.resolve("public/images/store");
const widths = [1600, 1200, 800];
const images = [
  {
    input: "huixiang-store-and-trucks-original.jpg",
    outputPrefix: "huixiang-store-and-trucks"
  },
  {
    input: "huixiang-storefront-original.jpg",
    outputPrefix: "huixiang-storefront"
  }
];

await fs.mkdir(outputDirectory, { recursive: true });

for (const image of images) {
  const inputPath = path.join(outputDirectory, image.input);
  const inputMetadata = await sharp(inputPath).metadata();

  if (!inputMetadata.width || !inputMetadata.height) {
    throw new Error(`Unable to read dimensions for ${image.input}.`);
  }

  console.log(
    `${image.input}: source ${inputMetadata.width}x${inputMetadata.height}, ${inputMetadata.format}`
  );

  for (const width of widths) {
    const outputPath = path.join(outputDirectory, `${image.outputPrefix}-${width}.webp`);
    const result = await sharp(inputPath)
      .resize({
        width,
        fit: "inside",
        withoutEnlargement: true
      })
      .webp({
        quality: 85,
        effort: 4
      })
      .toFile(outputPath);

    console.log(
      `${path.basename(outputPath)}: ${result.width}x${result.height}, ${result.size} bytes`
    );
  }
}
