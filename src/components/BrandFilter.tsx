import styles from './BrandFilter.module.css';
import { getBrandLogo } from '@/utils/brandLogos';

interface BrandFilterProps {
    brands: string[];
    selectedBrand: string;
    onSelectBrand: (brand: string) => void;
}

export default function BrandFilter({ brands, selectedBrand, onSelectBrand }: BrandFilterProps) {
    if (brands.length === 0) return null;

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Navegar por Marca</h3>
            <div className={styles.grid}>
                <button
                    className={`${styles.brandButton} ${selectedBrand === '' ? styles.active : ''}`}
                    onClick={() => onSelectBrand('')}
                >
                    <span style={{ fontSize: '24px' }}>🚗</span>
                    <span className={styles.name}>Todas</span>
                </button>

                {brands.map(brand => (
                    <button
                        key={brand}
                        className={`${styles.brandButton} ${selectedBrand === brand ? styles.active : ''}`}
                        onClick={() => onSelectBrand(brand)}
                    >
                        {getBrandLogo(brand) ? (
                            <img
                                src={getBrandLogo(brand)!}
                                alt={brand}
                                className={styles.logo}
                            />
                        ) : (
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>
                                {brand.charAt(0)}
                            </span>
                        )}
                        <span className={styles.name}>{brand}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
