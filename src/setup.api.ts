import 'tsconfig-paths/register';
import { exec } from 'child_process';
const setup = async () => {
    try {
        console.log(1);
        const scriptName = 'seed:test-db';
        exec(`npm run ${scriptName}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing script: ${error}`);
                return;
            }
            console.log('after seed');
            console.log('Script output:');
            console.log(stdout);
            if (stderr) {
                console.error('Script errors:');
                console.error(stderr);
            }
        });
    } catch (err) {
        console.log(err);
    }
};

export default setup;
