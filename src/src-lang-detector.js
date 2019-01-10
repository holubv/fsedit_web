const DICT = {
    json: {
        require: ['{', '}', ':', '"'],
        fn: str => {
            try {
                JSON.parse(str);
                return true;
            } catch (e) {
                return false;
            }
        }
    },
    py: {
        contains: [
            'if __name__ == "__main__":', ['def', '__init__', 'self'], ['def', 'else:'], ['def', 'except', 'as']
        ]
    },
    php: {
        start: ['<?php'],
        contains: [['class', '$this->'], ['<?', '?>', '$'], ['<?', '$_GET']]
    },
    vue: {
        start: ['<template>'],
        require: ['<script', '<style', 'export', '>'],
        contains: ['v-on:', '@', 'data']
    },
    java: {
        require: [';', '{', '}'],
        contains: [
            ['{', 'System.out.println('], ['for (', ' : ', ') {'], 'public static void', 'public class', 'public interface',
            ['package', 'import', 'java.util'], ['List', '=', 'new ArrayList<>();'], ['@Override', 'public', '(', ')', '{']
        ]
    },
    js: {
        require: ['function', 'return', '(', ')', ';', '{', '}', '.'],
        contains: [
            ['for', 'let', 'of'], 'console.log(', 'document.addEventListener', ['if', 'typeof', '=='], 'export default', 'undefined'
        ]
    },
    html: {
        require: ['<', '>'],
        start: ['<!DOCTYPE html>'],
        contains: [
            ['<head>', '</head>', '<body>', '</body>'], ['<div', '</div>', 'class="'], ['<button', '</button>', 'class="']
        ]
    },
    css: {
        require: ['{', '}', '.', ';', ':'],
        contains: [
            '!important;', ['color:', 'background-color:'], ['position:', 'absolute'], ['display:', 'inline-block']
        ]
    },
    sql: {
        contains: [
            ['CREATE', 'TABLE', 'INT', 'CHAR', 'NULL'], ['SELECT', 'FROM', 'WHERE', '=', '\''], ['UPDATE', 'SET', '=', '\'', 'LIMIT'],
            ['INSERT INTO', 'VALUES', '(', ')'], ['DELETE FROM', 'WHERE', 'LIMIT']
        ]
    }
};

/**
 * @param {string} content
 * @param {string|array} rule
 * @param {function} matcher
 * @return {boolean}
 */
function checkRule(content, rule, matcher) {
    if (!rule) {
        return false;
    }
    if (typeof rule === 'string') {
        return matcher(rule, content);
    }
    for (let comp of rule) {
        if (!matcher(comp, content)) {
            return false;
        }
    }
    return true;
}

/**
 * @param {string} content
 * @param {string} [def]
 * @return {string}
 */
export default function (content, def) {
    if (def === undefined) {
        def = 'txt';
    }
    content = content.trim();

    for (let lang in DICT) {
        if (!DICT.hasOwnProperty(lang)) {
            continue;
        }
        let spec = DICT[lang];

        let c = content;
        if (spec.lc) {
            c = c.toLowerCase();
        }

        if (spec.require) {
            let containsAll = true;
            for (let rule of spec.require) {
                if (!checkRule(c, rule, (search, str) => str.indexOf(search) !== -1)) {
                    containsAll = false;
                    break;
                }
            }
            if (!containsAll) {
                continue;
            }
        }

        if (spec.fn) {
            if (spec.fn(c)) {
                return lang;
            }
        }

        if (spec.start) {
            for (let rule of spec.start) {
                if (checkRule(c, rule, (search, str) => str.startsWith(search))) {
                    return lang;
                }
            }
        }

        if (spec.contains) {
            for (let rule of spec.contains) {
                if (checkRule(c, rule, (search, str) => str.indexOf(search) !== -1)) {
                    return lang;
                }
            }
        }
    }

    return 'txt';
}