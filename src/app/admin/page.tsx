'use client';

import styles from './admin.module.css';

export default function DashboardPage() {
    return (
        <>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Visão Geral</h1>
                    <p className={styles.subtitle}>Acompanhe o desempenho da sua revenda em tempo real.</p>
                </div>
                <div className={styles.dateRange}>
                    Dezembro 2024 ▾
                </div>
            </header>

            {/* KPIs */}
            <div className={styles.kpiGrid}>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiLabel}>Valor em Estoque</div>
                    <div className={styles.kpiValue}>R$ 12.5M</div>
                    <div className={`${styles.kpiTrend} ${styles.trendUp}`}>
                        ↑ 12% vs mês anterior
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiLabel}>Veículos Ativos</div>
                    <div className={styles.kpiValue}>45</div>
                    <div className={styles.kpiTrend} style={{ color: 'var(--text-secondary)' }}>
                        • 3 novos esta semana
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiLabel}>Leads Totais</div>
                    <div className={styles.kpiValue}>128</div>
                    <div className={`${styles.kpiTrend} ${styles.trendUp}`}>
                        ↑ 24% vs mês anterior
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiLabel}>Visualizações</div>
                    <div className={styles.kpiValue}>45.2K</div>
                    <div className={`${styles.kpiTrend} ${styles.trendDown}`}>
                        ↓ 5% vs mês anterior
                    </div>
                </div>
            </div>

            {/* Charts & Lists */}
            <div className={styles.dashboardGrid}>
                {/* Performance Chart */}
                <div className={styles.sectionCard}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Performance de Vendas</h2>
                        <button style={{ color: 'var(--accent-secondary)', fontSize: '0.9rem' }}>Ver Relatório</button>
                    </div>
                    <div className={styles.chartContainer}>
                        {/* Barras simuladas com alturas variadas */}
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((height, i) => (
                            <div
                                key={i}
                                className={styles.chartBar}
                                style={{ height: `${height}%` }}
                                title={`Semana ${i + 1}: ${height}%`}
                            ></div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        <span>Jan</span>
                        <span>Dez</span>
                    </div>
                </div>

                {/* Recent Leads */}
                <div className={styles.sectionCard}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Leads Recentes</h2>
                        <button style={{ color: 'var(--accent-secondary)', fontSize: '0.9rem' }}>Ver Todos</button>
                    </div>
                    <div className={styles.leadsList}>
                        <div className={styles.leadItem}>
                            <div className={styles.leadAvatar}>JD</div>
                            <div className={styles.leadInfo}>
                                <div className={styles.leadName}>João Doria</div>
                                <div className={styles.leadCar}>Interesse: Porsche 911</div>
                            </div>
                            <div className={styles.leadTime}>2m</div>
                        </div>
                        <div className={styles.leadItem}>
                            <div className={styles.leadAvatar}>AS</div>
                            <div className={styles.leadInfo}>
                                <div className={styles.leadName}>Ana Silva</div>
                                <div className={styles.leadCar}>Interesse: BMW M4</div>
                            </div>
                            <div className={styles.leadTime}>1h</div>
                        </div>
                        <div className={styles.leadItem}>
                            <div className={styles.leadAvatar}>RC</div>
                            <div className={styles.leadInfo}>
                                <div className={styles.leadName}>Roberto Carlos</div>
                                <div className={styles.leadCar}>Interesse: Audi RS e-tron</div>
                            </div>
                            <div className={styles.leadTime}>3h</div>
                        </div>
                        <div className={styles.leadItem}>
                            <div className={styles.leadAvatar}>MP</div>
                            <div className={styles.leadInfo}>
                                <div className={styles.leadName}>Maria Paula</div>
                                <div className={styles.leadCar}>Interesse: Mercedes AMG</div>
                            </div>
                            <div className={styles.leadTime}>5h</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
