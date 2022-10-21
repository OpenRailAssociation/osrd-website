'use strict';

var MktLexer = function(buf) {
    this.pos = 0;
    this.buf = buf;
    this.buflen = buf.length;
    this.tokens = []
}


MktLexer.prototype.next = function() {
    if (this.tokens.length !== 0)
        return this.tokens.shift();
    return this.token();
}

MktLexer.prototype.peek = function() {
    if (this.tokens.length == 0)
        this.tokens.push(this.token());
    return this.tokens[0];
}

MktLexer.prototype.expect = function(val_type) {
    var next_val = this.next();
    if (next_val.type !== val_type)
        throw Error(`expected ${val_type} got ${next_val.type}`);
    return next_val;
}

MktLexer.prototype.lex_all = function() {
    while (true) {
        const tok = this.token();
        if (tok === null)
            break;
        this.tokens.push(tok);
    }
}

// Operator table, mapping operator -> token name
MktLexer.prototype.optable = {
    '|':  'OR',
    '!':  'NOT',
    '&':  'AND',
};

MktLexer.prototype.token = function() {
    this._skipnontokens();
    if (this.pos >= this.buflen) {
        return {type: 'EOF', pos: this.pos};
    }

    // The char at this.pos is part of a real token. Figure out which.
    var c = this.buf.charAt(this.pos);

    // Look it up in the table of operators
    var op = this.optable[c];
    if (op !== undefined) {
        return {type: op, value: c, pos: this.pos++};
    } else {
        // Not an operator - so it's the beginning of another token.
        if (MktLexer._isalpha(c)) {
            return this._process_identifier();
        } else {
            throw Error('Token error at ' + this.pos);
        }
    }
}


MktLexer._isalpha = function(c) {
    return (c >= 'a' && c <= 'z') ||
        (c >= 'A' && c <= 'Z') ||
        c === '_' || c === '$';
}

MktLexer._isalphanum = function(c) {
    return (c >= 'a' && c <= 'z') ||
        (c >= 'A' && c <= 'Z') ||
        (c >= '0' && c <= '9') ||
        c === '_' || c === '$';
}

MktLexer.prototype._process_identifier = function() {
    var endpos = this.pos + 1;
    while (endpos < this.buflen &&
           MktLexer._isalphanum(this.buf.charAt(endpos))) {
        endpos++;
    }

    var tok = {
        type: 'IDENTIFIER',
        value: this.buf.substring(this.pos, endpos),
        pos: this.pos
    };
    this.pos = endpos;
    return tok;
}

MktLexer.prototype._skipnontokens = function() {
    while (this.pos < this.buflen) {
        var c = this.buf.charAt(this.pos);
        if (c == ' ' || c == '\t' || c == '\r' || c == '\n') {
            this.pos++;
        } else {
            break;
        }
    }
}


var MktParser = function(lexer) {
    this.lexer = lexer
    this.depth = 0
    this.handlers = {
        "OR": {prio: 10, handle_left: function (token, left, parser) {
            const right = parser.parse(this.prio);
            // console.log(`building or`);
            return function (flags) {
                return left(flags) || right(flags);
            };
        }},
        "AND": {prio: 20, handle_left: function (token, left, parser) {
            const right = parser.parse(this.prio);
            // console.log(`building and`);
            return function (flags) {
                return left(flags) && right(flags);
            };
        }},
        "NOT": {prio: 30, handle_nul: function (token, parser) {
            const internal_expr = parser.parse(this.prio);
            // console.log(`building not`);
            return function (flags) {
                return !internal_expr(flags);
            };
        }},
        "IDENTIFIER": {prio: 0, handle_nul: function(token, parser) {
            const value = token.value;
            // console.log(`building identifier`);
            return function (flags) {
                return flags[value];
            };
        }},
        "EOF": {prio: 0},
    };
}


MktParser.prototype._get_handler = function(token) {
    return this.handlers[token.type];
}

MktParser.prototype._padding = function() {
    var res = "";
    for (var i = 0; i < this.depth; i++)
        res += "  ";
    return res;
}

MktParser.prototype._nud = function(token) {
    // console.log(`${this._padding()}nul(${token})`);
    return this._get_handler(token).handle_nul(token, this);
}

MktParser.prototype._led = function(left, token) {
    // console.log(`${this._padding()}led(${token})`);
    const handler = this._get_handler(token);
    if (handler.handle_left === undefined) {
        throw Error(`${token} isn't an operator`);
    }
    return handler.handle_left(token, left, this);
}

MktParser.prototype.parse = function(up_prio) {
    if (up_prio === undefined)
        up_prio = 0;
    // console.log(`${this._padding()}parse(${up_prio})`);
    this.depth += 1;

    var left = this._nud(this.lexer.next());
    while (this._get_handler(this.lexer.peek()).prio > up_prio)
        left = this._led(left, this.lexer.next());

    this.depth -= 1;
    // console.log(`${this._padding()}<=`);
    return left;
}

function mkt_parse(expr) {
    const lexer = new MktLexer(expr)
    const parser = new MktParser(lexer)
    return parser.parse()
}

function mkt_hydrate(tree) {
    // console.log("in mkt_hydrate", tree);

    const flags = {}
    const managedNodes = []

    function mkt_prefix_visit(tree, f) {
        f(tree);
        var children = tree.children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            mkt_prefix_visit(child, f);
        }
    }

    function mkt_evaluate() {
        // console.log("in mkt_evaluate: ", flags)
        managedNodes.forEach(function (managedNode) {
            const {node, condition} = managedNode;
            var is_visible = condition(flags);
            // console.log(node, is_visible);
            node.style.visibility = is_visible ? "visible" : "hidden";
        });
    }

    function mkt_set_flag(name, value) {
        flags[name] = !!value;
        mkt_evaluate();
    }

    function mkt_toggle_flag(flag) {
        flags[flag] = !flags[flag];
        mkt_evaluate();
    }

    function mkt_register(node, condition) {
        managedNodes.push({"node": node, "condition": condition})
    }

    // parse mkt:flag
    mkt_prefix_visit(tree, function (node) {
        let flagAttr = node.attributes["mkt:flag"];
        if (flagAttr === undefined)
            return;
        const [flagName, flagValue] = flagAttr.value.split("=");
        flags[flagName] = (flagValue === "true");
    });

    // parse mkt:toggle-flag
    mkt_prefix_visit(tree, function (node) {
        let flagAttr = node.attributes["mkt:toggle-flag"];
        if (flagAttr === undefined)
            return;
        let flag = flagAttr.value;
        node.addEventListener("click", function (event) {
            mkt_toggle_flag(flag);
        }, false);
    });

    // parse mkt:set-flags
    mkt_prefix_visit(tree, function (node) {
        let flagAttr = node.attributes["mkt:set-flags"];
        if (flagAttr === undefined)
            return;
        // parse and prepare the flag operations list
        const flagOps = [];
        for (const [flagName, flagValue] of flagAttr.value.split(","))
            flagOps.push({flag: flagName, value: flagValue === "true"});
        // register the event handler
        node.addEventListener("click", function (event) {
            for (const op of flagOps)
                mkt_set_flag(op.flag, op.value);
        }, false);
    });

    // parse mkt:show-when
    mkt_prefix_visit(tree, function (node) {
        let flagAttr = node.attributes["mkt:show-when"];
        if (flagAttr === undefined)
            return;
        // if the node is hidden, unhide it
        if (node.style.display === "none")
            node.style.display = "inline";
        let conditionExpr = flagAttr.value;
        mkt_register(node, mkt_parse(conditionExpr));
    });

    mkt_evaluate();
}
