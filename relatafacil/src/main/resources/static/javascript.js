const relatorioForm = document.getElementById('relatorioForm');
const relatorioList = document.getElementById('relatorioList');
let relatorioIdEdicao = null; // Variável para armazenar o id do relatorio em edição

// Modal elements
const modal = document.getElementById("editModal");
const closeModal = document.querySelector(".close");
const editForm = document.getElementById("editRelatorioForm");

// Evento de envio do formulário principal
relatorioForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nomeRelatorio = document.getElementById('nomeRelatorio').value;
    const nomeSetor = document.getElementById('nomeSetor').value;
    const nomeCriador = document.getElementById('nomeCriador').value;
    const texto = document.getElementById('texto').value;
    const urlImagem = document.getElementById('urlImagem').value;

    const relatorio = { nomeRelatorio, nomeSetor, nomeCriador, texto, urlImagem };

    try {
        // Verifica se estamos adicionando ou editando
        if (relatorioIdEdicao) {
            alert('Finalize a edição atual antes de adicionar um novo relatorio!');
        } else {
            const response = await fetch(`http://localhost:8080/a/pi`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(relatorio)
            });

            if (response.ok) {
                await listarRelatorio(); // Atualiza a lista após adicionar
                relatorioForm.reset(); // Limpa o formulário
            } else {
                alert('Erro ao adicionar relatorio');
            }
        }
    } catch (error) {
        console.error('Erro:', error);
    }
});

// Evento de envio do formulário de edição
editForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nomeRelatorio = document.getElementById('editnomeRelatorio').value;
    const nomeSetor = document.getElementById('editnomeSetor').value;
    const nomeCriador = document.getElementById('editnomeCriador').value;
    const texto = document.getElementById('edittexto').value;
    const urlImagem = document.getElementById('editurlImagem').value;

    const relatorio = { nomeRelatorio, nomeSetor, nomeCriador, texto, urlImagem };

    try {
        // Requisição PUT para atualizar relatorio
        const response = await fetch(`http://localhost:8080/a/${relatorioIdEdicao}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(relatorio)
        });

        if (response.ok) {
            await listarRelatorio(); // Atualiza a lista
            resetModalFields(); // Limpa os campos do modal
            modal.style.display = "none"; // Fecha o modal
            relatorioIdEdicao = null; // Reseta o ID de edição
        } else {
            alert('Erro ao salvar alterações');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
});

// Função para listar relatórios
async function listarRelatorio() {
    try {
        const response = await fetch('http://localhost:8080/a');
        const relatorios = await response.json();

        relatorioList.innerHTML = ''; // Limpa a lista existente
        relatorios.forEach(relatorio => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${relatorio.nomeRelatorio}</strong><br>
                <strong>${relatorio.nomeSetor}</strong><br>
                <strong>${relatorio.nomeCriador}</strong><br>
                <strong>${relatorio.texto}</strong><br>
                <img src="${relatorio.urlImagem}" alt="${relatorio.nomeRelatorio}"><br>
                <button onclick="editarRelatorio(${relatorio.id})">Editar</button>
                <a href="#" onclick="deletarRelatorio(${relatorio.id})">Deletar</a>
            `;
            relatorioList.appendChild(li);
        });
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Função para carregar dados no modal e habilitar a edição
function editarRelatorio(id) {
    relatorioIdEdicao = id; // Define o ID do relatorio que será editado
    fetch(`http://localhost:8080/a/${id}`)
        .then(response => response.json())
        .then(relatorio => {
            // Preenche o modal com os dados do relatorio
            document.getElementById('editnomeRelatorio').value = relatorio.nomeRelatorio;
            document.getElementById('editnomeSetor').value = relatorio.nomeSetor;
            document.getElementById('editnomeCriador').value = relatorio.nomeCriador;
            document.getElementById('edittexto').value = relatorio.texto;
            document.getElementById('editurlImagem').value = relatorio.urlImagem;

            // Exibe o modal
            modal.style.display = "block";
        })
        .catch(error => console.error('Erro ao buscar dados do relatorio:', error));
}

// Evento para fechar o modal
closeModal.onclick = function() {
    modal.style.display = "none";
    resetModalFields(); // Limpa os campos do modal
    relatorioIdEdicao = null; // Reseta o ID de edição
};

// Fecha o modal ao clicar fora dele
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        resetModalFields(); // Limpa os campos do modal
        relatorioIdEdicao = null; // Reseta o ID de edição
    }
};

// Função para deletar um relatório
async function deletarRelatorio(id) {
    if (confirm('Tem certeza que deseja deletar este relatorio?')) {
        try {
            const response = await fetch(`http://localhost:8080/a/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await listarRelatorio(); // Atualiza a lista após deletar
            } else {
                alert('Erro ao deletar relatorio');
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    }
}

// Função para limpar os campos do modal
function resetModalFields() {
    document.getElementById('editnomeRelatorio').value = '';
    document.getElementById('editnomeSetor').value = '';
    document.getElementById('editnomeCriador').value = '';
    document.getElementById('edittexto').value = '';
    document.getElementById('editurlImagem').value = '';
}

// Carrega os relatórios ao iniciar
listarRelatorio();
