import { Auth0Provider } from "@auth0/auth0-react";
import { AppProps } from "next/app";
import { useEffect, useState } from "react";

function App({ Component, pageProps }: AppProps) {
    const [redirectUri, setRedirectUri] = useState<string>();
    useEffect(() => {
        setRedirectUri(window.location.origin);
    }, []);
    return (
        <Auth0Provider
            domain={process.env.NEXT_PUBLIC_AUTH_DOMAIN!}
            clientId={process.env.NEXT_PUBLIC_AUTH_CLIENT_ID!}
            redirectUri={redirectUri}
            useRefreshTokens
        >
            <Component {...pageProps} />
        </Auth0Provider>
    );
}

export default App;
