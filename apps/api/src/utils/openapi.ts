import openapiTS, { astToString, OpenAPI3 } from 'openapi-typescript';
import * as fs from 'node:fs/promises';
import * as fsSync from 'node:fs';
import { OpenAPIObject } from '@nestjs/swagger';
import chalk from 'chalk';

const DEFAULT_OUTPUT_DIR = './generated';
const DEFAULT_FILENAME = 'openapi.d.ts';

export async function generateOpenApiSpec(
  document: OpenAPI3 | OpenAPIObject,
  fileName: string = DEFAULT_FILENAME,
): Promise<void> {
  try {
    const filePath = `${DEFAULT_OUTPUT_DIR}/${fileName}`;
    console.log(chalk.blue('🔄 Generating OpenAPI types...'));

    // Generate new OpenAPI types content
    const ast = await openapiTS(document as OpenAPI3);
    const newContents = astToString(ast);

    // Check if content has changed
    const hasChanged = await hasContentChanged(filePath, newContents);

    if (!hasChanged) {
      console.log(chalk.green('✅ OpenAPI types are up to date'));
      return;
    }

    // Write the updated file
    await writeOpenApiFile(filePath, newContents);
    console.log(chalk.green('✅ OpenAPI types generated successfully'));
  } catch (error) {
    console.error(chalk.red('❌ Error generating OpenAPI types:'), error);
    throw error;
  }
}

async function hasContentChanged(
  filePath: string,
  newContents: string,
): Promise<boolean> {
  if (!fsSync.existsSync(filePath)) {
    return true;
  }

  try {
    const existingContents = await fs.readFile(filePath, 'utf8');
    return existingContents !== newContents;
  } catch {
    console.warn(
      chalk.yellow('⚠️  Could not read existing file, will create new one'),
    );
    return true;
  }
}

async function writeOpenApiFile(
  filePath: string,
  contents: string,
): Promise<void> {
  // Ensure directory exists
  await fs.mkdir(DEFAULT_OUTPUT_DIR, { recursive: true });

  // Write file
  await fs.writeFile(filePath, contents, 'utf8');
}
