// /netlify/functions/download.js  (Netlify)
// Uses RapidAPI: social-download-all-in-one (autolink)
// Expects env var: RAPIDAPI_KEY

export const handler = async (event) => {
  try {
    const params = event.queryStringParameters || {};
    const url = params.url;

    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing video URL ?url=' }),
      };
    }

    const apiRes = await fetch('https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'social-download-all-in-one.p.rapidapi.com'
      },
      body: JSON.stringify({ url })
    });

    const data = await apiRes.json();

    let normalized = data;
    if (!normalized.medias && Array.isArray(data.links)) {
      normalized = {
        title: data.title || '',
        picture: data.picture || '',
        duration: data.duration || '',
        medias: data.links
      };
    }

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(normalized),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', details: err.message }),
    };
  }
};
