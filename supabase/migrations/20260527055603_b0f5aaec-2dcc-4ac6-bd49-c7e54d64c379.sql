-- Restrict Realtime channel subscriptions: only authenticated users may subscribe,
-- and only to the public scores feed topic used by the leaderboard.
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can read scores feed" ON realtime.messages;
CREATE POLICY "Authenticated can read scores feed"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  realtime.topic() = 'scores-feed'
  AND extension IN ('postgres_changes', 'broadcast', 'presence')
);
