import dotenv from 'dotenv';
import commandLineArgs from 'command-line-args';


// Setup command line options
let options: any = {};
try{
    options = commandLineArgs([
        {
            name: 'env',
            alias: 'e',
            defaultValue: 'production',
            type: String,
        },
    ]);
} catch(e) {
    options.env = "test";
}


// Set the env file
if(process.env.NODE_ENV !== "production"){
    const result2 = dotenv.config({
        path: `./env/${options.env}.env`,
    });
    if (result2.error) {
        throw result2.error;
    }
}



