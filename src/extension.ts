import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// Simple version management without external dependencies
interface Version {
  major: number;
  minor: number;
  patch: number;
}

interface CommitMessage {
  version: Version;
  message: string;
  formatted: string;
}

class SimpleCommitverCore {
  private currentVersion: Version = { major: 1, minor: 0, patch: 0 };

  constructor() {
    this.loadCurrentVersion();
  }

  private loadCurrentVersion() {
    try {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (workspaceFolder) {
        const packageJsonPath = path.join(workspaceFolder.uri.fsPath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          const content = fs.readFileSync(packageJsonPath, 'utf-8');
          const packageJson = JSON.parse(content);
          const version = packageJson.version || '1.0.0';
          const match = version.match(/(\d+)\.(\d+)\.(\d+)/);
          if (match) {
            this.currentVersion = {
              major: parseInt(match[1]),
              minor: parseInt(match[2]),
              patch: parseInt(match[3])
            };
          }
        }
      }
    } catch (error) {
      console.log('Failed to load current version, using default');
    }
  }

  async processCommitMessage(message: string): Promise<CommitMessage> {
    // Increment patch version
    const newVersion = {
      ...this.currentVersion,
      patch: this.currentVersion.patch + 1
    };

    // Format version string
    const versionString = `v${newVersion.major}.${newVersion.minor}.${newVersion.patch}`;

    // Clean message
    const cleanMessage = message.replace(/^v?\d+\.\d+\.\d+\s*/, '').trim();

    // Create formatted commit message
    const formatted = cleanMessage 
      ? `${versionString} ${cleanMessage}`
      : `${versionString} Auto commit`;

    return {
      version: newVersion,
      message: cleanMessage || 'Auto commit',
      formatted
    };
  }

  async updatePackageVersion(workspacePath: string, version: Version): Promise<void> {
    try {
      const packageJsonPath = path.join(workspacePath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const content = fs.readFileSync(packageJsonPath, 'utf-8');
        const packageJson = JSON.parse(content);
        
        packageJson.version = `${version.major}.${version.minor}.${version.patch}`;
        
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      }
    } catch (error) {
      console.log('Failed to update package version:', error);
    }
  }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('COMMITVER extension is now active!');

    // Register quick commit command
    let disposable = vscode.commands.registerCommand('commitver.quickCommit', async () => {
        await quickCommitWithVersion();
    });

    context.subscriptions.push(disposable);
}

async function quickCommitWithVersion() {
    try {
        // Check if we're in a git repository
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }

        // Get commit message from user
        const message = await vscode.window.showInputBox({
            prompt: 'Enter commit message',
            placeHolder: 'Your commit message...'
        });

        if (!message) {
            vscode.window.showInformationMessage('Commit cancelled');
            return;
        }

        // Initialize simple core
        const core = new SimpleCommitverCore();
        
        // Process commit message with version
        const result = await core.processCommitMessage(message);

        // Show result to user
        const action = await vscode.window.showInformationMessage(
            `Commit with version: ${result.formatted}`,
            'Commit', 'Cancel'
        );

        if (action === 'Commit') {
            await executeGitCommit(workspaceFolder.uri.fsPath, result.formatted);
            
            // Update package.json
            await core.updatePackageVersion(workspaceFolder.uri.fsPath, result.version);
            
            vscode.window.showInformationMessage(
                `✅ Committed: ${result.formatted}\n✅ Package version updated: ${result.version.major}.${result.version.minor}.${result.version.patch}`
            );
        }

    } catch (error) {
        vscode.window.showErrorMessage(`Error: ${(error as Error).message}`);
    }
}

function findPackageJson(startDir: string): string | null {
    let currentDir = startDir;
    
    while (currentDir !== path.dirname(currentDir)) {
        const packageJsonPath = path.join(currentDir, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            return packageJsonPath;
        }
        currentDir = path.dirname(currentDir);
    }
    
    return null;
}

async function executeGitCommit(workspacePath: string, message: string): Promise<void> {
    const { exec } = require('child_process') as any;
    
    return new Promise((resolve, reject) => {
        exec('git add .', { cwd: workspacePath }, (error: any) => {
            if (error) {
                reject(error);
                return;
            }
            
            exec(`git commit -m "${message}"`, { cwd: workspacePath }, (error: any, stdout: any, stderr: any) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    });
}

export function deactivate() {
    console.log('COMMITVER extension deactivated');
}
