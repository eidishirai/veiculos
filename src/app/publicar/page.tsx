'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import styles from './publicar.module.css';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { vehicleService } from '@/services/vehicleService';
import { fipeService } from '@/services/fipeService';
import { formatCurrency, parseCurrency } from '@/utils/formatters';
import OptionalSelector from '@/components/OptionalSelector';

function PublicarContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');
    const isEditing = !!editId;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    // Photo States
    const [existingPhotos, setExistingPhotos] = useState<string[]>([]); // URLs de fotos já salvas
    const [newPhotos, setNewPhotos] = useState<File[]>([]); // Novos arquivos para upload
    const [previewUrls, setPreviewUrls] = useState<string[]>([]); // Todas as URLs para preview

    // FIPE Data States
    const [brands, setBrands] = useState<any[]>([]);
    const [models, setModels] = useState<any[]>([]);
    const [years, setYears] = useState<any[]>([]);

    // Selection States (IDs for API calls)
    const [selectedBrandId, setSelectedBrandId] = useState('');
    const [selectedModelId, setSelectedModelId] = useState('');
    const [selectedYearId, setSelectedYearId] = useState('');

    const [formData, setFormData] = useState({
        marca: '',
        modelo: '',
        ano: '',
        preco: '',
        km: '',
        cor: '',
        combustivel: 'gasolina',
        transmissao: 'automatico',
        descricao: ''
    });

    const [mostrarFipe, setMostrarFipe] = useState(false);
    const [precoFipe, setPrecoFipe] = useState('');
    const [selectedOptionals, setSelectedOptionals] = useState<string[]>([]);

    useEffect(() => {
        loadBrands();
        if (isEditing && editId) {
            loadVehicleData(editId);
        }
    }, [editId]);

    // Atualizar previews quando fotos mudam
    useEffect(() => {
        const newPhotoUrls = newPhotos.map(file => URL.createObjectURL(file));
        setPreviewUrls([...existingPhotos, ...newPhotoUrls]);

        // Cleanup URLs to avoid memory leaks
        return () => {
            newPhotoUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [existingPhotos, newPhotos]);

    const loadBrands = async () => {
        const data = await fipeService.getBrands();
        setBrands(data);
    };

    const loadVehicleData = async (id: string) => {
        try {
            setLoading(true);
            const vehicle = await vehicleService.getVehicleById(id);
            if (!vehicle) {
                alert('Veículo não encontrado');
                router.push('/admin/estoque');
                return;
            }

            setFormData({
                marca: vehicle.marca,
                modelo: vehicle.modelo,
                ano: vehicle.ano.toString(),
                preco: formatCurrency(vehicle.preco.toString()),
                km: vehicle.km.toLocaleString('pt-BR'),
                cor: vehicle.cor,
                combustivel: vehicle.combustivel,
                transmissao: vehicle.transmissao,
                descricao: vehicle.descricao
            });

            setExistingPhotos(vehicle.fotos);
            setMostrarFipe(vehicle.mostrarFipe || false);
            setPrecoFipe(vehicle.precoFipe || '');
            setSelectedOptionals(vehicle.opcionais || []);

            // Tentar pré-selecionar campos da FIPE se possível (opcional/complexo pois depende dos IDs)
            // Por simplicidade, mantemos os campos de texto preenchidos e o usuário pode usar a FIPE para sobrescrever se quiser

        } catch (error) {
            console.error('Erro ao carregar veículo:', error);
            alert('Erro ao carregar dados do veículo');
        } finally {
            setLoading(false);
        }
    };

    const handleBrandChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const brandId = e.target.value;
        const brandName = e.target.options[e.target.selectedIndex].text;

        setSelectedBrandId(brandId);
        setFormData(prev => ({ ...prev, marca: brandName, modelo: '', ano: '' }));

        setModels([]);
        setYears([]);
        setSelectedModelId('');
        setSelectedYearId('');

        if (brandId) {
            const data = await fipeService.getModels(brandId);
            setModels(data.modelos);
        }
    };

    const handleModelChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const modelId = e.target.value;
        const modelName = e.target.options[e.target.selectedIndex].text;

        setSelectedModelId(modelId);
        setFormData(prev => ({ ...prev, modelo: modelName, ano: '' }));

        setYears([]);
        setSelectedYearId('');

        if (modelId) {
            const data = await fipeService.getYears(selectedBrandId, modelId);
            setYears(data);
        }
    };

    const handleYearChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const yearId = e.target.value;

        setSelectedYearId(yearId);

        if (yearId) {
            const details = await fipeService.getVehicleDetails(selectedBrandId, selectedModelId, yearId);
            setPrecoFipe(details.Valor);

            setFormData(prev => ({
                ...prev,
                ano: details.AnoModelo.toString(),
                combustivel: mapFipeFuel(details.Combustivel),
                preco: formatCurrency(details.Valor.replace(/[^0-9]/g, '')), // Formatar valor FIPE
                descricao: `Veículo: ${details.Modelo}\nAno: ${details.AnoModelo}\nReferência FIPE: ${details.MesReferencia} - Valor: ${details.Valor}`
            }));
        }
    };

    const mapFipeFuel = (fipeFuel: string) => {
        const fuel = fipeFuel.toLowerCase();
        if (fuel.includes('flex')) return 'flex';
        if (fuel.includes('alcool') || fuel.includes('álcool')) return 'alcool';
        if (fuel.includes('diesel')) return 'diesel';
        if (fuel.includes('hibrido') || fuel.includes('híbrido')) return 'hibrido';
        if (fuel.includes('eletrico') || fuel.includes('elétrico')) return 'eletrico';
        return 'gasolina';
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        // Aplicar formatação para preço
        if (name === 'preco') {
            const formatted = formatCurrency(value);
            setFormData(prev => ({ ...prev, [name]: formatted }));
            return;
        }

        // Aplicar formatação para km (apenas números com separador de milhares)
        if (name === 'km') {
            const digits = value.replace(/\D/g, '');
            const formatted = digits ? parseInt(digits).toLocaleString('pt-BR') : '';
            setFormData(prev => ({ ...prev, [name]: formatted }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setNewPhotos(prev => [...prev, ...files]);
        }
    };

    const removePhoto = (index: number) => {
        if (index < existingPhotos.length) {
            // Remover foto existente
            setExistingPhotos(prev => prev.filter((_, i) => i !== index));
        } else {
            // Remover nova foto
            const newPhotoIndex = index - existingPhotos.length;
            setNewPhotos(prev => prev.filter((_, i) => i !== newPhotoIndex));
        }
    };

    const handlePublish = async () => {
        if (!formData.marca || !formData.modelo || !formData.preco) {
            alert('Por favor, preencha os campos obrigatórios (Marca, Modelo, Preço).');
            return;
        }

        setLoading(true);
        try {
            // Upload novas fotos
            const newPhotoUrls: string[] = [];
            for (const photo of newPhotos) {
                const url = await vehicleService.uploadImage(photo);
                newPhotoUrls.push(url);
            }

            // Combinar fotos existentes com novas
            const finalPhotos = [...existingPhotos, ...newPhotoUrls];

            const vehicleData = {
                marca: formData.marca,
                modelo: formData.modelo,
                ano: formData.ano,
                preco: parseCurrency(formData.preco),
                km: Number(formData.km.replace(/[^0-9]/g, '')),
                cor: formData.cor,
                combustivel: formData.combustivel,
                transmissao: formData.transmissao,
                descricao: formData.descricao,
                fotos: finalPhotos,
                mostrarFipe: mostrarFipe,
                precoFipe: precoFipe,
                opcionais: selectedOptionals
            };

            if (isEditing && editId) {
                await vehicleService.updateVehicle(editId, vehicleData);
                alert('Veículo atualizado com sucesso!');
                router.push('/admin/estoque');
            } else {
                await vehicleService.createVehicle({
                    ...vehicleData,
                    status: 'disponivel',
                    destaque: false
                });
                alert('Veículo publicado com sucesso!');
                // Reset form
                setFormData({
                    marca: '', modelo: '', ano: '', preco: '', km: '',
                    cor: '', combustivel: 'gasolina', transmissao: 'automatico', descricao: ''
                });
                setNewPhotos([]);
                setExistingPhotos([]);
                setSelectedBrandId('');
                setSelectedModelId('');
                setSelectedYearId('');
                setModels([]);
                setYears([]);
            }

        } catch (error) {
            console.error(error);
            alert('Erro ao salvar veículo. Verifique o console.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.main}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logo}>
                        ADMIN <span>PANEL</span>
                    </div>
                </div>

                <nav className={styles.nav}>
                    <Link href="/publicar" className={`${styles.navLink} ${!isEditing ? styles.navLinkActive : ''}`}>
                        <span>{isEditing ? 'Editar Veículo' : 'Novo Veículo'}</span>
                    </Link>
                    <Link href="/admin/estoque" className={styles.navLink}>
                        <span>Estoque</span>
                    </Link>
                </nav>

                <Link href="/" className={styles.backLink}>
                    ← Voltar ao Site
                </Link>
            </aside>

            <main className={styles.content}>
                <div className={styles.contentInner}>
                    <header className={styles.header}>
                        <div>
                            <h1 className={styles.title}>{isEditing ? 'Editar Veículo' : 'Cadastrar Veículo'}</h1>
                            <p className={styles.subtitle}>
                                {isEditing ? 'Atualize os dados do veículo abaixo.' : 'Os dados da FIPE são preenchidos automaticamente.'}
                            </p>
                        </div>
                        <div className={styles.actions}>
                            <button
                                className={styles.btnPrimary}
                                onClick={handlePublish}
                                disabled={loading}
                            >
                                {loading ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Publicar Agora')}
                            </button>
                        </div>
                    </header>

                    <div className={styles.formGrid}>
                        <div className={styles.formColumn}>

                            {/* Dados Principais (FIPE Driven) */}
                            <section className={styles.formSection}>
                                <h2 className={styles.sectionTitle}>Dados do Veículo (Integração FIPE)</h2>
                                <div className={styles.row}>
                                    <div className={styles.field}>
                                        <label>Marca *</label>
                                        <select
                                            className={styles.select}
                                            value={selectedBrandId}
                                            onChange={handleBrandChange}
                                        >
                                            <option value="">{formData.marca || 'Selecione a Marca...'}</option>
                                            {brands.map((brand: any) => (
                                                <option key={brand.codigo} value={brand.codigo}>{brand.nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={styles.field}>
                                        <label>Modelo *</label>
                                        <select
                                            className={styles.select}
                                            value={selectedModelId}
                                            onChange={handleModelChange}
                                            disabled={!selectedBrandId && !isEditing}
                                        >
                                            <option value="">{formData.modelo || 'Selecione o Modelo...'}</option>
                                            {models.map((model: any) => (
                                                <option key={model.codigo} value={model.codigo}>{model.nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.field}>
                                        <label>Ano/Versão *</label>
                                        <select
                                            className={styles.select}
                                            value={selectedYearId}
                                            onChange={handleYearChange}
                                            disabled={!selectedModelId && !isEditing}
                                        >
                                            <option value="">{formData.ano || 'Selecione o Ano...'}</option>
                                            {years.map((year: any) => (
                                                <option key={year.codigo} value={year.codigo}>{year.nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={styles.field}>
                                        <label>Preço de Venda (R$) *</label>
                                        <input
                                            type="text"
                                            name="preco"
                                            className={styles.input}
                                            placeholder="0,00"
                                            value={formData.preco}
                                            onChange={handleChange}
                                        />
                                        {formData.preco && <small style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '0.5rem' }}>Formatação automática aplicada</small>}
                                    </div>
                                </div>
                            </section>

                            {/* Especificações */}
                            <section className={styles.formSection}>
                                <h2 className={styles.sectionTitle}>Especificações Técnicas</h2>
                                <div className={styles.row}>
                                    <div className={styles.field}>
                                        <label>Quilometragem</label>
                                        <input
                                            type="text"
                                            name="km"
                                            className={styles.input}
                                            placeholder="0"
                                            value={formData.km}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label>Cor Externa</label>
                                        <input
                                            type="text"
                                            name="cor"
                                            className={styles.input}
                                            placeholder="Ex: Giz"
                                            value={formData.cor}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.field}>
                                        <label>Combustível</label>
                                        <select
                                            name="combustivel"
                                            className={styles.select}
                                            value={formData.combustivel}
                                            onChange={handleChange}
                                        >
                                            <option value="gasolina">Gasolina</option>
                                            <option value="alcool">Álcool</option>
                                            <option value="flex">Flex</option>
                                            <option value="hibrido">Híbrido</option>
                                            <option value="eletrico">Elétrico</option>
                                            <option value="diesel">Diesel</option>
                                        </select>
                                    </div>
                                    <div className={styles.field}>
                                        <label>Transmissão</label>
                                        <select
                                            name="transmissao"
                                            className={styles.select}
                                            value={formData.transmissao}
                                            onChange={handleChange}
                                        >
                                            <option value="automatico">Automático (PDK/ZF)</option>
                                            <option value="manual">Manual</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.field} style={{ marginTop: '1rem' }}>
                                    <label>Descrição</label>
                                    <textarea
                                        name="descricao"
                                        className={styles.input}
                                        rows={4}
                                        value={formData.descricao}
                                        onChange={handleChange}
                                        style={{ resize: 'vertical' }}
                                    />
                                </div>

                                {/* Checkbox FIPE */}
                                {precoFipe && (
                                    <div className={styles.field} style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.95rem' }}>
                                            <input
                                                type="checkbox"
                                                checked={mostrarFipe}
                                                onChange={(e) => setMostrarFipe(e.target.checked)}
                                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                            />
                                            <span style={{ color: '#0284c7', fontWeight: 600 }}>
                                                📊 Exibir valor FIPE no anúncio ({precoFipe})
                                            </span>
                                        </label>
                                        <small style={{ display: 'block', marginTop: '0.5rem', marginLeft: '2rem', color: '#64748b' }}>
                                            Ative para mostrar que o veículo está abaixo da tabela FIPE
                                        </small>
                                    </div>
                                )}
                            </section>

                            {/* Opcionais do Veículo */}
                            <section className={styles.formSection}>
                                <h2 className={styles.sectionTitle}>Opcionais do Veículo</h2>
                                <OptionalSelector
                                    selectedOptionals={selectedOptionals}
                                    onChange={setSelectedOptionals}
                                />
                            </section>

                            {/* Mídia */}
                            <section className={styles.formSection}>
                                <h2 className={styles.sectionTitle}>Galeria de Fotos</h2>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileSelect}
                                />
                                <div
                                    className={styles.uploadArea}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className={styles.uploadIcon}>📸</div>
                                    <p className={styles.uploadText}>
                                        Clique para selecionar fotos ({previewUrls.length} fotos)
                                    </p>
                                </div>

                                {/* Miniaturas */}
                                {previewUrls.length > 0 && (
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', overflowX: 'auto', paddingBottom: '10px' }}>
                                        {previewUrls.map((url, idx) => (
                                            <div key={idx} style={{ position: 'relative' }}>
                                                <img src={url} alt="Preview" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                                                <button
                                                    onClick={() => removePhoto(idx)}
                                                    style={{
                                                        position: 'absolute',
                                                        top: -5,
                                                        right: -5,
                                                        background: 'red',
                                                        color: 'white',
                                                        borderRadius: '50%',
                                                        width: '20px',
                                                        height: '20px',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* Right Column: Preview */}
                        <div className={styles.previewPanel}>
                            <div className={styles.previewCard}>
                                <div className={styles.previewImage}>
                                    {previewUrls.length > 0 ? (
                                        <img src={previewUrls[0]} alt="Preview Principal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                                            Sem Imagem
                                        </div>
                                    )}
                                </div>
                                <div className={styles.previewInfo}>
                                    <h3 className={styles.previewTitle}>
                                        {formData.marca || 'Marca'} {formData.modelo || 'Modelo'}
                                    </h3>
                                    <div className={styles.previewPrice}>
                                        {formData.preco || 'R$ 0,00'}
                                    </div>
                                    <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {formData.ano || 'Ano'} • {formData.km || '0'} km
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function AdminPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <PublicarContent />
        </Suspense>
    );
}
