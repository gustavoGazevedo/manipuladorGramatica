/* Autor: Gustavo Azevedo */

/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

//teste para descobrir o tipo de gramática
let [gr, glc, gsc, gi] = new Array(4).fill(true);
let novaProducao = {};
setLenght();
let producaoNome = '';
let prod = ''
let linhas = [];
let esquerda = [];
let direita = [];
let dirSimbolo = [];
let inicio = '';
let somenteTransGLC = true;

//Esses sets pegam os dados escritos nas caixas a esquerda, processam eles,
//e escrevem a gramática na caixa da direita
function setNT(nter) {
  let aux = '';
  let aws = nter.split('');
  for (let key in aws) {
    key = aws[key];
    if (/[A-Z]/g.test(key)) {
      aux += key + ', ';
    }
  }
  $('#n1').html(aux.slice(0, -2));
}

function setTer(ter) {
  let aux = '';
  let aws = ter.split('');
  for (let key in aws) {
    key = aws[key];
    if (/[a-z]/g.test(key)) {
      aux += key + ', ';
    }
  }
  $('#t1').html(aux.slice(0, -2));
}

function setSI(si) {
  $('#s1').html(si);
  $('#si').val(si);
}

function setProd(prod) {
  prod = prod.replace(/>/g, '→');
  prod = prod.replace(/&/g, 'ε');
  prod = prod.replace(/(?:\r\n|\r|\n)/g, '<br>');
  $('#p1').html(prod);
}

/* eslint-enable no-unused-vars */

