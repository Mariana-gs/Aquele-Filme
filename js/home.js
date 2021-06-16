
/*
  Portal de Filmes
  Desenvolvimento de Interfaces Web
 */

const API_KEY  = 'c9ff405419b843866fed3040683974ca';


//Gera e retorna uma url da api
function gerarUrl(caminho){
    const url =  `https://api.themoviedb.org/3${caminho}?api_key=${API_KEY}&language=pt-BR`;
    return url;
}


//Retorna a resposta da Requisição com os lançamentos
function procuraLancamentos(Funcao){
    $.ajax({
        url: gerarUrl('/movie/now_playing'),
        type: 'GET',
        success: function(response){
            Funcao(response);
        }
    })
}


//Exibe os lançamentos no Carousel principal da página  
function exibeLancamentos(resposta){
    let lancamentos = resposta;
    let carousel = document.getElementById('carousel-inner');
    let texto = "";
    let active = "";
    let estrelas = "";

    for(let i = 0; i < 5; i++){

        if(i == 0){
            active = 'active';
        }else{
            active = "";
        }

        let lancamento = lancamentos.results[i];
        let data = new Date (lancamento.release_date);
        //Cálculo das estrelinhas
        for(j = 0; j < ~~(lancamento.vote_average); j+=2){
            estrelas = estrelas + ' <i class="fa fa-star"></i> '
        }

        let videoKey, creditos;

        $.ajax({
            url: gerarUrl(`/movie/${lancamento.id}/videos`),
            type: 'GET',
            async: false,
            success: function(response){
               videoKey = response.results[0].key;
            }
        });

        
        
        $.ajax({
            url: gerarUrl(`/movie/${lancamento.id}/credits`),
            type: 'GET',
            async: false,
            success: function(response){
               creditos = response;
            }
        });

        let atores = "";

        for(j = 0; j < 4; j++){
          if(j < 3)
          atores = atores + creditos.cast[j].name + ", "; 
          else
          atores = atores + creditos.cast[j].name;
        }

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


        texto = texto + `
        <!-- Filme ${i+1} -->
              <div class="carousel-item ${active}">
                <div class="row slider">
                  <!-- Trailer -->
                  <div id="trailer${i+1}" class="col-sm-12 col-md-12 col-lg-5 boxTrailer">
                    <iframe class="trailer" width="560" height="315" src="https://www.youtube.com/embed/${videoKey}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                  </div>

                  <!-- Sinopse -->
                  <div class="col-sm-12 col-md-12 col-lg-7 infos">
                     <a target="_self" href="filme.html#${lancamento.id}"><h2>${lancamento.title}</h2></a>
                    <p> 
                     <b>Sinopse:</b> ${lancamento.overview}
                    </p>  
                     <!-- Informações Adicionais -->
                     <div class="row">
                      <div class="col-4 col-sm-5 direcao">
                        <p> <b> Direção: </b> ${diretor}</p>
                      </div>
                      <div class="col-4 col-sm-5 roteiro">
                        <p> <b> Roteiro:</b> ${roteirista}</p>
                      </div>
                      <div class="col-3 estreia">
                        <p> <b> Estreia: </b> ${data.toLocaleDateString()}</p>
                      </div>
                     </div>
                     <div class="row">
                       <div class="col-12 elenco">
                        <p> <b>Elenco: </b>${atores}</p>
                       </div>
                     </div>
                    
                        <p class="avaliacao"> Avaliação: ${lancamento.vote_average}</p> 
                         <!-- Estrelas -->                      
                      <div class="star">
                      ${estrelas}
                    </div>
                  </div>
              </div>
              </div>
        `;
        estrelas = "";
    }
    carousel.innerHTML= texto;
}


//Busca filmes em Destaque
function filmesDestaque(){
  //busca lista de generos
    let generos;
    $.ajax({
      url: gerarUrl(`/genre/movie/list`),
      type: 'GET',
      async: false,
      success: function(response){
         generos = response.genres;
      }
  });

    //Colcando opções na caixa de seleção
    let caixaSelecao = document.getElementById('inputEstado');
    for(i = 0; i < generos.length; i++){
      caixaSelecao.innerHTML += `<option value="${generos[i].id}">${generos[i].name}</option>`;
    }

    let filmes;

    //busca filmes populares
    $.ajax({
      url: gerarUrl(`/discover/movie`) + '&sort_by=popularity.desc&include_adult=false',
      type: 'GET',
      async: false,
      success: function(response){
        filmes = response;
         console.log(response);
      }
  });

  let qtd = 0;
  //mostra filmes
  mostrar(filmes, qtd);

  //clicar em mais soma 4 filmes na tela
  document.getElementById('mais').onclick = ()=>{
    qtd+=4;
    mostrar(filmes, qtd);
  }
 
  
  //selecionar reseta os filmes exibidos e mostra a categoria escolhida
    caixaSelecao.onchange = () =>{

      if(caixaSelecao.value == '0'){
        $.ajax({
          url: gerarUrl(`/discover/movie`) + '&sort_by=popularity.desc&include_adult=false',
          type: 'GET',
          async: false,
          success: function(response){
            filmes = response;
             console.log(response);
          }
      });
        qtd = 0;
        mostrar(filmes, qtd);

      }else{
          $.ajax({
            url: gerarUrl(`/discover/movie`) + `&with_genres=${caixaSelecao.value}`,
            type: 'GET',
            async: false,
            success: function(response){
              filmes = response;
               console.log(response);
            }
        });
          qtd = 0;
          mostrar(filmes, qtd);
      }
    }
}


//Exibe posters de filmes em Destaque
function mostrar(filmes, qtd){
  if(qtd == 0){
    document.getElementById('poster').innerHTML =``;
  }
  for(i = qtd; i < (qtd+4); i++){
  document.getElementById('poster').innerHTML += `
  <div class="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3 poster p${i}">
  <a href="filme.html#${filmes.results[i].id}" target="_self"><img src="https://image.tmdb.org/t/p/w500${filmes.results[i].poster_path}" alt=""></a>
  <div class="info">
  <a href="filme.html#${filmes.results[i].id}" target="_self"><h4 class="subtitle">${filmes.results[i].title}</h4></a>
  <p>Avaliação Média: ${filmes.results[i].vote_average} <br>
  ${filmes.results[i].overview.substr(0, 40)}... <a href="filme.html#${filmes.results[i].id}" target="_self">Ver Mais</a>
  </p>
  </div>
  </div>
  `;
}
}


  procuraLancamentos(exibeLancamentos);
  filmesDestaque();



