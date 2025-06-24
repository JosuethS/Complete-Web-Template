// app/utils/analytics/analytics.js

const Analytics = {
  webData: {
    newVisitors: 0,
    totalViews: 0,
    sessionDuration: 0, // minutes
    deviceType: { desktop: 0, mobile: 0, ios: 0, android: 0, tablet: 0 },
    referrers: { facebook: 0, youtube: 0, instagram: 0, google: 0, direct: 0 },
  },

  _sessionStart: null,
  optOut: false,

  detectDeviceType() {
    const ua = navigator.userAgent;
    if (/iPad/i.test(ua)) return "tablet";
    if (/iPhone|iPod/i.test(ua)) return "ios";
    if (/Android/i.test(ua)) return "android";
    if (/Mobile|Android/i.test(ua)) return "mobile";
    return "desktop";
  },

  detectReferrer() {
    const r = (navigator.referrer || "").toLowerCase();
    if (r.includes("facebook.com")) return "facebook";
    if (r.includes("youtube.com")) return "youtube";
    if (r.includes("instagram.com")) return "instagram";
    if (r.includes("google.com")) return "google";
    return "direct";
  },

  _getVisitorId() {
    let id = localStorage.getItem("visitorId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("visitorId", id);
      this.webData.newVisitors++;
    }
    return id;
  },

  trackTotalVisitors() {
    if (this.optOut) return;
    this._getVisitorId();
    const device = this.detectDeviceType();
    const referrer = this.detectReferrer();

    this.webData.totalViews++;
    this.webData.deviceType[device]++;
    this.webData.referrers[referrer]++;
  },

  updateSessionDuration() {
    if (this._sessionStart === null) return;

    const now = Date.now();
    const sessionMins = Math.floor((now - this._sessionStart) / 60000);
    const storedMins = parseInt(localStorage.getItem("sessionDuration") || "0", 10);

    const totalMins = storedMins + sessionMins;
    this.webData.sessionDuration = totalMins;

    // Persist it
    localStorage.setItem("sessionDuration", totalMins.toString());
  },

  initialize() {
    if (this.optOut) return;

    // Restore stored session duration
    const storedMins = parseInt(localStorage.getItem("sessionDuration") || "0", 10);
    this.webData.sessionDuration = storedMins;

    // Start session timer
    this._sessionStart = Date.now();

    // Record the visit
    this.trackTotalVisitors();
    this.updateSessionDuration();

    // Update every minute
    this._timer = setInterval(() => this.updateSessionDuration(), 60000);

    // On unload or hide, finalize session duration
    const finalizeSession = () => this.updateSessionDuration();

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") finalizeSession();
    });

    window.addEventListener("beforeunload", finalizeSession);
  },
};

export default Analytics;
export const analyticsData = Analytics.webData;
