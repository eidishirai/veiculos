'use client';

import Link from 'next/link';
import styles from './admin.module.css';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <div className={styles.main}>
            {/* Sidebar Fixa */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logo}>
                        ADMIN <span>PANEL</span>
                    </div>
                </div>

                <nav className={styles.nav}>
                    <Link href="/publicar" className={styles.navLink}>
                        <span>Novo Veículo</span>
                    </Link>
                    <Link
                        href="/admin"
                        className={`${styles.navLink} ${isActive('/admin') ? styles.navLinkActive : ''}`}
                    >
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        href="/admin/estoque"
                        className={`${styles.navLink} ${isActive('/admin/estoque') ? styles.navLinkActive : ''}`}
                    >
                        <span>Estoque</span>
                    </Link>
                    <Link href="#" className={styles.navLink}>
                        <span>Leads</span>
                    </Link>
                    <Link href="#" className={styles.navLink}>
                        <span>Configurações</span>
                    </Link>
                </nav>

                <Link href="/" className={styles.backLink}>
                    ← Voltar ao Site
                </Link>
            </aside>

            {/* Conteúdo Principal */}
            <main className={styles.content}>
                <div className={styles.contentInner}>
                    {children}
                </div>
            </main>
        </div>
    );
}