// eslint-disable-next-line no-unused-vars
function runProgram() {
  //teste para descobrir o tipo de gramática
  [gr, glc, gsc, gi] = new Array(4).fill(true);
  //limpa os dados para mais facilmente poder utiliza-los no futuro
  prod = $('#prod').val();
  prod = prod.replace(/ /g, '');
  linhas = prod.split('\n');
  esquerda = [];
  direita = [];
  dirSimbolo = [];
  for (const key of linhas) {
    let aux = key.split('>');
    direita.push(aux[1]);
    esquerda.push(aux[0]);
  }
  for (const key of direita) {
    let aux = key.split('|');
    for (const i of aux) {
      dirSimbolo.push(i);
    }
  }
  //fim da limpa dos dados

  //Procura se possui terminais na esquerda, se sim, não é GR nem GLC
  if (/([a-z])(.*>)/g.test(prod)) {
    gr = false;
    glc = false;
  }

  //Olha o lado esquerdo, se tiver mais de um caractere, não é GR nem GLC
  for (const key in esquerda) {
    for (const iterator of esquerda[key]) {
      if (iterator.length > 1) {
        gr = false;
        glc = false;
      }
    }
  }

  //Procura no lado direito se possui um terminal sozinho ou um terminal seguido de NT,
  //se fugir dessa regra, não é GR.
  //Procura também por vazios, se encontrar, não é GLC nem GSC
  for (const iter of dirSimbolo) {
    for (const key in iter) {
      if (
        /[A-Z]/g.test(iter.charAt(key)) &&
        !/[a-z]/g.test(iter.charAt(key - 1))
      ) {
        gr = false;
      } else if (
        /[a-z]/g.test(iter.charAt(key)) &&
        iter.charAt(key + 1) == '' &&
        iter.charAt(key - 1) != ''
      ) {
        gr = false;
      }
    }
    if (iter.includes('&')) {
      glc = false;
      gsc = false;
    }
  }

  //testa se o lado esquerdo possui o mesmo tamanho ou menor que o lado direito,
  //se não for, não é GSC
  if (gsc) {
    for (const key of linhas) {
      let [esq, dir] = key.split('>');
      let aux = dir.split('|');
      for (const i of aux) {
        if (i.length < esq.length) {
          gsc = false;
          break;
        }
      }
    }
  }

  //Testa se tem um NT na esquerda, se não tiver, não é uma produção valida
  for (const iterator of esquerda) {
    if (!/[A-Z]/g.test(iterator)) {
      gi = false;
      gsc = false;
      gr = false;
      glc = false;
    }
  }

  //Escreve o resultado na tela
  if (gr) {
    $('#typeGram').html('Gramática Regular');
    $('#typeGram').css('color', '#212529');
  } else if (glc) {
    $('#typeGram').html('Gramática Livre de Contexto');
    $('#typeGram').css('color', '#212529');
  } else if (gsc) {
    $('#typeGram').html('Gramática Sensível de Contexto');
    $('#typeGram').css('color', '#212529');
  } else if (gi) {
    $('#typeGram').html('Gramática Irrestrita');
    $('#typeGram').css('color', '#212529');
  } else {
    $('#typeGram').html('Erro: Gramática Inválida');
    $('#typeGram').css('color', 'red');
  }

  // fim teste para o tipo de gramática

  //Inicio da criação da sentença
  //Pega o valor inicial
  inicio = $('#si').val();
  let sentenca = inicio;
  let sentencas = '';
  if (somenteTransGLC) {
    for (const key in linhas) {
      if (esquerda[key] == inicio) {
        //Repete o processo três vezes
        for (let a = 0; a < 3; a++) {
          //Lança a função para criar a sentença com
          //os dados (inicio, opções da direita do inicio, sentença anterior)
          criaSentenca(esquerda[key], direita[key], esquerda[key]);
          sentencas =
            sentencas +
            sentenca.replace(
              /→([^→]+)→?$/g,
              sentenca.substr(sentenca.lastIndexOf('→')).replace(/&/g, '') //retira o vazio no final
            ) +
            '<br>'; //Concatena as sentenças geradas
          sentenca = inicio; //re-inicia o loop
        }
        //escreve na tela a resposta
        sentencas = `Sentenças Geradas = { <br />
          ${sentencas}
          }`;
        $('#sentencaGeradas').html(sentencas);
        break;
      }
    }
  }

  function criaSentenca(nt, t, anterior) {
    let aux = t.split('|');
    let limit = aux.length;
    //Pega uma opção da direita randomicamente e substitui
    let randT = aux[Math.floor(Math.random() * limit)];
    let nova = anterior.replace(nt, randT);
    sentenca = sentenca + ' → ' + nova;
    try {
      //testa se ainda existem NT na sentença, caso existirem,
      //escolha uma randomicamente e repete o processo
      if (/[A-Z]/g.test(nova)) {
        let NT = [];
        for (const key in esquerda) {
          if (nova.includes(esquerda[key])) {
            NT.push(key);
          }
        }
        if (NT.length != 0) {
          let rand = Math.floor(Math.random() * NT.length);
          criaSentenca(esquerda[NT[rand]], direita[NT[rand]], nova);
        } else {
          alert('Erro na produção: Não possui fim');
        }
      }
    } catch (e) {
      alert('Erro na produção: Loop infinito');
    }
  }

  // Automato Finito
  if (gr) {
    //cria a tabela
    $('#tabela').show();
    let tableHead = `<tr><th scope="col">#</th>`;
    let tableBody = `<tr>`;
    //pega o alfabeto
    let alfabeto = new Set(dirSimbolo);
    for (const i of alfabeto) {
      tableHead += `<th scope="col">${i}</th>`;
    }
    for (const i of linhas) {
      tableBody += `<th class="tableRow" scope="row">${i.split('>')[0]}</th>`;
      for (const a of alfabeto) {
        //pega os conjuntos de estados e testa eles contra o alfabeto
        let regex = new RegExp(`\\b${a}\\b`, 'g');
        if (regex.test(i)) {
          if (/[A-Z]/g.test(a)) {
            let aux = a.replace(/[a-z]/g, '').replace(/(?!^)(?!$)/g, '/');
            tableBody += `<td>${aux}</td>`;
          } else {
            tableBody += `<td>ε</td>`;
          }
        } else {
          tableBody += `<td>-</td>`;
        }
      }
      tableBody += `</tr>`;
    }
    tableHead += `</tr>`;
    //escreve na tela
    $('#tableHead').html(tableHead);
    $('#tableBody').html(tableBody);
  } else {
    $('#tabela').hide();
  }

  $('#producoes').html('');
  if (glc || !somenteTransGLC) {
    novaProducao = {};
    setLenght();

    for (const key of linhas) {
      let aux = key.split('>');
      let aws = aux[1].split('|');
      let dirAux = [];
      for (const i of aws) {
        dirAux.push(i);
      }
      novaProducao[Object.keys(novaProducao).length] = {
        direita: dirAux,
        esquerda: aux[0]
      };
    }
    
    producaoNome = "P";
    escreveNovaProd();

    $('#glcHr').attr('hidden', false);
    $('#glcDiv').attr('hidden', false);
  }
}

