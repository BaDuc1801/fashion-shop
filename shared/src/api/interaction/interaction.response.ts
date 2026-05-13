export interface TrackInteractionResponse {
  success: boolean;
  score: number;
}

export interface TrackPurchaseResponse extends TrackInteractionResponse {
  count: number;
}

