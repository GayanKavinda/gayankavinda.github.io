import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { POSTS } from "@/constants/blog";

const ALL_TAGS = ["All", ...Array.from(new Set(POSTS.map((p) => p.tag)))];

export const BlogList = () => {
  const [active, setActive] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filtered =
    active === "All" ? POSTS : POSTS.filter((p) => p.tag === active);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 md:pt-36 pb-24 max-w-[860px] mx-auto px-6 md:px-10">

        {/* Back */}
        <button
          onClick={() => navigate("/#blog")}
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/35 hover:text-[#D4891A] transition-colors mb-10 group"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="group-hover:-translate-x-1 transition-transform"
          >
            <path
              d="M8 2L3 6l5 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Home
        </button>

        {/* Header */}
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#E8A820] mb-3">
          // Writing
        </p>
        <h1 className="font-playfair font-black text-[clamp(36px,6vw,56px)] text-foreground leading-tight tracking-tight">
          From the{" "}
          <em className="italic text-[#C41E3A]">Trenches</em>
        </h1>
        <div className="flex items-center gap-3 mt-4 mb-8">
          <div className="w-10 h-px bg-gradient-to-r from-transparent to-[#C41E3A]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4891A]" />
        </div>

        {/* Tag filter */}
        <div className="flex gap-2 flex-wrap mb-10">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActive(tag)}
              className="font-mono text-[10px] uppercase tracking-[0.1em] px-3.5 py-1.5 rounded-full border transition-all duration-150"
              style={{
                borderColor:
                  active === tag ? "#C41E3A" : "hsl(var(--border))",
                background:
                  active === tag
                    ? "rgba(196,30,58,0.08)"
                    : "transparent",
                color:
                  active === tag
                    ? "#C41E3A"
                    : "hsl(var(--foreground)/0.45)",
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Post list */}
        <div className="space-y-4">
          {filtered.map((post) => (
            <div
              key={post.slug}
              className="group rounded-xl border border-border bg-card p-5 md:p-6 cursor-pointer hover:border-[#D4891A]/40 hover:-translate-y-[2px] transition-all duration-200 relative overflow-hidden"
              onClick={() => navigate(`/blog/${post.slug}`)}
            >
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#C41E3A] to-[#D4891A] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                <span
                  className="font-mono text-[9px] uppercase tracking-[0.12em] px-2.5 py-1 rounded-full border"
                  style={{
                    color: post.tagColor,
                    borderColor: `${post.tagColor}30`,
                    background: `${post.tagColor}10`,
                  }}
                >
                  {post.tag}
                </span>
                <span className="font-mono text-[9px] text-foreground/30">
                  {post.date}
                </span>
                <span className="ml-auto font-mono text-[9px] text-foreground/25">
                  {post.readTime}
                </span>
              </div>
              <h2 className="font-jakarta font-bold text-[16px] md:text-[18px] text-foreground leading-snug tracking-tight group-hover:text-[#D4891A] transition-colors mb-2">
                {post.title}
              </h2>
              <p className="font-sans text-[13px] text-foreground/50 leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogList;
