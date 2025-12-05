'use client';

import { useState, useEffect } from 'react';
import { vehicleService, Vehicle } from '@/services/vehicleService';
import styles from './page.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function VehicleDetails({ params }: { params: { id: string } }) {
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const router = useRouter();

    useEffect(() => {
        async function loadVehicle() {
            try {
                if (!params.id) return;
                const data = await vehicleService.getVehicleById(params.id);
                if (!data) {
                    // Se não encontrar, volta para home ou mostra erro
                    // router.push('/'); // Opcional: redirecionar
                }
                setVehicle(data);
            } catch (error) {
                console.error('Erro ao carregar veículo:', error);
            } finally {
                setLoading(false);
            }
        }
        loadVehicle();
    }, [params.id]);

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000',
                color: '#fff'
            }}>
                Carregando detalhes...
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000',
                color: '#fff',
                gap: '1rem'
            }}>
                <h2>Veículo não encontrado</h2>
                <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                    Voltar para a Home
                </Link>
            </div>
        );
    }

    const whatsappMessage = `Olá! Vi o ${vehicle.marca} ${vehicle.modelo} no site e gostaria de mais informações.`;
    const whatsappLink = `https://wa.me/5511999999999?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <div className={styles.container}>
            {/* Hero Section com Imagem Full Width */}
            <div className={styles.hero}>
                <Link href="/" className={styles.backButton}>
                    ← Voltar
                </Link>

                <img
                    src={vehicle.fotos[activeImageIndex] || '/placeholder-car.jpg'}
                    alt={`${vehicle.marca} ${vehicle.modelo}`}
                    className={styles.heroImage}
                />
                <div className={styles.heroOverlay}></div>

                {/* Thumbnails Flutuantes */}
                <div className={styles.thumbnails}>
                    {vehicle.fotos.map((foto, index) => (
                        <div
                            key={index}
                            className={`${styles.thumbnail} ${index === activeImageIndex ? styles.active : ''}`}
                            onClick={() => setActiveImageIndex(index)}
                        >
                            <img src={foto} alt={`Vista ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>

            <main className={styles.main}>
                {/* Informações */}
                <div className={styles.details}>
                    <div className={styles.header}>
                        <div className={styles.headerLeft}>
                            <span className={styles.brand}>{vehicle.marca}</span>
                            <h1 className={styles.title}>{vehicle.modelo}</h1>
                        </div>
                        <div className={styles.price}>
                            R$ {vehicle.preco.toLocaleString('pt-BR')}
                            {vehicle.mostrarFipe && vehicle.precoFipe && (
                                (() => {
                                    const precoFipeNum = Number(vehicle.precoFipe.replace(/[^0-9,]/g, '').replace(',', '.'));
                                    if (vehicle.preco < precoFipeNum) {
                                        const diff = precoFipeNum - vehicle.preco;
                                        return (
                                            <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                <span style={{ fontSize: '0.9rem', color: '#64748b', textDecoration: 'line-through', fontWeight: 'normal' }}>
                                                    FIPE: {vehicle.precoFipe}
                                                </span>
                                                <span style={{ color: '#0284c7', fontWeight: '600', fontSize: '0.9rem' }}>
                                                    Economia de R$ {diff.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        );
                                    }
                                })()
                            )}
                        </div>
                    </div>

                    <div className={styles.specsGrid}>
                        <div className={styles.specItem}>
                            <span className={styles.specLabel}>Ano</span>
                            <span className={styles.specValue}>{vehicle.ano}</span>
                        </div>
                        <div className={styles.specItem}>
                            <span className={styles.specLabel}>Quilometragem</span>
                            <span className={styles.specValue}>{vehicle.km.toLocaleString('pt-BR')} km</span>
                        </div>
                        <div className={styles.specItem}>
                            <span className={styles.specLabel}>Câmbio</span>
                            <span className={styles.specValue}>{vehicle.transmissao}</span>
                        </div>
                        <div className={styles.specItem}>
                            <span className={styles.specLabel}>Combustível</span>
                            <span className={styles.specValue}>{vehicle.combustivel}</span>
                        </div>
                        <div className={styles.specItem}>
                            <span className={styles.specLabel}>Cor</span>
                            <span className={styles.specValue}>{vehicle.cor}</span>
                        </div>
                        <div className={styles.specItem}>
                            <span className={styles.specLabel}>Final da Placa</span>
                            <span className={styles.specValue}>***</span>
                        </div>
                    </div>

                    <div className={styles.description}>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Sobre este veículo</h3>
                        <p>{vehicle.descricao || 'Sem descrição disponível para este veículo.'}</p>
                    </div>

                    <div className={styles.actions}>
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.whatsappButton}
                        >
                            <span>💬</span> Tenho Interesse
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}
