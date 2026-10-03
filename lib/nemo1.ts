/**
 * Adresy funkcí v Nemo1. Nejsou tajné a nemění se, takže jsou tady
 * jako výchozí hodnoty — do prostředí patří jen ID integrace a tajemství.
 *
 * Proměnnou lze přebít, když se testuje proti jinému projektu Supabase.
 */
const PROJECT = "https://jfccoykhzpnkacguosic.supabase.co/functions/v1";

/** Nemo1 → web: odkud se stahují nabídky. */
export const FEED_URL = process.env.NEMO1_FEED_URL || `${PROJECT}/web-advert-feed`;

/** web → Nemo1: kam se posílají poptávky z formulářů. */
export const LEAD_WEBHOOK_URL =
  process.env.NEMO1_LEAD_WEBHOOK_URL || `${PROJECT}/website-lead-webhook`;

/** Veřejné ID integrace „Osobní web makléře“. Není tajné. */
export const INTEGRATION_ID = process.env.NEMO1_INTEGRATION_ID;

/** Sdílené tajemství. Nikdy nesmí opustit server. */
export const SECRET = process.env.NEMO1_FEED_SECRET;

/** Bez těchhle dvou je nabídka na webu prázdná (v `next dev` ukázková). */
export const isConfigured = Boolean(INTEGRATION_ID && SECRET);
