import { XMLParser } from 'fast-xml-parser';

export interface FeedItem {
  title: string;
  link: string;
  date: Date;
}

const MEDIUM_FEED = 'https://medium.com/feed/@dhanushnehru';
const YOUTUBE_FEED = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCkPSG_rUGJqAXmcajZ0mNMw';

const parser = new XMLParser({ ignoreAttributes: false });

// Feeds are fetched once at build time. A failed feed renders an empty section instead of failing the deploy.
const fetchFeed = async (url: string) => {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'dhanushnehru-portfolio-build' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return parser.parse(await res.text());
  } catch (err) {
    console.warn(`[feeds] Could not load ${url}:`, err);
    return null;
  }
};

const asArray = <T>(value: T | T[] | undefined): T[] => (value === undefined ? [] : [value].flat() as T[]);

export const getArticles = async (limit = 4): Promise<FeedItem[]> => {
  const feed = await fetchFeed(MEDIUM_FEED);
  return asArray<any>(feed?.rss?.channel?.item)
    .slice(0, limit)
    .map(item => ({ title: String(item.title), link: item.link, date: new Date(item.pubDate) }));
};

export const getVideos = async (limit = 4): Promise<FeedItem[]> => {
  const feed = await fetchFeed(YOUTUBE_FEED);
  return asArray<any>(feed?.feed?.entry)
    .slice(0, limit)
    .map(entry => ({ title: String(entry.title), link: entry.link['@_href'], date: new Date(entry.published) }));
};
