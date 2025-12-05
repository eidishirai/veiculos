import { useState } from 'react';
import styles from './VehicleOptionals.module.css';

interface VehicleOptionalsProps {
    opcionais?: string[];
    maxVisible?: number;
}

const OPTIONAL_ICONS: Record<string, string> = {
    // Conforto
    'Ar-condicionado': '❄️',
    'Ar-condicionado digital': '❄️',
    'Bancos de couro': '🪑',
    'Bancos elétricos': '🪑',
    'Direção hidráulica': '🎮',
    'Direção elétrica': '🎮',
    'Vidros elétricos': '🪟',
    'Trava elétrica': '🔒',
    'Retrovisores elétricos': '🪞',
    'Piloto automático (Cruise Control)': '🚗',
    'Volante ajustável': '⚙️',
    'Volante multifuncional': '🎛️',

    // Segurança
    'Airbag motorista': '🛡️',
    'Airbag passageiro': '🛡️',
    'Airbags laterais': '🛡️',
    'Airbags de cortina': '🛡️',
    'Freios ABS': '🛑',
    'Controle de tração': '🔧',
    'Controle de estabilidade': '⚖️',
    'Alarme': '🚨',
    'Sensor de estacionamento': '📡',
    'Câmera de ré': '📹',
    'Sensor de chuva': '🌧️',
    'Sensor crepuscular': '💡',
    'Isofix': '👶',

    // Tecnologia
    'Central multimídia': '📱',
    'GPS/Navegação': '🗺️',
    'Computador de bordo': '💻',
    'Bluetooth': '📶',
    'Entrada USB': '🔌',
    'Entrada AUX': '🔌',
    'Apple CarPlay': '🍎',
    'Android Auto': '🤖',
    'Sistema de som premium': '🔊',
    'Comandos no volante': '🎛️',
    'Chave presencial (Keyless)': '🔑',
    'Partida por botão (Start/Stop)': '▶️',

    // Estilo
    'Rodas de liga leve': '⚙️',
    'Teto solar': '☀️',
    'Teto panorâmico': '🌅',
    'Faróis de neblina': '💡',
    'Faróis de LED': '💡',
    'Faróis de Xenon': '💡',
    'Lanternas de LED': '✨',
    'Acabamento interno premium': '✨',
    'Para-choque na cor do veículo': '🎨',
    'Rack de teto': '📦',
    'Spoiler': '🏎️'
};

export default function VehicleOptionals({ opcionais = [], maxVisible = 6 }: VehicleOptionalsProps) {
    const [showAll, setShowAll] = useState(false);

    if (!opcionais || opcionais.length === 0) {
        return null;
    }

    const visibleOptionals = showAll ? opcionais : opcionais.slice(0, maxVisible);
    const hasMore = opcionais.length > maxVisible;

    return (
        <div className={styles.container}>
            <h4 className={styles.title}>Opcionais</h4>
            <div className={styles.grid}>
                {visibleOptionals.map((optional, index) => (
                    <div key={index} className={styles.item}>
                        <span className={styles.icon}>
                            {OPTIONAL_ICONS[optional] || '✓'}
                        </span>
                        <span>{optional}</span>
                    </div>
                ))}

                {hasMore && !showAll && (
                    <button
                        className={styles.showMore}
                        onClick={() => setShowAll(true)}
                    >
                        + {opcionais.length - maxVisible} mais opcionais
                    </button>
                )}
            </div>
        </div>
    );
}
