'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { vehicleService, Vehicle } from '@/services/vehicleService';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import BrandFilter from '@/components/BrandFilter';
import VehicleOptionals from '@/components/VehicleOptionals';
import { getBrandLogo } from '@/utils/brandLogos';

export default function Home() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
    const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);

    // Search & Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Load vehicles from Firebase (or fallback dummy data)
    const loadVehicles = async () => {
        try {
            const allVehicles = await vehicleService.getVehicles();

            // If no vehicles returned, use dummy data for development
            const data = allVehicles.length ? allVehicles : [
                {
                    id: 'dummy-1',
                    marca: 'Fiat',
                    modelo: 'Uno Mile',
                    preco: 35000,
                    fotos: ['https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2070&auto=format&fit=crop'],
                    ano: '2020',
                    km: 15000,
                    combustivel: 'Flex',
                    status: 'disponivel' as const,
                    destaque: true,
                    mostrarFipe: false,
                    precoFipe: undefined,
                    createdAt: new Date(),
                    cor: 'Branco',
                    transmissao: 'Manual',
                    descricao: 'Veículo em ótimo estado de conservação.'
                },
            ];

            // Filter featured AFTER defining data (including dummy)
            const featured = data
                .filter(v => v.destaque && v.status === 'disponivel')
                .sort((a, b) => {
                    const getDate = (val: any) => {
                        if (val && typeof val.toDate === 'function') return val.toDate();
                        return new Date(val);
                    };
                    return getDate(b.createdAt).getTime() - getDate(a.createdAt).getTime();
                })
                .slice(0, 10);

            setVehicles(data);
            setFilteredVehicles(data);
            setFeaturedVehicles(featured);
        } catch (error) {
            console.error('Erro ao carregar veículos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVehicles();
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter Logic
    useEffect(() => {
        let result = vehicles;

        if (selectedBrand) {
            result = result.filter(v => v.marca === selectedBrand);
        }

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(v =>
                v.marca.toLowerCase().includes(lowerTerm) ||
                v.modelo.toLowerCase().includes(lowerTerm)
            );
        }

        setFilteredVehicles(result);
    }, [searchTerm, selectedBrand, vehicles]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);

        if (term.length > 0) {
            const lowerTerm = term.toLowerCase();
            const unique = new Set<string>();
            vehicles.forEach(v => {
                const brand = v.marca;
                const model = v.modelo;
                const full = `${brand} ${model}`;
                if (brand.toLowerCase().includes(lowerTerm)) unique.add(brand);
                if (model.toLowerCase().includes(lowerTerm)) unique.add(model);
                if (full.toLowerCase().includes(lowerTerm)) unique.add(full);
            });
            setSuggestions(Array.from(unique).slice(0, 5));
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setSearchTerm(suggestion);
        setShowSuggestions(false);
    };

    // Extract unique brands for filter
    const uniqueBrands = Array.from(new Set(vehicles.map(v => v.marca))).sort();

    return (
        <main className={styles.main}>
            {/* Header Premium */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.logo}>VEÍCULOS <span>PREMIUM</span></div>
                    <nav className={styles.nav}>
                        <Link href="#collection" className={styles.navLink}>Coleção</Link>
                        <Link href="#about" className={styles.navLink}>Sobre</Link>
                        <Link href="#contact" className={styles.navLink}>Contato</Link>
                    </nav>
                    <Link href="/admin/estoque" className={styles.adminLink}>Área do Revendedor</Link>
                </div>
            </header>

            {/* Hero Carousel */}
            <FeaturedCarousel vehicles={featuredVehicles} />

            {/* Search Section */}
            <div className={styles.searchSection}>
                <div className={styles.contentWrapper}>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder="Buscar por marca ou modelo..."
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <button className={styles.searchButton}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className={styles.suggestionsContainer} ref={searchRef}>
                                {suggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className={styles.suggestionItem}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        <span className={styles.suggestionIcon}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                        </span>
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Brand Filter Section */}
            <div className={styles.contentWrapper}>
                <BrandFilter
                    brands={uniqueBrands}
                    selectedBrand={selectedBrand}
                    onSelectBrand={setSelectedBrand}
                />
            </div>

            {/* Featured Collection */}
            <section id="collection" className={styles.collection}>
                <div className={styles.contentWrapper}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>
                            Últimos <span>Lançamentos</span>
                        </h2>
                        <Link href="/estoque" className={styles.viewAll}>
                            Ver Todo o Estoque
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </Link>
                    </div>

                    <div className={styles.grid}>
                        {loading ? (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                                Carregando veículos...
                            </div>
                        ) : filteredVehicles.length === 0 ? (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem' }}>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Nenhum veículo encontrado.</p>
                                {selectedBrand && (
                                    <button
                                        onClick={() => setSelectedBrand('')}
                                        style={{ color: 'var(--accent-primary)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        Limpar filtro de marca
                                    </button>
                                )}
                            </div>
                        ) : (
                            filteredVehicles.map(vehicle => (
                                <div key={vehicle.id} className={styles.card}>
                                    <div className={styles.cardImageWrapper}>
                                        <img
                                            src={vehicle.fotos[0] || 'https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2070&auto=format&fit=crop'}
                                            alt={`${vehicle.marca} ${vehicle.modelo}`}
                                            className={styles.cardImage}
                                        />
                                        {/* Badge FIPE */}
                                        {vehicle.mostrarFipe && vehicle.precoFipe && (() => {
                                            const precoFipeNum = Number(vehicle.precoFipe.replace(/[^0-9,]/g, '').replace(',', '.'));
                                            if (vehicle.preco < precoFipeNum) {
                                                return (
                                                    <div className={styles.fipeBadge}>
                                                        Abaixo da FIPE
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()}

                                        {vehicle.status === 'vendido' && (
                                            <div className={styles.soldOverlay}>
                                                <span className={styles.soldBadge}>
                                                    VENDIDO
                                                </span>
                                            </div>
                                        )}

                                        <div className={styles.cardOverlay}>
                                            <Link href={`/veiculo/${vehicle.id}`} className={styles.viewDetailsBtn}>
                                                Ver Detalhes
                                            </Link>
                                        </div>
                                    </div>

                                    <div className={styles.cardInfo}>
                                        <div className={styles.cardHeader}>
                                            {getBrandLogo(vehicle.marca) ? (
                                                <img src={getBrandLogo(vehicle.marca)!} alt={vehicle.marca} className={styles.brandLogo} />
                                            ) : (
                                                <span className={styles.cardBrand}>{vehicle.marca}</span>
                                            )}
                                            <h3 className={styles.cardTitle}>{vehicle.modelo}</h3>
                                            <span className={styles.cardPrice}>R$ {vehicle.preco.toLocaleString('pt-BR')}</span>
                                        </div>

                                        <div className={styles.cardFooter}>
                                            <div className={styles.specItem}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                    <line x1="16" y1="2" x2="16" y2="6" />
                                                    <line x1="8" y1="2" x2="8" y2="6" />
                                                    <line x1="3" y1="10" x2="21" y2="10" />
                                                </svg>
                                                {vehicle.ano}
                                            </div>
                                            <div className={styles.specItem}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <polyline points="12 6 12 12 16 14" />
                                                </svg>
                                                {vehicle.km.toLocaleString('pt-BR')} km
                                            </div>
                                            <div className={styles.specItem}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M12 2.69l5.74 5.88-5.74 5.88-5.74-5.88z" />
                                                    <path d="M12 21.31l5.74-5.88-5.74-5.88-5.74 5.88z" />
                                                </svg>
                                                {vehicle.combustivel}
                                            </div>
                                        </div>

                                        {/* Opcionais do Veículo */}
                                        <VehicleOptionals opcionais={vehicle.opcionais} maxVisible={4} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
