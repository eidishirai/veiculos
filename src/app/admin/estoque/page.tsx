'use client';

import { useState, useEffect } from 'react';
import { vehicleService, Vehicle } from '@/services/vehicleService';
import styles from './admin-estoque.module.css';
import Link from 'next/link';

export default function AdminEstoquePage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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
        if (searchTerm) {
            const filtered = vehicles.filter(v =>
                v.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                v.modelo.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredVehicles(filtered);
        } else {
            setFilteredVehicles(vehicles);
        }
    }, [searchTerm, vehicles]);

    const handleToggleFeatured = async (vehicleId: string, currentStatus: boolean) => {
        try {
            await vehicleService.updateVehicle(vehicleId, { destaque: !currentStatus });
            await loadVehicles();
        } catch (error) {
            console.error('Erro ao atualizar destaque:', error);
        }
    };

    const handleDelete = async (vehicleId: string, modelo: string) => {
        if (confirm(`Tem certeza que deseja excluir ${modelo}?`)) {
            try {
                await vehicleService.deleteVehicle(vehicleId);
                await loadVehicles();
            } catch (error) {
                console.error('Erro ao excluir veículo:', error);
                alert('Erro ao excluir veículo');
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1>Gerenciar Estoque</h1>
                    <p>Gerencie todos os veículos cadastrados</p>
                </div>
                <Link href="/publicar" className={styles.addButton}>
                    + Novo Veículo
                </Link>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '4rem' }}>
                    Carregando estoque...
                </div>
            ) : filteredVehicles.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '4rem' }}>
                    Nenhum veículo cadastrado.
                </div>
            ) : (
                <div className={styles.grid}>
                    {filteredVehicles.map((vehicle) => (
                        <div key={vehicle.id} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <img
                                    src={vehicle.fotos[0] || 'https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2070&auto=format&fit=crop'}
                                    alt={vehicle.modelo}
                                    className={styles.image}
                                />

                                {/* Badge de Status */}
                                <div className={`${styles.statusBadge} ${vehicle.status === 'disponivel' ? styles.statusDisponivel :
                                        vehicle.status === 'vendido' ? styles.statusVendido :
                                            styles.statusReservado
                                    }`}>
                                    {vehicle.status === 'disponivel' ? '✓ Disponível' :
                                        vehicle.status === 'vendido' ? 'Vendido' :
                                            'Reservado'}
                                </div>

                                {/* Badge de Destaque */}
                                {vehicle.destaque && (
                                    <div className={styles.featuredBadge}>
                                        ★ Destaque
                                    </div>
                                )}
                            </div>

                            <div className={styles.cardBody}>
                                <h3 className={styles.cardTitle}>
                                    {vehicle.marca} {vehicle.modelo}
                                </h3>
                                <div className={styles.cardPrice}>
                                    R$ {vehicle.preco.toLocaleString('pt-BR')}
                                </div>

                                <div className={styles.cardDetails}>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Ano</span>
                                        <span className={styles.detailValue}>{vehicle.ano}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>KM</span>
                                        <span className={styles.detailValue}>{vehicle.km.toLocaleString('pt-BR')}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Combustível</span>
                                        <span className={styles.detailValue}>{vehicle.combustivel}</span>
                                    </div>
                                </div>

                                <div className={styles.actions}>
                                    <Link
                                        href={`/publicar?edit=${vehicle.id}`}
                                        className={`${styles.actionButton} ${styles.editButton}`}
                                    >
                                        ✏️ Editar
                                    </Link>
                                    <button
                                        className={`${styles.actionButton} ${styles.deleteButton}`}
                                        onClick={() => vehicle.id && handleDelete(vehicle.id, vehicle.modelo)}
                                    >
                                        🗑️ Excluir
                                    </button>
                                </div>

                                <div className={styles.toggle}>
                                    <span className={styles.toggleLabel}>Destacar na página inicial</span>
                                    <div
                                        className={`${styles.toggleSwitch} ${vehicle.destaque ? styles.active : ''}`}
                                        onClick={() => vehicle.id && handleToggleFeatured(vehicle.id, vehicle.destaque || false)}
                                    >
                                        <div className={styles.toggleSlider}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
