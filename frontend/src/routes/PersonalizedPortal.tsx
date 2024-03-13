import React from 'react';
import trailImage from './trail.png';

const PersonalizedPortal = () => {
    return (
        <div className="container p-8" style={{ minHeight: '100vh', backgroundImage: `url(${trailImage})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed', backgroundPosition: 'center' }}>
            <h1 className="text-3xl font-bold text-center uppercase my-5">Trail</h1>
            <div className="bg-white shadow-lg rounded-lg p-6 m-6"><p className="text-center mb-5">A personalized portal that connects Amazonians to training and future project recommendations, celebrates achievements through centralized recognition, and enables ideas and best practices sharing across our community.</p></div>
            <div className="flex justify-center">
                <div className="w-full max-w-4xl">
                    <div className="flex justify-around p-6 bg-white shadow-lg rounded-lg">
                        <a href="#" className="p-3 bg-blue-200 rounded-lg">Our Mission and Vision</a>
                        <a href="/recognized-portal" className="p-3 bg-blue-200 rounded-lg">Recognize Excellence</a>
                        <a href="https://vivshri.people.aws.dev" className="p-3 bg-blue-200 rounded-lg">Personalized Training</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalizedPortal;
