
/*
  Portal de Filmes
  Desenvolvimento de Interfaces Web
 */

 const API_KEY  = 'c9ff405419b843866fed3040683974ca';
 let page = 1;
 let texto = "";
 
 function getLancamentos(page){
  const url =  `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=pt-BR&page=${page}&sort_by=popularity.desc&`;

  $.ajax({
     url: url,
     type: 'GET',
     success: function(response){
         exibeFilmes(response);
     }
 })



}

 function exibeFilmes(resposta){

    let divTela = document.getElementById('tela');
    
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
                    <a href="filme.html#${filme.id}" target="_self">
                      <img class="poster-filme" src="https://image.tmdb.org/t/p/w500${filme.poster_path}" alt="Capa do Filme">
                    </a>
                 </div>

                 <!--OUTRAS INFORMAÇÕES-->
                 <div class="col-12 col-sm-8 infos">
                   <a target="_self" href="filme.html#${filme.id}">
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


                    <div class="row">
                      <div class="col-12 botao">
                        <a target="_self" class="link" href="filme.html#${filme.id}">
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


 document.getElementById('mais').onclick = () =>{
     page++;
     getLancamentos(page);
 };

 getLancamentos(page);
