#!/usr/bin/env node

// packages
import mri from 'mri';
import { name, version } from '../package.json';

// local
import { createClone } from '.';

async function main(argv_: string[]) {
  const { _, ...flags } = mri(argv_.slice(2));

  const force = flags.force;

  // we only care about the first command, anything else is whatever
  const [repoPath, dest = process.cwd()] = _;

  if (!repoPath) {
    console.log(`${name} v${version}`);
    console.log(`Usage: ${name} <repository> [destination]`);
    console.log('');
    console.log('Flags:');
    console.log(' --force               overwrite existing destination directory');
    console.log('');
    console.log('Examples:');
    console.log(` ${name} github:user/repository`);
    console.log(` ${name} github:user/repository//subdirectory/file`);
    console.log(` ${name} gitlab:group/subgroup/repository//subdirectory/`);
    console.log(` ${name} gitlab:user/repository#branch`);
    console.log('');

    return;
  }

  await createClone(repoPath, dest, { force });
}

main(process.argv).catch(console.error);
