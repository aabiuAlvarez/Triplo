document.getElementById('notationForm').addEventListener('submit', function (e) {
    e.preventDefault();

    let expression = document.getElementById('expression').value;

    // Validar que no haya números negativos
    if (/[-]\d+/.test(expression)) {
        alert('No se permiten números negativos.');
        return;
    }

    try {
        // Mostrar la expresión original
        document.getElementById('originalExpression').textContent = expression;

        // Validar que sólo haya caracteres permitidos (números, operadores, paréntesis)
        if (!/^[0-9+\-*/() ]+$/.test(expression)) {
            alert('Caracteres inválidos. Sólo se permiten números, operadores y paréntesis.');
            return;
        }

        // Convertir la expresión a notación polaca (RPN)
        let rpn = infixToRPN(expression);

        // Verificar si el resultado es una notación polaca válida
        if (rpnValid(rpn)) {
            document.getElementById('resultRPN').textContent = rpn;

            // Evaluar el resultado de la operación en notación polaca
            let result = evaluateRPN(rpn);
            document.getElementById('operationResult').textContent = result;
        } else {
            alert('Expresión inválida para notación polaca.');
            document.getElementById('resultRPN').textContent = '';
            document.getElementById('operationResult').textContent = '';
        }
    } catch (error) {
        alert('Expresión inválida. Por favor, verifica la entrada.');
    }

    // Código con operaciones adicionales y logs corregidos
    let a = 10;
    let b = 2;
    let r1 = a / b; // División
    let c = 3;
    let r2 = r1 + c; // Suma después de dividir

    // Mostrar en consola las operaciones con división
    console.log(a + " / " + b);    // Mostrará "10 / 2"
    console.log(r1);               // Mostrará "5"
    console.log(r1 + " + " + c);   // Mostrará "5 + 3"
    console.log(r2);               // Mostrará "8"
});

// Función para convertir la expresión a notación polaca (Shunting Yard)
function infixToRPN(expression) {
    let outputQueue = [];
    let operatorStack = [];
    let operators = {
        '+': { precedence: 1, associativity: 'Left' },
        '-': { precedence: 1, associativity: 'Left' },
        '*': { precedence: 2, associativity: 'Left' },
        '/': { precedence: 2, associativity: 'Left' } // División soportada
    };

    let tokens = expression.match(/\d+|[+\-*/()]/g);

    tokens.forEach(token => {
        if (/\d/.test(token)) {
            outputQueue.push(token);
        } else if (token in operators) {
            let o1 = token;
            let o2 = operatorStack[operatorStack.length - 1];
            while (o2 in operators && (
                (operators[o1].associativity === 'Left' && operators[o1].precedence <= operators[o2].precedence) ||
                (operators[o1].associativity === 'Right' && operators[o1].precedence < operators[o2].precedence)
            )) {
                outputQueue.push(operatorStack.pop());
                o2 = operatorStack[operatorStack.length - 1];
            }
            operatorStack.push(o1);
        } else if (token === '(') {
            operatorStack.push(token);
        } else if (token === ')') {
            while (operatorStack[operatorStack.length - 1] !== '(') {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.pop();
        }
    });

    while (operatorStack.length > 0) {
        outputQueue.push(operatorStack.pop());
    }

    return outputQueue.join(' ');
}

// Validar si el resultado es una notación polaca válida
function rpnValid(rpn) {
    let tokens = rpn.split(' ');
    let stack = [];

    for (let token of tokens) {
        if (/\d/.test(token)) {
            stack.push(token);
        } else if (/[+\-*/]/.test(token)) {
            if (stack.length < 2) {
                return false;
            }
            stack.pop();
        }
    }

    return stack.length === 1;
}

// Evaluar la expresión en notación polaca
function evaluateRPN(rpn) {
    let tokens = rpn.split(' ');
    let stack = [];

    tokens.forEach(token => {
        if (/\d/.test(token)) {
            stack.push(parseFloat(token));
        } else {
            let b = stack.pop();
            let a = stack.pop();
            switch (token) {
                case '+': stack.push(a + b); break;
                case '-': stack.push(a - b); break;
                case '*': stack.push(a * b); break;
                case '/': stack.push(a / b); break; // División implementada
            }
        }
    });

    return stack[0];
}

// Limitar entrada a solo caracteres válidos (números, operadores, paréntesis)
document.getElementById('expression').addEventListener('keypress', function (e) {
    const allowedChars = /[0-9+\-*/() ]/;
    if (!allowedChars.test(e.key)) {
        e.preventDefault();
    }
});

// Evento para el botón "Restablecer"
document.getElementById('resetButton').addEventListener('click', function () {
    document.getElementById('expression').value = '';
    document.getElementById('originalExpression').textContent = '';
    document.getElementById('resultRPN').textContent = '';
    document.getElementById('operationResult').textContent = '';
});
