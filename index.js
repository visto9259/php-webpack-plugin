/**
 *
 */

class PhpWebpackPlugin {
    constructor(options) {
        options = options || {};
        this.options = {
            filename: options.filename || 'scriptlist.php',
            keyname: options.keyname || 'entry_point_map',
            entryPoint: options.entryPoint || null,
        };
        this.filename = options.filename || 'scriptlist.php';
        this.keyname = options.keyname || 'entry_point_map';
        this.entryPoint = options.entryPoint || null;
    }

    apply(compiler) {

        const options = this.options;
        compiler.hooks.emit.tap('MyPlugin', (compilation) => {
            // Start building file
            let filelist = '<?php\n';
            filelist += 'return [\n';
            filelist += `\t'${this.keyname}' => [\n`;

            const chunkGroups = compilation.chunkGroups;
            chunkGroups.map(chunk =>{
                if (chunk.options.name) {
                    console.debug('Chunk: '+chunk.options.name);
                    filelist += `\t\t'${chunk.options.name}' => [\n`;
                    const chunks = chunk.chunks;
                    chunks.map(childChunk => {
                        filelist += `\t\t\t'${childChunk.files.join("', '")}',\n`;
                    });
                    filelist += `\t\t],\n`;
                }
            });

            filelist += '\t],\n];';
            compilation.assets[this.filename] = {
                source: function () {
                    return filelist;
                },
                size: function () {
                    return filelist.length;
                }
            };
        });

        compiler.hooks.afterEmit.tap("LaminasMvcViewPlugin", (compilation,done) => {
            const stats = compilation.getStats().toJson();
            const {assetsByChunkName, entrypoints} = stats;
            const entryPoint = options.entryPoint;
        });
    }
}

module.exports = PhpWebpackPlugin;