function inuteis() {
  //retirando Símbolos inúteis
  for (let index = Object.keys(novaProducao).length - 1; index >= 0; index--) {
    let aux = novaProducao[index];
    let element = aux.esquerda;
    //se for somente um que aponta para si mesmo, retira e limpa dos outros
    if (aux.direita.length == 1 && aux.direita[0].includes(element)) {
      delete novaProducao[index];
      for (const x in novaProducao) {
        let aws = novaProducao[x];
        for (const key in aws.direita) {
          if (aws.direita[key].includes(element)) {
            delete aws.direita[key];
          }
        }
      }
    }
    // se não for o começo e não tiver como entrar nele por outro, retira
    if (element != inicio) {
      let test = true;
      for (const x in novaProducao) {
        let aws = novaProducao[x];
        if (aws.esquerda != element) {
          for (const key in aws.direita) {
            if (aws.direita[key].includes(element)) {
              test = false;
              break;
            }
          }
        }
      }
      if (test) {
        delete novaProducao[index];
      }
    }
  }
  escreveNovaProd();
}

function recurcao() {
  //pega a ultima entrada da produção para pegar o numero de linhas
  let rec = novaProducao[Object.keys(novaProducao).length - 1].esquerda.substring(1) + "'";
  for (const x in novaProducao) {
    let aws = novaProducao[x];
    for (const key in aws.direita) {
      if (aws.esquerda == aws.direita[key].substring(0, 1)) {
        novaProducao[Object.keys(novaProducao).length] = {
          esquerda: `${aws.esquerda + rec}`,
          direita: [
            aws.direita[key].substring(1),
            aws.direita[key].substring(1) + `${aws.esquerda + rec}`
          ]
        };
        delete aws.direita[key];
        for (const y in aws.direita) {
          aws.direita[y] = aws.direita[y] + `${aws.esquerda + rec}`;
        }
        rec += "'";
      }
    }
  }
  escreveNovaProd();
}

function eLivre() {
  //realizando e-livre
  for (const x in novaProducao) {
    let aws = novaProducao[x];
    for (const key in aws.direita) {
      if (aws.direita[key].includes('&')) {
        delete aws.direita[key];
        let regex = new RegExp(`\\b${aws.esquerda}\\b`, 'g');
        for (const y in aws.direita) {
          aws.direita.push(aws.direita[y].replace(regex, ''));
        }
        for (const y in novaProducao) {
          if (!aws.esquerda == novaProducao[y].esquerda) {
            for (const a in novaProducao[y].direita) {
              if (novaProducao[y].direita[a].includes(aws.esquerda)) {
                novaProducao[y].direita.push(
                  novaProducao[y].direita[a].replace(regex, '')
                );
              }
            }
          }
        }
      }
    }
  }
  escreveNovaProd();
}

function unitarios() {
  //substitui unitarios pela produção dele
  for (let index = Object.keys(novaProducao).length - 1; index >= 0; index--) {
    let aux = novaProducao[index];
    for (const key in aux.direita) {
      if (/^[A-Z]$/g.test(aux.direita[key])) {
        let aws = aux.direita[key];
        delete aux.direita[key];
        for (const x in novaProducao) {
          if (novaProducao[x].esquerda == aws) {
            for (const y in novaProducao[x].direita) {
              aux.direita.push(novaProducao[x].direita[y]);
            }
          }
        }
      }
    }
  }
  escreveNovaProd();
}

