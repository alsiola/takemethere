import { Injectable } from "@nestjs/common";
import { JwksClient } from "jwks-rsa";
const jwks = require("jwks-rsa");

@Injectable()
export class JwksService {
    private client: JwksClient;
    constructor() {
        this.client = jwks({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: "https://dev-qvdl9sv0.eu.auth0.com/.well-known/jwks.json"
        });
    }

    async getToken(kid: string) {
        const key = await this.client.getSigningKeyAsync(kid);
        return key.getPublicKey();
    }
}
