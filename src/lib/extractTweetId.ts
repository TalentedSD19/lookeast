export function extractTweetId(url: string): string | null {
  const match = url.match(/(?:twitter\.com|x\.com)\/\S+\/status\/(\d+)/);
  return match ? match[1] : null;
}
