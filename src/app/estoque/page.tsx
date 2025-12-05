'use client';

import { useState, useEffect } from 'react';
import { vehicleService, Vehicle } from '@/services/vehicleService';
import styles from './estoque.module.css';
import Link from 'next/link';

export default function EstoquePage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [brandFilter, setBrandFilter] = useState('');

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            const data = await vehicleService.getVehicles();
            setVehicles(data);
            setFilteredVehicles(data);
        } catch (error) {
            console.error('Erro ao carregar veículos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let result = vehicles;

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(v =>
                v.marca.toLowerCase().includes(lowerTerm) ||
                v.modelo.toLowerCase().includes(lowerTerm)
            );
        }

        if (brandFilter) {
            result = result.filter(v => v.marca === brandFilter);
        }

        setFilteredVehicles(result);
    }, [searchTerm, brandFilter, vehicles]);

    // Extrair marcas únicas para o filtro
    const brands = Array.from(new Set(vehicles.map(v => v.marca))).sort();

    return (
        <div className={styles.container}>
            {/* Hero & Filters */}
            <div className={styles.hero}>
                <h1 className={styles.heroTitle}>Nossa Coleção</h1>
                <p className={styles.heroSubtitle}>
                    Explore nossa seleção exclusiva de veículos premium, inspecionados e certificados.
                </p>

                <div className={styles.filters}>
                    <input
                        type="text"
                        placeholder="Buscar por modelo..."
                        className={styles.filterInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className={styles.filterSelect}
                        value={brandFilter}
                        onChange={(e) => setBrandFilter(e.target.value)}
                    >
                        <option value="">Todas as Marcas</option>
                        {brands.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className={styles.gridSection}>
                {loading ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '4rem' }}>
                        Carregando coleção...
                    </div>
                ) : filteredVehicles.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '4rem' }}>
                        Nenhum veículo encontrado com os filtros selecionados.
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {filteredVehicles.map((vehicle) => (
                            <Link key={vehicle.id} href={`/veiculo/${vehicle.id}`} className={styles.card}>
                                <div className={styles.imageWrapper}>
                                    <img
                                        src={vehicle.fotos[0]}
                                        alt={vehicle.modelo}
                                        className={styles.image}
                                    />
                                    {vehicle.status === 'vendido' && (
                                        <span className={styles.soldBadge}>VENDIDO</span>
                                    )}
                                </div>

                                <div className={styles.cardContent}>
                                    <span className={styles.brand}>{vehicle.marca}</span>
                                    <h3 className={styles.model}>{vehicle.modelo}</h3>
                                    <div className={styles.price}>
                                        R$ {vehicle.preco.toLocaleString('pt-BR')}
                                    </div>

                                    <div className={styles.specs}>
                                        <div className={styles.specItem}>
                                            <span>📅</span> {vehicle.ano}
                                        </div>
                                        <div className={styles.specItem}>
                                            <span>🛣️</span> {vehicle.km.toLocaleString('pt-BR')} km
                                        </div>
                                        <div className={styles.specItem}>
                                            <span>⛽</span> {vehicle.combustivel}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.viewButton}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
