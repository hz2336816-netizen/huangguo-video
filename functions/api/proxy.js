export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // 获取前端传过来的目标地址
  const targetUrl = url.searchParams.get('url') || 'https://huangguoai.com/';

  const modifiedHeaders = new Headers(request.headers);
  modifiedHeaders.delete('host');
  modifiedHeaders.set('Origin', 'https://huangguoai.com');
  modifiedHeaders.set('Referer', 'https://huangguoai.com/');

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: modifiedHeaders,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
    });

    const newHeaders = new Headers(response.headers);
    newHeaders.set('Access-Control-Allow-Origin', '*');
    newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    newHeaders.set('Access-Control-Allow-Headers', '*');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
