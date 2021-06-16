 
/*
  Portal de Filmes
  Desenvolvimento de Interfaces Web
 */

 let botoesPesquisa = document.getElementsByClassName('btn-pesquisa');
 let camposPesquisa = document.getElementsByClassName('campo-pesquisa');
 let pesquisa = "";

 const API_KEY  = 'c9ff405419b843866fed3040683974ca';
 
 function executaPesquisa(){
  const url =  `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pt-BR&query=${pesquisa}`;

  $.ajax({
     url: url,
     type: 'GET',
     success: function(response){
         exibeFilmes(response);
     }
 })
}

 function exibeFilmes(resposta){
    document.getElementById('pesquisado').innerHTML = pesquisa;
    let divTela = document.getElementById('tela');
    let texto = "";


    let dados = resposta;
    for(i = 0; i < dados.results.length; i++){
        let filme = dados.results[i];
        let data = new Date (filme.release_date);
        let estrelas = "";
        let sinopse = "";

        if(filme.overview.length > 0){
           sinopse =  '<b>Sinopse: </b>' + filme.overview;
        }

        //Cálculo das estrelinhas
        for(j = 0; j < ~~(filme.vote_average); j+=2){
            estrelas = estrelas + ' <i class="fa fa-star"></i> '
        }

        texto = texto + `
        <!--TEMPLATE AQUI-->
            <div class="filme row">  
              <!--IMAGEM-->
                <div class="col-12 col-sm-4">
                    <a href="https://www.themoviedb.org/movie/${filme.id}?language=pt-BR" target="_blank">
                      <img class="poster-filme" src="https://image.tmdb.org/t/p/w500${filme.poster_path}" alt="${filme.title}">
                    </a>
                 </div>

                 <!--OUTRAS INFORMAÇÕES-->
                 <div class="col-12 col-sm-8 infos">
                   <a target="_blank" href="https://www.themoviedb.org/movie/${filme.id}?language=pt-BR">
                     <h1 class="title tfilme">
                        ${filme.title}
                      </h1>
                    </a>

                    <p>
                    <span class="sinopse"> 
                      ${sinopse}
                      </span>
                    </p>

                    <p>
                    <b>Título Original:</b> <span class="Titulo">${filme.original_title}</span>
                    </p>

                    <p>
                      <b>Data de lançamento:</b> <span class="lancamento">${data.toLocaleDateString()}</span>
                    </p>

                    <p>
                      <b> Avaliação Média:</b> <span id="vote">${filme.vote_average}</span><br>
                      <span class="star">
                        ${estrelas}
                      </span>
                    </p>

                    <a target="_self" class="link" href="filme.html#${filme.id}">Clique aqui</a> para ver mais.


                    <div class="row">
                      <div class="col-12 botao">
                        <a target="_blank" class="link" href="https://www.themoviedb.org/movie/${filme.id}?language=pt-BR">
                          <button class="btn btn-gold vermais" type="submit">Mais Informações</button>
                        </a>
                      </div>
                    </div>

                  </div>
            </div> <!--end TEMPLATE-->
        `;
    }

    divTela.innerHTML = texto;

 }

/*
 [0] - Pesquisa Mobile 1 - Tablet
 [1] - Pesquisa Mobile 2 - Smartphone (Menu Toggle)
 [2] - Pesquisa Desktop
 */

 botoesPesquisa[0].onclick = () => {
  camposPesquisa[0].value = camposPesquisa[0].value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  window.location.assign("pesquisa.html#" + camposPesquisa[0].value);   
  pesquisa = location.hash.split("#")[1];
  pesquisa = pesquisa.replace(/%20/g, " ");
  executaPesquisa();
}
botoesPesquisa[1].onclick = () => {
  camposPesquisa[1].value = camposPesquisa[1].value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  window.location.assign("pesquisa.html#" + camposPesquisa[1].value);     
  pesquisa = location.hash.split("#")[1];
  pesquisa = pesquisa.replace(/%20/g, " ");
  executaPesquisa();
}
botoesPesquisa[2].onclick = () => { 
  camposPesquisa[2].value = camposPesquisa[2].value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  window.location.assign("pesquisa.html#" + camposPesquisa[2].value);   
  pesquisa = location.hash.split("#")[1];
  pesquisa = pesquisa.replace(/%20/g, " ");
  executaPesquisa();
}


pesquisa = location.hash.split("#")[1];
pesquisa = pesquisa.replace(/%20/g, " ");
executaPesquisa();


