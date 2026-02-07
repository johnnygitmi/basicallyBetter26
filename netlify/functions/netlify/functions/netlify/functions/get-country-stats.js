const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const country = event.queryStringParameters?.country;

    if (country) {
      // Get top items for specific country
      const { data, error } = await supabase.rpc('get_country_rankings', {
        country_code: country
      });

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ country, rankings: data })
      };
    } else {
      // Get vote distribution by country
      const { data, error } = await supabase
        .from('votes')
        .select('user_country')
        .order('user_country');

      if (error) throw error;

      // Count votes per country
      const countryCounts = data.reduce((acc, vote) => {
        acc[vote.user_country] = (acc[vote.user_country] || 0) + 1;
        return acc;
      }, {});

      const countryStats = Object.entries(countryCounts)
        .map(([code, count]) => ({ country: code, votes: count }))
        .sort((a, b) => b.votes - a.votes);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ countries: countryStats })
      };
    }

  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
