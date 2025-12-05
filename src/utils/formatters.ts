/**
 * Formata um valor numérico para moeda brasileira (R$)
 * @param value - Valor em centavos ou string com dígitos
 * @returns String formatada (ex: "1.500,00")
 */
export const formatCurrency = (value: string | number): string => {
    // Se for número, converter para string
    let stringValue = typeof value === 'number' ? value.toString() : value;

    // Remove tudo que não é dígito
    const digits = stringValue.replace(/\D/g, '');

    // Se vazio, retornar 0,00
    if (!digits) return '0,00';

    // Converter para número (considerando centavos)
    const number = parseInt(digits) / 100;

    // Formatar com separadores brasileiros
    return number.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

/**
 * Remove formatação e retorna apenas o valor numérico
 * @param formattedValue - Valor formatado (ex: "1.500,00")
 * @returns Número sem formatação
 */
export const parseCurrency = (formattedValue: string): number => {
    const digits = formattedValue.replace(/\D/g, '');
    return parseInt(digits) / 100;
};

/**
 * Formata valor enquanto o usuário digita
 * @param input - Valor digitado pelo usuário
 * @returns Valor formatado
 */
export const formatCurrencyInput = (input: string): string => {
    return formatCurrency(input);
};
