import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import type { City } from '../types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');

async function main() {
  try {
    // Create cities directory if it doesn't exist
    const citiesDir = join(projectRoot, 'src', 'data', 'cities');
    await mkdir(citiesDir, { recursive: true });

    // Read the original cities.ts file
    const citiesContent = await readFile(join(projectRoot, 'src', 'data', 'cities.ts'), 'utf-8');

    // Extract the cities object from the file content using a more robust regex
    const citiesMatch = citiesContent.match(/export\s+const\s+cities\s*=\s*({[\s\S]*?})\s*(?:as\s+const\s*)?;/);
    if (!citiesMatch) {
      throw new Error('Could not find cities object in cities.ts');
    }

    let citiesObject;
    try {
      // Use Function constructor instead of eval for better ESM compatibility
      citiesObject = new Function(`
        return ${citiesMatch[1].replace(/as\s+const/g, '')};
      `)();
    } catch (error) {
      console.error('Error parsing cities object:', error);
      throw new Error('Failed to parse cities object');
    }

    // Create individual city files
    for (const [cityKey, cityData] of Object.entries(citiesObject)) {
      const cityContent = `import type { City } from '../../types';

/**
 * Tourist information for ${(cityData as City).name}, ${(cityData as City).country}
 * @remarks This file was automatically generated from the original cities.ts
 */
export const ${cityKey}: City = ${JSON.stringify(cityData, null, 2)} as const;
`;

      await writeFile(join(citiesDir, `${cityKey}.ts`), cityContent);
      console.log(`Created ${cityKey}.ts`);
    }

    // Create new cities.ts file that imports all city files
    const cityImports = Object.keys(citiesObject)
      .map(cityKey => `import { ${cityKey} } from './cities/${cityKey}';`)
      .join('\n');

    const newCitiesContent = `import type { City } from '../types';

${cityImports}

/**
 * Collection of all available cities and their tourist information
 * @type {Record<string, City>}
 */
export const cities = {
  ${Object.keys(citiesObject).join(',\n  ')}
} as const;

/**
 * Type representing all available city keys
 */
export type CityKey = keyof typeof cities;
`;

    await writeFile(join(projectRoot, 'src', 'data', 'cities.ts'), newCitiesContent);
    console.log('Updated cities.ts');

  } catch (error) {
    console.error('Error processing cities:', error);
    process.exit(1);
  }
}

main();