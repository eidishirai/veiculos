/**
 * Lista de opcionais disponíveis para veículos
 * Baseada nos itens mais anunciados em revendas brasileiras (Webmotors, OLX, iCarros)
 * Organizados por categoria para facilitar a seleção
 */

export interface OptionalCategory {
    name: string;
    icon: string;
    items: string[];
}

export const VEHICLE_OPTIONALS: OptionalCategory[] = [
    {
        name: 'Conforto',
        icon: '🛋️',
        items: [
            'Ar-condicionado',
            'Ar-condicionado digital',
            'Ar-condicionado automático',
            'Bancos de couro',
            'Bancos em tecido premium',
            'Bancos elétricos',
            'Banco do motorista com regulagem de altura',
            'Banco com ajuste lombar',
            'Bancos aquecidos',
            'Direção hidráulica',
            'Direção elétrica',
            'Vidros elétricos (dianteiros)',
            'Vidros elétricos (4 portas)',
            'Trava elétrica',
            'Travas elétricas nas 4 portas',
            'Retrovisores elétricos',
            'Retrovisores rebatíveis',
            'Piloto automático (Cruise Control)',
            'Controle automático de velocidade adaptativo',
            'Volante ajustável em altura',
            'Volante com regulagem de altura e profundidade',
            'Volante multifuncional',
            'Volante revestido em couro',
            'Desembaçador traseiro',
            'Apoio de braço central'
        ]
    },
    {
        name: 'Segurança',
        icon: '🛡️',
        items: [
            'Airbag motorista',
            'Airbag passageiro',
            'Airbags laterais',
            'Airbags de cortina',
            'Airbags (6 ou mais)',
            'Freios ABS',
            'Controle de tração (TCS)',
            'Controle de estabilidade (ESP/ESC)',
            'EBD (Distribuição eletrônica de frenagem)',
            'Assistente de partida em rampa',
            'Alarme',
            'Alarme original de fábrica',
            'Imobilizador eletrônico',
            'Sensor de estacionamento traseiro',
            'Sensor de estacionamento dianteiro',
            'Câmera de ré',
            'Câmera 360 graus',
            'Sensor de chuva',
            'Sensor crepuscular (faróis automáticos)',
            'Faróis de neblina',
            'Faróis auxiliares',
            'Luz diurna (DRL)',
            'Isofix (fixação para cadeirinha)',
            'Blindagem',
            'Extintor de incêndio',
            'Kit de primeiros socorros'
        ]
    },
    {
        name: 'Tecnologia',
        icon: '📱',
        items: [
            'Central multimídia',
            'Central multimídia touchscreen',
            'GPS/Navegação',
            'Computador de bordo',
            'Painel digital',
            'Bluetooth',
            'Conexão USB',
            'Entrada AUX',
            'Entrada SD Card',
            'Apple CarPlay',
            'Android Auto',
            'Carregador wireless (indução)',
            'Sistema de som premium',
            'Alto-falantes (6 ou mais)',
            'Subwoofer',
            'Comandos de áudio no volante',
            'Chave presencial (Keyless)',
            'Partida por botão (Start/Stop)',
            'Vidros com acionamento sequencial (one touch)',
            'Espelhos retrovisores com antiofuscante automático',
            'Sistema de estacionamento automático',
            'Alerta de ponto cego',
            'Alerta de colisão frontal',
            'Frenagem automática de emergência'
        ]
    },
    {
        name: 'Estilo e Acabamento',
        icon: '✨',
        items: [
            'Rodas de liga leve',
            'Rodas de liga leve (aro 15)',
            'Rodas de liga leve (aro 16 ou maior)',
            'Calotas',
            'Teto solar',
            'Teto panorâmico',
            'Teto solar elétrico',
            'Faróis de LED',
            'Faróis de Xenon',
            'Faróis de neblina com LED',
            'Lanternas de LED',
            'Acabamento interno premium',
            'Revestimento em couro no painel',
            'Pedais esportivos',
            'Para-choque na cor do veículo',
            'Rack de teto',
            'Bagageiro de teto',
            'Spoiler',
            'Aerofólio',
            'Frisos laterais cromados',
            'Apliques cromados',
            'Maçanetas na cor do veículo',
            'Escapamento cromado',
            'Santo Antônio (para picapes)'
        ]
    },
    {
        name: 'Motor e Performance',
        icon: '⚙️',
        items: [
            'Motor turbo',
            'Injeção eletrônica',
            'Câmbio manual',
            'Câmbio automático',
            'Câmbio automatizado',
            'Câmbio CVT',
            'Tração 4x4',
            'Tração integral',
            'Modo esportivo (Sport)',
            'Modo econômico (ECO)',
            'Paddle shifters (borboletas no volante)',
            'Suspensão esportiva',
            'Suspensão regulável'
        ]
    }
];

// Função helper para obter todos os opcionais em uma lista única
export const getAllOptionals = (): string[] => {
    return VEHICLE_OPTIONALS.flatMap(category => category.items).sort();
};

// Função helper para buscar a categoria de um opcional
export const getCategoryForOptional = (optional: string): string | null => {
    for (const category of VEHICLE_OPTIONALS) {
        if (category.items.includes(optional)) {
            return category.name;
        }
    }
    return null;
};

// Opcionais mais populares (para destacar em filtros)
export const POPULAR_OPTIONALS = [
    'Ar-condicionado',
    'Direção hidráulica',
    'Direção elétrica',
    'Vidros elétricos (4 portas)',
    'Trava elétrica',
    'Alarme',
    'Airbag',
    'Freios ABS',
    'Câmera de ré',
    'Central multimídia',
    'Bluetooth',
    'Rodas de liga leve',
    'Sensor de estacionamento'
];
