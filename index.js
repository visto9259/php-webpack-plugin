/**
 *
 */

const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const PHPAssocArrayUtils = require('./lib/phpassocarrayutils');


class PhpWebpackPlugin {
    constructor(options) {
        options = options || {};
        this.options = {
            filename: options.filename || 'scriptlist.php',
            entryPoint: options.entryPoint,
        };
        if (!this.options.filename.endsWith('.php')) this.options.filename += '.php';
    }

    apply(compiler) {

        const options = this.options;
        const genPHPOutputAssocArray = (entryPoints=[]) => {
            let output = PHPAssocArrayUtils.phpHeader();
            output += PHPAssocArrayUtils.returnWithBracket(0);
            entryPoints.forEach(item => {
                const {name, chunks, assets} = item;
                output += PHPAssocArrayUtils.arrayKeyWithGT(name, 1);
                output += PHPAssocArrayUtils.openingBracket(0);
                chunks.forEach((chunk, key) => {
                    let asset;
                    // if Webpack 5, the asset is an object
                    if (assets[key] instanceof Object) {
                        if (assets[key].name) asset = path.join(compiler.options.output.publicPath, assets[key].name);
                        else console.error('Unsupported asset object');
                    }
                    // if Webpack 4, the asset is a string
                    else if (typeof assets[key] === 'string') asset = path.join(compiler.options.output.publicPath, assets[key]);
                    // if it changes again
                    else console.error('Unsupported asset object');
                    asset = asset.replace(/\\/gm,'/');
                    output += PHPAssocArrayUtils.arrayKeyWithGT(chunk, 2) + ` '${asset}',\n`
                });
                output += PHPAssocArrayUtils.closingBracket(1);
            });
            output += PHPAssocArrayUtils.closingBracket(0, true);
            return output;
        };

        const mkOutputDir = (dir) => {
            // Make webpack output directory if it doesn't already exist
            try {
                fs.mkdirSync(dir);
            } catch (err) {
                // If it does exist, don't worry unless there's another error
                if (err.code !== 'EEXIST') throw err;
            }
        };

        compiler.hooks.afterEmit.tap("LaminasMvcViewPlugin", (compilation,done) => {
            const stats = compilation.getStats().toJson();
            const {entrypoints} = stats;
            const entryPoint = options.entryPoint;
            let entryPointsArray  = [];
            if (!entryPoint) {
                    _.mapKeys(entrypoints, (value, key) => {
                        entryPointsArray.push({
                            name: key,
                            chunks: value.chunks,
                            assets: value.assets,
                        });
                    });
            } else {
                if (entrypoints[entryPoint]) {
                    entryPointsArray.push({
                        name: entryPoint,
                        chunks: entrypoints[entryPoint].chunks,
                        assets: entrypoints[entryPoint].assets,
                    });
                }
            }
            const output = genPHPOutputAssocArray(entryPointsArray);

            mkOutputDir(path.resolve(compiler.options.output.path));
            fs.writeFileSync(path.join(compiler.options.output.path, options.filename),output, done );
        });
    }
}

module.exports = PhpWebpackPlugin;