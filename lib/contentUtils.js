import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

/**
 * Read a single content file with frontmatter
 */
export function getContentFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const htmlContent = marked(content);
    
    return {
      frontmatter: data,
      content,
      html: htmlContent,
    };
  } catch (error) {
    console.error(`Error reading file ${fullPath}:`, error);
    return {
      frontmatter: {},
      content: '',
      html: '',
    };
  }
}

/**
 * Read all content files from a directory
 */
export function getContentFiles(dirPath, options = { featured: false }) {
  const fullPath = path.join(process.cwd(), dirPath);
  
  try {
    const fileNames = fs.readdirSync(fullPath);
    
    const allContent = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const id = fileName.replace(/\.md$/, '');
        const filePath = path.join(dirPath, fileName);
        const { frontmatter, content, html } = getContentFile(filePath);
        
        return {
          id,
          ...frontmatter,
          content,
          html
        };
      });
    
    // Filter for featured items if requested
    if (options.featured) {
      return allContent.filter(item => item.featured);
    }
    
    return allContent;
  } catch (error) {
    console.error(`Error reading directory ${fullPath}:`, error);
    return [];
  }
} 