function fatoracao() {
  //testa se necessita refatoração, se precisar, cria uma nova produção e substitue na antiga
  let rec = novaProducao[Object.keys(novaProducao).length - 1].esquerda.substring(1) + "'";
  for (const x in novaProducao) {
    let aws = novaProducao[x];
    let aux2 = [];
    for (const key in aws.direita) {
      for (const y in aws.direita) {
        if (key != y) {
          if (aws.direita[key].length < 2) {
            test = aws.direita[key];
            if (test == aws.direita[y].replace(/[A-Z]/g, '')) {
              let aux = [];
              for (const a in aws.direita) {
                if (y != a) {
                  if (!aws.direita[a].includes("'")) {
                    if (test == aws.direita[a].replace(/[A-Z]/g, '')) {
                      aux.push(aws.direita[a].replace(/[a-z]/g, ''));
                      aux.push(aws.direita[y].replace(/[a-z]/g, ''));
                      aws.direita[y] = aws.direita[y].replace(
                        /[A-Z]/g,
                        `${aws.esquerda + rec}`
                      );

                      aux2.push(key);
                    }
                  }
                }
              }
              aux = aux.filter(Boolean);
              if (aux.length == 1) {
                aux.push('&');
              }
              if (aux.length != 0) {
                novaProducao[Object.keys(novaProducao).length] = {
                  esquerda: `${aws.esquerda + rec}`,
                  direita: aux
                };
                rec += "'";
              }
            }
          } else if (/[A-Z]/g.test(aws.direita[key])) {
            if (
              aws.direita[y].replace(/[A-Z]/g, '%%') ==
              aws.direita[key].replace(/[A-Z]/g, '%%')
            ) {
              let aux = [];
              for (const a in aws.direita) {
                if (y != a) {
                  if (!aws.direita[a].includes("'")) {
                    if (
                      aws.direita[y].replace(/[A-Z]/g, '%%') ==
                      aws.direita[a].replace(/[A-Z]/g, '%%')
                    ) {
                      aux.push(aws.direita[a].replace(/[a-z]/g, ''));
                      aux.push(aws.direita[y].replace(/[a-z]/g, ''));
                      aws.direita[a] = aws.direita[a].replace(
                        /[A-Z]/g,
                        `${aws.esquerda + rec}`
                      );
                      aws.direita[y] = aws.direita[y].replace(
                        /[A-Z]/g,
                        `${aws.esquerda + rec}`
                      );

                      aux2.push(key);
                    }
                  }
                }
              }
              aux = aux.filter(Boolean); //retira vazios
              if (aux.length == 1) {
                aux.push('&');
              }
              if (aux.length != 0) {
                novaProducao[Object.keys(novaProducao).length] = {
                  esquerda: `${aws.esquerda + rec}`,
                  direita: aux
                };
                rec += "'";
              }
            }
          }
        }
      }
    }
    for (const t of aux2) {
      delete aws.direita[t];
      aws.direita = aws.direita.filter(Boolean);
    }
  }
  escreveNovaProd();
}

function escreveNovaProd() {
  let test = [];
  for (const x in novaProducao) {
    let aws = novaProducao[x].esquerda + '>' + novaProducao[x].direita.join();
    if (!test.includes(aws)) {
      test.push(novaProducao[x].esquerda + '>' + novaProducao[x].direita.join());
    } else {
      delete novaProducao[x];
    }
  }
  let text = '';
  for (const element in novaProducao) {
    text += novaProducao[element].esquerda + ' > ';
    novaProducao[element].direita = novaProducao[element].direita.filter(Boolean);
    novaProducao[element].direita = [...new Set(novaProducao[element].direita.map(item => item))]
    for (const key in novaProducao[element].direita) {
      if (key < novaProducao[element].direita.length - 1) {
        text += novaProducao[element].direita[key] + ' | ';
      } else {
        text += novaProducao[element].direita[key];
      }
    }
    text += '<br />';
  }
  text = `<p class="resultGramaticas transformaGlc">
        ${producaoNome} = { <br />
        ${text}
        }
        </p>`;
  producaoNome += "'";
  text = text.replace(/&/g , 'ε');
  $('#producoes').append(text);
}

function setLenght() {
  Object.defineProperty(novaProducao, 'lenght', {
    enumerable: false, // não enumerável
    get: function countProperties() {
      var count = 0;
      var obj = novaProducao;
      for (var property in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, property)) {
          count++;
        }
      }
      return count;
    }
  });
}