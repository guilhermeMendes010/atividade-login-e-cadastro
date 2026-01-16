// ================= USUÁRIO PRÉ-CADASTRADO =================
const usuarioPadrao = {
    usuario: "admin",
    senha: "123456"
};

if (!localStorage.getItem("usuarioPadrao")) {
    localStorage.setItem("usuarioPadrao", JSON.stringify(usuarioPadrao));
}

// Elementos do DOM
const loginForm = document.getElementById('loginForm');
const cadastroForm = document.getElementById('cadastroForm');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const loginScreen = document.getElementById('loginScreen');
const cadastroScreen = document.getElementById('cadastroScreen');

// ================= FUNÇÕES DE VALIDAÇÃO =================
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0, resto;

    for (let i = 1; i <= 9; i++) soma += cpf[i - 1] * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== Number(cpf[9])) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += cpf[i - 1] * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;

    return resto === Number(cpf[10]);
}

function validarTelefone(telefone) {
    return /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(telefone);
}

// ================= FORMATAÇÃO =================
document.getElementById('cpf').addEventListener('input', function () {
    this.value = this.value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{2})$/, '$1-$2')
        .substring(0, 14);
});

document.getElementById('telefone').addEventListener('input', function () {
    let t = this.value.replace(/\D/g, '');
    if (t.length > 11) t = t.substring(0, 11);

    if (t.length > 6)
        this.value = `(${t.slice(0, 2)}) ${t.slice(2, 7)}-${t.slice(7)}`;
    else if (t.length > 2)
        this.value = `(${t.slice(0, 2)}) ${t.slice(2)}`;
    else
        this.value = `(${t}`;
});

// ================= LOGIN =================
loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const usuario = document.getElementById('usuario').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const salvo = JSON.parse(localStorage.getItem("usuarioPadrao"));

    if (usuario === salvo.usuario && senha === salvo.senha) {
        showModal("Sucesso", `Bem-vindo, ${usuario}!\nLogin realizado com sucesso.`);
        setTimeout(irParaCadastro, 1500);
    } else {
        showModal("Erro", "Usuário ou senha incorretos.");
    }
});

// ================= CADASTRO =================
cadastroForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const sexo = document.querySelector('input[name="sexo"]:checked');
    const dataNascimento = document.getElementById('dataNascimento').value;
    const telefone = document.getElementById('telefone').value.trim();
    const endereco = document.getElementById('endereco').value.trim();

    if (!nome || nome.length < 3) {
        showModal("Erro", "Nome inválido.");
        return;
    }
    if (!validarEmail(email)) {
        showModal("Erro", "Email inválido.");
        return;
    }
    if (!validarCPF(cpf)) {
        showModal("Erro", "CPF inválido.");
        return;
    }
    if (!sexo) {
        showModal("Erro", "Selecione o sexo.");
        return;
    }
    if (!validarTelefone(telefone)) {
        showModal("Erro", "Telefone inválido.");
        return;
    }
    if (!endereco) {
        showModal("Erro", "Preencha o endereço.");
        return;
    }

    // ✅ MENSAGEM COM O NOME DA PESSOA
    const mensagem = `Cadastro de ${nome} realizado com sucesso! 🎉

Dados cadastrados:
- Nome: ${nome}
- Email: ${email}
- CPF: ${cpf}
- Sexo: ${sexo.value}
- Data de Nascimento: ${new Date(dataNascimento).toLocaleDateString('pt-BR')}
- Telefone: ${telefone}
- Endereço: ${endereco}`;

    showModal("Sucesso", mensagem);
    cadastroForm.reset();
});

// ================= TELAS =================
function irParaCadastro() {
    closeModal();
    loginScreen.classList.remove('active');
    cadastroScreen.classList.add('active');
}

function voltarParaLogin() {
    cadastroScreen.classList.remove('active');
    loginScreen.classList.add('active');
}

// ================= MODAL =================
function showModal(title, message) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
}

window.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
});