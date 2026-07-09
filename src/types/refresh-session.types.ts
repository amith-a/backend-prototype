export interface RefreshSession {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRefreshSession {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}
