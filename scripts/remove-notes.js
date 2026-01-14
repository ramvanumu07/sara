/**
 * Script to remove 'notes' field from curriculum.js
 * This helps reduce bundle size
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const curriculumPath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'curriculum.js')

// Read the curriculum file
let content = fs.readFileSync(curriculumPath, 'utf-8')
const originalSize = content.length

// Find and remove notes fields with backtick strings
// We need to handle nested backticks properly
function removeNotesFields(content) {
  let result = ''
  let i = 0

  while (i < content.length) {
    // Look for 'notes:' followed by whitespace and backtick
    const notesMatch = content.substring(i).match(/^notes:\s*`/)

    if (notesMatch && content.substring(i).startsWith(notesMatch[0])) {
      // Found a notes field, skip it
      i += notesMatch[0].length // Skip 'notes: `'

      // Find the closing backtick
      let depth = 0
      let foundEnd = false

      while (i < content.length && !foundEnd) {
        if (content[i] === '\\' && i + 1 < content.length) {
          // Skip escaped character
          i += 2
          continue
        }

        if (content[i] === '`') {
          // Check if this is the end of the template literal
          // It's the end if we're not inside a ${...}
          if (depth === 0) {
            foundEnd = true
            i++ // Skip the closing backtick

            // Skip trailing comma
            if (content[i] === ',') {
              i++
            }
            // Keep the newline but add proper formatting
            result = result.trimEnd() + '\n            '
          } else {
            i++
          }
        } else if (content[i] === '$' && content[i + 1] === '{') {
          depth++
          i += 2
        } else if (content[i] === '}' && depth > 0) {
          depth--
          i++
        } else {
          i++
        }
      }

      // Don't add the notes field to result
      continue
    }

    result += content[i]
    i++
  }

  return result
}

const newContent = removeNotesFields(content)

// Write back to file
fs.writeFileSync(curriculumPath, newContent)

console.log('✅ Removed all notes fields from curriculum.js')
console.log(`   Original size: ${(originalSize / 1024).toFixed(1)} KB`)
console.log(`   New size: ${(newContent.length / 1024).toFixed(1)} KB`)
console.log(`   Reduction: ${((1 - newContent.length / originalSize) * 100).toFixed(1)}%`)
