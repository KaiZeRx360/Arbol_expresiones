const generarArbol = () => {
    const expresion = document.getElementById('expresion').value.trim();

    if (expresion === '') {
        alert('Por favor ingresa una expresión válida.');
        return;
    }

    // Permitir letras junto con números y operadores
    if (!/^[\dA-Za-z+\-*/()]+$/.test(expresion)) {
        alert('La expresión solo puede contener números, letras y operadores (+, -, *, /).');
        return;
    }

    if (/^[+\-*/]/.test(expresion)) {
        alert('La expresión no puede empezar con un operador.');
        return;
    }

    if (/[a-zA-Z]/.test(expresion) && /[+\-*/]/.test(expresion) === false) {
        alert('La expresión debe contener al menos un operador si incluye letras.');
        return;
    }

    
    const parenBalanceados = expresion.split('').reduce((acum, char) => {
        if (char === '(') acum++;
        if (char === ')') acum--;
        return acum;
    }, 0);

    if (parenBalanceados !== 0) {
        alert('Los paréntesis no están balanceados.');
        return;
    }

    document.getElementById('arbol').innerHTML = '';
    document.getElementById('recorridos').innerHTML = '';

    const arbol = construirArbolDeExpresion(expresion.replace(/\s+/g, ''));
    mostrarArbol(arbol, document.getElementById('arbol'));

    // Actualizar recorridos
    mostrarPreorden();
    mostrarInorden();
    mostrarPostorden();
};

// Construir el árbol de expresión
const construirArbolDeExpresion = (expresion) => {
    const operadores = ['+', '-', '*', '/'];
    let nivelParentesis = 0;
    let operadorPrincipal = -1;
    let menorPrecedencia = Infinity;

    const precedencia = { '+': 1, '-': 1, '*': 2, '/': 2 };

    for (let i = 0; i < expresion.length; i++) {
        const caracter = expresion[i];
        if (caracter === '(') {
            nivelParentesis++;
        } else if (caracter === ')') {
            nivelParentesis--;
        } else if (nivelParentesis === 0 && operadores.includes(caracter)) {
            if (precedencia[caracter] <= menorPrecedencia) {
                menorPrecedencia = precedencia[caracter];
                operadorPrincipal = i;
            }
        }
    }

    if (operadorPrincipal === -1) {
        if (expresion.startsWith('(') && expresion.endsWith(')')) {
            return construirArbolDeExpresion(expresion.slice(1, -1));
        }
        return { valor: expresion };
    }

    const operador = expresion[operadorPrincipal];
    const izquierda = expresion.substring(0, operadorPrincipal);
    const derecha = expresion.substring(operadorPrincipal + 1);

    return {
        valor: operador,
        izquierda: construirArbolDeExpresion(izquierda),
        derecha: construirArbolDeExpresion(derecha)
    };
};

// Mostrar el árbol en el DOM
const mostrarArbol = (nodo, elementoPadre) => {
    if (!nodo) return;

    const elementoNodo = document.createElement('div');
    elementoNodo.className = 'nodo-arbol';
    
    const contenidoNodo = document.createElement('div');
    contenidoNodo.className = 'contenido-nodo';
    contenidoNodo.innerText = nodo.valor;
    
    elementoNodo.appendChild(contenidoNodo);
    
    if (nodo.izquierda || nodo.derecha) {
        const contenedorHijos = document.createElement('div');
        contenedorHijos.className = 'hijos';

        if (nodo.izquierda) {
            const contenedorIzquierda = document.createElement('div');
            contenedorIzquierda.className = 'nodo-arbol';
            mostrarArbol(nodo.izquierda, contenedorIzquierda);
            contenedorHijos.appendChild(contenedorIzquierda);
        }

        if (nodo.derecha) {
            const contenedorDerecha = document.createElement('div');
            contenedorDerecha.className = 'nodo-arbol';
            mostrarArbol(nodo.derecha, contenedorDerecha);
            contenedorHijos.appendChild(contenedorDerecha);
        }

        elementoNodo.appendChild(contenedorHijos);
    }
    
    elementoPadre.appendChild(elementoNodo);
};

// Recorridos del árbol
const recorridoPreorden = (nodo) => {
    if (!nodo) return [];
    return [nodo.valor, ...recorridoPreorden(nodo.izquierda), ...recorridoPreorden(nodo.derecha)];
};

const recorridoInorden = (nodo) => {
    if (!nodo) return [];
    return [...recorridoInorden(nodo.izquierda), nodo.valor, ...recorridoInorden(nodo.derecha)];
};

const recorridoPostorden = (nodo) => {
    if (!nodo) return [];
    return [...recorridoPostorden(nodo.izquierda), ...recorridoPostorden(nodo.derecha), nodo.valor];
};

const mostrarPreorden = () => {
    const arbol = construirArbolDeExpresion(document.getElementById('expresion').value.trim());
    const resultado = recorridoPreorden(arbol).join(' ');
    document.getElementById('recorridos').innerHTML = `<p><strong>Preorden:</strong> ${resultado}</p>`;
};

const mostrarInorden = () => {
    const arbol = construirArbolDeExpresion(document.getElementById('expresion').value.trim());
    const resultado = recorridoInorden(arbol).join(' ');
    document.getElementById('recorridos').innerHTML = `<p><strong>Inorden:</strong> ${resultado}</p>`;
};

const mostrarPostorden = () => {
    const arbol = construirArbolDeExpresion(document.getElementById('expresion').value.trim());
    const resultado = recorridoPostorden(arbol).join(' ');
    document.getElementById('recorridos').innerHTML = `<p><strong>Postorden:</strong> ${resultado}</p>`;
};

const limpiarArbol = () => {
    document.getElementById('arbol').innerHTML = '';
    document.getElementById('recorridos').innerHTML = '';
};
