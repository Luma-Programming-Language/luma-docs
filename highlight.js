if (typeof hljs !== 'undefined') {
    hljs.registerLanguage('luma', function(hljs) {
        const KEYWORDS = [
            'const', 'let', 'if', 'elif', 'else', 'loop', 'break', 
            'continue', 'return', 'defer', 'switch', 'fn', 'struct', 
            'enum', 'pub', 'priv', 'as'
        ];
        
        const TYPES = [
            'int', 'uint', 'float', 'double', 'bool', 'byte', 'void'
        ];
        
        const LITERALS = ['true', 'false'];
        
        const BUILTINS = [
            'output', 'outputln', 'input', 'system', 
            'alloc', 'free', 'sizeof', 'cast'
        ];

        return {
            name: 'Luma',
            aliases: ['lx'],
            keywords: {
                keyword: KEYWORDS,
                type: TYPES,
                literal: LITERALS,
                built_in: BUILTINS
            },
            contains: [
                // Line comments
                hljs.COMMENT('//', '$', {
                    relevance: 0
                }),
                
                // Block comments
                hljs.COMMENT('/\\*', '\\*/', {
                    relevance: 0
                }),
                
                // Module directives (@module, @use)
                {
                    className: 'meta',
                    begin: /@module\s+/,
                    end: /$/,
                    contains: [
                        {
                            className: 'string',
                            begin: '"',
                            end: '"'
                        }
                    ],
                    relevance: 10
                },
                {
                    className: 'meta',
                    begin: /@use\s+/,
                    end: /$/,
                    contains: [
                        {
                            className: 'string',
                            begin: '"',
                            end: '"'
                        },
                        {
                            className: 'keyword',
                            begin: /\bas\b/
                        },
                        {
                            className: 'title',
                            begin: /\bas\s+(\w+)/,
                            returnBegin: false
                        }
                    ],
                    relevance: 10
                },
                
                // Ownership attributes (#returns_ownership, #takes_ownership)
                {
                    className: 'meta',
                    begin: /#(returns_ownership|takes_ownership)\b/,
                    relevance: 10
                },
                
                // String literals
                {
                    className: 'string',
                    begin: '"',
                    end: '"',
                    contains: [
                        {
                            begin: /\\[nrt\\'"\x]/
                        }
                    ],
                    relevance: 0
                },
                
                // Character literals
                {
                    className: 'string',
                    begin: "'",
                    end: "'",
                    contains: [
                        {
                            begin: /\\[nrt\\'"\x]/
                        }
                    ],
                    relevance: 0
                },
                
                // Numbers (integers, floats, hex)
                {
                    className: 'number',
                    variants: [
                        { begin: '\\b0[xX][0-9a-fA-F]+\\b' },
                        { begin: '\\b\\d+\\.\\d+([eE][+-]?\\d+)?\\b' },
                        { begin: '\\b\\d+\\b' }
                    ],
                    relevance: 0
                },
                
                // Generic type parameters in angle brackets
                {
                    className: 'type',
                    begin: /<[A-Z][a-zA-Z0-9_]*>/,
                    relevance: 5
                },
                
                // Type declarations (after ->)
                {
                    begin: /->(?=\s*(fn|struct|enum))/,
                    className: 'operator',
                    relevance: 0
                },
                
                // Function definitions
                {
                    className: 'function',
                    beginKeywords: 'fn',
                    end: /[{;]/,
                    excludeEnd: true,
                    contains: [
                        {
                            className: 'title',
                            begin: /[a-zA-Z_][a-zA-Z0-9_]*/,
                            relevance: 0
                        },
                        {
                            // Generic parameters
                            begin: /<[^>]+>/,
                            className: 'type',
                            relevance: 5
                        },
                        {
                            className: 'params',
                            begin: /\(/,
                            end: /\)/,
                            keywords: {
                                keyword: KEYWORDS,
                                type: TYPES
                            },
                            contains: [
                                hljs.COMMENT('//', '$'),
                                hljs.COMMENT('/\\*', '\\*/'),
                                {
                                    className: 'type',
                                    begin: /:\s*/,
                                    end: /[,)]/,
                                    excludeEnd: true,
                                    keywords: {
                                        type: TYPES
                                    }
                                }
                            ]
                        },
                        {
                            // Return type
                            begin: /\)\s*/,
                            end: /[{;]/,
                            excludeEnd: true,
                            keywords: {
                                type: TYPES
                            }
                        }
                    ]
                },
                
                // Struct/enum definitions
                {
                    className: 'class',
                    beginKeywords: 'struct enum',
                    end: /[{;]/,
                    excludeEnd: true,
                    contains: [
                        {
                            className: 'title',
                            begin: /[a-zA-Z_][a-zA-Z0-9_]*/,
                            relevance: 5
                        },
                        {
                            // Generic parameters
                            begin: /<[^>]+>/,
                            className: 'type'
                        }
                    ]
                },
                
                // Type annotations (: Type)
                {
                    begin: /:\s*/,
                    end: /[;,=)\]]/,
                    excludeEnd: true,
                    returnBegin: true,
                    keywords: {
                        type: TYPES
                    },
                    contains: [
                        {
                            className: 'type',
                            begin: /:\s*/,
                            end: /[;,=)\]]/,
                            excludeEnd: true
                        }
                    ]
                },
                
                // Static access (Module::function, Enum::Variant)
                {
                    className: 'built_in',
                    begin: /[a-zA-Z_][a-zA-Z0-9_]*::[a-zA-Z_][a-zA-Z0-9_]*/,
                    relevance: 5
                },
                
                // Cast and sizeof with generic syntax
                {
                    className: 'built_in',
                    begin: /\b(cast|sizeof)<[^>]+>/,
                    relevance: 5
                },
                
                // Operators
                {
                    className: 'operator',
                    begin: /->|::|[+\-*\/%=<>!&|^]+/,
                    relevance: 0
                },
                
                // Pointer and reference operators
                {
                    className: 'operator',
                    begin: /[*&]/,
                    relevance: 0
                }
            ]
        };
    });
    
    // Auto-highlight on page load
    if (typeof document !== 'undefined') {
        document.addEventListener('DOMContentLoaded', function() {
            hljs.highlightAll();
        });
    }
}
