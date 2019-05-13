/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

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
  let aux = $('#nter').val();
  if (aux.includes(si)) {
    $('#s1').html(si);
  }
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
  let [gr, glc, gsc, gi] = new Array(4).fill(true);

  let prod = $('#prod').val();
  prod = prod.replace(/\s/g, '');
  let linhas = prod.split('\n');
  let esquerda = [];
  let direita = [];
  let dirSimbolo = [];
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
  if (/([a-z])(.*>)/g.test(prod)) {
    gr = false;
    glc = false;
  }

  for (const iterator of esquerda) {
    if (iterator.length > 1) {
      gr = false;
      glc = false;
    }
  }

  for (const iter of dirSimbolo) {
    for (const key in iter) {
      if (/[a-z]/g.test(iter.charAt(key))) {
        if (
          !(
            /[a-z]/g.test(iter.charAt(key)) &&
            /[A-Z]/g.test(iter.charAt(key + 1))
          )
        ) {
          gr = false;
        }
      }
    }
    if (iter.includes('&')) {
      glc = false;
      gsc = false;
    }
  }
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

  for (const iterator of esquerda) {
    if (!/[A-Z]/g.test(iterator)) {
      gi = false;
      gsc = false;
    }
  }

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

}
