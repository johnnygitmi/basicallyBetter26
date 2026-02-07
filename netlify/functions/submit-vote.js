const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { imageAId, imageBId, winnerId } = JSON.parse(event.body);

    // Validate input
    if (!imageAId || !imageBId || !winnerId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    if (winnerId !== imageAId && winnerId !== imageBId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Winner must be one of the presented images' })
      };
    }

    // Get country from Netlify's geolocation (via CloudFlare)
    const country = event.headers['x-country'] || 
                   context.geo?.country?.code || 
                   'XX'; // XX = unknown

    // Insert vote
    const { data, error } = await supabase
      .from('votes')
      .insert([
        {
          image_a_id: imageAId,
          image_b_id: imageBId,
          winner_id: winnerId,
          user_country: country
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Database error' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        vote: data[0],
        country: country 
      })
    };

  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
