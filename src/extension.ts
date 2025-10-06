import * as vscode from 'vscode';
import { URL } from 'url';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('gitmcp.updateFile', async () => {
        
        // --- 1. Get the current workspace folder ---
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder is open. Please open a project to use this extension.');
            return;
        }
        // Use the first workspace folder as the root
        const workspaceRoot = workspaceFolders[0].uri;
        const mcpJsonUri = vscode.Uri.joinPath(workspaceRoot, 'mcp.json');

        // --- 2. Prompt the user for the GitHub URL ---
        const githubUrl = await vscode.window.showInputBox({
            prompt: 'Enter the full GitHub repository URL',
            placeHolder: 'https://github.com/owner/repository',
            validateInput: text => {
                try {
                    const url = new URL(text);
                    return url.hostname === 'github.com' ? null : 'Please enter a valid GitHub URL.';
                } catch (error) {
                    return 'Invalid URL format.';
                }
            }
        });

        if (!githubUrl) {
            // User cancelled the input box
            return;
        }

        try {
            // --- 3. Parse the URL and construct the GitMCP URL ---
            const parsedUrl = new URL(githubUrl);
            const pathParts = parsedUrl.pathname.substring(1).split('/');
            if (pathParts.length < 2) {
                throw new Error('URL does not contain an owner and repository.');
            }
            const owner = pathParts[0];
            let repoName = pathParts[1];

            // Remove .git suffix if present
            if (repoName.endsWith('.git')) {
                repoName = repoName.slice(0, -4);
            }
            
            const gitmcpUrl = `https://gitmcp.io/${owner}/${repoName}`;
            const serverName = `${owner}/${repoName}`;

            // --- 4. Read, update, and write mcp.json ---
            let mcpData: any = { mcpServers: {} };

            try {
                const fileContents = await vscode.workspace.fs.readFile(mcpJsonUri);
                const contentString = Buffer.from(fileContents).toString('utf8');
                if (contentString.trim()) {
                     mcpData = JSON.parse(contentString);
                }
            } catch (error) {
                // File doesn't exist or is empty, which is fine. We'll create it.
                // We check if the error is a FileNotFound error specifically.
                if (!(error instanceof vscode.FileSystemError && error.code === 'FileNotFound')) {
                    throw error; // Re-throw other errors (like permission denied)
                }
            }
            
            // Ensure the base structure exists
            if (!mcpData.mcpServers) {
                mcpData.mcpServers = {};
            }

            // Add or update the new server entry
            mcpData.mcpServers[serverName] = { url: gitmcpUrl };

            // Convert the object back to a pretty-printed JSON string
            const updatedContent = JSON.stringify(mcpData, null, 2);
            const writeData = Buffer.from(updatedContent, 'utf8');

            // Write the file
            await vscode.workspace.fs.writeFile(mcpJsonUri, writeData);

            vscode.window.showInformationMessage(`Successfully updated mcp.json with '${serverName}'!`);

        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred.';
            vscode.window.showErrorMessage(`Failed to update mcp.json: ${message}`);
        }
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
