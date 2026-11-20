const html = document.querySelector("html");
const focoBt = document.querySelector(".app__card-button--foco");
const curtoBt = document.querySelector(".app__card-button--curto");
const longoBt = document.querySelector(".app__card-button--longo");
const banner = document.querySelector(".app__image");
const titulo = document.querySelector(".app__title");
const botoes = document.querySelectorAll(".app__card-button");
const musicaFocoInput = document.querySelector("#alternar-musica");
const startPauseBt = document.querySelector("#start-pause");
const iniciarOuPausarBt = document.querySelector("#start-pause span");
const iniciarOuPausarBtIcone = document.querySelector(".app__card-primary-butto-icon");
const tempoNaTela = document.querySelector("#timer");

const musica = new Audio("./sons/luna-rise-part-one.mp3");
const somIniciar = new Audio("./sons/play.wav");
const somPausar = new Audio("./sons/pause.mp3");
const somFinalizar = new Audio("./sons/beep.mp3");

const duracaoFoco = 25 * 60;
const duracaoCurto = 5 * 60;
const duracaoLongo = 15 * 60;

let tempoDecorridoEmSegundos = duracaoFoco;
let intervaloId = null;

musica.loop = true;

musicaFocoInput.addEventListener("change", () => {
    if (musicaFocoInput.checked && intervaloId !== null) {
        musica.play();
    } else {
        musica.pause();
    }
});

focoBt.addEventListener("click", () => {
    tempoDecorridoEmSegundos = duracaoFoco;
    alterarContexto("foco");
    focoBt.classList.add("active");
});

curtoBt.addEventListener("click", () => {
    tempoDecorridoEmSegundos = duracaoCurto;
    alterarContexto("descanso-curto");
    curtoBt.classList.add("active");
});

longoBt.addEventListener("click", () => {
    tempoDecorridoEmSegundos = duracaoLongo;
    alterarContexto("descanso-longo");
    longoBt.classList.add("active");
});

function alterarContexto(contexto) {
    mostrarTempo();
    zerar();
    botoes.forEach((botao) => {
        botao.classList.remove("active");
    });

    html.setAttribute("data-contexto", contexto);
    banner.setAttribute("src", `./imagens/${contexto}.png`);

    switch (contexto) {
        case "foco":
            titulo.innerHTML = `Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>`;
            break;
        case "descanso-curto":
            titulo.innerHTML = `Que tal dar uma respirada?,<br>
                <strong class="app__title-strong">Faça uma pausa curta!</strong>`;
            break;
        case "descanso-longo":
            titulo.innerHTML = `Hora de voltar à superficie,<br>
                <strong class="app__title-strong">Faça uma pausa longa.</strong>`;
            break;
        default:
            return;
    }
}

const contagemRegressiva = () => {
    if (tempoDecorridoEmSegundos <= 0) {
        zerar();
        return;
    }
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo();

    if (tempoDecorridoEmSegundos === 0) {
        zerar();
        void somFinalizar.play().catch(console.error);
        alert("Tempo finalizado!");
    }
};

function iniciarOuPausar() {
    if (intervaloId !== null) {
        zerar();
        void somPausar.play().catch(console.error);
        return;
    }
    if (tempoDecorridoEmSegundos <= 0) {
        return;
    }
    intervaloId = setInterval(contagemRegressiva, 1000);
    iniciarOuPausarBt.textContent = "Pausar";
    iniciarOuPausarBtIcone.setAttribute("src", "./imagens/pause.png");
    void somIniciar.play().catch(console.error);

    if (musicaFocoInput.checked) {
        musica.play();
    }
}

function zerar() {
    clearInterval(intervaloId);
    iniciarOuPausarBt.textContent = "Começar";
    iniciarOuPausarBtIcone.setAttribute("src", "./imagens/play_arrow.png");
    musica.pause();
    intervaloId = null;
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString("pt-Br", {
        minute: "2-digit",
        second: "2-digit"
    });
    tempoNaTela.innerHTML = `${tempoFormatado}`;
}

startPauseBt.addEventListener("click", iniciarOuPausar);

mostrarTempo();