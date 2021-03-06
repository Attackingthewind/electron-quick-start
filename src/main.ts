import { app, BrowserWindow } from "electron";
import * as express from "express";
import * as http from "http";
import * as path from "path";
import { Environments } from "./enums/enums";

import { client } from 'electron-connect';

declare var __dirname: string;

// Save a reference to the window object, so that it's not garbage collected
let mainWindow: Electron.BrowserWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        height: 500,
        icon: path.join(__dirname, "src/assets/icon.icns"),
        minHeight: 400,
        minWidth: 410,
        width: 700,
        webPreferences: {
            nodeIntegration: true,
        }
    });

    if (process.env.NODE_ENV === Environments.Development) {
        mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
    } else {
        mainWindow.loadFile(path.join(__dirname, "../app/index.html"));
    }
    
    mainWindow.on("close", () => app.quit());
    if (process.env.NODE_ENV === Environments.Development) {
        mainWindow.webContents.openDevTools({ mode: "undocked" });
        if (process.env.DEVTOOLS_REACT_PATH) {
            BrowserWindow.addDevToolsExtension(process.env.DEVTOOLS_REACT_PATH);
        } else {
            BrowserWindow.removeDevToolsExtension("React Developer Tools");
        }
        if (process.env.DEVTOOLS_REDUX_PATH) {
            BrowserWindow.addDevToolsExtension(process.env.DEVTOOLS_REDUX_PATH);
        } else {
            BrowserWindow.removeDevToolsExtension("Redux DevTools");
        }
    }
}

app.on("ready", () => {
    createWindow();
    if (process.env.WATCH) {
        client.create(mainWindow);
    }
});

app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});