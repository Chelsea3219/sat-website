import React from 'react';
import styled from 'styled-components';

export default function LoadingHorizontalAnimation2 (text: string) {
    return (
        <StyledWrapper>
            <div className='flex flex-col items-center justify-center h-full space-y-4'>
                <p className='text-xl'>{text}</p>
                <div className="loading">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                </div>
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
    .loading {
    --speed-of-animation: 0.9s;
    --gap: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    gap: 6px;
    height: 100px;
    }

    .loading span {
    width: 8px;
    height: 50px;
    background: var(--color-white);
    animation: scale var(--speed-of-animation) ease-in-out infinite;
    }

    .loading span:nth-child(2) {
    background: var(--color-white);
    animation-delay: -0.8s;
    }
    
    .loading span:nth-child(3) {
    background: var(--color-white);
    animation-delay: -0.7s;
    }
    
    .loading span:nth-child(4) {
    background: var(--color-white);
    animation-delay: -0.6s;
    }
    
    .loading span:nth-child(5) {
    background: var(--color-white);
    animation-delay: -0.5s;
    }
    
    @keyframes scale {
    0%, 40%, 100% {
    transform: scaleY(0.05);
    }
        
    20% {
    transform: scaleY(1);
    }
   }`;