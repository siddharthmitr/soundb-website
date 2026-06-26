let token: string | null = null;
let tokenExpiry = 0;

async function getToken() {
  if (token && Date.now() < tokenExpiry) return token;
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials&client_id=8c7d45a102d74b0ba0e0031c9e2b868e&client_secret=1233502ba22f46c0b5544a2d302e00b1',
  });
  const data: any = await res.json();
  token = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return token;
}

export default () => {
  return async (ctx: any, next: any) => {
    if (ctx.path !== '/spotify-proxy') return next();
    try {
      const accessToken = await getToken();
      const endpoint = ctx.query.endpoint;
      if (!endpoint) { ctx.status = 400; ctx.body = { error: 'endpoint required' }; return; }
      const res = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      ctx.body = await res.json();
    } catch(e: any) {
      ctx.status = 500;
      ctx.body = { error: e.message };
    }
  };
};