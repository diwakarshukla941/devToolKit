import hljs from 'highlight.js';
import { js as beautifyJs, html as beautifyHtml, css as beautifyCss } from 'js-beautify';
import YAML from 'yaml';
import JSON5 from 'json5';
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
let isDarkTheme = localStorage.getItem('theme') === 'dark';

function updateTheme() {
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
    themeToggle.textContent = isDarkTheme ? '☀️' : '🌙';
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
}

themeToggle.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
    updateTheme();
});

// Initialize theme
updateTheme();

// Tool Navigation
const toolBtns = document.querySelectorAll('.tool-btn');
const toolSections = document.querySelectorAll('.tool-section');

toolBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tool = btn.dataset.tool;
        
        toolBtns.forEach(b => b.classList.remove('active'));
        toolSections.forEach(s => s.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(tool).classList.add('active');
    });
});

// Code Formatter
const formatLanguage = document.getElementById('formatLanguage');
const codeInput = document.getElementById('codeInput');
const formattedOutput = document.getElementById('formattedOutput');
const formatBtn = document.getElementById('formatBtn');
const copyFormattedBtn = document.getElementById('copyFormattedBtn');

const formatOptions = {
    indent_size: 2,
    indent_char: ' ',
    max_preserve_newlines: 2,
    preserve_newlines: true,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: 'normal',
    brace_style: 'collapse',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: false,
    end_with_newline: true,
    wrap_line_length: 0,
    indent_inner_html: false,
    comma_first: false,
    e4x: false,
    indent_empty_lines: false
};

formatBtn.addEventListener('click', () => {
    const code = codeInput.value;
    let formatted = code;

    switch (formatLanguage.value) {
        case 'javascript':
            formatted = beautifyJs(code, formatOptions);
            break;
        case 'html':
            formatted = beautifyHtml(code, formatOptions);
            break;
        case 'css':
            formatted = beautifyCss(code, formatOptions);
            break;
        case 'sql':
            // Basic SQL formatting
            formatted = code.replace(/\s+/g, ' ')
                           .replace(/\s*,\s*/g, ', ')
                           .replace(/\s*=\s*/g, ' = ')
                           .replace(/\(\s*/g, '(')
                           .replace(/\s*\)/g, ')')
                           .replace(/\s*;\s*/g, ';\n')
                           .replace(/(SELECT|FROM|WHERE|GROUP BY|HAVING|ORDER BY|INSERT|UPDATE|DELETE)/gi, '\n$1\n')
                           .replace(/\n\s*\n/g, '\n');
            break;
    }

    formattedOutput.textContent = formatted;
    hljs.highlightElement(formattedOutput);
});

copyFormattedBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(formattedOutput.textContent);
    copyFormattedBtn.textContent = 'Copied!';
    setTimeout(() => {
        copyFormattedBtn.textContent = 'Copy Formatted';
    }, 2000);
});

// Data Converter
const fromFormat = document.getElementById('fromFormat');
const toFormat = document.getElementById('toFormat');
const dataInput = document.getElementById('dataInput');
const convertedOutput = document.getElementById('convertedOutput');
const convertBtn = document.getElementById('convertBtn');
const copyConvertedBtn = document.getElementById('copyConvertedBtn');

convertBtn.addEventListener('click', () => {
    try {
        let data = dataInput.value;
        let parsed;

        // Parse input
        switch (fromFormat.value) {
            case 'json':
                parsed = JSON.parse(data);
                break;
            case 'yaml':
                parsed = YAML.parse(data);
                break;
            case 'json5':
                parsed = JSON5.parse(data);
                break;
        }

        // Convert to output format
        let result;
        switch (toFormat.value) {
            case 'json':
                result = JSON.stringify(parsed, null, 2);
                break;
            case 'yaml':
                result = YAML.stringify(parsed);
                break;
            case 'json5':
                result = JSON5.stringify(parsed, null, 2);
                break;
        }

        convertedOutput.textContent = result;
        hljs.highlightElement(convertedOutput);
    } catch (error) {
        convertedOutput.textContent = `Error: ${error.message}`;
    }
});

copyConvertedBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(convertedOutput.textContent);
    copyConvertedBtn.textContent = 'Copied!';
    setTimeout(() => {
        copyConvertedBtn.textContent = 'Copy Result';
    }, 2000);
});

