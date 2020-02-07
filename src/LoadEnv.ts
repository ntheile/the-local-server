import dotenv from 'dotenv';
import commandLineArgs from 'command-line-args';

// Setup command line options
const options = commandLineArgs([
    {
        name: 'env',
        alias: 'e',
        defaultValue: 'production',
        type: String,
    },
]);

// Set the env file
try{
    const result2 = dotenv.config({
        path: `./env/${options.env}.env`,
    });
    if (result2.error) {
        throw result2.error;
    }
}
catch(e){
    console.log(`cannot find ./env/${options.env}.env`)
}

