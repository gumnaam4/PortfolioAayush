// api/leetcode.js — Serverless proxy for LeetCode stats
// Deploy on Vercel (or Netlify Functions) to bypass CORS.
// Endpoint: GET /api/leetcode?user=USERNAME

export default async function handler(req, res) {
  const username = req.query.user || 'gumnaam05';

  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          ranking
        }
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
        'User-Agent': 'Mozilla/5.0 (compatible; PortfolioBot/1.0)',
      },
      body: JSON.stringify({ query, variables: { username } }),
    });

    if (!response.ok) {
      throw new Error(`LeetCode API responded with ${response.status}`);
    }

    const data = await response.json();
    const user = data?.data?.matchedUser;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const acStats = user.submitStatsGlobal?.acSubmissionNum || [];
    const getCount = (diff) =>
      (acStats.find((s) => s.difficulty === diff) || {}).count || 0;

    const result = {
      username: user.username,
      ranking: user.profile?.ranking || null,
      totalSolved: getCount('All'),
      easySolved: getCount('Easy'),
      mediumSolved: getCount('Medium'),
      hardSolved: getCount('Hard'),
      fetchedAt: new Date().toISOString(),
    };

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(result);
  } catch (err) {
    console.error('LeetCode proxy error:', err.message);
    return res.status(502).json({ error: 'Failed to fetch LeetCode data', detail: err.message });
  }
}
