#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class RealtimeSync {
  constructor() {
    this.isRunning = false;
    this.lastSync = null;
    this.syncInterval = 30000; // 30 seconds
    this.watchPaths = [
      'src/',
      'components/',
      'pages/',
      'lib/',
      'types/',
      'hooks/',
      'services/',
      'data/'
    ];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '📡',
      success: '✅',
      error: '❌',
      warning: '⚠️'
    }[type] || '📡';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async executeCommand(command, options = {}) {
    try {
      const result = execSync(command, { 
        encoding: 'utf8', 
        cwd: process.cwd(),
        ...options 
      });
      return { success: true, output: result };
    } catch (error) {
      return { success: false, error: error.message, output: error.stdout };
    }
  }

  async syncWithRemote() {
    this.log('Starting sync with remote repository...');
    
    // Fetch latest changes
    const fetchResult = await this.executeCommand('git fetch origin');
    if (!fetchResult.success) {
      this.log(`Failed to fetch: ${fetchResult.error}`, 'error');
      return false;
    }

    // Check if there are any local changes
    const statusResult = await this.executeCommand('git status --porcelain');
    const hasLocalChanges = statusResult.output.trim().length > 0;

    if (hasLocalChanges) {
      this.log('Local changes detected, committing...');
      
      // Add all changes
      const addResult = await this.executeCommand('git add .');
      if (!addResult.success) {
        this.log(`Failed to add changes: ${addResult.error}`, 'error');
        return false;
      }

      // Commit changes
      const commitMessage = `Auto-sync: ${new Date().toISOString()}`;
      const commitResult = await this.executeCommand(`git commit -m "${commitMessage}"`);
      if (!commitResult.success) {
        this.log(`Failed to commit: ${commitResult.error}`, 'error');
        return false;
      }
    }

    // Pull latest changes
    const pullResult = await this.executeCommand('git pull origin main');
    if (!pullResult.success) {
      this.log(`Failed to pull: ${pullResult.error}`, 'error');
      return false;
    }

    // Push local changes if any
    if (hasLocalChanges) {
      const pushResult = await this.executeCommand('git push origin main');
      if (!pushResult.success) {
        this.log(`Failed to push: ${pushResult.error}`, 'error');
        return false;
      }
    }

    this.lastSync = new Date();
    this.log('Sync completed successfully!', 'success');
    return true;
  }

  setupFileWatcher() {
    this.log('Setting up file watcher...');
    
    this.watchPaths.forEach(watchPath => {
      if (fs.existsSync(watchPath)) {
        fs.watch(watchPath, { recursive: true }, (eventType, filename) => {
          if (filename && !filename.includes('node_modules') && !filename.includes('.git')) {
            this.log(`File changed: ${filename}`);
            // Debounce sync to avoid multiple rapid syncs
            clearTimeout(this.syncTimeout);
            this.syncTimeout = setTimeout(() => {
              this.syncWithRemote();
            }, 5000); // Wait 5 seconds after last change
          }
        });
        this.log(`Watching: ${watchPath}`, 'success');
      }
    });
  }

  async start() {
    if (this.isRunning) {
      this.log('Sync is already running', 'warning');
      return;
    }

    this.isRunning = true;
    this.log('🚀 Starting real-time sync...');

    // Initial sync
    await this.syncWithRemote();

    // Setup file watcher
    this.setupFileWatcher();

    // Periodic sync as backup
    this.syncTimer = setInterval(async () => {
      await this.syncWithRemote();
    }, this.syncInterval);

    this.log('Real-time sync is now active!', 'success');
    this.log(`Sync interval: ${this.syncInterval / 1000} seconds`);
    this.log('Press Ctrl+C to stop');

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      this.stop();
    });
  }

  stop() {
    if (!this.isRunning) return;

    this.log('Stopping real-time sync...');
    this.isRunning = false;
    
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
    
    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout);
    }

    this.log('Real-time sync stopped', 'success');
    process.exit(0);
  }
}

// Start the sync if this file is run directly
if (require.main === module) {
  const sync = new RealtimeSync();
  sync.start();
}

module.exports = RealtimeSync;
