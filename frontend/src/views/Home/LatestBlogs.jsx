import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Calendar, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { blogController } from '../../controllers/blogController';

const LatestBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsData = await blogController.getRecent(api, 3);
        setBlogs(blogsData);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-brand-600" size={32} />
      </div>
    );
  }

  if (blogs.length === 0) {
    return <div className="text-center text-gray-500 py-20">No blogs available yet</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <Link
          key={blog.id}
          to={`/blogs/${blog.slug}`}
          className="glass-card overflow-hidden group hover:border-brand-500/30 transition-all flex flex-col h-full"
        >
          {/* Blog Image */}
          {blog.featuredImage ? (
            <div className="h-48 overflow-hidden bg-gray-100 dark:bg-white/5">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ) : (
            <div className="h-48 bg-gradient-to-br from-brand-200 to-brown-300 dark:from-brand-900/50 dark:to-brown-900/50 flex items-center justify-center">
              <span className="text-white/30 font-display text-2xl font-black">BLOG</span>
            </div>
          )}

          {/* Content */}
          <div className="p-6 flex flex-col gap-3 flex-1">
            {/* Date */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Calendar size={14} />
              <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>

            {/* Title */}
            <h3 className="font-display font-bold dark:text-white text-base line-clamp-2 group-hover:text-brand-600 transition-colors">
              {blog.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed flex-1">
              {blog.metaDescription || blog.content?.substring(0, 100) || 'Read more about design and printing...'}
            </p>

            {/* CTA */}
            <div className="flex items-center gap-2 text-sm font-bold text-brand-600 dark:text-brand-400 mt-auto pt-4 group-hover:gap-3 transition-all">
              Read More <ArrowRight size={16} />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default LatestBlogs;
