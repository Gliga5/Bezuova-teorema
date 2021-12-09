function changefontsize() {
    var myInput = document.getElementById('input');
    currentfontsize = 35;
    if(isOverflown(myInput)) {
      while (isOverflown(myInput)){
      currentfontsize--;
      myInput.style.fontSize = currentfontsize + 'px';
      }
    }else {
      myInput.style.fontSize = currentfontsize + 'px';
      while (isOverflown(myInput)){
      currentfontsize--;
      myInput.style.fontSize = currentfontsize + 'px';
      }
    }	
  }
  
  function isOverflown(element) {
      return element.scrollWidth > element.clientWidth;
  }

window.onload = function() {
    document.querySelector('input').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            document.getElementById("rjesenja").innerHTML = ''
            let formula = document.querySelector('input').value
            formula = formula.replace(/x\^/g, 'x^{').replace(/ *- */g,'}-').replace(/ *\+ */g,'}+').replace(/[^\d]}/g,'x')
            console.log(formula)
            document.getElementById("gliga").innerHTML = `\\(${formula}\\)`
            document.getElementById("break").style.visibility = 'hidden'
            MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
            bezuov(document.querySelector('input').value)
        }
    });
    
}

function bezuov(input) {
    let clanovi = input.toLowerCase().replace(/ /g, '').replace(/-/g, '+-').split('+').filter(e => e).map(e => e.includes('x') ? (e.split('x')[0] == '' ? '1'+e: ( e.split('x')[0] == '-' ? e.replace('-','-1') : e)) : e)
    console.log(clanovi)

    let djelioci = []
    for (let i = 1; i <= Math.abs(parseInt(clanovi[clanovi.length-1])); i++){
        if (Math.abs(parseInt(clanovi[clanovi.length-1])) % i == 0) {
            djelioci.push(i)
            djelioci.push(-i)
        }
    }

    console.log(djelioci)

    /**
     * 
     * @param {string} clan
     */
    function djeljenje(clan) {
        const stepen = parseInt(clan.split('^')[1])-1
        if (stepen == 1) {
            return clan.split('^')[0]
        }else if (isNaN(stepen)) {
            return clan.replace('x','')
        }else {
            return clan.split('^')[0]+'^'+stepen.toString()
        }
    }

    /**
     * 
     * @param {string} rez 
     * @param {number} a 
     */
    function mnozenje(rez, a) {
        if (rez.includes('x')) {
            return parseInt(rez.split('x')[0])*a+'x'+rez.split('x')[1]
        }else {
            return parseInt(rez.split('x')[0])*a+''
        }
    }

    /**
     * 
     * @param {string} clan 
     * @param {string} rez 
     */
    function sabiranje(clan, rez) {
        if (clan.includes('x')) {
            return parseInt(clan.split('x')[0])+parseInt(rez.split('x')[0])+'x'+clan.split('x')[1]
        }else {
            return parseInt(clan.split('x')[0])+parseInt(rez.split('x')[0])
        }
    }

    for (const djelioc of djelioci) {
        let rezultat = ""
        let ostatak = clanovi[0]
        console.log(`<------------<${djelioc}>------------>`)
        for (let i = 0; i < clanovi.length-1; i++) {
            rezultat += (djeljenje(ostatak).includes('-') ? djeljenje(ostatak) : '+'+djeljenje(ostatak))
            ostatak = sabiranje(clanovi[i+1],mnozenje(djeljenje(ostatak), djelioc))
        }
        console.log(rezultat)
        console.log(ostatak)
        if (ostatak == 0) {
            document.getElementById("break").style.visibility = 'visible'
            rezultat = rezultat.replace(/\+1x/g, '+x')
            rezultat = rezultat.replace(/-1x/g, '-x')
            if (rezultat[0] == '+') {
                rezultat = rezultat.substring(1)
            }
            var node = document.createElement("p");
            rezultat = rezultat.replace(/x\^/g, 'x^{').replace(/ *- */g,'}-').replace(/ *\+ */g,'}+').replace(/[^\d]}/g,'x')
            if (djelioc*-1 > 0) {
                var textnode = document.createTextNode(`\\((${rezultat})(x+${djelioc*-1})\\)`);
            }else {
                var textnode = document.createTextNode(`\\((${rezultat})(x${djelioc*-1})\\)`);
            }
            node.appendChild(textnode);
            document.getElementById("rjesenja").appendChild(node);
            MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        }
    }
}
