import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    const url = new URL(request.url);
    const baseUrl = isProduction
      ? 'https://vicentinos-app.vercel.app'
      : `${url.protocol}//${url.host}`;

    // Full path to the favicon
    const faviconUrl = new URL('/favicon.ico', baseUrl).toString();

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundImage: 'linear-gradient(to bottom right, #EFF6FF, #FFFFFF)',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                backgroundColor: '#F97316',
                borderRadius: '50%',
                overflow: 'hidden',
                marginRight: '20px',
              }}
            >
              {/* Using the favicon with a fallback */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={faviconUrl} width="80" height="80" alt="Vicentinos Logo" />
            </div>
            <h1
              style={{
                fontSize: '60px',
                fontWeight: 'bold',
                color: '#1E40AF',
                margin: '0',
              }}
            >
              Vicentinos
            </h1>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '20px',
              backgroundColor: 'rgba(255,255,255,0.7)',
              padding: '30px',
              borderRadius: '16px',
              border: '4px solid #F97316',
              maxWidth: '90%',
            }}
          >
            <h2
              style={{
                fontSize: '40px',
                fontWeight: 'bold',
                color: '#1E40AF',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              Sua doação transforma vidas
            </h2>
            <p
              style={{
                fontSize: '30px',
                color: '#2563EB',
                textAlign: 'center',
                margin: 0,
              }}
            >
              Ajude-nos a ajudar quem mais precisa
            </p>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#F97316',
              padding: '12px 30px',
              borderRadius: '9999px',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '28px',
            }}
          >
            Paróquia Nossa Senhora da Conceição
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Error generating image', { status: 500 });
  }
}
