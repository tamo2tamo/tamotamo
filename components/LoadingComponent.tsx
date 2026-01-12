
import React from 'react';

interface LoadingComponentProps {
    message: string;
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-16 h-16 border-4 border-sky-400 border-t-transparent border-solid rounded-full animate-spin mb-6"></div>
            <p className="text-xl font-semibold text-slate-300">{message}</p>
            <p className="text-slate-400 mt-2">AIが最高の学習体験を準備しています。少々お待ちください...</p>
        </div>
    );
};

export default LoadingComponent;
