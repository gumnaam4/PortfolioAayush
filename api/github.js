// api/github.js — Serverless proxy for GitHub stats
// Deploy on Vercel (or Netlify Functions) to get higher rate limits.
// Set GITHUB_TOKEN as an environment variable in your hosting dashboard.
// Endpoint: GET /api/github?user=USERNAME

export default async function handler(req, res) {
  const username = req.query.user || 'gumnaam4';
  const token = process.env.GITHUB_TOKEN; // Never exposed to client

  const headers = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'PortfolioBot/1.0',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    // Fetch user profile
    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (!userRes.ok) throw new Error(`GitHub API: ${userRes.status}`);
    const user = await userRes.json();

    // Fetch repos for language stats and star count
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { headers }
    );
    const repos = await reposRes.json();

    // Aggregate language stats
    const langMap = {};
    let totalReposWithLang = 0;
    let totalStars = 0;
    for (const repo of repos) {
      if (repo.language) {
        langMap[repo.language] = (langMap[repo.language] || 0) + 1;
        totalReposWithLang++;
      }
      totalStars += repo.stargazers_count || 0;
    }

    const languages = Object.entries(langMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({
        name,
        count,
        percent: Math.round((count / totalReposWithLang) * 100),
      }));

    // Recent repos (top 5)
    const recentRepos = repos.slice(0, 5).map((r) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      stars: r.stargazers_count,
      language: r.language,
      updatedAt: r.updated_at,
    }));

    const result = {
      username: user.login,
      name: user.name,
      bio: user.bio,
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      totalStars,
      languages,
      recentRepos,
      avatarUrl: user.avatar_url,
      profileUrl: user.html_url,
      fetchedAt: new Date().toISOString(),
    };

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(result);
  } catch (err) {
    console.error('GitHub proxy error:', err.message);
    return res.status(502).json({ error: 'Failed to fetch GitHub data', detail: err.message });
  }
}
