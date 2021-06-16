 
/*
  Portal de Filmes
  Desenvolvimento de Interfaces Web
 */


//CÓDIGO DA BARRA DE PESQUISA 

let botoes = document.getElementsByClassName('btn-pesquisa');
let campos = document.getElementsByClassName('me-2');
let valorPesquisa = "";

botoes[0].onclick = (event) =>{
    event.preventDefault();
    valorPesquisa = campos[0].value;
    valorPesquisa = valorPesquisa.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    window.location.href = 'pesquisa.html#' + valorPesquisa;
}
botoes[1].onclick = (event) =>{
    event.preventDefault();
    valorPesquisa = campos[1].value;
    valorPesquisa = valorPesquisa.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    window.location.href = 'pesquisa.html#' + valorPesquisa;
}
botoes[2].onclick = (event) =>{
    event.preventDefault();
    valorPesquisa = campos[2].value;
    valorPesquisa = valorPesquisa.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    window.location.href = 'pesquisa.html#' + valorPesquisa;
}