// Generator
const generateUUID = document.getElementById('generateUUID');
const uuidOutput = document.getElementById('uuidOutput');
const generatePassword = document.getElementById('generatePassword');
const passwordOutput = document.getElementById('passwordOutput');
const passwordLength = document.getElementById('passwordLength');
const useUppercase = document.getElementById('useUppercase');
const useNumbers = document.getElementById('useNumbers');
const useSpecial = document.getElementById('useSpecial');

generateUUID.addEventListener('click', () => {
    uuidOutput.value = uuidv4();
});

generatePassword.addEventListener('click', () => {
    const length = parseInt(passwordLength.value);
    const charset = {
        lower: 'abcdefghijklmnopqrstuvwxyz',
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        numbers: '0123456789',
        special: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    let availableChars = charset.lower;
    if (useUppercase.checked) availableChars += charset.upper;
    if (useNumbers.checked) availableChars += charset.numbers;
    if (useSpecial.checked) availableChars += charset.special;

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * availableChars.length);
        password += availableChars[randomIndex];
    }

    passwordOutput.value = password;
});

// Encoder/Decoder
const encodingType = document.getElementById('encodingType');
const textInput = document.getElementById('textInput');
const encodedOutput = document.getElementById('encodedOutput');
const encodeBtn = document.getElementById('encodeBtn');
const decodeBtn = document.getElementById('decodeBtn');
const copyEncodedBtn = document.getElementById('copyEncodedBtn');

function encodeText() {
    const text = textInput.value;
    let result = '';

    switch (encodingType.value) {
        case 'base64':
            result = btoa(text);
            break;
        case 'url':
            result = encodeURIComponent(text);
            break;
        case 'html':
            result = text.replace(/[<>&"']/g, char => {
                const entities = {
                    '<': '&lt;',
                    '>': '&gt;',
                    '&': '&amp;',
                    '"': '&quot;',
                    "'": '&#39;'
                };
                return entities[char];
            });
            break;
        case 'md5':
            result = CryptoJS.MD5(text).toString();
            break;
        case 'sha256':
            result = CryptoJS.SHA256(text).toString();
            break;
    }

    encodedOutput.textContent = result;
    hljs.highlightElement(encodedOutput);
}

function decodeText() {
    const text = textInput.value;
    let result = '';

    try {
        switch (encodingType.value) {
            case 'base64':
                result = atob(text);
                break;
            case 'url':
                result = decodeURIComponent(text);
                break;
            case 'html':
                result = text.replace(/&lt;|&gt;|&amp;|&quot;|&#39;/g, entity => {
                    const entities = {
                        '&lt;': '<',
                        '&gt;': '>',
                        '&amp;': '&',
                        '&quot;': '"',
                        '&#39;': "'"
                    };
                    return entities[entity];
                });
                break;
            case 'md5':
            case 'sha256':
                result = 'Hash cannot be decoded';
                break;
        }
    } catch (error) {
        result = `Error: ${error.message}`;
    }

    encodedOutput.textContent = result;
    hljs.highlightElement(encodedOutput);
}

encodeBtn.addEventListener('click', encodeText);
decodeBtn.addEventListener('click', decodeText);

copyEncodedBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(encodedOutput.textContent);
    copyEncodedBtn.textContent = 'Copied!';
    setTimeout(() => {
        copyEncodedBtn.textContent = 'Copy Result';
    }, 2000);
});

// Text Diff
const originalText = document.getElementById('originalText');
const modifiedText = document.getElementById('modifiedText');
const compareDiff = document.getElementById('compareDiff');
const diffOutput = document.getElementById('diffOutput');

function computeDiff(text1, text2) {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const diff = [];
    let i = 0, j = 0;

    while (i < lines1.length || j < lines2.length) {
        if (i >= lines1.length) {
            diff.push({ type: 'added', line: lines2[j] });
            j++;
        } else if (j >= lines2.length) {
            diff.push({ type: 'removed', line: lines1[i] });
            i++;
        } else if (lines1[i] === lines2[j]) {
            diff.push({ type: 'unchanged', line: lines1[i] });
            i++;
            j++;
        } else {
            diff.push({ type: 'removed', line: lines1[i] });
            diff.push({ type: 'added', line: lines2[j] });
            i++;
            j++;
        }
    }

    return diff;
}

compareDiff.addEventListener('click', () => {
    const diff = computeDiff(originalText.value, modifiedText.value);
    diffOutput.innerHTML = diff.map(d => `
        <div class="diff-line ${d.type === 'added' ? 'diff-added' : d.type === 'removed' ? 'diff-removed' : ''}">
            ${d.type === 'added' ? '+' : d.type === 'removed' ? '-' : ' '} ${d.line}
        </div>
    `).join('');
});