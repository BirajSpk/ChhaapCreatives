import React from 'react';

const About = () => {
    return (
        <div className="section-container pb-20 pt-4 animate-fade-in">
            <div className="max-w-3xl mx-auto flex flex-col gap-10">
                <div className="flex flex-col gap-4 text-center">
                    <h1 className="heading-lg dark:text-white">Our Story</h1>
                    <div className="h-1.5 w-24 bg-brand-600 mx-auto rounded-full"></div>
                </div>

                <div className="glass-card p-10 flex flex-col gap-6 leading-relaxed text-gray-700 dark:text-gray-300">
                    <p>
                        Established in the heart of Kathmandu, <strong>Chhaap Creatives</strong> was born from a simple vision: to bridge the gap between high-quality design and professional printing services in Nepal.
                    </p>
                    <p>
                        We specialize in a wide range of services, from traditional print media like banners and visiting cards to modern digital solutions like NFC-enabled business cards. Our team of designers and technicians work tirelessly to ensure that every "Chhaap" (impression) we create is of the highest standard.
                    </p>
                    <div className="bg-brand-600/5 p-6 rounded-2xl border border-brand-200/30 italic text-sm">
                        "Our mission is to empower local businesses in Nepal with world-class branding and printing identity that leaves a lasting impression."
                    </div>
                    <p>
                        Located in Gokarneshwor-5, Jorpati, we take pride in being a local business that serves both individual needs and large-scale corporate requirements.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
                    <div className="glass-card p-8">
                        <h4 className="font-bold text-3xl text-brand-600">500+</h4>
                        <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mt-1">Happy Clients</p>
                    </div>
                    <div className="glass-card p-8">
                        <h4 className="font-bold text-3xl text-brand-600">10k+</h4>
                        <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mt-1">Successful Prints</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
