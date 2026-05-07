import { NextRequest, NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const path = params.path.join('/');
  const targetUrl = `https://liveapi.astrocall.live/api/${path}${request.nextUrl.search}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'FingerPrintJsKey': request.headers.get('fingerprintjskey') || '',
        'Authorization': request.headers.get('authorization') || '',
        'Origin': request.headers.get('origin') || '',
        'Referer': request.headers.get('referer') || '',
      },
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, FingerPrintJsKey',
      },
    });
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const path = params.path.join('/');
  const targetUrl = `https://liveapi.astrocall.live/api/${path}`;

  try {
    const body = await request.text();

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'FingerPrintJsKey': request.headers.get('fingerprintjskey') || '',
        'Authorization': request.headers.get('authorization') || '',
        'Origin': request.headers.get('origin') || '',
        'Referer': request.headers.get('referer') || '',
      },
      body: body,
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, FingerPrintJsKey',
      },
    });
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const path = params.path.join('/');
  const targetUrl = `https://liveapi.astrocall.live/api/${path}`;

  try {
    const body = await request.text();

    const response = await fetch(targetUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'FingerPrintJsKey': request.headers.get('fingerprintjskey') || '',
        'Authorization': request.headers.get('authorization') || '',
        'Origin': request.headers.get('origin') || '',
        'Referer': request.headers.get('referer') || '',
      },
      body: body,
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, FingerPrintJsKey',
      },
    });
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const path = params.path.join('/');
  const targetUrl = `https://liveapi.astrocall.live/api/${path}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'FingerPrintJsKey': request.headers.get('fingerprintjskey') || '',
        'Authorization': request.headers.get('authorization') || '',
        'Origin': request.headers.get('origin') || '',
        'Referer': request.headers.get('referer') || '',
      },
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, FingerPrintJsKey',
      },
    });
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, FingerPrintJsKey',
    },
  });
}
