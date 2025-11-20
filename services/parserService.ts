import { RawComment } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const parseWeChatComments = (text: string): RawComment[] => {
  // Split by newline, trim whitespace, and filter out purely empty lines
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
  const comments: RawComment[] = [];

  // Heuristic: The format provided alternates between Name and Content.
  // Name
  // Content
  // Name
  // Content
  
  for (let i = 0; i < lines.length; i += 2) {
    // If we have an odd number of lines, the last one might be an ignored author or content,
    // but we need pairs to form a comment.
    if (i + 1 >= lines.length) break;

    const author = lines[i];
    const content = lines[i + 1];
    
    let isReply = false;
    let replyTo = undefined;

    // Check for "回复 [Name]：" pattern common in WeChat copy-pastes
    // We extract the metadata but KEEP the original content as requested by the user.
    const replyMatch = content.match(/^回复(.+?)[:：]\s*/);
    
    if (replyMatch) {
      isReply = true;
      replyTo = replyMatch[1];
    }

    comments.push({
      id: uuidv4(),
      author,
      content, // Keep the full content including "回复xxx："
      isReply,
      replyTo
    });
  }

  return comments;
};