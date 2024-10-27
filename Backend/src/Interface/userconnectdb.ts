export interface UserOAuthAccount {
    account_id: number;
    user_id: number;
    provider_id: number;
    access_token: string;
    refresh_token: string | null; // Allow null
    token_expires_at?: Date | null; // Keep optional and allow null
    created_at: Date;
    updated_at: Date;
    provider: {
        provider_name: string;
      };
  }
  