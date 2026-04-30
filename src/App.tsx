import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, PlayCircle, BookOpen, ExternalLink, ArrowRight, Code } from 'lucide-react';

const App = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [videos, setVideos] = useState<any[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);

  // Fetch Medium Articles via RSS-to-JSON
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@dhanushnehru');
        const data = await res.json();
        if (data.items) {
          setArticles(data.items.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to fetch articles', err);
      } finally {
        setLoadingArticles(false);
      }
    };
    fetchArticles();
  }, []);

  // Fetch YouTube Videos via RSS-to-JSON
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=UCkPSG_rUGJqAXmcajZ0mNMw');
        const data = await res.json();
        if (data.items) {
          setVideos(data.items.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to fetch videos', err);
      } finally {
        setLoadingVideos(false);
      }
    };
    fetchVideos();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <div className="min-h-screen bg-chess-black text-chess-light selection:bg-chess-accent selection:text-white pb-20">
      
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 bg-chess-pattern z-0 opacity-20 pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-2xl font-black tracking-tighter"
        >
          <div className="w-8 h-8 bg-white flex items-center justify-center text-black font-mono font-bold">
            D
          </div>
          <span className="hidden sm:inline">DHANUSH NEHRU</span>
        </motion.div>
        
        <motion.nav 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6 text-sm font-semibold tracking-wide uppercase"
        >
          <a href="#about" className="hover:text-chess-accent transition-colors">About</a>
          <a href="#articles" className="hover:text-chess-accent transition-colors">Writings</a>
          <a href="#videos" className="hover:text-chess-accent transition-colors">Videos</a>
        </motion.nav>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 mt-12 sm:mt-24">
        
        {/* Hero Section */}
        <motion.section 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-32"
        >
          {/* Hero Left - Dark Square */}
          <motion.div variants={itemVariants} className="bg-chess-dark p-10 sm:p-16 border border-white/5 flex flex-col justify-center min-h-[500px]">
            <h2 className="text-chess-accent font-mono text-sm tracking-widest mb-4">{"<GRANDMASTER_OF_CODE />"}</h2>
            <h1 className="text-5xl sm:text-7xl font-black leading-[1.1] mb-6">
              Checkmate<br />Complex<br />Systems.
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-md">
              Software Engineer, Technical Writer, and Open Source Contributor. I build robust architectures and share my knowledge with the global developer community.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://github.com/DhanushNehru" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white text-black px-6 py-3 font-bold hover:bg-gray-200 transition-colors">
                <Github size={18} /> GitHub
              </a>
              <a href="https://www.linkedin.com/in/dhanushnehru/" target="_blank" rel="noreferrer" className="flex items-center gap-2 border border-white/20 px-6 py-3 font-bold hover:bg-white/5 transition-colors">
                <Linkedin size={18} /> LinkedIn
              </a>
            </div>
          </motion.div>

          {/* Hero Right - Chessboard Abstract */}
          <motion.div variants={itemVariants} className="hidden lg:grid grid-cols-4 grid-rows-4 h-[500px] border border-white/5">
             {[...Array(16)].map((_, i) => {
               const isDark = (Math.floor(i / 4) + i % 4) % 2 === 1;
               return (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, scale: 0.8 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: i * 0.05, duration: 0.5 }}
                   className={`${isDark ? 'bg-chess-dark' : 'bg-[#111]'} flex items-center justify-center overflow-hidden relative group`}
                 >
                    {i === 5 && <Code className="text-chess-accent/30 group-hover:text-chess-accent transition-colors duration-500 w-1/2 h-1/2" />}
                    {i === 10 && <BookOpen className="text-white/10 group-hover:text-white transition-colors duration-500 w-1/2 h-1/2" />}
                    <div className="absolute inset-0 bg-chess-accent/0 group-hover:bg-chess-accent/10 transition-colors duration-500"></div>
                 </motion.div>
               );
             })}
          </motion.div>
        </motion.section>

        {/* Medium Articles Section */}
        <section id="articles" className="mb-32">
          <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
            <div>
              <h2 className="text-4xl font-black flex items-center gap-3">
                <BookOpen className="text-chess-accent" size={32} />
                Latest Strategies
              </h2>
              <p className="text-gray-400 mt-2">Insights and deep dives from my Medium blog.</p>
            </div>
            <a href="https://dhanushnehru.medium.com/" target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-2 text-chess-accent font-bold hover:text-white transition-colors">
              View All <ArrowRight size={16} />
            </a>
          </div>

          {loadingArticles ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-chess-dark h-80 animate-pulse border border-white/5"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-white/5">
              {articles.map((article, i) => {
                const isDark = i % 2 !== 0;
                // removed unused thumbnail extraction
                
                return (
                  <motion.a 
                    href={article.link}
                    target="_blank"
                    rel="noreferrer"
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`${isDark ? 'bg-chess-dark' : 'bg-[#111]'} p-6 sm:p-8 flex flex-col justify-between h-80 group relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-chess-accent/0 group-hover:bg-chess-accent/5 transition-colors duration-300 z-0"></div>
                    <div className="relative z-10">
                      <div className="text-xs text-gray-500 font-mono mb-4">{new Date(article.pubDate).toLocaleDateString()}</div>
                      <h3 className="text-xl font-bold leading-tight group-hover:text-chess-accent transition-colors line-clamp-4">
                        {article.title}
                      </h3>
                    </div>
                    <div className="relative z-10 flex items-center justify-between text-gray-400 group-hover:text-white mt-4">
                      <span className="text-sm font-semibold uppercase tracking-wider">Read Article</span>
                      <ExternalLink size={16} />
                    </div>
                  </motion.a>
                );
              })}
            </div>
          )}
        </section>

        {/* YouTube Section */}
        <section id="videos" className="mb-32">
          <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
            <div>
              <h2 className="text-4xl font-black flex items-center gap-3">
                <PlayCircle className="text-chess-accent" size={32} />
                Video Tactics
              </h2>
              <p className="text-gray-400 mt-2">Latest content from The Curious Guy.</p>
            </div>
            <a href="https://www.youtube.com/@dhanushnehru" target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-2 text-chess-accent font-bold hover:text-white transition-colors">
              Subscribe <ArrowRight size={16} />
            </a>
          </div>

          {loadingVideos ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-chess-dark h-28 animate-pulse border border-white/5"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videos.map((video, i) => (
                <motion.a
                  href={video.link}
                  target="_blank"
                  rel="noreferrer"
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-chess-dark border border-white/10 p-6 flex items-center gap-6 group hover:border-chess-accent/50 transition-colors"
                >
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-[#111] flex-shrink-0 flex items-center justify-center text-gray-600 group-hover:text-chess-accent group-hover:scale-110 transition-all duration-300">
                    <PlayCircle size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold group-hover:text-white text-gray-200 line-clamp-2">
                      {video.title}
                    </h3>
                    <span className="text-chess-accent text-sm font-mono mt-2 inline-block">Watch on YouTube</span>
                  </div>
                </motion.a>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20 pt-10 pb-10 text-center text-gray-500 font-mono text-sm">
        <p>© {new Date().getFullYear()} Dhanush Nehru. Checkmate.</p>
      </footer>
    </div>
  );
};

export default App;
