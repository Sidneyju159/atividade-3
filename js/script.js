$(document).ready(function () {
    // Chave no Local Storage
    const STORAGE_KEY = "cadastroPessoas";

    // Função para carregar Pessoas do localStorage
    function carregar() {
        let pessoas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        $("#lista").empty();

        pessoas.forEach((pessoa, i) => {
            $("#lista").append(`
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <strong>Nome: ${pessoa.nome}</strong><br>
                        <small>E-mail: ${pessoa.email}</small><br>
                        <small>Nascimento: ${formatarData(pessoa.dataNascimento)}</small>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-warning editar" data-id="${i}">✏️</button>
                        <button class="btn btn-sm btn-danger excluir" data-id="${i}">🗑️</button>
                    </div>
                </li>
            `);
        });
    }

    // Função auxiliar para formatar a data (opcional, melhora a visualização)
    function formatarData(dataISO) {
        if (!dataISO) return '';
        const [ano, mes, dia] = dataISO.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    // Adicionar nova pessoa
    $("#btnAdd").click(function () {
        let nome = $("#nome").val().trim();
        let email = $("#email").val().trim();
        let dataNascimento = $("#dataNascimento").val();

        if (!nome || !email || !dataNascimento) {
            return alert("Por favor, preencha Nome, E-mail e Data de Nascimento!");
        }

        let pessoas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        
        // Adiciona um novo objeto com os 3 campos
        pessoas.push({ 
            nome: nome, 
            email: email, 
            dataNascimento: dataNascimento 
        });
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pessoas));

        // Limpa os campos
        $("#nome").val("");
        $("#email").val("");
        $("#dataNascimento").val("");
        
        carregar();
    });

    // Excluir pessoa
    $(document).on("click", ".excluir", function () {
        let id = $(this).data("id");
        let pessoas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        
        pessoas.splice(id, 1); // Remove o item
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pessoas));
        carregar();
    });

    // Editar pessoa
    $(document).on("click", ".editar", function () {
        let id = $(this).data("id");
        let pessoas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        let atual = pessoas[id];

        // Usa prompts para capturar novos valores
        let novoNome = prompt("Editar Nome:", atual.nome);
        let novoEmail = prompt("Editar E-mail:", atual.email);
        let novaData = prompt("Editar Data de Nascimento (AAAA-MM-DD):", atual.dataNascimento);

        if (novoNome && novoEmail && novaData) {
            // Atualiza o objeto completo
            pessoas[id] = { 
                nome: novoNome, 
                email: novoEmail, 
                dataNascimento: novaData 
            };
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(pessoas));
            carregar();
        }
    });

    // Carregar ao iniciar
    carregar();
});
$(document).ready(function () {
    // Chave no Local Storage
    const STORAGE_KEY = "cadastroPessoas";

    // Regex para validar o formato de e-mail de forma mais robusta
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Função auxiliar para formatar a data
    function formatarData(dataISO) {
        if (!dataISO) return 'N/A';
        // A data vem como AAAA-MM-DD
        const [ano, mes, dia] = dataISO.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    // --- LÓGICA DE CARREGAMENTO (SÓ EXECUTA NA PÁGINA DE INTEGRANTES) ---
    // Verifica se o elemento da lista (#lista) existe na página atual.
    if ($('#lista').length > 0) {
        
        // Função para carregar Pessoas do localStorage 
        // Agora aceita um termo de busca opcional (filtro)
        function carregar(termoBusca = '') {
            let pessoas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            $("#lista").empty();

            // Normaliza o termo de busca para comparação sem case-sensitive
            const termoNormalizado = termoBusca.toLowerCase().trim();

            // Se houver termo de busca, filtra a lista
            let pessoasFiltradas = pessoas;
            if (termoNormalizado) {
                pessoasFiltradas = pessoas.filter(pessoa => 
                    pessoa.nome.toLowerCase().includes(termoNormalizado) ||
                    pessoa.email.toLowerCase().includes(termoNormalizado)
                );
            }
            
            if (pessoasFiltradas.length === 0) {
                 if (termoNormalizado) {
                     $("#lista").append('<li class="list-group-item text-center text-muted">Nenhum integrante encontrado com o filtro aplicado.</li>');
                 } else {
                     $("#lista").append('<li class="list-group-item text-center text-muted">Ainda não há integrantes cadastrados.</li>');
                 }
                 return;
            }

            pessoasFiltradas.forEach((pessoa, i) => {
                // Importante: Note que o data-id é o índice original (i) da array *não filtrada* (pessoas).
                // Isso é crucial para que as funções de edição e exclusão funcionem corretamente!
                // No entanto, para usar o índice original, precisamos de um método diferente.
                // Como alternativa mais simples e robusta, vamos usar o índice original da array "pessoas" 
                // e buscar o objeto no array original no momento da edição/exclusão.
                
                // Para manter a compatibilidade com a lógica de exclusão/edição existente (que usa o índice),
                // vamos reverter o método para buscar o índice no array original no momento do clique,
                // e manter o índice "i" do loop para o filtro (o que está errado).
                
                // MELHOR SOLUÇÃO: Passar um identificador único, mas como você usa índices,
                // vamos manter a lógica de carregamento simples e adicionar o filtro.
                // A lógica de edição/exclusão atual que usa `data-id="${i}"` só funciona bem sem filtro.
                // Vou manter o filtro simples por enquanto e, se precisar de edição/exclusão com filtro,
                // precisaremos de um ID único para cada pessoa (ex: timestamp ou UUID).
                
                // Para o seu caso atual, onde a edição/exclusão usa o INDEX do array, a filtragem quebra a edição/exclusão.
                // Vou criar uma versão da função carregar que usa o índice ORIGINAL da pessoa no array,
                // mesmo após a filtragem, o que resolve o problema.
                const originalIndex = pessoas.indexOf(pessoasFiltradas[i]);

                $("#lista").append(`
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>Nome: ${pessoa.nome}</strong><br>
                            <small>E-mail: ${pessoa.email}</small><br>
                            <small>Nascimento: ${formatarData(pessoa.dataNascimento)}</small>
                        </div>
                        <div>
                            <!-- Usando o índice original (originalIndex) para edição/exclusão -->
                            <button class="btn btn-sm btn-warning editar me-2" data-id="${originalIndex}">✏️</button>
                            <button class="btn btn-sm btn-danger excluir" data-id="${originalIndex}">🗑️</button>
                        </div>
                    </li>
                `);
            });
        }
        
        // NOVO: Listener para o campo de busca
        $("#campoBusca").on("keyup", function() {
            const termo = $(this).val();
            carregar(termo);
        });

        // Excluir pessoa (DELEGAÇÃO DE EVENTOS)
        $(document).on("click", ".excluir", function () {
            let id = $(this).data("id");
             
            // Usando console.log em vez de window.confirm para evitar bloqueios no iFrame.
            // Em uma aplicação real, use um modal Bootstrap para confirmação.
            console.log(`Exclusão de item #${id} solicitada. Prosseguindo com a exclusão.`);
            
            let pessoas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            
            pessoas.splice(id, 1); // Remove o item
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(pessoas));
            
            // Recarrega a lista, aplicando o filtro atual (se houver)
            const termoAtual = $("#campoBusca").val() || '';
            carregar(termoAtual);
        });

        // Editar pessoa (DELEGAÇÃO DE EVENTOS)
        $(document).on("click", ".editar", function () {
            let id = $(this).data("id"); // ID agora é o índice original
            let pessoas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            let atual = pessoas[id];

            // PROMPT é bloqueante; idealmente, deveria ser substituído por um modal.
            let novoNome = prompt("Editar Nome:", atual.nome);
            let novoEmail = prompt("Editar E-mail:", atual.email);
            let novaData = prompt("Editar Data de Nascimento (AAAA-MM-DD):", atual.dataNascimento);

            // 1. Verifica se todos os campos foram preenchidos (se o usuário não cancelou)
            if (novoNome !== null && novoEmail !== null && novaData !== null) {
                
                // 2. Valida o novo e-mail
                if (!EMAIL_REGEX.test(novoEmail.trim())) {
                    console.error("ERRO: O formato do novo E-mail é inválido. A edição foi cancelada.");
                    return;
                }

                // 3. Atualiza o objeto completo
                pessoas[id] = { 
                    nome: novoNome.trim(), 
                    email: novoEmail.trim(), 
                    dataNascimento: novaData 
                };
                
                localStorage.setItem(STORAGE_KEY, JSON.stringify(pessoas));
                
                // Recarrega a lista, aplicando o filtro atual (se houver)
                const termoAtual = $("#campoBusca").val() || '';
                carregar(termoAtual);
            } else {
                 console.log("Edição cancelada pelo usuário.");
            }
        });
        
        // Carregar a lista ao iniciar a página (sem filtro)
        carregar();
    }

    // --- LÓGICA DE CADASTRO (SÓ EXECUTA NA PÁGINA DE CADASTRO) ---
    // Verifica se o formulário de cadastro (#cadastro) e o botão (#btnAdd) existem na página atual.
    if ($('#btnAdd').length > 0) {
        
        // Adicionar nova pessoa
        $("#btnAdd").click(function () {
            let nome = $("#nome").val().trim();
            let email = $("#email").val().trim();
            let dataNascimento = $("#dataNascimento").val();

            if (!nome || !email || !dataNascimento) {
                return console.error("ERRO: Por favor, preencha Nome, E-mail e Data de Nascimento!");
            }
            
            // Validação de e-mail usando Regex
            if (!EMAIL_REGEX.test(email)) {
                 return console.error("ERRO: O formato do E-mail é inválido.");
            }

            let pessoas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            
            try {
                // LOG 1: Confirma o estado do array antes de adicionar
                console.log("LOG 1: Dados antes do cadastro:", pessoas.length, "itens no Local Storage."); 

                // Adiciona um novo objeto
                pessoas.push({ 
                    nome: nome, 
                    email: email, 
                    dataNascimento: dataNascimento 
                });
                
                // LOG 2: Antes da linha crítica de salvamento
                console.log("LOG 2: Tentando salvar os dados no Local Storage..."); 
                
                // ESTA É A LINHA CRÍTICA DE SALVAMENTO
                localStorage.setItem(STORAGE_KEY, JSON.stringify(pessoas));
                
                // LOG 3: Depois da linha crítica de salvamento
                console.log("LOG 3: Dados salvos com sucesso no Local Storage!");

                // Limpa os campos SOMENTE SE O SALVAMENTO FOI BEM-SUCEDIDO
                $("#nome").val("");
                $("#email").val("");
                $("#dataNascimento").val("");
                
                console.log(`Pessoa "${nome}" cadastrada com sucesso! Verifique a página Integrantes.`);

            } catch (e) {
                // Captura qualquer erro de Local Storage, como 'QuotaExceededError' ou problemas de permissão.
                console.error("ERRO CRÍTICO DE ARMAZENAMENTO:", e.name, e.message);
                console.log("Verifique se o seu navegador permite o uso do Local Storage para arquivos locais (file:///) ou se o armazenamento está cheio.");
            }
        });
    }

});