export interface ApiFile {
  name: string
  path: string
  modified: number
  type: string
}

export interface FileTreeNode {
  name: string
  path: string
  isFolder: boolean
  children?: FileTreeNode[]
}

export function buildFileTree(files: ApiFile[]): FileTreeNode[] {
  const root: FileTreeNode = {
    name: '',
    path: '',
    isFolder: true,
    children: [],
  }

  for (const file of files) {
    const parts = file.path.split('/')
    let currentNode = root

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]!
      const isLastPart = i === parts.length - 1
      const pathSoFar = parts.slice(0, i + 1).join('/')

      if (!currentNode.children) {
        currentNode.children = []
      }

      let childNode = currentNode.children.find(child => child.name === part)

      if (!childNode) {
        const newNode: FileTreeNode = {
          name: part,
          path: pathSoFar,
          isFolder: !isLastPart,
          children: isLastPart ? undefined : [],
        }
        currentNode.children.push(newNode)
        childNode = newNode
      }

      if (!isLastPart) {
        currentNode = childNode
      }
    }
  }

  // Return sorted children of root
  return sortNodes(root.children || [])
}

function sortNodes(nodes: FileTreeNode[]): FileTreeNode[] {
  // Separate folders and files
  const folders = nodes.filter(n => n.isFolder)
  const files = nodes.filter(n => !n.isFolder)

  // Sort each group alphabetically
  folders.sort((a, b) => a.name.localeCompare(b.name))
  files.sort((a, b) => a.name.localeCompare(b.name))

  // Recursively sort children
  for (const folder of folders) {
    if (folder.children) {
      folder.children = sortNodes(folder.children)
    }
  }

  // Return folders first, then files
  return [...folders, ...files]
}
