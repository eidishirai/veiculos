import styles from './OptionalSelector.module.css';
import { VEHICLE_OPTIONALS } from '@/utils/vehicleOptionals';

interface OptionalSelectorProps {
    selectedOptionals: string[];
    onChange: (optionals: string[]) => void;
}

export default function OptionalSelector({ selectedOptionals, onChange }: OptionalSelectorProps) {
    const handleToggle = (optional: string) => {
        if (selectedOptionals.includes(optional)) {
            onChange(selectedOptionals.filter(o => o !== optional));
        } else {
            onChange([...selectedOptionals, optional]);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.categories}>
                {VEHICLE_OPTIONALS.map(category => {
                    const selectedInCategory = category.items.filter(item =>
                        selectedOptionals.includes(item)
                    ).length;

                    return (
                        <div key={category.name} className={styles.category}>
                            <div className={styles.categoryHeader}>
                                <span className={styles.categoryIcon}>{category.icon}</span>
                                <span className={styles.categoryName}>{category.name}</span>
                                {selectedInCategory > 0 && (
                                    <span className={styles.selectedCount}>
                                        {selectedInCategory} selecionado{selectedInCategory > 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>
                            <div className={styles.itemsGrid}>
                                {category.items.map(item => (
                                    <label key={item} className={styles.checkboxItem}>
                                        <input
                                            type="checkbox"
                                            checked={selectedOptionals.includes(item)}
                                            onChange={() => handleToggle(item)}
                                        />
                                        <span className={styles.checkboxLabel}>{item}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
