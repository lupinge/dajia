<?php

// All Deployer recipes are based on `recipe/common.php`.
require 'recipe/common.php';

// Define a server for deployment.
// Let's name it "prod" and use port 8022.
server('prod', '182.92.114.82', 8022)
    ->user('deploy')
    ->identityFile() // You can use identity key, ssh config, or username/password to auth on the server.
    ->stage('production')
    ->env('deploy_path', '/mnt/data/wwwroot/h5.dajia365.com') // Define the base path to deploy your project to.
    ->env('branch', 'online')
    ->env('config_type', 'online');

// Define a server for deployment.
// Let's name it "test" and use port 22.
server('test', '192.168.1.119', 22)
    ->user('deploy')
    ->identityFile() // You can use identity key, ssh config, or username/password to auth on the server.
    ->stage('test')
    ->env('deploy_path', '/deploy/dajia/h5') // Define the base path to deploy your project to.
    ->env('branch', 'master')
    ->env('config_type', 'test');

// Specify the repository from which to download your project's code.
// The server needs to have git installed for this to work.
// If you're not using a forward agent, then the server has to be able to clone
// your project from this repository.
set('repository', 'https://git.youwei.me/frontend/dajia365-h5.git');

// npm shared files
set('shared_dirs', ['node_modules']);

// Init grunt enviroment.
task('deploy:init-grunt', function () {
    within("{{release_path}}", function() {
        run('git submodule init');
        run('git submodule update');
        run('nvm use system && grunt');
    });
})->desc('Init grunt enviroment');

/**
 * Create symlinks for config file.
 */
task('deploy:symlink_config', function () {
    within("{{release_path}}", function() {
        run('ln -fs config_{{config_type}}.js src/hybrid/common/config.js');
    });
})->desc('Creating symlinks for config file');

after('rollback', 'deploy:init-grunt');

task('deploy', [
    'deploy:prepare',
    'deploy:release',
    'deploy:update_code',
    'deploy:shared',
    'deploy:writable',
    'deploy:symlink',
    'deploy:symlink_config',
    'deploy:init-grunt',
    'cleanup'
])->desc('Deploy dajia365-h5 project');

after('deploy', 'success');
