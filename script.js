// --- Seleção de Elementos ---
const form = document.getElementById('cadastro-form');
const inputBusca = document.getElementById('recipe-search');
const recipeTrack = document.getElementById('recipe-track');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// --- Função para Obter Receitas do LocalStorage ---
function obterReceitas() {
    const receitas = localStorage.getItem('receitas');
    return receitas ? JSON.parse(receitas) : [];
}

// --- Função para Renderizar as Receitas no Carrossel ---
function renderizarReceitas(filtro = "") {
    const receitas = obterReceitas();
    recipeTrack.innerHTML = ""; // Limpa a track antes de redesenhar

    // Filtra as receitas pelo nome (busca)
    const receitasFiltradas = receitas.filter(r => 
        r.nome.toLowerCase().includes(filtro.toLowerCase())
    );

    receitasFiltradas.forEach((receita, index) => {
        const card = document.createElement('div');
        card.className = 'recipe-card';

        // Estrutura do Card individual
        card.innerHTML = `
            <img src="${receita.imagemBase64}" alt="${receita.nome}" class="recipe-main-img">
            <div class="recipe-details">
                <h2>${receita.nome}</h2>
                <p class="recipe-time">Tempo de preparo: ${receita.tempo}</p>
                
                <div class="recipe-ingredients">
                    <h3>Ingredientes:</h3>
                    <ul>${receita.ingredientes.split(',').map(i => `<li>${i.trim()}</li>`).join('')}</ul>
                </div>
                
                <div class="recipe-instructions">
                    <h3>Modo de Preparo:</h3>
                    <p>${receita.preparo}</p>
                </div>
                <button onclick="excluirReceita(${index})" style="background: #ff4d4d; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px; font-size: 0.8rem; width: 100%;">Excluir</button>
            </div>
        `;
        recipeTrack.appendChild(card);
    });
}

// --- Função Auxiliar para Transformar Imagem em Base64 (Texto) ---
function converterParaBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// --- Evento de Envio do Formulário (Cadastrar com Imagem) ---
form.addEventListener('submit', async function(e) {
    e.preventDefault(); // Impede o recarregamento

    const fileInput = document.getElementById('imagemComida');
    const file = fileInput.files[0];

    try {
        // Converte a imagem antes de salvar
        const imagemBase64 = await converterParaBase64(file);

        // Cria o objeto da nova receita com a imagem
        const novaReceita = {
            nome: document.getElementById('nomeComida').value,
            ingredientes: document.getElementById('ingredientes').value,
            preparo: document.getElementById('modoPreparo').value,
            tempo: document.getElementById('tempoPreparo').value,
            imagemBase64: imagemBase64 // Salva o texto da imagem
        };

        const receitas = obterReceitas();
        receitas.push(novaReceita);
        localStorage.setItem('receitas', JSON.stringify(receitas));

        form.reset(); // Limpa o formulário
        renderizarReceitas(); // Redesenha o carrossel
        alert("Receita e imagem salvas com sucesso no navegador!");

    } catch (error) {
        console.error("Erro ao processar imagem:", error);
        alert("Ocorreu um erro ao salvar a imagem. Tente uma imagem menor.");
    }
});

// --- Evento de Busca (Filtro em Tempo Real) ---
inputBusca.addEventListener('input', (e) => {
    renderizarReceitas(e.target.value);
});

// --- Função para Excluir Receita ---
window.excluirReceita = function(index) {
    const receitas = obterReceitas();
    receitas.splice(index, 1);
    localStorage.setItem('receitas', JSON.stringify(receitas));
    renderizarReceitas();
};

// --- Lógica de Navegação do Carrossel (Botões) ---
const cardWidth = 320; // Largura do card (min-width + gap)

nextBtn.addEventListener('click', () => {
    recipeTrack.scrollLeft += cardWidth;
});

prevBtn.addEventListener('click', () => {
    recipeTrack.scrollLeft -= cardWidth;
});

// --- Inicialização ---
renderizarReceitas(); // Carrega as receitas já salvas ao abrir a página