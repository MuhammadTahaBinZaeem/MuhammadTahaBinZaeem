import { writeFile } from 'node:fs/promises';
const owner = 'MuhammadTahaBinZaeem';
const repositories = [];
for (let page = 1; ; page++) {
  const response = await fetch(`https://api.github.com/users/${owner}/repos?per_page=100&sort=updated&page=${page}`, { headers: { 'User-Agent': 'Taha-portfolio-public-project-audit', Accept: 'application/vnd.github+json' } });
  if (!response.ok) throw new Error(`GitHub returned ${response.status}; existing snapshot is preserved.`);
  const batch = await response.json();
  repositories.push(...batch.map(repo => ({ name: repo.name, description: repo.description, url: repo.html_url, homepage: repo.homepage || null, fork: repo.fork, archived: repo.archived, language: repo.language, branch: repo.default_branch })));
  if (batch.length < 100) break;
}
const snapshot = { owner, checkedAt: new Date().toISOString(), repositories };
await writeFile(new URL('../web/app/github-repositories.json', import.meta.url), JSON.stringify(snapshot, null, 2) + '\n');
console.log(JSON.stringify(snapshot, null, 2));
