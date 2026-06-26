import dotenv from 'dotenv';

dotenv.config();

let token: string | null = null;
let tokenExpiry = 0;

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error(
    'Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env'
  );
}

async function getToken() {
  if (token && Date.now() < tokenExpiry) {
    return token;
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!res.ok) {
    throw new Error(`Spotify authentication failed: ${res.status}`);
  }

  const data: any = await res.json();

  token = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

  return token;
}

export default () => {
  return async (ctx: any, next: any) => {
    if (ctx.path !== '/spotify-proxy') {
      return next();
    }

    try {
      const accessToken = await getToken();

      const endpoint = ctx.query.endpoint;

      if (!endpoint) {
        ctx.status = 400;
        ctx.body = { error: 'endpoint required' };
        return;
      }

      const res = await fetch(
        `https://api.spotify.com/v1/${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      ctx.status = res.status;
      ctx.body = await res.json();
    } catch (e: any) {
      ctx.status = 500;
      ctx.body = {
        error: e.message,
      };
    }
  };
};