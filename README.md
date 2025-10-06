GitMCP Updater
==============

A simple VS Code extension to quickly add GitMCP server configurations to a local mcp.json file based on a GitHub repository URL.

> **Note:** This is a small project built to test and explore the experience of AI-assisted pair programming and "vibe coding".

Features
--------

*   Prompts for a GitHub repository URL.
    
*   Automatically generates the corresponding GitMCP server URL (e.g., https://gitmcp.io/owner/repo).
    
*   Adds or updates an entry in the mcp.json file located in your workspace root.
    
*   Creates mcp.json if it doesn't exist.
    

How to Use
----------

1.  Open a project folder in VS Code that contains (or where you want to create) your mcp.json file.
    
2.  Open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P).
    
3.  Type GitMCP and select the command **"GitMCP: Update mcp.json from GitHub URL"**.
    
4.  Enter the full GitHub repository URL when prompted.
    
5.  The mcp.json file will be created or updated automatically.
