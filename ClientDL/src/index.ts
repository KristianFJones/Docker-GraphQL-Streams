import gql from 'graphql-tag';
import { decompress } from 'iltorb';
import { extract } from 'tar-fs-fixed';
import { client, createContainer, startContainer, removeContainer } from './Docker';

const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const controllerGit = 'https://github.com/Auto-Systems/vCenter-Controller.git';
const folder = controllerGit.replace(/.*\/(\w.*).git/, '$1');

async function startClientDL(): Promise<void> {
  // const successfulPull = await pullImage('docker.pkg.github.com/kristianfjones/auto-deploy/moduledl')
  // console.log('Pull Successful: ', successfulPull)
  const container = await createContainer(
    'docker.pkg.github.com/kristianfjones/auto-deploy/moduledl',
    [{ key: 'TYPE', value: folder }, { key: 'GIT_URL', value: controllerGit }]
  );

  await startContainer(container.id);

  await timeout(25000);

  const tarStream = extract('tmp');

  client
    .subscribe<{ containerFiles: string }>({
      query: gql`subscription { containerFiles(containerId: "${container.id}", path: "/${folder}") }`
    })
    .subscribe({
      async next({ data: { containerFiles } }) {
        try {
          const buffer = await decompress(Buffer.from(containerFiles, 'hex'));
          tarStream.write(buffer);
        } catch {}
      },
      async complete() {
        tarStream.end();
        console.log('Done');
        await removeContainer(container.id)
        process.exit(0)
      }
    });
}

startClientDL();
