import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLanguage(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (extension) {
    const languageMap: { [key: string]: string } = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      py: 'python',
      java: 'java',
      c: 'c',
      cpp: 'cpp',
      cs: 'csharp',
      go: 'go',
      html: 'html',
      css: 'css',
      scss: 'scss',
      sql: 'sql',
      rb: 'ruby',
      php: 'php',
      swift: 'swift',
      kt: 'kotlin',
      rs: 'rust',
      md: 'markdown',
    };
    return languageMap[extension] || 'plaintext';
  }
  return 'plaintext';
}
