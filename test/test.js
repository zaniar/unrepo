// native
const assert = require('assert').strict;
const path = require('path');

// packages
const fs = require('fs-extra');
const dotenv = require('dotenv');
const glob = require('tiny-glob');

// local
const { createClone } = require('../');

dotenv.config();

const mainBranchFullOutput = new Map([
  ['README.md', 'unrepo test'],
  ['level1'],
  [path.join('level1', 'LEVEL1.md'), ''],
  [path.join('level1', 'level2')],
  [path.join('level1', 'level2', 'LEVEL2.md'), ''],
  [path.join('level1', 'level2', 'level3')],
  [path.join('level1', 'level2', 'level3', 'LEVEL3.md'), ''],
  [path.join('other')],
  [path.join('other', 'OTHER.md'), ''],
])

const mainBranchLevel1Output = new Map([
  [path.join('LEVEL1.md'), ''],
  [path.join('level2')],
  [path.join('level2', 'LEVEL2.md'), ''],
  [path.join('level2', 'level3')],
  [path.join('level2', 'level3', 'LEVEL3.md'), ''],
])

const mainBranchLevel2Output = new Map([
  [path.join('level2')],
  [path.join('level2', 'LEVEL2.md'), ''],
  [path.join('level2', 'level3')],
  [path.join('level2', 'level3', 'LEVEL3.md'), ''],
])

async function compare(dir, expected) {
  const files = await glob('**', { cwd: dir });

  assert.deepStrictEqual(files.sort(), [...expected.keys()].sort());

  const output = await Promise.all(
    files.map(async (file) => [
      file,
      fs.lstatSync(path.join(dir, file)).isDirectory() ? undefined : await fs.readFile(path.join(dir, file), 'utf8'),
    ])
  );

  assert.deepStrictEqual(new Map(output), expected);
}

beforeEach(async () => {
  await fs.remove('.output');
});

after(async () => {
  await fs.remove('.output');
});

describe('unrepo', function () {
  this.timeout(20000);

  describe('unrepo + github', () => {
    [
      'zaniar/unrepo-test',
      'github:zaniar/unrepo-test',
      'https://github.com/zaniar/unrepo-test',
      'git@github.com:zaniar/unrepo-test',
    ].forEach((repo) => {
      it(repo, async () => {
        await createClone(repo, '.output');

        await compare(
          '.output',
          mainBranchFullOutput
        );
      });
    });

    [
      'zaniar/unrepo-test//level1/',
      'github:zaniar/unrepo-test//level1/',
      'https://github.com/zaniar/unrepo-test//level1/',
      'git@github.com:zaniar/unrepo-test//level1/',
    ].forEach((repo) => {
      it(repo, async () => {
        await createClone(repo, '.output');

        await compare(
          '.output',
          mainBranchLevel1Output
        );
      });
    });

    // const branch = 'github:zaniar/unrepo-test#a-branch';

    // it(branch, async () => {
    //   await createClone(branch, '.output');

    //   await compare(
    //     '.output',
    //     mainBranchFullOutput
    //   );
    // });

    const private = 'github:zaniar/unrepo-test-private';

    it(private, async () => {
      await createClone(private, '.output');

      await compare(
        '.output',
        mainBranchFullOutput
      );
    });
  });

  describe('unrepo + gitlab', () => {
    [
      'gitlab:zaniar/unrepo-test',
      'https://gitlab.com/zaniar/unrepo-test',
      'git@gitlab.com:zaniar/unrepo-test',
    ].forEach((repo) => {
      it(repo, async () => {
        await createClone(repo, '.output');

        await compare(
          '.output',
          mainBranchFullOutput
        );
      });
    });

    // const branch = 'gitlab:zaniar/unrepo-test#a-branch';

    // it(branch, async () => {
    //   await createClone(branch, '.output');

    //   await compare(
    //     '.output',
    //     mainBranchFullOutput
    //   );
    // });

    [
      'gitlab:zaniar/unrepo-test//level1/',
      'https://gitlab.com/zaniar/unrepo-test//level1/',
      'git@gitlab.com:zaniar/unrepo-test//level1/',
    ].forEach((repo) => {
      it(repo, async () => {
        await createClone(repo, '.output');

        await compare(
          '.output',
          mainBranchLevel1Output
        );
      });
    });

    const private = 'gitlab:zaniar/unrepo-test-private';

    it(private, async () => {
      await createClone(private, '.output');

      await compare(
        '.output',
        mainBranchFullOutput
      );
    });
  });

  // describe('unrepo + bitbucket', () => {
  //   [
  //     'bitbucket:zaniar/unrepo-test',
  //     'https://bitbucket.org/zaniar/unrepo-test',
  //     'git@bitbucket.org:zaniar/unrepo-test',
  //   ].forEach((repo) => {
  //     it(repo, async () => {
  //       await createClone(repo, '.output');

  //       await compare(
  //         '.output',
  //         new Map([['index.txt', 'This is only a test.\n']])
  //       );
  //     });
  //   });

  //   const branch = 'bitbucket:zaniar/unrepo-test#a-branch';

  //   it(branch, async () => {
  //     await createClone(branch, '.output');

  //     await compare(
  //       '.output',
  //       new Map([['index.txt', 'This is only a test branch.\n']])
  //     );
  //   });

  //   const private = 'bitbucket:zaniar/unrepo-test-private';

  //   it(private, async () => {
  //     await createClone(private, '.output');

  //     await compare(
  //       '.output',
  //       new Map([['index.txt', 'This is only a private test.\n']])
  //     );
  //   });
  // });

  describe('unrepo + gist', () => {
    [
      'gist:rdmurphy/a331aa74143680d709faf3922b15c463',
      'https://gist.github.com/rdmurphy/a331aa74143680d709faf3922b15c463',
      'git@gist.github.com:rdmurphy/a331aa74143680d709faf3922b15c463',
    ].forEach((repo) => {
      it(repo, async () => {
        await createClone(repo, '.output');

        await compare(
          '.output',
          new Map([['index.txt', 'This is only a test.\n']])
        );
      });
    });

    const private = 'gist:zaniar/28bd7785994d005c669627d310db14b4';

    it(`${private} (private)`, async () => {
      await createClone(private, '.output');

      await compare(
        '.output',
        new Map([['unrepo-test-private.md', 'unrepo-test-private']])
      );
    });
  });
});
