/*
  Portal de Filmes
  Desenvolvimento de Interfaces Web
 */

const API_KEY  = 'c9ff405419b843866fed3040683974ca';
let id = location.hash.split("#")[1];

/**
 * Gera e retorna uma url da api
 * @param {caminho} caminho 
 * @returns 
 */
 function gerarUrl(caminho){
    const url =  `https://api.themoviedb.org/3${caminho}?api_key=${API_KEY}&language=pt-BR`;
    return url;
}


 function procuraFilme(){
    $.ajax({
        url: gerarUrl(`/movie/${id}`),
        type: 'GET',
        success: function(response){
          montaPagina(response);
        }
    })
}

function montaPagina(resposta){
  
    let elemento = document.getElementById('filme');
    let filme = resposta;
    let data = new Date (filme.release_date);
    let creditos;


    $.ajax({
        url: gerarUrl(`/movie/${id}/credits`),
        type: 'GET',
        async: false,
        success: function(response){
           creditos = response;
        }
    });


    let diretor = "";

    for(j= 0; j < creditos.crew.length; j++){
      if(creditos.crew[j].department == "Directing"){
        diretor = creditos.crew[j].name;
      }
    }

    let roteirista = "";

    for(j= 0; j < creditos.crew.length; j++){
      if(creditos.crew[j].department == "Writing"){
        roteirista = creditos.crew[j].name;
      }
    }

    let estrelas = "";
    //Cálculo das estrelinhas
    for(j = 0; j < ~~(filme.vote_average); j+=2){
        estrelas = estrelas + ' <i class="fa fa-star"></i> '
    }

    let texto =`
    <!--IMAGEM-->
                <div class="col-12 col-md-4">
                    
                      <img class="poster-filme" src="https://image.tmdb.org/t/p/w500${filme.poster_path}" alt="${filme.title}">
                    
                 </div>

                 <!--OUTRAS INFORMAÇÕES-->
                 <div class="col-12 col-md-8 infos">

                     <h1 class="title tfilme">
                       ${filme.title}
                      </h1>
                      <h3 class="title subtitle">${filme.tagline}</h3>

                    <p>
                    <b>Sinopse:</b> <span class="sinopse">
                    ${filme.overview}
                      </span>
                    </p>

                    <p>
                    <b>Título Original:</b> <span class="Titulo">${filme.original_title}</span>
                    </p>

                    <p>
                      <b>Data de lançamento:</b> <span class="lancamento">${data.toLocaleDateString()}</span>
                    </p>

                     <!-- Informações Adicionais -->
                     <div class="row">
                      <div class="col-12 direcao">
                        <p> <b>Direção:</b> ${diretor}</p>
                      </div>
                      <div class="col-12 roteiro">
                        <p> <b>Roteiro:</b> ${roteirista}</p>
                      </div>
                      <p>
                        <b> Avaliação Média:</b> <span id="vote">${filme.vote_average}</span><br>
                        <span class="star">
                          ${estrelas} 
                        </span>
                      </p>
                      
                  </div>
            </div>
    `;

    elemento.innerHTML=texto;

    elemento = document.getElementById('elenco');

    texto = "";
    let pessoa;
    let ultimos="";

    for(j = 0; j < 8; j++){

        $.ajax({
            url: gerarUrl(`/person/${creditos.cast[j].id}`),
            type: 'GET',
            async: false,
            success: function(response){
               pessoa = response;
            }
        });

        if(j > 5){
           ultimos="ultimos";
        }

    texto = texto + `
    <div class="col-6 col-lg-4 col-xl-3 ${ultimos}">
                  <div class="card mb-3" >
                    <div class="row g-0">
                      <div class="col-md-4">
                        <img class="imgactor" src="https://image.tmdb.org/t/p/w500${pessoa.profile_path}" alt="${pessoa.name}">
                      </div>
                      <div class="col-md-8">
                        <div class="card-body">
                          <h5 class="card-title"></h5>
                          <p class="card-text"><b>${pessoa.name}</b> <br>
                            ${creditos.cast[j].character}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
    `;
    }

    elemento.innerHTML=texto;

    elemento = document.getElementById('trailer');

    let video;

        $.ajax({
            url: gerarUrl(`/movie/${id}/videos`),
            type: 'GET',
            async: false,
            success: function(response){
               video = response;
            }
        });

        if(video.results.length > 0){
          document.getElementById('video-title').innerText = video.results[0].name;
        }

    texto = `
    <iframe class="trailer" width="750" height="400" src="https://www.youtube.com/embed/${video.results[0].key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `;

    elemento.innerHTML = texto;

    elemento = document.getElementById('avaliacoes');

    let avaliacoes;

    $.ajax({
        url: gerarUrl(`/movie/${id}/reviews`),
        type: 'GET',
        async: false,
        success: function(response){
           avaliacoes = response;
        }
    });

    texto = "";




    if(avaliacoes.results.length == 0){
        texto = `
        Ainda não temos avaliações para ${filme.title}.
        `;
    }else{

    let i = 0;

    for(j = 0; j < avaliacoes.results.length; j++){

        let avaliacao = avaliacoes.results[j];
        estrelas = "";
        data = new Date (avaliacao.updated_at);
        let avatar;

        //Cálculo das estrelinhas
    for(let e = 0; e < ~~(avaliacao.author_details.rating); e+=2){
        estrelas = estrelas + ' <i class="fa fa-star"></i> '
    }

        texto = texto + `
        <!-- Avaliação ${j+1} -->
        <div class="col-md-12 col-lg-6 col-xl-4 critica c${j+1}">
          <div class="row">
            <!-- Imagem de Perfil -->
            <div class="col-2 col-sm-2 perfil">
              <img src="https://image.tmdb.org/t/p/w500${avaliacao.author_details.avatar_path}">
            </div>
            <!-- Avaliação -->
            <div class="col-10 col-sm-9 critica">
              <h3 class="subtitle">${avaliacao.author_details.username}</h3>
                <p><b>Avaliação: </b>${avaliacao.content.substr(0, 200)} ... <a href="${avaliacao.url}" target="_blank">Ver mais</a></p>
              <!-- Estrelas --> 
              <div class="row">             
              <div class="col-7 star">
                ${estrelas}
            </div>
            <div class="col-4 data">
              <p><b>${data.toLocaleDateString()}</b></p>
            </div> 
          </div>        
          </div>
        </div>
      </div>
        `;

        i++;
        if(i == 4){
            break;
        }
    }
}

    elemento.innerHTML = texto;
    let qtd = 4;
    elemento = document.getElementById('relacionados');
    texto="";
    let similares, similar;

    $.ajax({
        url: gerarUrl(`/movie/${id}/similar`),
        type: 'GET',
        async: false,
        success: function(response){
           similares = response;
        }
    });

    for(i = 0; i < qtd; i++){
        similar = similares.results[i];
        texto = texto +`
        <div class="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
        <div class="poster p1">
                <a href="filme.html#${similar.id}" target="_blank"><img src="https://image.tmdb.org/t/p/w500${similar.poster_path}" alt=""></a>
                <a href="filme.html#${similar.id}" target="_blank"><h4 class="subtitle">${similar.title}</h4></a>
        </div>
        </div>
        `;
        
    }
    elemento.innerHTML = texto;

    //Mostrar Mais
    document.getElementById('mais').onclick = () =>{
      for(i = qtd; i < (qtd+4); i++){
        similar = similares.results[i];
        texto = texto +`
        <div class="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
        <div class="poster p1">
                <a href="filme.html#${similar.id}" target="_blank"><img src="https://image.tmdb.org/t/p/w500${similar.poster_path}" alt=""></a>
                <a href="filme.html#${similar.id}" target="_blank"><h4 class="subtitle">${similar.title}</h4></a>
        </div>
        </div>
        `;
    }
    elemento.innerHTML = texto;
        qtd+=4;
}

}

procuraFilme();

