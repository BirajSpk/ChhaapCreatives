import React, { useState, useEffect } from 'react';
import { ArrowRight, Loader2, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { serviceController } from '../../controllers/serviceController';

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesData = await serviceController.getFeatured(api, 4);
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-brand-600" size={32} />
      </div>
    );
  }

  // Fallback services if none from API
  const displayServices = services.length > 0 ? services : [
    {
      id: 1,
      name: 'Stickers & Labels',
      description: 'Vinyl, Paper, Transparent and specialized stickers for all purposes.',
      slug: 'stickers'
    },
    {
      id: 2,
      name: 'Flex & Banners',
      description: 'Large format printing with vibrant colors and durable materials for outdoors.',
      slug: 'banners'
    },
    {
      id: 3,
      name: 'NFC Business Cards',
      description: 'The future of networking. Smart digital cards for the modern professional era.',
      slug: 'nfc'
    },
    {
      id: 4,
      name: 'Photo Frames',
      description: 'Beautifully crafted frames to preserve your most precious memories forever.',
      slug: 'frames'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayServices.map((service) => (
        <div
          key={service.id}
          className="glass-card p-6 flex flex-col gap-4 group hover:-translate-y-2 transition-all duration-300"
        >
          {/* Icon/Image */}
          <div className="h-20 w-20 flex items-center justify-center rounded-2xl bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 group-hover:bg-brand-600 group-hover:text-white transition-all">
            {service.images?.[0]?.url ? (
              <img
                src={service.images[0].url}
                alt={service.name}
                className="h-full w-full object-cover rounded-2xl"
              />
            ) : (
              <Phone size={32} />
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col gap-2 flex-1">
            <h3 className="font-display font-bold dark:text-white text-base">{service.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
              {service.description || 'Premium service tailored for your needs.'}
            </p>
          </div>

          {/* Price (if available) */}
          {service.basePrice && (
            <div className="text-sm font-bold text-brand-600 dark:text-brand-400">
              From Rs. {parseFloat(service.basePrice).toLocaleString()}
            </div>
          )}

          {/* CTA */}
          <Link
            to="/contact"
            className="text-sm font-bold text-brand-600 dark:text-brand-400 mt-2 inline-flex items-center gap-1 group-hover:gap-2 transition-all hover:text-brand-700"
          >
            Contact Now <ArrowRight size={16} />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ServicesSection;
