'use client';

import { useState, useEffect } from 'react';
import { Vehicle } from '@/services/vehicleService';
import Link from 'next/link';
import styles from './FeaturedCarousel.module.css';

interface FeaturedCarouselProps {
    vehicles: Vehicle[];
}

export default function FeaturedCarousel({ vehicles }: FeaturedCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (vehicles.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % vehicles.length);
        }, 5000); // Trocar a cada 5 segundos

        return () => clearInterval(interval);
    }, [vehicles.length]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + vehicles.length) % vehicles.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % vehicles.length);
    };

    if (vehicles.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p>Nenhum veículo em destaque no momento.</p>
            </div>
        );
    }

    const currentVehicle = vehicles[currentIndex];

    return (
        <div className={styles.carousel}>
            <div className={styles.slideContainer}>
                {/* Imagem de fundo */}
                <div
                    className={styles.backgroundImage}
                    style={{ backgroundImage: `url(${currentVehicle.fotos[0]})` }}
                />

                {/* Overlay escuro */}
                <div className={styles.overlay} />

                {/* Conteúdo */}
                <div className={styles.content}>
                    <div className={styles.badge}>EM DESTAQUE</div>

                    <h2 className={styles.brand}>{currentVehicle.marca}</h2>
                    <h1 className={styles.model}>{currentVehicle.modelo}</h1>

                    <div className={styles.specs}>
                        <div className={styles.specItem}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <span>{currentVehicle.ano}</span>
                        </div>
                        <div className={styles.specItem}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <span>{currentVehicle.km.toLocaleString('pt-BR')} km</span>
                        </div>
                        <div className={styles.specItem}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2.69l5.74 5.88-5.74 5.88-5.74-5.88z"></path>
                                <path d="M12 21.31l5.74-5.88-5.74-5.88-5.74 5.88z"></path>
                            </svg>
                            <span>{currentVehicle.combustivel}</span>
                        </div>
                    </div>

                    <div className={styles.price}>
                        R$ {currentVehicle.preco.toLocaleString('pt-BR')}
                    </div>

                    <Link href={`/veiculo/${currentVehicle.id}`} className={styles.viewButton}>
                        Ver Detalhes
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </Link>
                </div>

                {/* Navegação */}
                <button className={`${styles.navButton} ${styles.navPrev}`} onClick={goToPrevious}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                <button className={`${styles.navButton} ${styles.navNext}`} onClick={goToNext}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>

                {/* Indicadores */}
                <div className={styles.indicators}>
                    {vehicles.map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.indicator} ${index === currentIndex ? styles.indicatorActive : ''}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Ir para slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
