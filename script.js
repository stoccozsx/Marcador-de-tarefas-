const campoDeTarefa = document.getElementById('campo-de-tarefa');
const selectPrioridade = document.getElementById('select-prioridade');
const listaDeTarefas = document.getElementById('lista-de-tarefas');
const btnAdicionar = document.getElementById('btn-adicionar');
const botoesFiltro = document.querySelectorAll('.btn-filtro');

// Configuração dos Eventos dos Botões de Filtro
botoesFiltro.forEach(botao => {
    botao.addEventListener('click', function() {
        botoesFiltro.forEach(b => b.classList.remove('ativo'));
        this.classList.add('ativo');

        aplicarFiltro(this.getAttribute('data-filtro'));
    });
});

// Eventos para adicionar tarefa
btnAdicionar.addEventListener('click', adicionarTarefa);
campoDeTarefa.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        adicionarTarefa();
    }
});

function adicionarTarefa() {
    const tarefaTexto = campoDeTarefa.value.trim();
    const prioridade = selectPrioridade.value;

    if (tarefaTexto !== '') {
        const novaTarefa = document.createElement('li');
        novaTarefa.textContent = tarefaTexto;
        
        novaTarefa.classList.add(`prioridade-${prioridade}`);
        novaTarefa.dataset.prioridade = prioridade;

        // Marcar como concluída ao clicar no item
        novaTarefa.addEventListener('click', function() {
            novaTarefa.classList.toggle('concluida');
            salvarTarefas();
        });

        // Botão de deletar
        const btnDeletar = document.createElement('button');
        btnDeletar.textContent = '❌';

        btnDeletar.addEventListener('click', function(event) {
            event.stopPropagation();
            novaTarefa.remove();
            salvarTarefas();
        });

        novaTarefa.appendChild(btnDeletar);
        listaDeTarefas.appendChild(novaTarefa);
        campoDeTarefa.value = '';

        salvarTarefas();
    }
}

function aplicarFiltro(tipoFiltro) {
    const tarefas = document.querySelectorAll('#lista-de-tarefas li');

    tarefas.forEach(tarefa => {
        const estaConcluida = tarefa.classList.contains('concluida');

        if (tipoFiltro === 'todas') {
            tarefa.style.display = 'flex';
        } else if (tipoFiltro === 'pendentes') {
            tarefa.style.display = estaConcluida ? 'none' : 'flex';
        } else if (tipoFiltro === 'concluidas') {
            tarefa.style.display = estaConcluida ? 'flex' : 'none';
        }
    });
}

function atualizarContador() {
    const contador = document.getElementById('contador');
    if (contador) {
        const pendentes = document.querySelectorAll('#lista-de-tarefas li:not(.concluida)').length;
        contador.textContent = `Pendentes: ${pendentes}`;
    }
}

function salvarTarefas() {
    const tarefas = [];
    document.querySelectorAll('#lista-de-tarefas li').forEach(li => {
        const texto = li.firstChild.textContent;
        const concluida = li.classList.contains('concluida');
        const prioridade = li.dataset.prioridade || 'media';
        tarefas.push({ texto, concluida, prioridade });
    });

    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    atualizarContador();

    // Recompõe o filtro ativo na tela
    const filtroAtivo = document.querySelector('.btn-filtro.ativo');
    if (filtroAtivo) {
        aplicarFiltro(filtroAtivo.getAttribute('data-filtro'));
    }
}

function carregarTarefas() {
    const tarefasSalvas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefasSalvas.forEach(t => {
        campoDeTarefa.value = t.texto;
        selectPrioridade.value = t.prioridade || 'media';
        adicionarTarefa();
        if (t.concluida) {
            listaDeTarefas.lastChild.classList.add('concluida');
        }
    });
    salvarTarefas();
}

// Inicializa o app ao carregar o script
carregarTarefas();