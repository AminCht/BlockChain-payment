import 'tsconfig-paths/register';
import { execSync } from 'child_process';
const setup = async () => {
    try {
        console.log('before seed');
        const scriptName = 'seed:test-db';
        execSync(`npm run ${scriptName}`);
        console.log('after seed');}
    catch (err){
        console.log(err);
    }
};

export default setup;
