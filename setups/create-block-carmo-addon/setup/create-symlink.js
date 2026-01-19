#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createSymlink() {
  try {
    // Obter o diretório atual do plugin (onde está o package.json)
    const pluginDir = process.cwd();
    const pluginName = path.basename(pluginDir);

    console.log('\n🔗 Criar Symlink do Plugin\n');
    console.log(`Plugin: ${pluginName}`);
    console.log(`Diretório do plugin: ${pluginDir}\n`);

    // Perguntar o diretório de destino
    const targetDir = await question('📁 Digite o caminho completo do diretório WordPress (ex: /Users/carmo/Sites/meu-site/wp-content/plugins): ');

    if (!targetDir || !targetDir.trim()) {
      console.log('❌ Diretório não pode estar vazio!');
      rl.close();
      return;
    }

    const targetPath = path.resolve(targetDir.trim());
    const symlinkPath = path.join(targetPath, pluginName);

    // Verificar se o diretório de destino existe
    if (!fs.existsSync(targetPath)) {
      console.log(`❌ O diretório ${targetPath} não existe!`);
      rl.close();
      return;
    }

    // Verificar se já existe um symlink ou pasta com o mesmo nome
    if (fs.existsSync(symlinkPath)) {
      const stats = fs.lstatSync(symlinkPath);
      if (stats.isSymbolicLink()) {
        console.log(`⚠️  Já existe um symlink em ${symlinkPath}`);
        const overwrite = await question('Deseja substituir? (s/n): ');
        if (overwrite.toLowerCase() !== 's') {
          console.log('❌ Operação cancelada.');
          rl.close();
          return;
        }
        fs.unlinkSync(symlinkPath);
      } else {
        console.log(`❌ Já existe uma pasta/ficheiro em ${symlinkPath}`);
        console.log('❌ Não é possível criar o symlink. Por favor, remova ou renomeie primeiro.');
        rl.close();
        return;
      }
    }

    // Criar o symlink
    fs.symlinkSync(pluginDir, symlinkPath, 'dir');
    
    console.log('\n✅ Symlink criado com sucesso!');
    console.log(`   Origem: ${pluginDir}`);
    console.log(`   Destino: ${symlinkPath}\n`);

  } catch (error) {
    console.error('\n❌ Erro ao criar symlink:', error.message);
  } finally {
    rl.close();
  }
}

createSymlink();
