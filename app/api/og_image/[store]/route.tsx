import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

type Params = {
  id: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: { store: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const image = searchParams.get('image');
  const storeName = searchParams.get('store');
  if (!storeName || !image) {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            backgroundColor: '#111518',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 300 300"
            >
              <g>
                <g>
                  <path
                    fill="#FFFFFF"
                    d="M227.2,37.6c-5.1-16.8-9.4-25.6-12.2-29.9c-0.5-0.8-1-1.3-1.4-1.8c-0.2-0.3-0.3-0.5-0.5-0.6
                c-0.4-0.4-0.6-0.6-0.9-0.8c-1.3,0.4-3.5,2-6.1,4.6c-0.4,0.4-0.8,0.8-1.2,1.2c-9.5,9.9-23.7,30.6-27.6,51.1v0
                c2.7,0.3,5.4,0.5,8,0.8c2.6,0.3,5.1,0.6,7.5,0.9c0.4,0,0.8,0.1,1.2,0.2v0c1.8-19.1,8.9-45.4,14.9-51.8c0.9-0.9,1.7-1.4,2.5-1.4
                c0.6,0,1.2,0.4,1.8,1.1c6.2,6.9,13.8,42.8,13.9,43.2c0.1,0.3,0,0.7-0.2,0.9c-0.1,0.2-0.4,0.4-0.7,0.4c-0.3,0.1-0.7,0-0.9-0.2
                c-0.2-0.1-0.3-0.3-0.4-0.6v0c-2.6-12.4-5.6-23.4-8.2-31.1c-0.2-0.5-0.3-0.9-0.5-1.3c-0.4-1.3-0.9-2.5-1.3-3.6
                c-0.3-0.7-0.5-1.3-0.8-1.9c-0.9-2.1-1.7-3.6-2.3-4.3c-0.1-0.1-0.2-0.2-0.3-0.3c-0.1,0-0.2-0.1-0.3-0.1c-0.3,0-0.7,0.3-1.1,0.7
                c-4,4.6-12.2,29.7-14,50.6v0c1.3,0.3,2.6,0.7,3.8,1.1c0.6,0.2,1.2,0.5,1.8,0.8c1.2,0.5,2.4,1.1,3.5,1.8c1.1,0.7,2.2,1.4,3.2,2.3
                c0.5,0.4,1,0.8,1.5,1.3c0.5,0.4,1,0.9,1.4,1.4c3.2,3.3,5.6,7.3,7.1,11.8L225,104c3.6-3.6,11.2-12.7,11.2-23.8
                C236.3,73.9,232.9,56.3,227.2,37.6z"
                  />
                  <path
                    fill="#FFFFFF"
                    d="M226.5,93.5c-0.2,0-0.3,0-0.5-0.1c-0.5-0.3-0.8-0.9-0.6-1.5c2-4.6,3.1-8.6,3.1-11.8c0-2.5-0.3-5.9-0.9-10.1
                c-0.1-0.6,0.3-1.2,1-1.3c0.7-0.1,1.2,0.3,1.3,1c0.6,4.3,0.9,7.8,0.9,10.4c0,3.5-1.1,7.8-3.3,12.7
                C227.4,93.3,226.9,93.5,226.5,93.5z"
                  />
                </g>
                <g>
                  <path
                    fill="#FFFFFF"
                    d="M95,10.3c-0.4-0.4-0.8-0.8-1.2-1.2c-2.6-2.6-4.8-4.2-6.1-4.6c-0.3,0.1-0.5,0.4-0.9,0.8
                c-0.2,0.2-0.4,0.4-0.5,0.6c-0.4,0.5-0.8,1-1.4,1.8c-2.8,4.3-7.1,13.1-12.2,29.9c-5.7,18.6-9,36.2-9,42.5
                c0,11.1,7.7,20.2,11.2,23.8l6.4-19.9c1.5-4.5,3.9-8.5,7.1-11.8c0.4-0.5,0.9-0.9,1.4-1.4s1-0.9,1.5-1.3c1-0.8,2-1.6,3.2-2.3
                c1.1-0.7,2.3-1.3,3.5-1.8c0.6-0.3,1.2-0.5,1.8-0.8c1.3-0.5,2.5-0.8,3.8-1.1v0c-1.8-20.9-10-46-14.1-50.6c-0.1-0.2-0.3-0.3-0.4-0.4
                c-0.3-0.2-0.5-0.3-0.7-0.3c-0.1,0-0.2,0.1-0.3,0.1c0,0.1-0.1,0.2-0.3,0.3c-0.6,0.7-1.4,2.1-2.3,4.3c-0.3,0.6-0.5,1.3-0.8,1.9
                c-0.3,0.8-0.5,1.5-0.8,2.3c-0.3,0.8-0.6,1.7-0.9,2.5c-2.6,7.7-5.6,18.7-8.2,31.1c-0.1,0.6-0.7,1-1.3,0.8c-0.3,0-0.5-0.2-0.7-0.4
                c-0.2-0.2-0.3-0.6-0.2-0.9c0.1-0.4,7.7-36.3,13.9-43.2c0.6-0.7,1.3-1.1,1.8-1.1c0.8,0,1.6,0.5,2.5,1.4c6,6.4,13,32.6,14.9,51.8v0
                c0.4,0,0.8-0.1,1.2-0.2c2.4-0.3,4.9-0.6,7.5-0.9c2.6-0.3,5.3-0.5,8-0.8v0C118.7,40.9,104.5,20.2,95,10.3z"
                  />
                  <path
                    fill="#FFFFFF"
                    d="M74.5,92c0.3,0.5,0,1.2-0.5,1.5c-0.2,0.1-0.3,0.1-0.5,0.1c-0.4,0-0.8-0.3-1-0.7c-2.2-4.9-3.3-9.2-3.3-12.7
                c0-2.6,0.3-6.1,0.9-10.4c0.1-0.6,0.6-1,1.3-1s1,0.6,1,1.3c-0.6,4.2-0.9,7.6-0.9,10.1C71.4,83.4,72.5,87.3,74.5,92z"
                  />
                </g>
                <path
                  fill="#F7E21A"
                  d="M150,202.1c-0.8,0-1.5,0-2.3,0v6.6c0,0.6,0.2,1.1,0.5,1.5c0.1,0.1,0.2,0.3,0.3,0.3c0.4,0.3,0.9,0.5,1.4,0.5
            s1-0.2,1.4-0.5c0.1-0.1,0.2-0.2,0.3-0.3c0.3-0.4,0.5-0.9,0.5-1.5V202C151.5,202.1,150.8,202.1,150,202.1z"
                />
                <g>
                  <path
                    fill="#F7E21A"
                    d="M158,218.7c-2-2-4.9-3.3-8-3.3c-3.1,0-5.9,1.3-8,3.3c-2,2-3.3,4.8-3.3,7.9c0,3.1,1.3,6,3.3,8
                c2,2,4.8,3.3,8,3.3c3.1,0,6-1.3,8-3.3c2-2,3.3-4.9,3.3-8C161.3,223.6,160,220.8,158,218.7z"
                  />
                  <polygon
                    fill="#F7E21A"
                    points="146.5,228.4 153.5,217.4 150.2,225.6 153.5,225 146.5,236 149.8,227.8 		"
                  />
                </g>
                <path
                  fill="#2FB3C0"
                  d="M143.3,208.6v-6.8c-6.4-0.5-12.4-1.7-17.9-3.5c-1.8-0.6-3.6-1.3-5.4-1.9l-2.3-0.4c-0.1,0-0.2,0-0.3,0
            c-0.5,0-0.9,0.3-1.1,0.4c-0.1,0-0.1,0.1-0.2,0.2c-0.2,0.3-0.4,0.6-0.4,1.1v2c0,2.4,1.3,4.5,3.2,5.6c0.7,0.4,1.4,0.6,2.2,0.8
            l6.9,1.3l6.9,1.3c2.9,0.5,5.8,0.9,8.7,1.1v0C143.3,209.4,143.3,209,143.3,208.6z"
                />
                <path
                  fill="#FFFFFF"
                  d="M88.6,248.5c-2,2.2-3.5,5-3.5,8.4c0,7.6,2.3,14.1,5.2,19.1c0.9-4.5,1.8-11.1,2.7-17.9c0.6-4.8,1.3-9.7,2-14.4
            C93.1,244.7,90.6,246.3,88.6,248.5z"
                />
                <path
                  fill="#FFFFFF"
                  d="M211.4,248.5c-2-2.2-4.5-3.7-6.5-4.8c0.8,4.7,1.4,9.7,2,14.4c1,6.9,1.8,13.4,2.7,17.9
            c2.9-5.1,5.2-11.5,5.2-19.1C214.9,253.4,213.4,250.6,211.4,248.5z"
                />
                <path
                  fill="#FFFFFF"
                  d="M212.3,287c-0.5-0.5-1.3-1-2.1-1.2c-0.5-0.1-1-0.4-1.5-0.8c-0.3-0.2-0.5-0.4-0.7-0.7c-0.7-0.7-1.3-1.6-1.6-2.6
            c0-0.2-0.1-0.3-0.2-0.5c-1.2-4.2-2.3-12.7-3.7-22.6c-1.7-12.7-3.7-27.1-6-33.2c-1.7-4.6-8.4-13.5-11.6-17.4
            c-1.5,1.3-3.2,2.1-5.1,2.5l-13.7,2.5c-2.2,0.4-4.4,0.7-6.6,0.9c0.5,0.3,1,0.8,1.3,1.2c3.1,2.9,5,6.9,5,11.5c0,1.6-0.3,3.2-0.7,4.7
            c-0.1,0.5-0.3,1-0.5,1.5c-0.8,1.9-2,3.6-3.4,5c-2.8,2.9-6.8,4.7-11.2,4.7c-4.3,0-8.3-1.8-11.2-4.7c-1.4-1.4-2.6-3.1-3.4-5
            c-0.3-0.5-0.4-1-0.5-1.5c-0.5-1.5-0.7-3.1-0.7-4.7c0-4.5,1.9-8.6,5-11.5c0.4-0.4,0.9-0.8,1.3-1.2c-2.2-0.2-4.4-0.5-6.6-0.9
            l-13.7-2.5c-1.9-0.3-3.7-1.2-5.1-2.5c-3.1,3.9-9.9,12.8-11.6,17.4c-2.3,6.1-4.3,20.5-6,33.2c-1.3,9.9-2.5,18.4-3.7,22.6
            c-0.1,0.2-0.1,0.3-0.2,0.5c-0.3,1-0.9,1.9-1.6,2.6c-0.2,0.3-0.5,0.5-0.7,0.7c-0.5,0.4-1,0.7-1.5,0.8c-0.8,0.2-1.5,0.6-2.1,1.2
            c-1,0.9-1.5,2.2-1.5,3.6c0,1.4,0.5,2.6,1.5,3.5c0.8,0.9,2.1,1.5,3.5,1.5c0.3,0,0.6,0,0.9-0.1v0c-0.9-1.4-1.4-3.1-1.4-4.8
            c0-0.7,0.4-1.4,0.9-1.7c0.3-0.2,0.8-0.3,1.2-0.3c0.5,0,0.8,0.1,1.2,0.3c0.5,0.3,0.9,1,0.9,1.7c0,1.4,0.6,2.7,1.5,3.6
            c0.9,0.9,2.2,1.5,3.6,1.5c1.4,0,2.7-0.6,3.6-1.5c0.9-0.9,1.5-2.2,1.5-3.6c0-1.3-0.5-2.5-1.3-3.4c-0.8-0.9-0.7-2.2,0.1-3
            c0.6-0.6,1.5-0.7,2.3-0.4c0.3,0.1,0.5,0.3,0.7,0.5c1.5,1.7,2.4,3.9,2.4,6.2c0,1-0.2,2-0.5,2.9c0.2,0.3,0.5,0.6,0.8,0.9
            c0.8,0.8,2.1,1.3,3.3,1.3c1.4,0,2.7-0.6,3.6-1.5c0.9-0.9,1.5-2.2,1.5-3.6c0-2.1-1.3-3.9-3.1-4.7c-0.6-0.3-1.3-0.4-2-0.4
            c-1.1,0-2.1-0.9-2.1-2.1c0-0.7,0.4-1.4,0.9-1.7c0.1-0.1,0.3-0.2,0.4-0.2c0.3-0.1,0.5-0.2,0.8-0.2h0.8c2.7-5.9,15-34,15-44.5
            c0-0.6,0.3-1.2,0.7-1.5c0.4-0.4,1-0.7,1.6-0.7c0.5,0,0.9,0.1,1.3,0.4c0.1,0,0.3,0.2,0.3,0.3c0.4,0.4,0.7,0.9,0.7,1.5
            c0,8.2-6.3,24.9-10.9,36.1c-1.2,2.9-2.3,5.5-3.2,7.4v0c-0.3,0.7-0.5,1.2-0.8,1.7c-0.1,0.3-0.2,0.5-0.3,0.7v0c0.5,0.3,1,0.7,1.5,1.2
            c1.4,1.3,2.3,3.1,2.6,5v0c0.6-0.3,1.2-0.7,1.7-1.1c0.5-0.4,1-0.8,1.4-1.1c-0.4-0.3-0.8-0.6-1-1c-0.9-1-1.5-2.2-1.5-3.5
            c0-0.6,0.2-1.1,0.6-1.5c0.2-0.2,0.4-0.3,0.7-0.5c0.3-0.1,0.5-0.2,0.8-0.2s0.6,0,0.8,0.2c0.3,0.1,0.5,0.3,0.7,0.5
            c0.4,0.4,0.6,0.9,0.6,1.5c0,1.3,3.6,3,9.7,4.1c3.7,0.7,8.2,1.1,13.6,1.1c5.3,0,9.9-0.4,13.6-1.1c6.1-1.1,9.7-2.8,9.7-4.1
            c0-0.6,0.2-1.1,0.6-1.5c0.2-0.2,0.4-0.3,0.7-0.5c0.3-0.1,0.5-0.2,0.8-0.2c0.3,0,0.5,0,0.8,0.2c0.3,0.1,0.5,0.3,0.7,0.5
            c0.4,0.4,0.6,0.9,0.6,1.5c0,1.3-0.5,2.5-1.5,3.5c-0.3,0.3-0.6,0.6-1,1c0.4,0.4,0.9,0.8,1.4,1.1c0.5,0.4,1.1,0.8,1.7,1.1v0
            c0.3-1.9,1.2-3.6,2.6-5c0.4-0.5,0.9-0.8,1.5-1.2v0c-0.1-0.2-0.2-0.5-0.3-0.7c-0.3-0.5-0.5-1-0.8-1.7v0c-0.9-1.9-2-4.5-3.2-7.4
            c-4.6-11.2-10.9-27.9-10.9-36.1c0-0.6,0.3-1.2,0.7-1.5c0.1-0.1,0.2-0.2,0.3-0.3c0.4-0.3,0.8-0.4,1.3-0.4c0.6,0,1.2,0.3,1.6,0.7
            c0.4,0.4,0.7,0.9,0.7,1.5c0,10.5,12.4,38.6,15,44.5h0.8c0.3,0,0.5,0,0.8,0.2c0.1,0,0.3,0.1,0.4,0.2c0.5,0.3,0.9,1,0.9,1.7
            c0,1.2-1,2.1-2.1,2.1c-0.7,0-1.4,0.1-2,0.4c-1.8,0.8-3.1,2.6-3.1,4.7c0,1.4,0.6,2.7,1.5,3.6c0.9,0.9,2.2,1.5,3.6,1.5
            c1.3,0,2.5-0.5,3.3-1.3c0.3-0.3,0.5-0.6,0.8-0.9c-0.3-0.9-0.5-1.9-0.5-2.9c0-2.3,0.9-4.5,2.4-6.2c0.2-0.3,0.5-0.4,0.7-0.5
            c0.8-0.3,1.6-0.2,2.3,0.4c0.8,0.8,0.9,2.1,0.1,3c-0.8,0.9-1.3,2.1-1.3,3.4c0,1.4,0.6,2.7,1.5,3.6c0.9,0.9,2.2,1.5,3.6,1.5
            c1.4,0,2.7-0.6,3.6-1.5c0.9-0.9,1.5-2.2,1.5-3.6c0-0.7,0.4-1.4,0.9-1.7c0.3-0.2,0.7-0.3,1.2-0.3c0.4,0,0.8,0.1,1.2,0.3
            c0.5,0.3,0.9,1,0.9,1.7c0,1.3-0.3,2.6-0.8,3.8c-0.2,0.4-0.3,0.7-0.5,1h0v0c0.3,0.1,0.6,0.1,0.9,0.1c1.4,0,2.6-0.6,3.5-1.5
            c0.9-0.9,1.5-2.1,1.5-3.5C213.8,289.2,213.3,287.9,212.3,287z"
                />
                <path
                  fill="#2FB3C0"
                  d="M184,196.6c-0.1-0.1-0.1-0.1-0.2-0.2c-0.3-0.2-0.7-0.5-1.4-0.4l-2.3,0.4c-1.8,0.7-3.6,1.3-5.4,1.9
            c-5.6,1.8-11.5,3-17.9,3.5v6.8c0,0.4,0,0.8-0.1,1.2v0c2.9-0.2,5.8-0.6,8.6-1.1l6.9-1.3l6.9-1.3c0.8-0.1,1.5-0.4,2.2-0.8
            c2-1.1,3.2-3.3,3.2-5.6v-2C184.4,197.2,184.2,196.8,184,196.6z"
                />
                <g>
                  <path
                    fill="#FFFFFF"
                    d="M224.2,116.2l-2.3-7.1l-1.4-4.5l-6.2-19.1c-0.2-0.5-0.4-1-0.6-1.6c-0.8-2-1.9-4-3.2-5.7
                c-0.6-0.9-1.3-1.7-2.1-2.5c-0.4-0.4-0.8-0.8-1.2-1.2c-2.8-2.6-6.1-4.6-9.7-5.9c-0.5-0.2-1-0.3-1.6-0.5c-0.3-0.1-0.5-0.1-0.7-0.2
                c-0.3,0-0.5-0.1-0.8-0.1c-0.2,0-0.5-0.1-0.7-0.1c-0.5-0.1-1-0.2-1.5-0.2c-1.2-0.2-2.4-0.3-3.6-0.5c-1.3-0.1-2.5-0.3-3.8-0.4
                c-2.6-0.3-5.4-0.5-8.2-0.8c-1.5-0.1-3-0.2-4.5-0.3c-1-0.1-1.9-0.2-2.9-0.3c-1.9-0.2-3.8-0.3-5.8-0.4c-4.8-0.3-9.4-0.4-13.6-0.4
                c-4.2,0-8.8,0.2-13.6,0.4c-1.9,0.1-3.8,0.3-5.8,0.4c-1,0.1-1.9,0.2-2.9,0.3c-1.5,0.1-3,0.3-4.5,0.3c-2.8,0.3-5.6,0.5-8.2,0.8
                c-1.3,0.1-2.6,0.3-3.8,0.4c-1.2,0.2-2.4,0.3-3.6,0.5c-0.5,0-1,0.1-1.5,0.2c-0.3,0-0.5,0.1-0.7,0.1c-0.3,0-0.5,0.1-0.8,0.1
                c-0.3,0.1-0.5,0.1-0.7,0.2c-0.5,0.1-1,0.3-1.6,0.5c-3.6,1.3-7,3.3-9.7,5.9c-0.4,0.4-0.8,0.8-1.2,1.2c-0.8,0.8-1.5,1.6-2.1,2.5
                c-1.3,1.8-2.3,3.7-3.2,5.7c-0.2,0.5-0.4,1-0.6,1.6l-6.2,19.1l-1.4,4.5l-2.3,7.1c-4.8,15-2.4,31.4,6.6,44
                c3.1,4.4,6.9,8.9,11.3,13.4c1.5,1.5,3,2.9,4.6,4.3c3.2,2.8,6.8,5.5,10.7,7.9c3.8,2.4,8,4.6,12.6,6.4c4.1,1.6,8.6,3,13.3,3.9
                c1.2,0.2,2.4,0.4,3.6,0.6c3.7,0.5,7.5,0.8,11.5,0.8c4,0,7.8-0.3,11.5-0.8c1.2-0.2,2.4-0.4,3.6-0.6c4.7-0.9,9.2-2.3,13.3-3.9
                c4.6-1.8,8.7-4,12.6-6.4c3.9-2.4,7.4-5.1,10.7-7.9c1.6-1.4,3.2-2.9,4.6-4.3c4.4-4.4,8.2-9,11.3-13.4
                C226.6,147.6,229,131.2,224.2,116.2z"
                  />
                  <path
                    fill="#FFFFFF"
                    d="M97.9,140.6c-6-1.1-9.9-6.8-8.9-12.7l2.8-16c1-6,6.7-9.9,12.7-8.8c5.3,0.9,9.1,5.5,9.1,10.7
                c0,0.6,0,1.2-0.2,1.9l-2.8,16C109.5,137.6,103.9,141.6,97.9,140.6z"
                  />
                  <path
                    fill="#FFFFFF"
                    d="M150,191.8c-9.7,0-18.6-6.9-23.4-11.2c-2.1-2-3.1-4.9-2.5-7.8l2.1-9.7c0.8-3.5,3.3-6.4,6.8-7.3
                c3.9-1,9.7-2.3,16.9-2.3c7.2,0,13,1.2,16.9,2.3c3.5,0.9,6.1,3.8,6.8,7.3l2.1,9.7c0.6,2.9-0.3,5.8-2.5,7.8
                C168.6,184.9,159.6,191.8,150,191.8z"
                  />
                  <path
                    fill="#FFFFFF"
                    d="M202.1,140.5c-5.9,1-11.6-2.9-12.7-8.9l-2.8-16c-1-5.9,2.9-11.6,8.9-12.7c0.6-0.1,1.3-0.2,1.9-0.2
                c5.2,0,9.8,3.7,10.7,9l2.8,16C212,133.7,208,139.5,202.1,140.5z"
                  />
                </g>
                <g>
                  <path
                    fill="#222222"
                    d="M73.5,93.5c-0.4,0-0.8-0.3-1-0.7c-2.2-4.9-3.3-9.2-3.3-12.7c0-2.6,0.3-6.1,0.9-10.4c0.1-0.6,0.6-1,1.3-1
                c0.6,0.1,1,0.7,1,1.3c-0.6,4.2-0.9,7.6-0.9,10.1c0,3.2,1,7.1,3.1,11.8c0.2,0.6,0,1.2-0.6,1.5C73.8,93.5,73.6,93.5,73.5,93.5z"
                  />
                </g>
                <g>
                  <path
                    fill="#222222"
                    d="M226.5,93.5c-0.2,0-0.3,0-0.5-0.1c-0.6-0.3-0.8-0.9-0.6-1.5c2-4.6,3.1-8.6,3.1-11.8c0-2.5-0.3-5.9-0.9-10.1
                c-0.1-0.6,0.3-1.2,1-1.3c0.6-0.1,1.2,0.3,1.3,1c0.6,4.3,0.9,7.8,0.9,10.4c0,3.5-1.1,7.8-3.3,12.7
                C227.4,93.3,226.9,93.5,226.5,93.5z"
                  />
                </g>
                <g>
                  <path
                    fill="#222222"
                    d="M88,12.7c-0.1,0.1-0.2,0.2-0.3,0.3c0,0,0,0.1-0.1,0.1c0,0.1-0.1,0.2-0.1,0.3C87.7,13,87.9,12.8,88,12.7
                L88,12.7z M87.2,13.9c-0.3,0.5-0.6,1.3-1,2.1c0.5-1.2,1-2,1.4-2.7c0,0-0.1,0.1-0.1,0.1C87.4,13.5,87.3,13.7,87.2,13.9z M89.7,13
                c0.3,0.3,0.5,0.7,0.8,1.1C90.2,13.6,89.9,13.2,89.7,13z M95.6,26.1c3.5,10.3,7,24.7,8.1,37.5C103.6,53.5,99.6,37.6,95.6,26.1z"
                  />
                </g>
                <path
                  fill="#222222"
                  d="M173.4,180.6c-4.7,4.3-13.7,11.2-23.4,11.2c-9.7,0-18.6-6.9-23.4-11.2c-2.1-2-3.1-4.9-2.5-7.8l2.1-9.7
            c0.8-3.5,3.3-6.4,6.8-7.3c3.9-1,9.7-2.2,16.9-2.2c7.2,0,13,1.1,16.9,2.2c3.5,1,6.1,3.8,6.8,7.3l2.1,9.7
            C176.5,175.7,175.5,178.7,173.4,180.6z"
                />
                <path
                  fill="#222222"
                  d="M113.6,113.7c0,0.6,0,1.3-0.2,1.9l-2.8,16c-1,6-6.7,9.9-12.7,8.9c-6-1.1-9.9-6.7-8.9-12.7l2.8-16
            c1-6,6.7-9.9,12.7-8.9C109.9,103.9,113.6,108.5,113.6,113.7z"
                />
                <path
                  fill="#222222"
                  d="M202.1,140.5L202.1,140.5c-6,1-11.6-2.9-12.7-8.9l-2.8-16c-1-6,2.9-11.6,8.9-12.7h0c6-1,11.6,2.9,12.7,8.9
            l2.8,16C212,133.8,208,139.4,202.1,140.5z"
                />
                <polygon
                  fill="#222222"
                  points="153.5,217.4 146.5,228.4 149.8,227.8 146.5,236 153.5,225 150.2,225.6 	"
                />
                <path
                  fill="#222222"
                  d="M226.5,108.8c2.3-2,14.2-13.5,14.2-28.6c0-15.4-16.8-80.2-28.4-80.2c-8.1,0-33.9,31.7-39.4,61
            c-8-0.7-16-1.1-23-1.1c-6.9,0-15,0.5-23,1.1C121.5,31.7,95.7,0,87.6,0C76.1,0,59.2,64.8,59.2,80.2c0,15.1,12,26.6,14.3,28.6l-2,6
            c-5.2,16.2-2.7,34.1,7.2,47.9c7.8,10.9,19,22.8,34.3,30.5c-1.2,1.2-1.8,2.8-1.8,4.4v2c0,1.7,0.4,3.3,1.1,4.7
            c-2.8,3.5-10.9,13.9-13,19.5c-1.3,3.3-2.4,8.7-3.4,14.8c-4,1.5-15,6.7-15,18.1c0,10.3,3.7,18.6,7.8,24.5c0,0-0.1,0.1-0.1,0.1
            c-4.1,1.1-6.9,4.8-6.9,9.1c0,5.2,4.2,9.4,9.4,9.4c1.6,0,3.1-0.4,4.6-1.2c1.3,0.7,2.7,1,4.2,1c2.5,0,4.8-1,6.5-2.7
            c1.7,1.7,4,2.7,6.4,2.7c4,0,7.4-2.5,8.7-6.1h0c0.1,0,0.2,0,0.3-0.1c0.5-0.2,4.9-2,7.1-4.9c7.1,2.7,18.1,2.9,21.1,2.9
            c3.1,0,14-0.2,21.1-2.9c2.2,2.9,6.5,4.7,7.1,4.9c0.1,0,0.2,0,0.3,0.1c1.3,3.6,4.7,6.1,8.7,6.1c2.4,0,4.8-1,6.4-2.7
            c1.7,1.6,4,2.7,6.5,2.7c1.5,0,3-0.4,4.2-1c1.4,0.8,3,1.2,4.6,1.2c5.2,0,9.4-4.2,9.4-9.4c0-4.3-2.9-8-6.8-9c0,0-0.1-0.1-0.2-0.2
            c4-5.9,7.7-14.2,7.7-24.5c0-11.4-11-16.6-15-18.1c-1-6.1-2.1-11.5-3.4-14.8c-2.1-5.6-10.1-15.9-13-19.5c0.7-1.4,1.1-3.1,1.1-4.8v-2
            c0-1.7-0.6-3.2-1.8-4.4c15.3-7.8,26.5-19.7,34.3-30.5c9.9-13.9,12.4-31.7,7.2-47.9L226.5,108.8z M205,10.4c0.4-0.4,0.8-0.8,1.2-1.2
            c2.6-2.7,4.8-4.3,6.1-4.6c0.3,0.1,0.5,0.4,0.9,0.8c0.2,0.1,0.4,0.4,0.5,0.6c0.4,0.5,0.9,1.1,1.4,1.8c2.8,4.3,7.1,13.1,12.2,29.8
            c5.7,18.7,9,36.3,9,42.6c0,11.1-7.7,20.2-11.2,23.8l-6.4-19.9c-1.5-4.5-3.9-8.5-7.1-11.8c-0.4-0.5-0.9-1-1.4-1.4
            c-0.5-0.5-1-1-1.5-1.3c-1-0.8-2-1.6-3.2-2.3c-1.1-0.7-2.3-1.3-3.5-1.8c-0.6-0.3-1.2-0.5-1.8-0.8c-1.3-0.5-2.5-0.8-3.8-1.1
            c1.8-20.9,10-46,14-50.6c0.4-0.5,0.8-0.8,1.1-0.8c0.1,0,0.2,0.1,0.3,0.2c0.1,0,0.2,0.1,0.3,0.3c0.7,0.7,1.4,2.1,2.3,4.3
            c0.3,0.6,0.5,1.2,0.8,1.9c0.4,1.1,0.9,2.3,1.3,3.6c0.2,0.4,0.3,0.8,0.5,1.3c2.6,7.7,5.6,18.7,8.2,31.1v0c0.1,0.3,0.2,0.4,0.4,0.6
            c0.3,0.2,0.6,0.3,0.9,0.2c0.3,0,0.5-0.2,0.7-0.4c0.2-0.2,0.3-0.6,0.2-0.9c-0.1-0.4-7.7-36.3-13.9-43.2c-0.6-0.7-1.3-1.1-1.8-1.1
            c-0.8,0-1.6,0.5-2.5,1.4c-6,6.3-13,32.6-14.9,51.8c-0.4,0-0.8-0.1-1.2-0.2c-2.4-0.3-4.9-0.6-7.5-0.8c-2.6-0.3-5.3-0.6-8-0.8
            C181.3,41,195.5,20.2,205,10.4z M63.7,80.2c0-6.3,3.3-23.9,9-42.6C77.9,20.9,82.1,12,84.9,7.8c0.5-0.7,1-1.3,1.4-1.8
            c0.2-0.3,0.3-0.5,0.5-0.6c0.3-0.4,0.6-0.7,0.9-0.8c1.3,0.4,3.5,2,6.1,4.6c0.4,0.3,0.8,0.8,1.2,1.2c9.5,9.9,23.7,30.6,27.6,51.1
            c-2.7,0.2-5.4,0.5-8,0.8c-2.6,0.3-5.1,0.5-7.5,0.8c-0.4,0-0.8,0.1-1.2,0.2C104.1,44.1,97,17.8,91,11.5c-0.8-0.9-1.7-1.4-2.5-1.4
            c-0.6,0-1.3,0.4-1.8,1.1C80.5,18,72.9,53.9,72.9,54.3c-0.1,0.3,0,0.7,0.2,0.9c0.2,0.2,0.4,0.4,0.7,0.4c0.6,0.2,1.2-0.3,1.3-0.8
            c1.1-5.3,2.4-10.7,3.7-15.8l0.6-2.4c0.3-1.4,0.7-2.7,1.1-3.9c0.9-3.2,1.8-6.1,2.6-8.6c0.2-0.6,0.4-1.2,0.6-1.8
            c0.8-2.1,1.4-4,2.1-5.5c0.1-0.3,0.3-0.6,0.4-0.9c0.4-0.8,0.7-1.5,1-2.1c0.1-0.2,0.2-0.4,0.3-0.5c0-0.1,0.1-0.3,0.2-0.3
            c0,0,0,0,0.1-0.1c0.1-0.2,0.2-0.3,0.3-0.3c0.1-0.2,0.2-0.3,0.3-0.3c0.1-0.1,0.1-0.1,0.2-0.1c0,0,0,0,0.1,0c0.1,0,0.2,0,0.3,0.1
            c0.1,0,0.3,0.1,0.4,0.3c0,0,0.1,0,0.1,0.1c0,0,0.1,0.1,0.2,0.2c0,0,0,0,0.1,0.1c0.3,0.2,0.5,0.6,0.8,1.1c0.2,0.2,0.3,0.5,0.5,0.7
            c0.3,0.4,0.5,1,0.8,1.5c0.4,0.7,0.8,1.5,1.1,2.4c0.2,0.4,0.3,0.8,0.5,1.2c0.3,0.5,0.5,1.2,0.7,1.8c0.3,0.8,0.6,1.5,0.9,2.3
            c0.3,0.7,0.5,1.4,0.8,2.1c4,11.5,7.9,27.4,8.1,37.5c-1.3,0.3-2.6,0.7-3.8,1.1c-0.6,0.3-1.2,0.5-1.8,0.8c-1.2,0.5-2.4,1.1-3.5,1.8
            c-1.1,0.7-2.2,1.4-3.2,2.3c-0.5,0.4-1,0.8-1.5,1.3c-0.5,0.5-1,0.9-1.4,1.4c-3.2,3.3-5.6,7.3-7.1,11.8l-4.2,13L75,104
            C71.4,100.4,63.7,91.3,63.7,80.2z M85.1,256.9c0-3.5,1.5-6.3,3.5-8.4c2-2.2,4.5-3.8,6.5-4.8c-0.8,4.8-1.4,9.7-2,14.5
            c-1,6.9-1.8,13.4-2.7,17.9C87.4,271,85.1,264.5,85.1,256.9z M211.4,248.5c2,2.2,3.5,5,3.5,8.4c0,7.6-2.3,14.1-5.2,19.1
            c-0.9-4.5-1.8-11.1-2.7-17.9c-0.6-4.8-1.3-9.7-2-14.5C206.9,244.7,209.4,246.3,211.4,248.5z M196.6,225.5c2.3,6.1,4.3,20.5,6,33.2
            c1.3,9.9,2.5,18.4,3.7,22.6c0.1,0.2,0.1,0.3,0.2,0.5c0.3,1,0.9,1.9,1.6,2.6c0.3,0.3,0.5,0.5,0.7,0.6c0.5,0.4,1,0.7,1.5,0.8
            c0.8,0.2,1.5,0.6,2.1,1.2c1,0.9,1.5,2.2,1.5,3.6c0,1.4-0.5,2.6-1.5,3.5c-0.9,0.9-2.1,1.5-3.5,1.5c-0.3,0-0.5,0-0.8-0.1h0
            c0.2-0.3,0.4-0.7,0.6-1c0.5-1.1,0.8-2.4,0.8-3.8c0-0.7-0.4-1.4-0.9-1.7c-0.3-0.3-0.8-0.4-1.2-0.4c-0.5,0-0.8,0.1-1.2,0.4
            c-0.5,0.3-0.9,1-0.9,1.7c0,1.4-0.6,2.7-1.5,3.6c-0.9,0.9-2.2,1.5-3.6,1.5c-1.4,0-2.7-0.6-3.6-1.5c-0.9-0.9-1.5-2.2-1.5-3.6
            c0-1.3,0.5-2.5,1.3-3.4c0.8-0.9,0.7-2.2-0.1-3c-0.6-0.5-1.5-0.7-2.3-0.3c-0.3,0.1-0.5,0.3-0.7,0.5v0c-1.5,1.7-2.4,3.9-2.4,6.2
            c0,1,0.2,1.9,0.5,2.9c-0.3,0.3-0.5,0.6-0.8,0.9c-0.9,0.8-2.1,1.3-3.3,1.3c-1.4,0-2.7-0.6-3.6-1.5c-0.9-0.9-1.5-2.2-1.5-3.6
            c0-2.1,1.3-3.9,3.1-4.7c0.6-0.3,1.3-0.5,2-0.5c1.1,0,2.1-0.9,2.1-2.1c0-0.7-0.4-1.3-0.9-1.7c-0.1-0.1-0.3-0.2-0.4-0.2
            c-0.3-0.1-0.5-0.2-0.8-0.2c-0.3,0-0.5,0-0.8,0.1v-0.1c-2.7-5.9-15-34-15-44.5c0-0.6-0.3-1.2-0.7-1.5c-0.4-0.5-1-0.7-1.6-0.7
            c-0.5,0-0.9,0.1-1.3,0.4c-0.1,0.1-0.2,0.2-0.3,0.3c-0.4,0.4-0.7,0.9-0.7,1.5c0,8.2,6.3,24.9,10.9,36.1c1.2,2.9,2.3,5.5,3.2,7.4v0
            c0.3,0.6,0.5,1.2,0.8,1.7c0.1,0.3,0.2,0.5,0.3,0.8c-0.5,0.3-1,0.8-1.5,1.2c-1.4,1.3-2.3,3.1-2.6,5c-0.6-0.3-1.2-0.7-1.7-1
            c-0.5-0.4-1-0.8-1.4-1.1l0,0c0.4-0.3,0.8-0.6,1-0.9c0.9-1,1.5-2.2,1.5-3.6c0-0.5-0.2-1-0.6-1.4c-0.2-0.2-0.4-0.3-0.7-0.5
            c-0.3-0.1-0.5-0.2-0.8-0.2c-0.3,0-0.6,0.1-0.8,0.2c-0.3,0.1-0.5,0.3-0.7,0.5c-0.4,0.4-0.6,0.9-0.6,1.4c0,1.3-3.6,3-9.7,4.1
            c-3.7,0.6-8.2,1-13.6,1c-5.3,0-9.9-0.4-13.6-1c-6.1-1.1-9.7-2.8-9.7-4.1c0-0.5-0.2-1-0.6-1.4c-0.2-0.2-0.4-0.3-0.7-0.5
            c-0.3-0.1-0.5-0.2-0.8-0.2s-0.5,0.1-0.8,0.2c-0.3,0.1-0.5,0.3-0.7,0.5c-0.4,0.4-0.6,0.9-0.6,1.4c0,1.4,0.5,2.5,1.5,3.6
            c0.3,0.3,0.7,0.6,1,0.9l0,0c-0.4,0.4-0.9,0.7-1.4,1.1c-0.5,0.4-1.1,0.8-1.7,1c-0.3-1.9-1.2-3.6-2.6-5c-0.4-0.5-0.9-0.9-1.5-1.2
            c0.1-0.2,0.2-0.5,0.3-0.8c0.3-0.5,0.5-1,0.8-1.7v0c0.8-2,2-4.6,3.2-7.4c4.6-11.2,10.9-27.9,10.9-36.1c0-0.6-0.3-1.2-0.7-1.5
            c0-0.1-0.2-0.3-0.3-0.3c-0.4-0.3-0.8-0.4-1.3-0.4c-0.6,0-1.2,0.3-1.6,0.7c-0.4,0.4-0.7,0.9-0.7,1.5c0,10.5-12.4,38.6-15,44.5v0.1
            c-0.3-0.1-0.5-0.1-0.8-0.1c-0.3,0-0.5,0.1-0.8,0.2c-0.1,0-0.3,0.1-0.4,0.2c-0.5,0.3-0.9,1-0.9,1.7c0,1.2,1,2.1,2.1,2.1
            c0.7,0,1.4,0.2,2,0.5c1.8,0.8,3.1,2.6,3.1,4.7c0,1.4-0.6,2.7-1.5,3.6c-0.9,0.9-2.2,1.5-3.6,1.5c-1.3,0-2.5-0.5-3.3-1.3
            c-0.3-0.3-0.6-0.6-0.8-0.9c0.3-1,0.5-1.9,0.5-2.9c0-2.3-0.9-4.5-2.4-6.2v0c-0.2-0.2-0.5-0.4-0.7-0.5c-0.8-0.3-1.6-0.2-2.3,0.3
            c-0.8,0.8-0.9,2.1-0.1,3c0.8,0.9,1.3,2.1,1.3,3.4c0,1.4-0.6,2.7-1.5,3.6c-0.9,0.9-2.2,1.5-3.6,1.5c-1.4,0-2.7-0.6-3.6-1.5
            c-0.9-0.9-1.5-2.2-1.5-3.6c0-0.7-0.4-1.4-0.9-1.7c-0.3-0.3-0.7-0.4-1.2-0.4c-0.4,0-0.8,0.1-1.2,0.4c-0.5,0.3-0.9,1-0.9,1.7
            c0,1.8,0.5,3.4,1.4,4.8c-0.3,0.1-0.6,0.1-0.9,0.1c-1.4,0-2.6-0.5-3.5-1.5c-0.9-0.9-1.5-2.1-1.5-3.5c0-1.4,0.5-2.6,1.5-3.6
            c0.5-0.6,1.3-1,2.1-1.2c0.5-0.1,1-0.4,1.5-0.8c0.3-0.2,0.5-0.4,0.7-0.6c0.7-0.7,1.3-1.6,1.6-2.6c0-0.2,0.1-0.3,0.2-0.5
            c1.2-4.2,2.3-12.7,3.7-22.6c1.7-12.7,3.7-27.1,6-33.2c1.7-4.6,8.4-13.5,11.6-17.4v0c1.5,1.3,3.2,2.1,5.1,2.5l13.7,2.5
            c2.2,0.4,4.5,0.7,6.7,0.9l0,0c-0.5,0.3-0.9,0.8-1.3,1.1c-3.1,2.9-5,7-5,11.5c0,1.6,0.3,3.2,0.7,4.7c0.2,0.5,0.3,1,0.5,1.5
            c0.8,1.9,2,3.6,3.4,5c2.9,2.9,6.8,4.6,11.2,4.6c4.3,0,8.3-1.8,11.2-4.6c1.4-1.4,2.6-3.1,3.4-5c0.2-0.5,0.4-1,0.5-1.5
            c0.5-1.5,0.7-3.1,0.7-4.7c0-4.5-1.9-8.6-5-11.5c-0.4-0.4-0.8-0.8-1.3-1.1l0,0c2.2-0.2,4.5-0.5,6.7-0.9l13.7-2.5
            c1.9-0.3,3.7-1.2,5.1-2.5v0C188.1,212.1,194.8,220.9,196.6,225.5z M143.4,209.8c-2.9-0.2-5.8-0.6-8.7-1.1l-6.9-1.3l-6.9-1.3
            c-0.8-0.1-1.5-0.4-2.2-0.8c-2-1.1-3.2-3.3-3.2-5.6v-2c0-0.5,0.2-0.8,0.4-1.1c0-0.1,0.1-0.2,0.2-0.2c0.2-0.2,0.6-0.4,1.1-0.4
            c0.1,0,0.2,0,0.3,0l2.3,0.4c1.8,0.7,3.6,1.4,5.4,2c5.6,1.7,11.5,2.9,17.9,3.4v6.8C143.3,209,143.3,209.4,143.4,209.8z M150,215.4
            c3.1,0,6,1.3,8,3.3c2,2,3.3,4.8,3.3,7.9c0,3.1-1.3,6-3.3,8c-2,2-4.9,3.3-8,3.3c-3.1,0-5.9-1.3-8-3.3c-2-2-3.3-4.9-3.3-8
            c0-3.1,1.3-5.9,3.3-7.9C144,216.7,146.9,215.4,150,215.4z M147.7,208.6V202c0.8,0,1.5,0,2.3,0s1.5,0,2.3,0v6.6
            c0,0.6-0.2,1.1-0.5,1.5c-0.1,0.1-0.2,0.3-0.3,0.3c-0.4,0.3-0.9,0.5-1.4,0.5s-1-0.2-1.4-0.5c-0.1-0.1-0.2-0.2-0.3-0.3
            C148,209.7,147.7,209.2,147.7,208.6z M156.6,209.8c0.1-0.4,0.1-0.8,0.1-1.2v-6.8c6.4-0.5,12.4-1.7,17.9-3.4c1.8-0.6,3.6-1.3,5.4-2
            l2.3-0.4c0.7-0.1,1.2,0.2,1.4,0.4c0.1,0,0.2,0.1,0.2,0.2c0.2,0.3,0.4,0.6,0.4,1.1v2c0,2.4-1.3,4.5-3.2,5.6
            c-0.7,0.4-1.4,0.7-2.2,0.8l-6.9,1.3l-6.9,1.3C162.4,209.2,159.5,209.6,156.6,209.8z M217.7,160.1c-3.1,4.4-6.9,9-11.3,13.4
            c-1.5,1.5-3,2.9-4.6,4.3c-3.2,2.8-6.8,5.5-10.7,7.9c-3.8,2.4-8,4.6-12.6,6.4c-4.1,1.7-8.6,3-13.3,3.9c-1.2,0.2-2.4,0.4-3.6,0.5
            c-3.7,0.6-7.5,0.9-11.5,0.9c-4,0-7.8-0.3-11.5-0.9c-1.2-0.1-2.4-0.3-3.6-0.5c-4.7-0.9-9.2-2.3-13.3-3.9c-4.6-1.8-8.7-4-12.6-6.4
            c-3.9-2.4-7.4-5.1-10.7-7.9c-1.6-1.4-3.2-2.9-4.6-4.3c-4.4-4.4-8.2-9-11.3-13.4c-8.9-12.5-11.4-28.9-6.6-43.9l2.3-7.1l1.4-4.5
            L85,87.5l0.7-2c0.2-0.5,0.4-1,0.6-1.6c0.8-2,1.9-4,3.2-5.7c0.6-0.9,1.3-1.7,2.1-2.5c0.3-0.5,0.8-0.8,1.2-1.2
            c1.9-1.8,4.2-3.4,6.6-4.6c1-0.5,2-0.9,3.1-1.3c0.5-0.2,1-0.3,1.6-0.5c0.3,0,0.5-0.1,0.7-0.2c0.3-0.1,0.5-0.1,0.8-0.1
            c0.2-0.1,0.5-0.1,0.7-0.2c0.5-0.1,1-0.2,1.5-0.2c1.2-0.1,2.4-0.3,3.6-0.4c1.3-0.1,2.5-0.3,3.8-0.4c2.6-0.3,5.4-0.6,8.2-0.8
            c1.5-0.1,3-0.2,4.5-0.3c1-0.1,1.9-0.2,2.9-0.2c1.9-0.2,3.8-0.3,5.8-0.4c4.8-0.3,9.4-0.5,13.6-0.5c4.2,0,8.8,0.2,13.6,0.5
            c1.9,0.1,3.8,0.3,5.8,0.4c1,0,1.9,0.1,2.9,0.2c1.5,0.1,3,0.3,4.5,0.3c2.8,0.3,5.6,0.6,8.2,0.8c1.3,0.1,2.6,0.3,3.8,0.4
            c1.2,0.1,2.4,0.3,3.6,0.4c0.5,0,1,0.1,1.5,0.2c0.3,0,0.5,0.1,0.7,0.2c0.3,0,0.5,0,0.8,0.1c0.3,0,0.5,0.1,0.7,0.2
            c0.5,0.2,1,0.3,1.6,0.5c3.6,1.2,7,3.2,9.7,5.9c0.4,0.3,0.8,0.7,1.2,1.2c0.8,0.8,1.5,1.6,2.1,2.5c1.3,1.8,2.4,3.7,3.2,5.7
            c0.2,0.5,0.4,1,0.6,1.6l6.2,19.1l1.4,4.5l2.3,7.1C229,131.2,226.6,147.6,217.7,160.1z"
                />
                <path
                  fill="#ED1F67"
                  d="M103.7,63.6c-1.3,0.3-2.6,0.7-3.8,1.1c-0.6,0.3-1.2,0.5-1.8,0.8c-1.2,0.5-2.4,1.1-3.5,1.8
            c-1.1,0.7-2.2,1.4-3.2,2.3c-0.5,0.4-1,0.8-1.5,1.3c-0.5,0.5-1,0.9-1.4,1.4c-3.2,3.3-5.6,7.3-7.1,11.8l-4.2,13c0,0-5.7-9.8-5.7-16.3
            c0-6.5,1.5-16.1,3.6-26.1c1.1-5.3,2.4-10.7,3.7-15.8c1.7-6.3,3.4-12.1,4.9-16.7c0.8-2.1,1.4-4,2.1-5.5c1-2.5,1.9-4,2.5-4.4
            c0,0,0,0,0,0c0.1-0.1,0.1-0.1,0.2-0.1c0,0,0,0,0.1,0c0.1,0,0.2,0,0.3,0.1c0.1,0.1,0.3,0.2,0.4,0.3c0,0,0.1,0,0.1,0.1
            c0,0,0.1,0.1,0.2,0.2c0,0,0,0,0.1,0.1c0.3,0.2,0.5,0.6,0.8,1.1c0.2,0.2,0.3,0.5,0.5,0.7c0.3,0.4,0.5,1,0.8,1.5
            c0.4,0.7,0.8,1.5,1.1,2.4c0.2,0.4,0.3,0.8,0.5,1.2c0.3,0.5,0.5,1.2,0.7,1.8c0.3,0.8,0.6,1.5,0.9,2.3c0.3,0.7,0.5,1.4,0.8,2.1
            C99.6,37.6,103.6,53.5,103.7,63.6z"
                />
                <path
                  fill="#ED1F67"
                  d="M196.3,63.6c1.3,0.3,2.6,0.7,3.8,1.1c0.6,0.3,1.2,0.5,1.8,0.8c1.2,0.5,2.4,1.1,3.5,1.8
            c1.1,0.7,2.2,1.4,3.2,2.3c0.5,0.4,1,0.8,1.5,1.3c0.5,0.5,1,0.9,1.4,1.4c3.2,3.3,5.6,7.3,7.1,11.8l4.2,13c0,0,5.7-9.8,5.7-16.3
            c0-6.5-1.5-16.1-3.6-26.1c-1.1-5.3-2.4-10.7-3.7-15.8c-1.7-6.3-3.4-12.1-4.9-16.7c-0.8-2.1-1.4-4-2.1-5.5c-1-2.5-1.9-4-2.5-4.4
            c0,0,0,0,0,0c-0.1-0.1-0.1-0.1-0.2-0.1c0,0,0,0-0.1,0c-0.1,0-0.2,0-0.3,0.1c-0.1,0.1-0.3,0.2-0.4,0.3c0,0-0.1,0-0.1,0.1
            c0,0-0.1,0.1-0.2,0.2c0,0,0,0-0.1,0.1c-0.3,0.2-0.5,0.6-0.8,1.1c-0.2,0.2-0.3,0.5-0.5,0.7c-0.3,0.4-0.5,1-0.8,1.5
            c-0.4,0.7-0.8,1.5-1.1,2.4c-0.2,0.4-0.3,0.8-0.5,1.2c-0.3,0.5-0.5,1.2-0.7,1.8c-0.3,0.8-0.6,1.5-0.9,2.3c-0.3,0.7-0.5,1.4-0.8,2.1
            C200.4,37.6,196.4,53.5,196.3,63.6z"
                />
                <path
                  fill="#FFFFFF"
                  d="M154.3,156.6c-4.9,1.1-16.6,4.3-24.7,12c-0.2,0.1-0.3,0.2-0.3,0.1v0l0.5-2.6c0.8-3.5,3.3-6.4,6.8-7.3
            c3.9-1,9.7-2.2,16.9-2.2H154.3z"
                />
                <path
                  fill="#222222"
                  d="M173.4,180.6c-4.7,4.3-13.7,11.2-23.4,11.2c-9.7,0-18.6-6.9-23.4-11.2c-2.1-2-3.1-4.9-2.5-7.8l2.1-9.7
            c0.8-3.5,3.3-6.4,6.8-7.3c3.9-1,9.7-2.2,16.9-2.2c7.2,0,13,1.1,16.9,2.2c3.5,1,6.1,3.8,6.8,7.3l2.1,9.7
            C176.5,175.7,175.5,178.7,173.4,180.6z"
                />
                <path
                  fill="#FFFFFF"
                  d="M154.3,156.6c-4.9,1.1-16.6,4.3-24.7,12c-0.2,0.1-0.3,0.2-0.3,0.1v0l0.5-2.6c0.8-3.5,3.3-6.4,6.8-7.3
            c3.9-1,9.7-2.2,16.9-2.2H154.3z"
                />
                <circle fill="#A97C50" cx="105.7" cy="37.4" r="2.8" />
                <path
                  fill="#A97C50"
                  d="M107.5,26.5c-0.6,1-1.7,1.8-3,1.8c-1.9,0-3.5-1.5-3.5-3.5c0-1.8,1.3-3.2,3-3.5
            C105.2,22.9,106.4,24.7,107.5,26.5z"
                />
                <path
                  fill="#A97C50"
                  d="M112.3,34.4c-0.5,0.5-1.1,0.8-1.8,0.8c-1.4,0-2.5-1.1-2.5-2.5c0-1.2,0.8-2.2,1.9-2.4
            C110.7,31.6,111.6,33,112.3,34.4z"
                />
                <path
                  fill="#A97C50"
                  d="M113,39.4c0,0.7-0.6,1.3-1.3,1.3s-1.3-0.6-1.3-1.3c0-0.7,0.6-1.3,1.3-1.3S113,38.7,113,39.4z"
                />
              </g>
            </svg>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 40,
              fontStyle: 'normal',
              color: 'white',
              marginTop: 30,
              lineHeight: 1.8,
              whiteSpace: 'pre-wrap',
            }}
          >
            <b>SubBase Creator Platform</b>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
  console.log(image);
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          backgroundColor: '#111518',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            width="300"
            height="300"
            src={image!}
            style={{
              borderRadius: 150,
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 60,
            fontStyle: 'normal',
            color: 'white',
            marginTop: 30,
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
          }}
        >
          <b>{storeName!}</b>
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 20,
            fontStyle: 'normal',
            color: 'white',
            marginTop: 15,
            lineHeight: 0.5,
            whiteSpace: 'pre-wrap',
          }}
        >
          <b>by SubBase Creator Platform</b>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
