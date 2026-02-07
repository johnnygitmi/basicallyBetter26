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
    // Get total count of images
    const { count } = await supabase
      .from('images')
      .select('*', { count: 'exact', head: true });

    if (count < 2) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Not enough images in database' })
      };
    }

    // Get two random distinct images
    const randomOffset1 = Math.floor(Math.random() * count);
    let randomOffset2 = Math.floor(Math.random() * count);
    
    // Ensure different images
    while (randomOffset2 === randomOffset1) {
      randomOffset2 = Math.floor(Math.random() * count);
    }

    const { data: image1 } = await supabase
      .from('images')
      .select('*')
      .range(randomOffset1, randomOffset1)
      .single();

    const { data: image2 } = await supabase
      .from('images')
      .select('*')
      .range(randomOffset2, randomOffset2)
      .single();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        imageA: image1,
        imageB: image2
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
