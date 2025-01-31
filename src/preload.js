const { contextBridge, ipcRenderer } = require('electron')
const { deleteFile, deleteFolder } = require('./lib/filesystem/delete')
const fileTypes = require('./lib/filesystem/filesTypes')
const { isDirectory, isFileExists, readExistingProjects, readFolderContent, readFile } = require('./lib/filesystem/read')
const { editFile, newFile, newFolder } = require('./lib/filesystem/write')
const os = require('os');
const path = require("path");

const homedir = os.homedir()

contextBridge.exposeInMainWorld('darkMode', {
    toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
    get: () => ipcRenderer.invoke('dark-mode:get')
})

contextBridge.exposeInMainWorld('fs', {
    homeDir: homedir,
    fileTypes: fileTypes,
    isDirectory: (path) => {
        return isDirectory(path)
    },
    isFileExists: (path) => {
        return isFileExists(path)
    },
    deleteFile: (filePath) => {
        return deleteFile(filePath)
    },
    deleteFolder: (folderPath, recursive = false) => {
        return deleteFile(folderPath, recursive)
    },
    editFile: (filePath, newFileContent) => {
        editFile(filePath, newFileContent)
    },
    newFile: (filePath, fileContent) => {
        newFile(filePath, fileContent)
    },
    newFolder: (path) => {
        newFolder(path)
    },
    readExistingProjects: (homedir) => {
        return readExistingProjects(homedir)
    },
    readFolderContent: (path, files = []) => {
        return readFolderContent(path, files)
    },
    readFile: async (path) => {
        return readFile(path)
    }
})

if(!isDirectory(path.join(homedir + "/paxoProjects"))) {
    newFolder(path.join(homedir + "/paxoProjects"))
}

console.log('preload')
