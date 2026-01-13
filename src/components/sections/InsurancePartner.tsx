import React from 'react';
import protectiveLogo from '../../assets/images/protective-life-logo.png';
import { partners } from '../../data/teamData.ts';

const partnerDescriptionPool = [
    '24/7 emergency-ready care for BrightLife members.',
    'Modern diagnostics and experienced medical teams.',
    'Priority admission support through our concierge desk.',
    'Nationwide network access with cashless facilities.'
];

const InsurancePartner: React.FC = () => (
    <section id="insurancepartner" className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 font-heading tracking-tight">Our Insurance Partner</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-16 leading-relaxed font-body">
                We are proud to partner with Protective Islami Life Insurance Ltd. to provide our members with the best possible coverage and security.
            </p>
            <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-2xl shadow-xl">
                <img src={protectiveLogo} alt="Protective Islami Life Ins. Ltd. Logo" className="h-24 mx-auto mb-8"/>
                <h3 className="text-3xl font-bold text-gray-800 font-heading">Protective Islami Life Ins. Ltd.</h3>
                <p className="text-gray-600 mt-4 mb-8">
                    Protective Islami Life Insurance Limited (PILIL) is the fastest growing Life Insurance Company in Bangladesh. Being the leading group insurer, PILIL has been working towards financial inclusion; PILIL quite extensively with over 1 Million lives coming under the umbrella of PILIL.
                </p>
                <a href="https://www.protectivelife.com.bd/" target="_blank" rel="noopener noreferrer" className="btn-gold-gradient text-green-900 font-bold py-3 px-8 rounded-full inline-block">
                    Visit Their Website
                </a>
            </div>

            {/* Hospital Partners Section */}
            <div className="mt-20">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 font-heading tracking-tight">Our Hospital Partners</h2>
                <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-12 leading-relaxed font-body">
                    We have partnered with leading hospitals across Bangladesh to ensure our members receive the best healthcare services.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {partners.map((partner, index) => (
                        <div 
                            key={index} 
                            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 hover:-translate-y-2 group"
                        >
                            <div className="bg-white rounded-xl p-4 mb-4 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                                <img 
                                    src={partner.logo} 
                                    alt={`${partner.name} photo`} 
                                    className="h-28 w-full mx-auto object-contain rounded-lg"
                                />
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {partnerDescriptionPool[index % partnerDescriptionPool.length]}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

export default InsurancePartner;
